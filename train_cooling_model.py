import pandas as pd
from google.cloud import bigquery

PROJECT_ID = "project-5ca89b0c-e364-4245-a61"
DATASET_ID = "data_center_research"
MODEL_ID = "cooling_forecast_model"

def train_model(client):
    # Entrenamos con datos a partir de 2025-01-01 para optimizar el tiempo de entrenamiento en el sandbox
    sql = f"""
    CREATE OR REPLACE MODEL `{PROJECT_ID}.{DATASET_ID}.{MODEL_ID}`
    OPTIONS(
      model_type='ARIMA_PLUS',
      time_series_timestamp_col='time',
      time_series_data_col='temperature_c',
      time_series_id_col='location',
      auto_arima=TRUE,
      data_frequency='HOURLY'
    ) AS
    SELECT time, location, temperature_c
    FROM `{PROJECT_ID}.{DATASET_ID}.climate_data_global`
    WHERE location IN ('Isla Gordon, Chile', 'Colchane, Chile', 'Reykjavik, Islandia', 'Helsinki, Finlandia', 'Lulea, Suecia', 'Quebec, Canada')
      AND time >= '2025-01-01T00:00:00'
    """
    print("Iniciando el entrenamiento del modelo de series temporales (ARIMA_PLUS) en BigQuery ML...")
    print("Esto entrenará 6 series de tiempo individuales de forma paralela en la nube de Google.")
    print("Este proceso puede tomar de 1 a 2 minutos...")
    try:
        query_job = client.query(sql)
        query_job.result() # Esperar finalización
        print("¡Modelo entrenado exitosamente y registrado en BigQuery ML/Vertex AI!")
    except Exception as e:
        print(f"Error durante el entrenamiento del modelo: {e}")
        raise

def forecast_temperatures(client):
    sql = f"""
    SELECT
      location,
      forecast_timestamp,
      ROUND(forecast_value, 2) as forecasted_temp_c,
      ROUND(standard_error, 2) as std_error
    FROM
      ML.FORECAST(MODEL `{PROJECT_ID}.{DATASET_ID}.{MODEL_ID}`, STRUCT(24 AS horizon, 0.95 AS confidence_level))
    ORDER BY
      location, forecast_timestamp
    """
    print("\nGenerando pronóstico de temperatura (Horizonte: 24 horas)...")
    try:
        query_job = client.query(sql)
        df = query_job.to_dataframe()
        print("\nMuestra del pronóstico generado (primeras 10 filas):")
        print(df.head(10))
        
        # Guardar resultados
        df.to_csv("pronostico_temperaturas_24h.csv", index=False)
        print("\n¡Resultados de la predicción guardados exitosamente en 'pronostico_temperaturas_24h.csv'!")
    except Exception as e:
        print(f"Error al generar el pronóstico: {e}")
        raise

def main():
    client = bigquery.Client(project=PROJECT_ID)
    train_model(client)
    forecast_temperatures(client)

if __name__ == "__main__":
    main()
