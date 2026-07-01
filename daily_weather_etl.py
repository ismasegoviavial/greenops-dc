import sys
import datetime
import requests
import pandas as pd
from google.cloud import bigquery

PROJECT_ID = "project-5ca89b0c-e364-4245-a61"
DATASET_ID = "data_center_research"
TABLE_ID = "climate_data_global"

CITIES = {
    "Isla Gordon, Chile":           {"lat": -54.95,  "lon": -69.65,  "region": "Sudamérica"},
    "Colchane, Chile":              {"lat": -19.26,  "lon": -68.63,  "region": "Sudamérica"},
    "Reykjavik, Islandia":          {"lat":  64.14,  "lon": -21.94,  "region": "Europa"},
    "Helsinki, Finlandia":          {"lat":  60.16,  "lon":  24.93,  "region": "Europa"},
    "Lulea, Suecia":                {"lat":  65.58,  "lon":  22.15,  "region": "Europa"},
    "Quebec, Canada":               {"lat":  46.81,  "lon": -71.20,  "region": "Norteamérica"},
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

def check_records_exist(client, date_str):
    table_ref = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"
    query = f"SELECT COUNT(1) as cnt FROM `{table_ref}` WHERE DATE(time) = '{date_str}'"
    print(f"Verificando si ya existen registros en BigQuery para la fecha {date_str}...")
    try:
        query_job = client.query(query)
        result = query_job.to_dataframe()
        count = int(result["cnt"].iloc[0])
        print(f"Registros encontrados para esa fecha: {count}")
        return count > 0
    except Exception as e:
        print(f"Aviso: No se pudo verificar existencia (posiblemente la tabla esta vacia o es la primera ejecucion): {e}")
        return False

def main():
    # Permitir pasar una fecha especifica por argumento de linea de comandos (YYYY-MM-DD)
    if len(sys.argv) > 1:
        date_str = sys.argv[1]
        try:
            datetime.datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            print("Error: El formato de la fecha debe ser YYYY-MM-DD")
            sys.exit(1)
    else:
        # Por defecto, procesamos el dia de ayer
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
    
    # Idempotencia: verificar si los datos ya existen
    if check_records_exist(client, date_str):
        print(f"Los registros para la fecha {date_str} ya existen en BigQuery. Evitando duplicados y saltando la insercion.")
        sys.exit(0)
    
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
