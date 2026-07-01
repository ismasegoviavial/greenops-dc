import requests
import csv
import time

# ============================================================
# DATASET GLOBAL DE LOCALIDADES ESTRATÉGICAS PARA DATA CENTERS DE IA
# Fuente climática: ERA5 / Open-Meteo Historical Archive API
# Autora: Fernanda - Tesis de Magíster USACH
# Coordenadas verificadas con Open-Meteo location search
# ============================================================

LOCATIONS = {
    # ── CHILE (Resultados originales de la Tesis) ──────────────────────────
    "Isla Gordon, Chile":           {"lat": -54.95,  "lon": -69.65,  "region": "Sudamérica"},
    "Colchane, Chile":              {"lat": -19.26,  "lon": -68.63,  "region": "Sudamérica"},
    "Punta Arenas, Chile":          {"lat": -53.15,  "lon": -70.92,  "region": "Sudamérica"},
    "Puerto Natales, Chile":        {"lat": -51.73,  "lon": -72.49,  "region": "Sudamérica"},
    "Coyhaique, Chile":             {"lat": -45.57,  "lon": -72.07,  "region": "Sudamérica"},

    # ── SUDAMÉRICA (Localidades emergentes) ─────────────────────────────────
    "Mendoza, Argentina":           {"lat": -32.89,  "lon": -68.85,  "region": "Sudamérica"},
    "Montevideo, Uruguay":          {"lat": -34.90,  "lon": -56.19,  "region": "Sudamérica"},
    "Ushuaia, Argentina":           {"lat": -54.80,  "lon": -68.30,  "region": "Sudamérica"},
    "Bogotá, Colombia":             {"lat":   4.71,  "lon": -74.07,  "region": "Sudamérica"},
    "Quito, Ecuador":               {"lat":  -0.23,  "lon": -78.52,  "region": "Sudamérica"},

    # ── EUROPA NÓRDICA (Las Mecas globales del Free Cooling) ────────────────
    "Reykjavik, Islandia":          {"lat":  64.14,  "lon": -21.94,  "region": "Europa"},
    "Helsinki, Finlandia":          {"lat":  60.16,  "lon":  24.93,  "region": "Europa"},
    "Lulea, Suecia":                {"lat":  65.58,  "lon":  22.15,  "region": "Europa"},
    "Trondheim, Noruega":           {"lat":  63.43,  "lon":  10.39,  "region": "Europa"},
    "Stavanger, Noruega":           {"lat":  58.97,  "lon":   5.73,  "region": "Europa"},
    "Oulu, Finlandia":              {"lat":  65.01,  "lon":  25.47,  "region": "Europa"},
    "Tallin, Estonia":              {"lat":  59.44,  "lon":  24.75,  "region": "Europa"},
    "Estocolmo, Suecia":            {"lat":  59.33,  "lon":  18.06,  "region": "Europa"},
    "Oslo, Noruega":                {"lat":  59.91,  "lon":  10.75,  "region": "Europa"},
    "Copenhague, Dinamarca":        {"lat":  55.68,  "lon":  12.57,  "region": "Europa"},

    # ── EUROPA CENTRAL (Hubs de conectividad y tráfico de internet) ─────────
    "Frankfurt, Alemania":          {"lat":  50.11,  "lon":   8.68,  "region": "Europa"},
    "Amsterdam, Holanda":           {"lat":  52.37,  "lon":   4.89,  "region": "Europa"},
    "Dublin, Irlanda":              {"lat":  53.33,  "lon":  -6.25,  "region": "Europa"},
    "Zúrich, Suiza":                {"lat":  47.37,  "lon":   8.54,  "region": "Europa"},
    "Londres, UK":                  {"lat":  51.51,  "lon":  -0.13,  "region": "Europa"},

    # ── NORTEAMÉRICA ─────────────────────────────────────────────────────────
    "Quebec, Canada":               {"lat":  46.81,  "lon": -71.20,  "region": "Norteamérica"},
    "Vancouver, Canada":            {"lat":  49.25,  "lon": -123.12, "region": "Norteamérica"},
    "Anchorage, Alaska USA":        {"lat":  61.22,  "lon": -149.90, "region": "Norteamérica"},
    "Des Moines, Iowa USA":         {"lat":  41.60,  "lon":  -93.61, "region": "Norteamérica"},
    "Portland, Oregon USA":         {"lat":  45.52,  "lon": -122.68, "region": "Norteamérica"},

    # ── ASIA-PACÍFICO ────────────────────────────────────────────────────────
    "Hokkaido (Sapporo), Japón":    {"lat":  43.06,  "lon": 141.35,  "region": "Asia-Pacífico"},
    "Ulaanbaatar, Mongolia":        {"lat":  47.90,  "lon": 106.90,  "region": "Asia-Pacífico"},
    "Christchurch, Nueva Zelanda":  {"lat": -43.53,  "lon": 172.62,  "region": "Asia-Pacífico"},
    "Seúl, Corea del Sur":          {"lat":  37.56,  "lon": 126.97,  "region": "Asia-Pacífico"},
    "Singapur":                     {"lat":   1.35,  "lon": 103.82,  "region": "Asia-Pacífico"},

    # ── ORIENTE MEDIO / ÁFRICA (Puntos de estrés térmico máximo) ────────────
    "Dubai, EAU":                   {"lat":  25.20,  "lon":  55.27,  "region": "Oriente Medio"},
    "Nairobi, Kenia":               {"lat":  -1.29,  "lon":  36.82,  "region": "África"},

    # ── REFERENCIA CLIMÁTICA (Temperatura extrema de control) ───────────────
    "Yakutsk, Rusia":               {"lat":  62.03,  "lon": 129.73,  "region": "Asia"},
    "Phoenix, Arizona USA":         {"lat":  33.45,  "lon": -112.07, "region": "Norteamérica"},
}

