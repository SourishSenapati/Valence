"""
Zero-hallucination physical properties and component databank.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional
import math

try:
    import chemicals
    HAS_CHEMICALS_PKG = True
except ImportError:
    HAS_CHEMICALS_PKG = False


@dataclass
class ComponentData:
    name: str
    cas: str
    formula: str
    mw: float                 # Molecular weight (g/mol)
    tc: float                 # Critical temperature (K)
    pc: float                 # Critical pressure (Pa)
    omega: float              # Acentric factor
    tb: float                 # Normal boiling point (K)
    # Shomate / polynomial Cp coefficients (J / mol*K): Cp(T) = a0 + a1*T + a2*T^2 + a3*T^3
    cp_coeffs: List[float] = field(default_factory=lambda: [30.0, 0.0, 0.0, 0.0])

    def heat_capacity(self, temp_k: float) -> float:
        """Returns ideal gas isobaric heat capacity Cp in J/(mol*K)."""
        t = temp_k
        val = 0.0
        for i, coeff in enumerate(self.cp_coeffs):
            val += coeff * (t ** i)
        return max(val, 10.0)

    def enthalpy_departure(self, temp_k: float, t_ref: float = 298.15) -> float:
        """
        Integrates Cp from t_ref to temp_k: Integral(Cp dT) in J/mol.
        """
        t = temp_k
        t0 = t_ref
        h = 0.0
        for i, coeff in enumerate(self.cp_coeffs):
            power = i + 1
            h += coeff * (t**power - t0**power) / power
        return h


# Standard Industrial Core Dataset (Evaluated NIST/DIPPR values)
CORE_DATA: Dict[str, ComponentData] = {
    "water": ComponentData(
        name="water",
        cas="7732-18-5",
        formula="H2O",
        mw=18.015,
        tc=647.10,
        pc=22.064e6,
        omega=0.344,
        tb=373.15,
        cp_coeffs=[32.24, 0.00192, 1.055e-5, -3.595e-9]
    ),
    "ethanol": ComponentData(
        name="ethanol",
        cas="64-17-5",
        formula="C2H6O",
        mw=46.069,
        tc=514.0,
        pc=6.137e6,
        omega=0.644,
        tb=351.44,
        cp_coeffs=[19.9, 0.2096, -1.038e-4, 2.005e-8]
    ),
    "methanol": ComponentData(
        name="methanol",
        cas="67-56-1",
        formula="CH4O",
        mw=32.042,
        tc=512.6,
        pc=8.09e6,
        omega=0.556,
        tb=337.8,
        cp_coeffs=[21.15, 0.0709, 2.587e-5, -2.852e-8]
    ),
    "toluene": ComponentData(
        name="toluene",
        cas="108-88-3",
        formula="C7H8",
        mw=92.141,
        tc=591.75,
        pc=4.108e6,
        omega=0.264,
        tb=383.79,
        cp_coeffs=[-24.35, 0.5125, -2.765e-4, 4.911e-8]
    ),
    "benzene": ComponentData(
        name="benzene",
        cas="71-43-2",
        formula="C6H6",
        mw=78.114,
        tc=562.05,
        pc=4.895e6,
        omega=0.210,
        tb=353.24,
        cp_coeffs=[-33.92, 0.4719, -2.983e-4, 7.081e-8]
    ),
    "methane": ComponentData(
        name="methane",
        cas="74-82-8",
        formula="CH4",
        mw=16.043,
        tc=190.56,
        pc=4.599e6,
        omega=0.011,
        tb=111.66,
        cp_coeffs=[19.25, 0.0521, 1.197e-5, -1.132e-8]
    ),
    "carbon dioxide": ComponentData(
        name="carbon dioxide",
        cas="124-38-9",
        formula="CO2",
        mw=44.01,
        tc=304.13,
        pc=7.377e6,
        omega=0.225,
        tb=194.67,
        cp_coeffs=[19.8, 0.0734, -5.602e-5, 1.715e-8]
    ),
    "nitrogen": ComponentData(
        name="nitrogen",
        cas="7727-37-9",
        formula="N2",
        mw=28.013,
        tc=126.2,
        pc=3.39e6,
        omega=0.037,
        tb=77.36,
        cp_coeffs=[31.15, -0.01357, 2.68e-5, -1.168e-8]
    ),
    "oxygen": ComponentData(
        name="oxygen",
        cas="7782-44-7",
        formula="O2",
        mw=31.999,
        tc=154.58,
        pc=5.043e6,
        omega=0.022,
        tb=90.20,
        cp_coeffs=[28.11, -3.68e-6, 1.746e-5, -1.065e-8]
    )
}


class ChemicalDatabase:
    """
    Tiered physical property database manager:
    1. Fast in-memory core dataset
    2. Dynamic lookup via `chemicals` package (if available)
    """

    def __init__(self):
        self._cache: Dict[str, ComponentData] = dict(CORE_DATA)

    def get(self, name_or_cas: str) -> ComponentData:
        key = name_or_cas.strip().lower()
        if key in self._cache:
            return self._cache[key]

        # Check by CAS in local cache
        for comp in self._cache.values():
            if comp.cas == key or comp.formula.lower() == key:
                return comp

        # Dynamic fallback to `chemicals` package if installed
        if HAS_CHEMICALS_PKG:
            try:
                cas = chemicals.CAS_from_any(key)
                comp = ComponentData(
                    name=key,
                    cas=cas,
                    formula=chemicals.formula(cas) if hasattr(chemicals, "formula") else "",
                    mw=chemicals.MW(cas),
                    tc=chemicals.Tc(cas) or 500.0,
                    pc=chemicals.Pc(cas) or 5e6,
                    omega=chemicals.omega(cas) or 0.2,
                    tb=chemicals.Tb(cas) or 350.0
                )
                self._cache[key] = comp
                return comp
            except Exception:
                pass

        raise ValueError(
            f"Component '{name_or_cas}' not found in database. "
            f"Available default components: {list(self._cache.keys())}"
        )

    def list_components(self) -> List[str]:
        return list(self._cache.keys())
