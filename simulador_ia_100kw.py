import csv
from collections import defaultdict

# Archivos de entrada y salida
INPUT_FILE = "climate_data_2023_2025.csv"
OUTPUT_FILE = "resultados_100kw_2023_2025.csv"

# Parámetros Termodinámicos de las Tecnologías para un Rack de 100 kW
# T_cr = Temperatura Crítica Exterior máxima para lograr Free Cooling del 100%
# Valores basados en la literatura técnica de 2024-2025 para refrigeración líquida.

TECHNOLOGIES = {
    "RDHx (Aire/Agua Baseline)": {
        "T_cr": 10.0, # Requiere agua muy fría para enfriar el aire del rack
        "PUE_base": 1.5,
        "PUE_fc": 1.15
    },
    "D2C Bifásico (Termosifón D2C)": {
        "T_cr": 25.0, # El refrigerante hierve a mayor temp, permite disipación con aire exterior más cálido
        "PUE_base": 1.2,
        "PUE_fc": 1.05
    },
    "Inmersión Bifásica": {
        "T_cr": 35.0, # El fluido dieléctrico permite operar el condensador a temperaturas muy altas
        "PUE_base": 1.1,
        "PUE_fc": 1.02
    }
}

def simular():
    print("Iniciando Simulador Termodinámico de IA (Rack 100 kW)...")
    
    # Estructura: {City: {Tech: fch_count}}
    results = defaultdict(lambda: defaultdict(int))
    total_hours = defaultdict(int)

    # Procesar el archivo CSV hora a hora
    try:
        with open(INPUT_FILE, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                city = row["Location"]
                try:
                    temp = float(row["Temperature_C"])
                except ValueError:
                    continue
                
                total_hours[city] += 1
                
                # Evaluar cada tecnología
                for tech, params in TECHNOLOGIES.items():
                    if temp < params["T_cr"]:
                        results[city][tech] += 1
    except FileNotFoundError:
        print(f"Error: No se encontró el archivo {INPUT_FILE}")
        return

    # Escribir el reporte final
    print("Generando resultados...")
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        header = ["Localidad", "Tecnología", "Free Cooling Hours (FCH)", "Free Cooling % (FCP)", "Ahorro Estimado vs Baseline (ESQ)"]
        writer.writerow(header)
        
        for city, techs in results.items():
            hours = total_hours[city]
            if hours == 0: continue
            
            for tech, fch in techs.items():
                fcp = (fch / hours) * 100
                # Cálculo de ahorro referencial
                writer.writerow([city, tech, fch, f"{fcp:.2f}%", f"Determinado por PUE de {TECHNOLOGIES[tech]['PUE_fc']}"])
                print(f"[{city}] {tech}: FCH={fch} ({fcp:.1f}%)")

    print(f"\n¡Simulación completada! Resultados exportados a {OUTPUT_FILE}")

if __name__ == "__main__":
    simular()
