"""
Adiabatic Mixer Unit Operation with rigorous mass and energy balance.
"""

from typing import List, Optional
from open_sim.units.base import UnitOperation
from open_sim.core.stream import MaterialStream


class Mixer(UnitOperation):
    """
    Combines multiple inlet streams into a single outlet stream.
    Solves rigorous mass balance and adiabatic energy balance.
    """

    def __init__(
        self,
        name: str,
        inlets: List[MaterialStream],
        outlet: Optional[MaterialStream] = None,
        pressure_Pa: Optional[float] = None,
    ):
        super().__init__(name)
        if not inlets:
            raise ValueError(f"Mixer '{name}' requires at least one inlet stream.")
        self.inlets = list(inlets)
        self.outlet = outlet or MaterialStream(
            name=f"{name}_OUT",
            temperature_K=298.15,
            pressure_Pa=101325.0,
            molar_flow_mol_s=1.0,
            composition=dict(inlets[0].composition),
            db=inlets[0].db,
        )
        self.outlets = [self.outlet]
        self.specified_pressure = pressure_Pa

    def solve(self) -> None:
        # 1. Total molar flow
        total_flow = sum(s.molar_flow_mol_s for s in self.inlets)
        if total_flow <= 0:
            raise ValueError(f"Mixer '{self.name}': total inlet flow is zero.")

        # 2. Mixed composition (mole fractions)
        all_components = set()
        for s in self.inlets:
            all_components.update(s.composition.keys())

        mixed_composition = {}
        for comp in all_components:
            molar_rate = sum(s.molar_flow_mol_s * s.composition.get(comp, 0.0) for s in self.inlets)
            mixed_composition[comp] = molar_rate / total_flow

        # 3. Outlet pressure (minimum of inlets unless specified)
        out_pressure = self.specified_pressure or min(s.pressure_Pa for s in self.inlets)

        # 4. Energy Balance (Adiabatic: H_in = H_out)
        total_h_in = sum(s.enthalpy_flow_W() for s in self.inlets)

        # Solve for T_out such that outlet.enthalpy_flow_W(T_out) == total_h_in
        # Newton-Raphson iteration
        t_guess = sum(s.temperature_K * s.molar_flow_mol_s for s in self.inlets) / total_flow
        db = self.inlets[0].db

        for _ in range(30):
            # Evaluate enthalpy at current t_guess
            h_molar = sum(
                mixed_composition[c] * db.get(c).enthalpy_departure(t_guess)
                for c in mixed_composition
            )
            h_calc = total_flow * h_molar
            residual = h_calc - total_h_in

            if abs(residual) < 1e-4:  # Converged
                break

            # Derivative dH/dT = total_flow * Cp_mix
            cp_mix = sum(
                mixed_composition[c] * db.get(c).heat_capacity(t_guess)
                for c in mixed_composition
            )
            df = total_flow * cp_mix
            if df == 0:
                break
            t_guess -= residual / df

        # Update outlet stream properties
        self.outlet.temperature_K = t_guess
        self.outlet.pressure_Pa = out_pressure
        self.outlet.molar_flow_mol_s = total_flow
        self.outlet.composition = mixed_composition
