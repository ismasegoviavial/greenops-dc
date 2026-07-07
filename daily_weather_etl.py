import sys
import datetime
import requests
import pandas as pd
from google.cloud import bigquery

PROJECT_ID = "project-5ca89b0c-e364-4245-a61"
DATASET_ID = "data_center_research"
TABLE_ID = "climate_data_global"

CITIES = {
    # ── CHILE ──────────────────────────
    "Isla Gordon, Chile":           {"lat": -54.95,  "lon": -69.65,  "region": "Sudamérica"},
    "Colchane, Chile":              {"lat": -19.26,  "lon": -68.63,  "region": "Sudamérica"},
    "Punta Arenas, Chile":          {"lat": -53.15,  "lon": -70.92,  "region": "Sudamérica"},
    "Puerto Natales, Chile":        {"lat": -51.73,  "lon": -72.49,  "region": "Sudamérica"},
    "Coyhaique, Chile":             {"lat": -45.57,  "lon": -72.07,  "region": "Sudamérica"},

    # ── SUDAMÉRICA ─────────────────────────────────
    "Mendoza, Argentina":           {"lat": -32.89,  "lon": -68.85,  "region": "Sudamérica"},
    "Montevideo, Uruguay":          {"lat": -34.90,  "lon": -56.19,  "region": "Sudamérica"},
    "Ushuaia, Argentina":           {"lat": -54.80,  "lon": -68.30,  "region": "Sudamérica"},
    "Bogotá, Colombia":             {"lat":   4.71,  "lon": -74.07,  "region": "Sudamérica"},
    "Quito, Ecuador":               {"lat":  -0.23,  "lon": -78.52,  "region": "Sudamérica"},

    # ── EUROPA NÓRDICA ────────────────
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

    # ── EUROPA CENTRAL ─────────
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

    # ── ORIENTE MEDIO / ÁFRICA ────────────
    "Dubai, EAU":                   {"lat":  25.20,  "lon":  55.27,  "region": "Oriente Medio"},
    "Nairobi, Kenia":               {"lat":  -1.29,  "lon":  36.82,  "region": "África"},

    # ── REFERENCIA CLIMÁTICA ───────────────
    "Yakutsk, Rusia":               {"lat":  62.03,  "lon": 129.73,  "region": "Asia"},
    "Phoenix, Arizona USA":         {"lat":  33.45,  "lon": -112.07, "region": "Norteamérica"},
}

def fetch_weather_for_date(date_str):
    all_rows = []
    print(f"Obteniendo datos del clima para la fecha: {date_str}...")
    
    for city, info in CITIES.items():
        lat = info["lat"]
        lon = info["lon"]
        region = info["region"]
        
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=temperature_2m&start_date={date_str}&end_date={date_str}"
        try:
            r = requests.get(url, timeout=15)
            if r.status_code == 200:
                data = r.json()
                times = data["hourly"]["time"]
                temps = data["hourly"]["temperature_2m"]
                
                print(f"  - {city}: {len(times)} horas de datos obtenidas.")
                for t, temp in zip(times, temps):
                    if temp is None:
                        temp = 0.0
                    all_rows.append({
                        "location": city,
                        "region": region,
                        "latitude": lat,
                        "longitude": lon,
                        "time": t,
                        "temperature_c": float(temp)
                    })
            else:
                print(f"  ! Error HTTP {r.status_code} para {city}")
        except Exception as e:
            print(f"  ! Excepcion al consultar API para {city}: {e}")
            
    return pd.DataFrame(all_rows)

def delete_records_for_date(client, date_str):
    table_ref = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"
    query = f"DELETE FROM `{table_ref}` WHERE DATE(time) = '{date_str}'"
    print(f"Eliminando registros existentes en BigQuery para la fecha {date_str} para asegurar la idempotencia...")
    try:
        query_job = client.query(query)
        query_job.result()  # Esperar a que se complete el delete
        print("  - Registros anteriores eliminados con éxito.")
    except Exception as e:
        print(f"Aviso: No se pudo realizar la eliminación previa (esto es normal si es la primera ejecución): {e}")

def main():
    # Permitir pasar una fecha específica por argumento de línea de comandos (YYYY-MM-DD)
    if len(sys.argv) > 1:
        date_str = sys.argv[1]
        try:
            datetime.datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            print("Error: El formato de la fecha debe ser YYYY-MM-DD")
            sys.exit(1)
    else:
        # Por defecto, procesamos el día de ayer
        yesterday = datetime.date.today() - datetime.timedelta(days=1)
        date_str = yesterday.strftime("%Y-%m-%d")
        
    df = fetch_weather_for_date(date_str)
    
    if df.empty:
        print("No se pudieron obtener datos para ninguna ciudad. Abortando.")
        sys.exit(1)
        
    # Formatear la columna de tiempo como datetime para BigQuery
    df["time"] = pd.to_datetime(df["time"])
    
    # Inicializar cliente de BigQuery
    client = bigquery.Client(project=PROJECT_ID)
    dataset_ref = client.dataset(DATASET_ID)
    table_ref = dataset_ref.table(TABLE_ID)
    
    # Idempotencia: eliminar registros previos de la misma fecha (habilitado para facturación activa)
    delete_records_for_date(client, date_str)
    
    # Subir nuevos datos (Append)
    print(f"Insertando {len(df)} nuevos registros en `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}`...")
    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_APPEND
    )
    
    try:
        load_job = client.load_table_from_dataframe(df, table_ref, job_config=job_config)
        load_job.result()
        print("¡Ingesta incremental diaria completada con éxito!")
    except Exception as e:
        print(f"Error al subir los datos a BigQuery: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
