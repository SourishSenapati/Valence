"""
Flowsheet manager and reporting engine.
"""

from typing import List, Dict
from open_sim.core.stream import MaterialStream
from open_sim.units.base import UnitOperation


class Flowsheet:
    """
    Manages a chemical engineering flowsheet:
    - Tracks units and streams
    - Solves unit operations
    - Generates Markdown stream reports and JSON schemas
    """

    def __init__(self, name: str = "Flowsheet"):
        self.name = name
        self.streams: Dict[str, MaterialStream] = {}
        self.units: List[UnitOperation] = []

    def add_stream(self, stream: MaterialStream) -> MaterialStream:
        self.streams[stream.name] = stream
        return stream

    def add_unit(self, unit: UnitOperation) -> UnitOperation:
        self.units.append(unit)
        for s in unit.inlets + unit.outlets:
            if s.name not in self.streams:
                self.streams[s.name] = s
        return unit

    def solve(self) -> None:
        """Executes all unit operations in topological / sequence order."""
        for unit in self.units:
            unit.solve()

    def generate_markdown_report(self) -> str:
        """Generates an Aspen-style comprehensive stream results table in Markdown."""
        all_comps = sorted(
            list({comp for s in self.streams.values() for comp in s.composition.keys()})
        )
        stream_names = list(self.streams.keys())

        lines = []
        lines.append(f"# Flowsheet Simulation Report: {self.name}\n")
        lines.append("### Stream Summary Table\n")

        # Header
        header = ["Property / Component"] + stream_names
        lines.append("| " + " | ".join(header) + " |")
        lines.append("| " + " | ".join(["---"] * len(header)) + " |")

        # Basic State Variables
        t_row = ["Temperature (°C)"] + [f"{self.streams[s].temperature_C:.2f}" for s in stream_names]
        lines.append("| " + " | ".join(t_row) + " |")

        p_row = ["Pressure (bar)"] + [f"{self.streams[s].pressure_bar:.3f}" for s in stream_names]
        lines.append("| " + " | ".join(p_row) + " |")

        molar_flow_row = ["Molar Flow (kmol/h)"] + [
            f"{self.streams[s].molar_flow_kmol_h:.3f}" for s in stream_names
        ]
        lines.append("| " + " | ".join(molar_flow_row) + " |")

        mass_flow_row = ["Mass Flow (kg/h)"] + [
            f"{self.streams[s].mass_flow_kg_h:.3f}" for s in stream_names
        ]
        lines.append("| " + " | ".join(mass_flow_row) + " |")

        mw_row = ["Average MW (g/mol)"] + [
            f"{self.streams[s].average_mw:.2f}" for s in stream_names
        ]
        lines.append("| " + " | ".join(mw_row) + " |")

        lines.append("| **Mole Fractions** | " + " | ".join([""] * len(stream_names)) + " |")
        for comp in all_comps:
            comp_row = [f"  - {comp.capitalize()}"] + [
                f"{self.streams[s].composition.get(comp, 0.0):.4f}" for s in stream_names
            ]
            lines.append("| " + " | ".join(comp_row) + " |")

        return "\n".join(lines)
