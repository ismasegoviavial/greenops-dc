import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

# Leer datos
print("Cargando datos climáticos de 2023 a 2025...")
df = pd.read_csv("climate_data_2023_2025.csv")
df['Time'] = pd.to_datetime(df['Time'])

# Configurar el gráfico
plt.figure(figsize=(15, 7))

# Ciudades a comparar
city_chile = "Isla Gordon, Chile"
city_europe = "Helsinki, Finlandia"

df_chile = df[df['Location'] == city_chile]
df_europe = df[df['Location'] == city_europe]

plt.plot(df_chile['Time'], df_chile['Temperature_C'], label=city_chile, color='blue', alpha=0.7, linewidth=0.5)
plt.plot(df_europe['Time'], df_europe['Temperature_C'], label=city_europe, color='orange', alpha=0.7, linewidth=0.5)

# Líneas críticas de Tecnología
plt.axhline(y=25.0, color='red', linestyle='--', linewidth=2, label="Límite D2C Bifásico (25°C)")
plt.axhline(y=10.0, color='green', linestyle='--', linewidth=2, label="Límite RDHx (10°C)")

plt.title("Comportamiento Térmico Horario (2023-2025): Chile vs. Finlandia", fontsize=14, fontweight='bold')
plt.xlabel("Fecha", fontsize=12)
plt.ylabel("Temperatura Exterior (°C)", fontsize=12)
plt.legend(loc='upper right')
plt.grid(True, alpha=0.3)
plt.tight_layout()

# Guardar la gráfica en la carpeta de artifacts
output_path = r"C:\Users\Fernanda\.gemini\antigravity\brain\fd493162-746b-4353-99f8-45953a80c5d2\grafico_termico_2023_2025.png"
plt.savefig(output_path, dpi=300)
print(f"Gráfica guardada en: {output_path}")

