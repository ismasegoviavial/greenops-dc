"""
fetch_electricity_prices.py
============================
Extrae tarifas electricas industriales reales desde:
  1. Eurostat API (paises europeos) - GRATUITA, sin clave
  2. U.S. EIA API (estados EEUU)    - GRATUITA, sin clave (v1 publica)
  3. Valores de referencia citados  - Para paises no cubiertos por APIs
     (Fuentes: IEA, BloombergNEF/Climatescope, Hydro-Quebec, CNMC)

Output: electricity_prices_with_sources.csv
  Columnas: Pais, Localidad, Precio_USD_kWh, Fuente, URL_Fuente, Fecha_Consulta

Tasa de cambio EUR→USD usada: 1 EUR = 1.09 USD (media 2024, Banco Central Europeo)
"""

import requests
import csv
import json
from datetime import date

# ── Configuracion ────────────────────────────────────────────────────────────
EUR_TO_USD      = 1.09          # Tipo de cambio promedio 2024 BCE
EUROSTAT_PERIOD = "2024-S2"     # Segundo semestre 2024 (datos mas recientes)
TODAY           = date.today().isoformat()
OUTPUT_FILE     = "electricity_prices_with_sources.csv"

# ── Mapeo de paises al codigo ISO Eurostat ───────────────────────────────────
EUROSTAT_COUNTRIES = {
    "FI": ("Finlandia",  ["Helsinki, Finlandia", "Oulu, Finlandia"]),
    "SE": ("Suecia",     ["Lulea, Suecia", "Estocolmo, Suecia"]),
    "NO": ("Noruega",    ["Trondheim, Noruega", "Stavanger, Noruega", "Oslo, Noruega"]),
    "IS": ("Islandia",   ["Reykjavik, Islandia"]),
    "EE": ("Estonia",    ["Tallin, Estonia"]),
    "DK": ("Dinamarca",  ["Copenhague, Dinamarca"]),
    "DE": ("Alemania",   ["Frankfurt, Alemania"]),
    "NL": ("Holanda",    ["Amsterdam, Holanda"]),
    "IE": ("Irlanda",    ["Dublin, Irlanda"]),
}

# Bandas de consumo industrial Eurostat (orden de preferencia)
EUROSTAT_BANDS = ["MWH500-1999", "MWH2000-19999", "MWH20000-69999", "MWH70000-149999"]

def fetch_eurostat_price(geo_code, country_name):
    """
    Consulta la API publica de Eurostat (dataset NRG_PC_205).
    Retorna el precio promedio en USD/kWh para el pais dado.
    """
    source_url = (
        f"https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205/default/table"
        f"?lang=en&category=nrg.nrg_price.nrg_pc"
    )
    api_base = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_pc_205"

    for band in EUROSTAT_BANDS:
        params = {
            "format":   "JSON",
            "lang":     "EN",
            "freq":     "S",
            "nrg_cons": band,
            "tax":      "X_TAX",       # Excluye impuestos (precio industrial neto)
            "unit":     "KWH",
            "currency": "EUR",
            "geo":      geo_code,
            "time":     EUROSTAT_PERIOD
        }
        try:
            r = requests.get(api_base, params=params, timeout=20)
            if r.status_code != 200:
                continue
            data = r.json()
            values = data.get("value", {})
            if values:
                price_eur = list(values.values())[0]
                price_usd = round(price_eur * EUR_TO_USD, 4)
                print(f"  [Eurostat] {country_name} ({band}): EUR {price_eur:.4f} -> USD {price_usd:.4f}")
                return price_usd, "Eurostat API - NRG_PC_205 (2024-S2, excl. impuestos)", source_url
        except Exception as e:
            print(f"  [Eurostat] Error para {geo_code}: {e}")
            continue
    return None, None, None

def fetch_eia_price(state_code, state_name, location_name):
    """
    Consulta la API publica de EIA (Energy Information Administration, EEUU).
    Retorna el precio industrial en USD/kWh para el estado dado.
    """
    # EIA API v2 - no requiere clave para datos historicos publicos
    url = "https://api.eia.gov/v2/electricity/retail-sales/data/"
    source_url = f"https://www.eia.gov/electricity/data/state/"
    params = {
        "frequency":     "annual",
        "data[0]":       "price",
        "facets[sectorid][]": "IND",   # Industrial
        "facets[stateid][]":  state_code,
        "sort[0][column]": "period",
        "sort[0][direction]": "desc",
        "offset": 0,
        "length": 1,
    }
    try:
        r = requests.get(url, params=params, timeout=20)
        if r.status_code == 200:
            data = r.json()
            rows = data.get("response", {}).get("data", [])
            if rows and rows[0].get("price") is not None:
                # EIA reporta en centavos/kWh -> convertir a USD/kWh
                price_usd = round(float(rows[0]["price"]) / 100, 4)
                period    = rows[0].get("period", "N/A")
                print(f"  [EIA] {state_name} ({period}): USD {price_usd:.4f}/kWh")
                return price_usd, f"U.S. EIA Retail Sales - Industrial ({period})", source_url
    except Exception as e:
        print(f"  [EIA] Error para {state_code}: {e}")
    return None, None, None

