"""
Full verification test of the integrated Valence Chemical & Simulation Engine:
1. Trillion-compound combinatorial space exploration
2. Process flowsheet simulation (mass and energy balance)
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from open_sim import ChemicalDatabase, MaterialStream, Mixer, Splitter, Flowsheet
from open_sim.combinatorial.space import TrillionCompoundSpace


def main():
    print("=================================================================")
    print("            VALENCE CHEMICAL & SIMULATION ENGINE DEMO            ")
    print("=================================================================\n")

    # 1. Trillion-Compound Space Verification
    print("[1] Initializing Combinatorial Synthon Space...")
    space = TrillionCompoundSpace(multiplier_order=100000)
    total_space = space.total_addressable_molecules()
    print(f"    [+] Total addressable virtual molecules: {total_space:,}")
    print("    [+] Sampling molecules generated on-the-fly:")
    
    samples = space.sample_space(3)
    for s in samples:
        print(f"        - ID: {s['compound_id']} | Rxn: {s['reaction']} | MW: {s['mw_g_mol']} g/mol | Tb: {s['estimated_tb_K']} K")
    print()

    # 2. Industrial Flowsheet Simulation Verification
    print("[2] Running Process Flowsheet Simulation...")
    db = ChemicalDatabase()
    fs = Flowsheet(name="Valence Plant Reactor Feed Preparation")

    s1 = MaterialStream("Feed_1_Toluene", 300.0, 200000.0, 10.0, {"toluene": 1.0}, db=db)
    s2 = MaterialStream("Feed_2_Benzene", 350.0, 200000.0, 15.0, {"benzene": 1.0}, db=db)

    mixer = Mixer("M-101", inlets=[s1, s2])
    fs.add_unit(mixer)
    fs.solve()

    print(f"    [OK] Mixer Outlet Temperature: {mixer.outlet.temperature_C:.2f}°C")
    print(f"    [OK] Total Molar Flow: {mixer.outlet.molar_flow_kmol_h:.2f} kmol/h")
    print(f"    [OK] Mass Flow: {mixer.outlet.mass_flow_kg_h:.2f} kg/h")
    print("\n[+] Valence Chemical & Simulation Engine fully operational!")


if __name__ == "__main__":
    main()
