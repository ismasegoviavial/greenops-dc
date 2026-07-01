import csv
import pandas as pd
from collections import defaultdict

INPUT_FILE = "climate_data_2023_2025.csv"
OUTPUT_FILE = "analisis_termoeconomico_2023_2025.csv"

# Precios de energía (USD/kWh)
ENERGY_PRICES = {
    "Isla Gordon, Chile": 0.176,
    "Colchane, Chile": 0.176,
    "Reykjavik, Islandia": 0.080,
    "Helsinki, Finlandia": 0.085,
    "Lulea, Suecia": 0.085,
    "Quebec, Canada": 0.090
}

# Sistemas a evaluar (5 sistemas en total)
SYSTEMS = {
    "CRAC (Aire Acondicionado Tradicional)": {"T_cr": -50.0, "PUE_base": 1.80, "PUE_fc": 1.80},
    "RDHx (Rear Door Heat Exchanger)": {"T_cr": 10.0, "PUE_base": 1.50, "PUE_fc": 1.15},
    "Termosifón Bifásico Original (Por Aire)": {"T_cr": 15.0, "PUE_base": 1.50, "PUE_fc": 1.10},
    "D2C Bifásico (Direct-to-Chip)": {"T_cr": 25.0, "PUE_base": 1.20, "PUE_fc": 1.05},
    "Inmersión Líquida Bifásica": {"T_cr": 35.0, "PUE_base": 1.10, "PUE_fc": 1.02}
}

IT_LOAD_KW = 100.0

def calcular_termoeconomia():
    print("Iniciando Análisis Termoeconómico (Rack 100 kW, 3 Años)...")
    
    # Estructura: {City: {Tech: {"energy_kwh": 0, "cost_usd": 0, "fch": 0}}}
    results = defaultdict(lambda: defaultdict(lambda: {"energy_kwh": 0.0, "cost_usd": 0.0, "fch": 0}))
    total_hours = defaultdict(int)

    # Leer CSV de 3 años
    try:
        df = pd.read_csv(INPUT_FILE)
        # Procesar eficientemente con pandas
        for city in ENERGY_PRICES.keys():
            df_city = df[df['Location'] == city]
            hours = len(df_city)
            total_hours[city] = hours
            if hours == 0: continue
            
            price = ENERGY_PRICES[city]
            temps = df_city['Temperature_C'].values
            
            for sys_name, params in SYSTEMS.items():
                t_cr = params["T_cr"]
                pue_base = params["PUE_base"]
                pue_fc = params["PUE_fc"]
                
                # Mascaras booleanas
                fc_mask = temps < t_cr
                mech_mask = ~fc_mask
                
                fch = fc_mask.sum()
                mech_h = mech_mask.sum()
                
                energy_fc = fch * IT_LOAD_KW * pue_fc
                energy_mech = mech_h * IT_LOAD_KW * pue_base
                
                total_energy = energy_fc + energy_mech
                total_cost = total_energy * price
                
                results[city][sys_name]["fch"] = fch
                results[city][sys_name]["energy_kwh"] = total_energy
                results[city][sys_name]["cost_usd"] = total_cost
                
    except FileNotFoundError:
        print(f"Error: No se encontró el archivo {INPUT_FILE}")
        return

    # Escribir reporte
    print("Exportando resultados...")
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Localidad", "Tecnología", "Horas Totales", "Free Cooling Hours", "Energía Total (kWh)", "Costo Energía (USD)", "Precio USD/kWh"])
        
        for city, techs in results.items():
            for sys_name, data in techs.items():
                writer.writerow([
                    city, 
                    sys_name, 
                    total_hours[city], 
                    data["fch"], 
                    f"{data['energy_kwh']:.2f}", 
                    f"{data['cost_usd']:.2f}",
                    ENERGY_PRICES[city]
                ])
                print(f"[{city}] {sys_name}: Costo USD ${data['cost_usd']:,.2f}")

    print(f"\n¡Análisis completado! Resultados guardados en {OUTPUT_FILE}")

if __name__ == "__main__":
    calcular_termoeconomia()
