"""
Splitter Unit Operation.
"""

from typing import List, Optional
from open_sim.units.base import UnitOperation
from open_sim.core.stream import MaterialStream


class Splitter(UnitOperation):
    """
    Divides an inlet stream into multiple outlet streams according to specified split fractions.
    Temperature, pressure, and composition are conserved across all branches.
    """

    def __init__(
        self,
        name: str,
        inlet: MaterialStream,
        split_fractions: List[float],
        outlets: Optional[List[MaterialStream]] = None,
    ):
        super().__init__(name)
        self.inlet = inlet
        self.inlets = [inlet]
        self.split_fractions = list(split_fractions)

        # Normalize fractions
        total = sum(self.split_fractions)
        if total <= 0:
            raise ValueError(f"Splitter '{name}': sum of split fractions must be positive.")
        self.split_fractions = [f / total for f in self.split_fractions]

        if outlets:
            if len(outlets) != len(self.split_fractions):
                raise ValueError("Number of outlet streams must match number of split fractions.")
            self.outlets = list(outlets)
        else:
            self.outlets = [
                inlet.copy(f"{name}_OUT_{i+1}")
                for i in range(len(self.split_fractions))
            ]

    def solve(self) -> None:
        inlet_flow = self.inlet.molar_flow_mol_s
        for f, out_stream in zip(self.split_fractions, self.outlets):
            out_stream.molar_flow_mol_s = inlet_flow * f
            out_stream.temperature_K = self.inlet.temperature_K
            out_stream.pressure_Pa = self.inlet.pressure_Pa
            out_stream.composition = dict(self.inlet.composition)