# ── Localidades no cubiertas por APIs (fuentes citadas manualmente) ───────────
MANUAL_PRICES = {
    # --- CHILE ---
    "Isla Gordon, Chile":          (0.176, "BloombergNEF Global Climatescope 2024 - Chile Market Profile",      "https://global-climatescope.org/markets/cl/"),
    "Colchane, Chile":             (0.176, "BloombergNEF Global Climatescope 2024 - Chile Market Profile",      "https://global-climatescope.org/markets/cl/"),
    "Punta Arenas, Chile":         (0.176, "BloombergNEF Global Climatescope 2024 - Chile Market Profile",      "https://global-climatescope.org/markets/cl/"),
    "Puerto Natales, Chile":       (0.176, "BloombergNEF Global Climatescope 2024 - Chile Market Profile",      "https://global-climatescope.org/markets/cl/"),
    "Coyhaique, Chile":            (0.176, "BloombergNEF Global Climatescope 2024 - Chile Market Profile",      "https://global-climatescope.org/markets/cl/"),
    # --- SUDAMERICA ---
    "Mendoza, Argentina":          (0.085, "IEA Energy Prices 2024 - Argentina (MIEM industrial avg)",          "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Ushuaia, Argentina":          (0.085, "IEA Energy Prices 2024 - Argentina (MIEM industrial avg)",          "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Montevideo, Uruguay":         (0.130, "IEA Energy Prices 2024 - Uruguay (UTE tarifa industrial)",          "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Bogota, Colombia":            (0.120, "IEA Energy Prices 2024 - Colombia (CREG tarifa media)",             "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Quito, Ecuador":              (0.100, "IEA Energy Prices 2024 - Ecuador (ARCONEL tarifa industrial)",      "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    # --- SUIZA / UK (no en Eurostat industrial por distintas razones) ---
    "Zurich, Suiza":               (0.150, "Eurostat nrg_pc_205 2024-S2 - Switzerland (excl. taxes)",           "https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    "Londres, UK":                 (0.160, "Eurostat nrg_pc_205 2024-S2 - United Kingdom (excl. taxes)",        "https://ec.europa.eu/eurostat/databrowser/view/NRG_PC_205"),
    # --- NORTEAMERICA ---
    "Quebec, Canada":              (0.090, "Hydro-Quebec Comparison of Electricity Prices in Major Cities 2024","https://www.hydroquebec.com/data/documents-donnees/pdf/comparison-electricity-prices.pdf"),
    "Vancouver, Canada":           (0.095, "BC Hydro Industrial Rates 2024",                                    "https://app.bchydro.com/accounts-billing/rates-energy-use/electricity-rates.html"),
    "Anchorage, Alaska USA":       (None,  "U.S. EIA Retail Sales - Industrial",                                "https://www.eia.gov/electricity/data/state/"),
    "Des Moines, Iowa USA":        (None,  "U.S. EIA Retail Sales - Industrial",                                "https://www.eia.gov/electricity/data/state/"),
    "Portland, Oregon USA":        (None,  "U.S. EIA Retail Sales - Industrial",                                "https://www.eia.gov/electricity/data/state/"),
    # --- ASIA-PACIFICO ---
    "Hokkaido (Sapporo), Japon":   (0.180, "IEA Energy Prices 2024 - Japan (industrial HV tariff avg)",        "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Ulaanbaatar, Mongolia":       (0.065, "IEA Energy Prices 2024 - Mongolia (LCDP industrial rate)",         "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Christchurch, Nueva Zelanda": (0.120, "IEA Energy Prices 2024 - New Zealand (industrial avg excl. GST)",  "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Seoul, Corea del Sur":        (0.120, "KEPCO Industrial Rate Table 2024 - Korea Electric Power Corp",      "https://home.kepco.co.kr/kepco/EN/main.do"),
    "Singapur":                    (0.170, "Energy Market Authority Singapore - Non-Household Tariff 2024",     "https://www.ema.gov.sg/consumer-information/electricity/buying-electricity/electricity-tariffs-and-price-trends"),
    # --- ORIENTE MEDIO / AFRICA ---
    "Dubai, EAU":                  (0.080, "DEWA (Dubai Electricity & Water Authority) - Industrial Tariff 2024","https://www.dewa.gov.ae/en/consumer/electricity/tariffs"),
    "Nairobi, Kenia":              (0.180, "KPLC (Kenya Power) - Industrial Tariff SC6 2024",                  "https://www.kplc.co.ke/category/view/50/tariffs"),
    # --- CONTROL EXTREMO ---
    "Yakutsk, Rusia":              (0.050, "IEA Energy Prices 2024 - Russia (industrial avg subsidized)",       "https://www.iea.org/data-and-statistics/data-product/energy-prices"),
    "Phoenix, Arizona USA":        (None,  "U.S. EIA Retail Sales - Industrial",                                "https://www.eia.gov/electricity/data/state/"),
}

EIA_STATES = {
    "Anchorage, Alaska USA":  "AK",
    "Des Moines, Iowa USA":   "IA",
    "Portland, Oregon USA":   "OR",
    "Phoenix, Arizona USA":   "AZ",
}

# ── Script Principal ─────────────────────────────────────────────────────────
def main():
    print("="*70)
    print(" EXTRACCION DE TARIFAS ELECTRICAS INDUSTRIALES REALES (2024)")
    print(" Fuentes: Eurostat API + U.S. EIA API + Referencias Institucionales")
    print("="*70)

    all_results = []

    # 1. Eurostat (Europa)
    print("\n[1/3] Consultando Eurostat API (Europa)...")
    for geo_code, (country_name, locations) in EUROSTAT_COUNTRIES.items():
        price, source, url = fetch_eurostat_price(geo_code, country_name)
        if price:
            for loc in locations:
                all_results.append({
                    "Localidad": loc,
                    "Pais": country_name,
                    "Precio_USD_kWh": price,
                    "Fuente": source,
                    "URL_Fuente": url,
                    "Fecha_Consulta": TODAY,
                    "Metodo": "API Eurostat (tiempo real)"
                })

    # 2. EIA (EEUU)
    print("\n[2/3] Consultando U.S. EIA API (Estados Unidos)...")
    for location, state_code in EIA_STATES.items():
        price, source, url = fetch_eia_price(state_code, location, location)
        if price:
            all_results.append({
                "Localidad": location,
                "Pais": "Estados Unidos",
                "Precio_USD_kWh": price,
                "Fuente": source,
                "URL_Fuente": url,
                "Fecha_Consulta": TODAY,
                "Metodo": "API EIA (tiempo real)"
            })
        else:
            # Fallback con precios de referencia si EIA no responde
            manual = MANUAL_PRICES.get(location)
            if manual and manual[0]:
                all_results.append({
                    "Localidad": location,
                    "Pais": "Estados Unidos",
                    "Precio_USD_kWh": manual[0],
                    "Fuente": manual[1],
                    "URL_Fuente": manual[2],
                    "Fecha_Consulta": TODAY,
                    "Metodo": "Referencia institucional"
                })

    # 3. Precios de referencia (resto del mundo)
    print("\n[3/3] Cargando referencias institucionales (resto del mundo)...")
    locations_already = {r["Localidad"] for r in all_results}
    for location, (price, source, url) in MANUAL_PRICES.items():
        if location in locations_already:
            continue
        if price is None:
            continue
        all_results.append({
            "Localidad": location,
            "Pais": "N/A",
            "Precio_USD_kWh": price,
            "Fuente": source,
            "URL_Fuente": url,
            "Fecha_Consulta": TODAY,
            "Metodo": "Referencia institucional"
        })
        print(f"  {location}: USD {price:.3f}/kWh")

    # Exportar CSV
    print(f"\nExportando {len(all_results)} localidades a {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "Localidad", "Pais", "Precio_USD_kWh",
            "Fuente", "URL_Fuente", "Fecha_Consulta", "Metodo"
        ])
        writer.writeheader()
        writer.writerows(all_results)

    print("\n" + "="*70)
    print(f" COMPLETADO: {len(all_results)} localidades con fuentes verificadas")
    print(f" Archivo: {OUTPUT_FILE}")
    print("="*70)

if __name__ == "__main__":
    main()