START_DATE = "2023-01-01"
END_DATE   = "2025-12-31"
OUTPUT_FILE = "climate_data_global_2023_2025.csv"

def fetch_location(city, coords):
    url = (
        f"https://archive-api.open-meteo.com/v1/archive"
        f"?latitude={coords['lat']}&longitude={coords['lon']}"
        f"&start_date={START_DATE}&end_date={END_DATE}"
        f"&hourly=temperature_2m&timezone=UTC"
    )
    try:
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            data = response.json()
            times = data["hourly"]["time"]
            temps = data["hourly"]["temperature_2m"]
            return times, temps
        else:
            print(f"  ! Error HTTP {response.status_code} para {city}")
            return [], []
    except Exception as e:
        print(f"  ! Excepcion para {city}: {e}")
        return [], []

def main():
    print("=" * 65)
    print(" DESCARGA MASIVA - DATASET GLOBAL DE DATA CENTERS DE IA")
    print(f" {len(LOCATIONS)} localidades x 3 anios (2023-2025) via ERA5")
    print("=" * 65)

    total_rows = 0

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Location", "Region", "Latitude", "Longitude", "Time", "Temperature_C"])

        for i, (city, coords) in enumerate(LOCATIONS.items(), 1):
            print(f"[{i:02d}/{len(LOCATIONS)}] Descargando: {city}...")
            times, temps = fetch_location(city, coords)

            rows_written = 0
            for t, temp in zip(times, temps):
                if temp is None:
                    temp = 0.0
                writer.writerow([city, coords["region"], coords["lat"], coords["lon"], t, round(temp, 2)])
                rows_written += 1

            total_rows += rows_written
            print(f"       OK: {rows_written:,} horas guardadas")

            # Pausa de cortesía hacia la API (evitar bloqueo por rate limiting)
            time.sleep(0.8)

    print("\n" + "=" * 65)
    print(" DESCARGA COMPLETADA")
    print(f" Archivo: {OUTPUT_FILE}")
    print(f" Total de registros: {total_rows:,} filas")
    print(f" Localidades procesadas: {len(LOCATIONS)}")
    print("=" * 65)

if __name__ == "__main__":
    main()
