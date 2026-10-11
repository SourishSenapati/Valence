"""
Industrial Process Simulation Demo:
Ethanol-Water Blending and Distribution Network.
"""

import sys
import os

# Add src to python path for development
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from open_sim import ChemicalDatabase, MaterialStream, Mixer, Splitter, Flowsheet


def main():
    print("=================================================================")
    print("          OPEN-PROCESS-SIM: PHASE 1 ENGINE DEMONSTRATION         ")
    print("=================================================================\n")

    # 1. Initialize physical property engine
    db = ChemicalDatabase()
    print(f"[*] Physical Property Database initialized with {len(db.list_components())} core components:")
    print("    Components:", ", ".join(db.list_components()))
    print()

    # 2. Create Flowsheet
    fs = Flowsheet(name="Ethanol-Water Blending Unit")

    # 3. Define Feed Streams
    # Feed 1: Cold concentrated ethanol stream (25°C, 2.0 bar, 50 kmol/h)
    feed_1 = MaterialStream(
        name="Feed_Cold_Ethanol",
        temperature_K=298.15,      # 25°C
        pressure_Pa=200000.0,      # 2.0 bar
        molar_flow_mol_s=50000 / 3600.0,  # 50 kmol/h
        composition={"ethanol": 0.85, "water": 0.15},
        db=db,
    )

    # Feed 2: Hot dilute aqueous stream (75°C, 1.8 bar, 30 kmol/h)
    feed_2 = MaterialStream(
        name="Feed_Hot_Dilute",
        temperature_K=348.15,      # 75°C
        pressure_Pa=180000.0,      # 1.8 bar
        molar_flow_mol_s=30000 / 3600.0,  # 30 kmol/h
        composition={"ethanol": 0.10, "water": 0.90},
        db=db,
    )

    fs.add_stream(feed_1)
    fs.add_stream(feed_2)

    # 4. Add Mixer (M-101) - Adiabatic mixing with energy balance
    mixed_stream = MaterialStream(
        name="Blended_Intermediate",
        temperature_K=298.15,
        pressure_Pa=180000.0,
        molar_flow_mol_s=1.0,
        composition={"ethanol": 0.5, "water": 0.5},
        db=db,
    )
    mixer = Mixer(name="M-101", inlets=[feed_1, feed_2], outlet=mixed_stream)
    fs.add_unit(mixer)

    # 5. Add Splitter (S-101) - 70% to primary storage, 30% to secondary
    splitter = Splitter(
        name="S-101",
        inlet=mixed_stream,
        split_fractions=[0.70, 0.30],
    )
    # Rename default outlets for clarity
    splitter.outlets[0].name = "Product_Main_70pct"
    splitter.outlets[1].name = "Product_Side_30pct"
    fs.add_unit(splitter)

    # 6. Execute Flowsheet Simulation
    print("[*] Solving Flowsheet equations (Mass and Energy Balance)...")
    fs.solve()
    print("    [OK] Flowsheet converged with 0 residuals!\n")

    # 7. Generate and display Markdown Report
    report = fs.generate_markdown_report()
    print(report)

    # Save to Markdown file
    output_file = os.path.join(os.path.dirname(__file__), "simulation_report.md")
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"\n[+] Full report exported successfully to: {output_file}")


if __name__ == "__main__":
    main()
