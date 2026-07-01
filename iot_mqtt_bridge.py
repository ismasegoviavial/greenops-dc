import json
import random
import time
import urllib.request

# Este script actúa como el "puente de hardware" en el data center.
# En producción, usaría una librería de Modbus (pymodbus) para leer PLCs
# o se suscribiría a un broker MQTT industrial.
# Luego, empuja los datos al servidor de Fixus GreenOps.

FASTAPI_URL = "http://127.0.0.1:8000/api/v1/iot-telemetry/update"

print("Iniciando puente de sensores IoT (Fixus Bridge)...")
print("Presiona Ctrl+C para detener.")

try:
    while True:
        # Simulamos lecturas reales de los sensores del rack Blackwell:
        # 1. Carga IT de los procesadores (sensor de potencia eléctrica)
        sensor_load = random.uniform(85.0, 115.0) # kW
        # 2. Temperatura exterior en Isla Gordon (termómetro externo)
        sensor_ext_temp = random.uniform(8.0, 14.0) # C
        # 3. Caudal de refrigerante secundario (caudalímetro)
        sensor_flow = random.uniform(0.9, 1.3) # L/s

        payload = {
            "it_load_kw": round(sensor_load, 2),
            "external_temp_c": round(sensor_ext_temp, 2),
            "flow_rate_ls": round(sensor_flow, 2)
        }

        # Enviamos los datos reales del sensor al backend FastAPI
        req = urllib.request.Request(
            FASTAPI_URL, 
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        try:
            with urllib.request.urlopen(req) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                print(f"[SENSOR LECTURA] Carga: {payload['it_load_kw']} kW, Ext Temp: {payload['external_temp_c']} °C, Caudal: {payload['flow_rate_ls']} L/s")
                print(f"[GEMELO DIGITAL] Tj calculada: {res_data['current_state']['chip_temp_c']} °C, PUE: {res_data['current_state']['pue_instantaneous']}")
        except Exception as e:
            print("[ERROR ENLACE BACKEND] El servidor de FastAPI no está respondiendo. Ejecuta fastapi_server.py primero. Detalle:", e)
        
        time.sleep(3) # Frecuencia de muestreo: cada 3 segundos

except KeyboardInterrupt:
    print("\nPuente IoT detenido.")
