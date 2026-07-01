import pandas as pd
from google.cloud import bigquery
from google.api_core.exceptions import Conflict

PROJECT_ID = "project-5ca89b0c-e364-4245-a61"
DATASET_ID = "data_center_research"

def get_or_create_dataset(client):
    dataset_ref = bigquery.DatasetReference(PROJECT_ID, DATASET_ID)
    try:
        dataset = client.get_dataset(dataset_ref)
        print(f"Dataset '{DATASET_ID}' ya existe.")
    except Exception:
        # Si no existe, lo creamos
        dataset = bigquery.Dataset(dataset_ref)
        dataset.location = "US"
        dataset = client.create_dataset(dataset)
        print(f"Dataset '{DATASET_ID}' creado exitosamente en la ubicacion 'US'.")
    return dataset_ref

def upload_climate_data(client, dataset_ref):
    csv_file = "climate_data_global_2023_2025.csv"
    table_id = "climate_data_global"
    table_ref = dataset_ref.table(table_id)
    
    print(f"\nProcesando '{csv_file}'...")
    df = pd.read_csv(csv_file)
    
    # Renombrar columnas a snake_case
    df.rename(columns={
        "Location": "location",
        "Region": "region",
        "Latitude": "latitude",
        "Longitude": "longitude",
        "Time": "time",
        "Temperature_C": "temperature_c"
    }, inplace=True)
    
    # Convertir columna de tiempo a datetime para que en BQ sea TIMESTAMP
    df["time"] = pd.to_datetime(df["time"])
    
    print(f"Subiendo {len(df):,} filas a '{table_id}' en BigQuery...")
    
    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
        schema=[
            bigquery.SchemaField("location", "STRING"),
            bigquery.SchemaField("region", "STRING"),
            bigquery.SchemaField("latitude", "FLOAT"),
            bigquery.SchemaField("longitude", "FLOAT"),
            bigquery.SchemaField("time", "TIMESTAMP"),
            bigquery.SchemaField("temperature_c", "FLOAT"),
        ]
    )
    
    load_job = client.load_table_from_dataframe(df, table_ref, job_config=job_config)
    load_job.result() # Esperar a que se complete la carga
    print(f"¡Tabla '{table_id}' subida exitosamente!")

def upload_thermoeconomic_data(client, dataset_ref):
    csv_file = "analisis_termoeconomico_global.csv"
    table_id = "analisis_termoeconomico_global"
    table_ref = dataset_ref.table(table_id)
    
    print(f"\nProcesando '{csv_file}'...")
    df = pd.read_csv(csv_file)
    
    # Renombrar columnas para evitar espacios y caracteres especiales en SQL
    column_mapping = {
        "Region": "region",
        "Localidad": "localidad",
        "Precio_USD_kWh": "precio_usd_kwh",
        "Fuente_Tarifa": "fuente_tarifa",
        "URL_Fuente": "url_fuente",
        "Sistema de Enfriamiento": "sistema_enfriamiento",
        "Horas Totales": "horas_totales",
        "Free Cooling Hours": "free_cooling_hours",
        "FCH %": "fch_pct",
        "Energia Total (kWh)": "energia_total_kwh",
        "OPEX 3 Anios (USD)": "opex_3_anios_usd"
    }
    
    df.rename(columns=column_mapping, inplace=True)
    
    print(f"Subiendo {len(df):,} filas a '{table_id}' en BigQuery...")
    
    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
        schema=[
            bigquery.SchemaField("region", "STRING"),
            bigquery.SchemaField("localidad", "STRING"),
            bigquery.SchemaField("precio_usd_kwh", "FLOAT"),
            bigquery.SchemaField("fuente_tarifa", "STRING"),
            bigquery.SchemaField("url_fuente", "STRING"),
            bigquery.SchemaField("sistema_enfriamiento", "STRING"),
            bigquery.SchemaField("horas_totales", "INTEGER"),
            bigquery.SchemaField("free_cooling_hours", "INTEGER"),
            bigquery.SchemaField("fch_pct", "FLOAT"),
            bigquery.SchemaField("energia_total_kwh", "FLOAT"),
            bigquery.SchemaField("opex_3_anios_usd", "FLOAT"),
        ]
    )
    
    load_job = client.load_table_from_dataframe(df, table_ref, job_config=job_config)
    load_job.result()
    print(f"¡Tabla '{table_id}' subida exitosamente!")

def main():
    client = bigquery.Client(project=PROJECT_ID)
    dataset_ref = get_or_create_dataset(client)
    
    upload_climate_data(client, dataset_ref)
    upload_thermoeconomic_data(client, dataset_ref)
    
    print("\n==============================================")
    print(" CARGA DE DATOS A BIGQUERY COMPLETADA CON EXITO")
    print("==============================================")

if __name__ == "__main__":
    main()
