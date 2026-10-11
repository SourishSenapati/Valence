"""
Material and Energy stream representation.
"""

from typing import Dict, Optional
from open_sim.thermo.database import ChemicalDatabase, ComponentData


class MaterialStream:
    """
    Represents a thermodynamic material stream in a process flowsheet.
    """

    def __init__(
        self,
        name: str,
        temperature_K: float,
        pressure_Pa: float,
        molar_flow_mol_s: float,
        composition: Dict[str, float],
        db: Optional[ChemicalDatabase] = None,
    ):
        self.name = name
        self.temperature_K = float(temperature_K)
        self.pressure_Pa = float(pressure_Pa)
        self.molar_flow_mol_s = float(molar_flow_mol_s)
        self.db = db or ChemicalDatabase()

        # Normalize mole fractions
        total_frac = sum(composition.values())
        if total_frac <= 0:
            raise ValueError(f"Stream '{name}' has non-positive composition sum.")
        self.composition = {k.lower(): v / total_frac for k, v in composition.items()}

    @property
    def temperature_C(self) -> float:
        return self.temperature_K - 273.15

    @property
    def pressure_bar(self) -> float:
        return self.pressure_Pa / 1e5

    @property
    def molar_flow_kmol_h(self) -> float:
        return (self.molar_flow_mol_s * 3600.0) / 1000.0

    @property
    def average_mw(self) -> float:
        """Average molecular weight in g/mol."""
        return sum(
            self.composition[c] * self.db.get(c).mw
            for c in self.composition
        )

    @property
    def mass_flow_kg_s(self) -> float:
        """Mass flow rate in kg/s."""
        return (self.molar_flow_mol_s * self.average_mw) / 1000.0

    @property
    def mass_flow_kg_h(self) -> float:
        """Mass flow rate in kg/h."""
        return self.mass_flow_kg_s * 3600.0

    def enthalpy_flow_W(self, t_ref: float = 298.15) -> float:
        """
        Enthalpy flow rate relative to 298.15 K in Watts (J/s):
        H_dot = n_dot * sum(z_i * Delta_H_i)
        """
        h_molar = sum(
            self.composition[c] * self.db.get(c).enthalpy_departure(self.temperature_K, t_ref)
            for c in self.composition
        )
        return self.molar_flow_mol_s * h_molar

    def copy(self, new_name: Optional[str] = None) -> "MaterialStream":
        return MaterialStream(
            name=new_name or f"{self.name}_copy",
            temperature_K=self.temperature_K,
            pressure_Pa=self.pressure_Pa,
            molar_flow_mol_s=self.molar_flow_mol_s,
            composition=dict(self.composition),
            db=self.db,
        )

    def to_dict(self) -> Dict:
        return {
            "name": self.name,
            "temperature_C": round(self.temperature_C, 2),
            "pressure_bar": round(self.pressure_bar, 3),
            "molar_flow_kmol_h": round(self.molar_flow_kmol_h, 3),
            "mass_flow_kg_h": round(self.mass_flow_kg_h, 3),
            "composition": {k: round(v, 4) for k, v in self.composition.items()},
        }

    def __repr__(self) -> str:
        return (
            f"MaterialStream(name='{self.name}', "
            f"T={self.temperature_C:.1f}°C, "
            f"P={self.pressure_bar:.2f} bar, "
            f"Flow={self.molar_flow_kmol_h:.2f} kmol/h)"
        )
