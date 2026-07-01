import requests
import json
import csv

locations = {
    "Isla Gordon, Chile": {"lat": -54.95, "lon": -69.65},
    "Colchane, Chile": {"lat": -19.26, "lon": -68.63},
    "Reykjavik, Islandia": {"lat": 64.14, "lon": -21.94},
    "Helsinki, Finlandia": {"lat": 60.16, "lon": 24.93},
    "Lulea, Suecia": {"lat": 65.58, "lon": 22.15},
    "Quebec, Canada": {"lat": 46.81, "lon": -71.20}
}

start_date = "2023-01-01"
end_date = "2025-12-31"

print("Descargando datos climáticos ERA5 de Open-Meteo (2023 a 2025)...")

with open("climate_data_2023_2025.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["Location", "Time", "Temperature_C"])
    
    for city, coords in locations.items():
        print(f"Obteniendo datos para {city}...")
        url = f"https://archive-api.open-meteo.com/v1/archive?latitude={coords['lat']}&longitude={coords['lon']}&start_date={start_date}&end_date={end_date}&hourly=temperature_2m&timezone=UTC"
        
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            times = data["hourly"]["time"]
            temps = data["hourly"]["temperature_2m"]
            
            for t, temp in zip(times, temps):
                # Handle None values (missing data)
                if temp is None:
                    temp = 0.0
                writer.writerow([city, t, temp])
        else:
            print(f"Error descargando {city}: {response.status_code}")

print("¡Descarga completada! Datos guardados en climate_data_2023_2025.csv")
