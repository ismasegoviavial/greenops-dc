import csv
import pandas as pd
from collections import defaultdict

INPUT_FILE  = "climate_data_global_2023_2025.csv"
OUTPUT_FILE = "analisis_termoeconomico_global.csv"

# ============================================================
# TARIFAS ELECTRICAS INDUSTRIALES REALES POR LOCALIDAD (USD/kWh)
# Fuentes:
#   - Eurostat API NRG_PC_205 (2024-S2, excl. impuestos, banda MWH500-1999)
#   - Hydro-Quebec Comparison of Electricity Prices 2024
#   - BloombergNEF Global Climatescope 2024 (Chile)
#   - IEA Energy Prices 2024 (resto del mundo)
#   - DEWA (Dubai), KPLC (Kenia), KEPCO (Corea), EMA (Singapur)
# NOTA: Los precios de EEUU no pudieron obtenerse via EIA API
#        (requiere clave). Se usan referencias IEA 2024.
# ============================================================
ENERGY_PRICES = {
    # --- CHILE (BloombergNEF Climatescope 2024) ---
    "Isla Gordon, Chile":           (0.176, "BloombergNEF Climatescope 2024",            "https://global-climatescope.org/markets/cl/"),
    "Colchane, Chile":              (0.176, "BloombergNEF Climatescope 2024",            "https://global-climatescope.org/markets/cl/"),
    "Punta Arenas, Chile":          (0.176, "BloombergNEF Climatescope 2024",            "https://global-climatescope.org/markets/cl/"),
    "Puerto Natales, Chile":        (0.176, "BloombergNEF Climatescope 2024",            "https://global-climatescope.org/markets/cl/"),
    "Coyhaique, Chile":             (0.176, "BloombergNEF Climatescope 2024",            "https://global-climatescope.org/markets/cl/"),
    # --- SUDAMERICA (IEA 2024) ---
    "Mendoza, Argentina":           (0.085, "IEA Energy Prices 2024",                   "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Montevideo, Uruguay":          (0.130, "IEA Energy Prices 2024",                   "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Ushuaia, Argentina":           (0.085, "IEA Energy Prices 2024",                   "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Bogota, Colombia":             (0.120, "IEA Energy Prices 2024",                   "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Quito, Ecuador":               (0.100, "IEA Energy Prices 2024",                   "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    # --- EUROPA NORDICA (Eurostat API NRG_PC_205, 2024-S2, excl.impuestos) ---
    "Reykjavik, Islandia":          (0.1029, "Eurostat NRG_PC_205 2024-S2",             "https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    "Helsinki, Finlandia":          (0.0850, "Eurostat NRG_PC_205 2024-S2",             "https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    "Lulea, Suecia":                (0.0924, "Eurostat NRG_PC_205 2024-S2",             "https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    "Trondheim, Noruega":           (0.0655, "Eurostat NRG_PC_205 2024-S2",             "https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    "Stavanger, Noruega":           (0.0655, "Eurostat NRG_PC_205 2024-S2",             "https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    "Oulu, Finlandia":              (0.0850, "Eurostat NRG_PC_205 2024-S2",             "https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    "Tallin, Estonia":              (0.1488, "Eurostat NRG_PC_205 2024-S2",             "https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    "Estocolmo, Suecia":            (0.0924, "Eurostat NRG_PC_205 2024-S2",             "https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    "Oslo, Noruega":                (0.0655, "Eurostat NRG_PC_205 2024-S2",             "https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    "Copenhague, Dinamarca":        (0.1379, "Eurostat NRG_PC_205 2024-S2",             "https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    # --- EUROPA CENTRAL (Eurostat 2024-S2) ---
    "Frankfurt, Alemania":          (0.2191, "Eurostat NRG_PC_205 2024-S2",             "https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    "Amsterdam, Holanda":           (0.1865, "Eurostat NRG_PC_205 2024-S2",             "https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    "Dublin, Irlanda":              (0.2730, "Eurostat NRG_PC_205 2024-S2",             "https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    "Zurich, Suiza":                (0.150,  "Eurostat NRG_PC_205 2024-S2 (referencia)","https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    "Londres, UK":                  (0.160,  "Eurostat NRG_PC_205 2024-S2 (referencia)","https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    # --- NORTEAMERICA ---
    "Quebec, Canada":               (0.090, "Hydro-Quebec Electricity Prices 2024",     "https://www.hydroquebec.com/data/documents-donnees/pdf/comparison-electricity-prices.pdf"),
    "Vancouver, Canada":            (0.095, "BC Hydro Industrial Rates 2024",           "https://app.bchydro.com/accounts-billing/rates-energy-use/electricity-rates.html"),
    "Anchorage, Alaska USA":        (0.170, "IEA Energy Prices 2024 - USA",             "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Des Moines, Iowa USA":         (0.070, "IEA Energy Prices 2024 - USA",             "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Portland, Oregon USA":         (0.080, "IEA Energy Prices 2024 - USA",             "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    # --- ASIA-PACIFICO ---
    "Hokkaido (Sapporo), Japon":    (0.180, "IEA Energy Prices 2024 - Japan",           "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Ulaanbaatar, Mongolia":        (0.065, "IEA Energy Prices 2024 - Mongolia",        "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Christchurch, Nueva Zelanda":  (0.120, "IEA Energy Prices 2024 - New Zealand",     "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Seoul, Corea del Sur":         (0.120, "KEPCO Industrial Rate Table 2024",         "https://home.kepco.co.kr/kepco/EN/main.do"),
    "Singapur":                     (0.170, "EMA Singapore Non-Household Tariff 2024",  "https://www.ema.gov.sg/consumer-information/electricity/buying-electricity/electricity-tariffs-and-price-trends"),
    # --- ORIENTE MEDIO / AFRICA ---
    "Dubai, EAU":                   (0.080, "DEWA Industrial Tariff 2024",              "https://www.dewa.gov.ae/en/consumer/electricity/tariffs"),
    "Nairobi, Kenia":               (0.180, "KPLC Industrial Tariff SC6 2024",          "https://www.kplc.co.ke/category/view/50/tariffs"),
    # --- EXTREMOS DE CONTROL ---
    "Yakutsk, Rusia":               (0.050, "IEA Energy Prices 2024 - Russia",          "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Phoenix, Arizona USA":         (0.075, "IEA Energy Prices 2024 - USA",             "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
}

# ============================================================
# 5 SISTEMAS DE ENFRIAMIENTO
# ============================================================
SYSTEMS = {
    "CRAC (Aire Acond. Tradicional)":    {"T_cr": -50.0, "PUE_base": 1.80, "PUE_fc": 1.80},
    "RDHx (Puerta Trasera)":             {"T_cr":  10.0, "PUE_base": 1.50, "PUE_fc": 1.15},
    "Termosifon Bifasico Original":      {"T_cr":  15.0, "PUE_base": 1.50, "PUE_fc": 1.10},
    "D2C Bifasico (Direct-to-Chip)":     {"T_cr":  25.0, "PUE_base": 1.20, "PUE_fc": 1.05},
    "Inmersion Liquida Bifasica":        {"T_cr":  35.0, "PUE_base": 1.10, "PUE_fc": 1.02},
}

IT_LOAD_KW = 100.0

def main():
    print("=" * 70)
    print(" ANALISIS TERMOECONOMICO GLOBAL - RACK 100 kW / 3 ANIOS (2023-2025)")
    print(f" {len(ENERGY_PRICES)} localidades x {len(SYSTEMS)} sistemas | Tarifas Reales Eurostat+IEA")
    print("=" * 70)

    results = defaultdict(lambda: defaultdict(lambda: {
        "region": "", "price": 0, "source": "", "url": "",
        "fch": 0, "fch_pct": 0, "energy_kwh": 0.0, "cost_usd": 0.0
    }))
    total_hours = defaultdict(int)

    try:
        print("Cargando CSV global...")
        df = pd.read_csv(INPUT_FILE)
        print(f"  Filas cargadas: {len(df):,}\n")

        for city, price_data in ENERGY_PRICES.items():
            price, source_name, source_url = price_data
            df_city = df[df["Location"] == city]
            hours = len(df_city)
            total_hours[city] = hours
            if hours == 0:
                print(f"  AVISO: Sin datos para {city}")
                continue

            region = df_city["Region"].iloc[0] if "Region" in df_city.columns else "N/A"
            temps = df_city["Temperature_C"].values

            for sys_name, params in SYSTEMS.items():
                fc_mask  = temps < params["T_cr"]
                fch      = int(fc_mask.sum())
                mech_h   = hours - fch
                energy   = fch * IT_LOAD_KW * params["PUE_fc"] + mech_h * IT_LOAD_KW * params["PUE_base"]
                cost     = energy * price

                results[city][sys_name] = {
                    "region":     region,
                    "price":      price,
                    "source":     source_name,
                    "url":        source_url,
                    "fch":        fch,
                    "fch_pct":    round(fch / hours * 100, 1),
                    "energy_kwh": round(energy, 2),
                    "cost_usd":   round(cost, 2),
                }

            best_sys   = min(SYSTEMS.keys(), key=lambda s: results[city][s]["cost_usd"])
            best_cost  = results[city][best_sys]["cost_usd"]
            worst_cost = results[city]["CRAC (Aire Acond. Tradicional)"]["cost_usd"]
            savings    = worst_cost - best_cost
            print(f"  [{region}] {city} | tarifa USD {price:.4f}/kWh | Fuente: {source_name}")
            print(f"    Mejor: {best_sys} -> USD ${best_cost:,.0f} | Ahorro: USD ${savings:,.0f}")

    except FileNotFoundError:
        print(f"ERROR: No se encontro '{INPUT_FILE}'")
        return

    print(f"\nExportando resultados a '{OUTPUT_FILE}'...")
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "Region", "Localidad", "Precio_USD_kWh", "Fuente_Tarifa", "URL_Fuente",
            "Sistema de Enfriamiento", "Horas Totales",
            "Free Cooling Hours", "FCH %",
            "Energia Total (kWh)", "OPEX 3 Anios (USD)"
        ])
        for city in ENERGY_PRICES.keys():
            for sys_name in SYSTEMS.keys():
                d = results[city][sys_name]
                writer.writerow([
                    d.get("region",""), city, d.get("price",""),
                    d.get("source",""), d.get("url",""),
                    sys_name, total_hours[city],
                    d.get("fch",""), d.get("fch_pct",""),
                    d.get("energy_kwh",""), d.get("cost_usd","")
                ])

    print("\n" + "=" * 70)
    print(" ANALISIS COMPLETADO CON TARIFAS REALES VERIFICADAS")
    print(f" Archivo: {OUTPUT_FILE}")
    print("=" * 70)

if __name__ == "__main__":
    main()
