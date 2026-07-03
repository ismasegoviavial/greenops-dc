import json
import csv
import io
import datetime
import random
from fastapi import FastAPI, Depends, HTTPException, Security, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security.api_key import APIKeyHeader
from pydantic import BaseModel

app = FastAPI(
    title="GreenOps DC API Gateway",
    description="Production-ready API for ESG reporting, live energy tariffs, and IoT telemetries",
    version="1.1.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Key Security Config
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)
VALID_API_KEY = "FIXUS_SECURE_TOKEN_2026"

def get_api_key(api_key: str = Depends(api_key_header)):
    if not api_key or api_key != VALID_API_KEY:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Invalid or missing X-API-Key header. Get your key from the API Integration Hub."
        )
    return api_key

# In-memory store for IoT Telemetry (simulating live Modbus/MQTT values)
live_telemetry = {
    "location": "Isla Gordon, Chile",
    "it_load_kw": 100.0,
    "external_temp_c": 12.5,
    "flow_rate_ls": 1.2,
    "chip_temp_c": 52.4,
    "pressure_bar": 1.08,
    "pue_instantaneous": 1.034,
    "status": "Estable - FC Pasivo"
}

class TelemetryUpdate(BaseModel):
    it_load_kw: float
    external_temp_c: float
    flow_rate_ls: float

@app.get("/")
def read_root():
    return {"status": "GreenOps API is running", "version": "1.1.0", "secured_endpoints": ["/api/v1/esg-metrics", "/api/v1/upload-inventory"]}

# MÓDULO C: API de Cumplimiento ESG (Scope 2 & PUE) - SECURED
@app.get("/api/v1/esg-metrics", dependencies=[Depends(get_api_key)])
def get_esg_metrics(location: str = "Isla Gordon, Chile", racks: int = 10, density: float = 100.0):
    pue_avg = 1.034
    it_power = density * racks
    energy_it_yr = it_power * 8760
    energy_sys_yr = energy_it_yr * pue_avg
    
    # Baseline comparison (CRAC)
    crac_pue = 1.80
    energy_baseline_yr = energy_it_yr * crac_pue
    energy_saved_yr = energy_baseline_yr - energy_sys_yr
    
    # Grid emissions factor (tCO2e/MWh)
    grid_factor = 0.35
    if "Islandia" in location or "Reykjavik" in location:
        grid_factor = 0.01
    
    carbon_saved_yr = (energy_saved_yr / 1000) * grid_factor
    
    return {
        "metadata": {
            "platform": "Fixus GreenOps DC",
            "compliance_standard": "GHG Protocol Scope 2",
            "reporting_period": "2026-Annual-Projection",
            "security": "Authenticated via X-API-Key"
        },
        "metrics": {
            "location": location,
            "racks_count": racks,
            "rack_density_kw": density,
            "average_pue": round(pue_avg, 3),
            "it_energy_mwh": round(energy_it_yr / 1000, 2),
            "system_total_energy_mwh": round(energy_sys_yr / 1000, 2),
            "energy_savings_mwh": round(energy_saved_yr / 1000, 2),
            "carbon_reduction_tco2e": round(carbon_saved_yr, 2),
            "water_consumption_effectiveness_wue": 0.0
        }
    }

# MÓDULO D: Integración IoT con Sensores Físicos
@app.get("/api/v1/iot-telemetry")
def get_iot_telemetry():
    return live_telemetry

@app.post("/api/v1/iot-telemetry/update", dependencies=[Depends(get_api_key)])
def update_iot_telemetry(data: TelemetryUpdate):
    global live_telemetry
    
    # Recalculate physics based on real sensor inputs
    R_condenser = 0.08 / data.flow_rate_ls
    T_sat = data.external_temp_c + data.it_load_kw * R_condenser
    Tj = T_sat + (data.it_load_kw / 100) * 15
    P_bar = 1.013 * 2.71828 ** (-3140 * (1 / (T_sat + 273.15) - 1 / 334.15))
    
    if data.external_temp_c < 25:
        pue = 1.03
        status = "Operación Estable (FC Pasivo)"
    else:
        pue = 1.08
        status = "Chiller Assist Activo"
        
    live_telemetry = {
        "location": "Isla Gordon, Chile",
        "it_load_kw": data.it_load_kw,
        "external_temp_c": data.external_temp_c,
        "flow_rate_ls": data.flow_rate_ls,
        "chip_temp_c": round(Tj, 1),
        "pressure_bar": round(P_bar, 2),
        "pue_instantaneous": round(pue, 3),
        "status": status
    }
    return {"message": "Telemetry updated successfully", "current_state": live_telemetry}

# PENDIENTE COMERCIAL: Tarifas en Tiempo Real (BloombergNEF Live Simulation)
@app.get("/api/v1/live-tariffs")
def get_live_tariffs():
    base_tariffs = {
        "Isla Gordon, Chile": 0.176,
        "Colchane, Chile": 0.145,
        "Reykjavik, Islandia": 0.052,
        "Helsinki, Finlandia": 0.112,
        "Lulea, Suecia": 0.088,
        "Quebec, Canada": 0.076
    }
    now = datetime.datetime.now()
    seed = now.hour + now.day
    random.seed(seed)
    live = {}
    for loc, base in base_tariffs.items():
        # Live market fluctuation (+/- 5%)
        fluctuation = random.uniform(-0.05, 0.05)
        live[loc] = round(base * (1 + fluctuation), 4)
        
    return {
        "live_tariffs": live,
        "timestamp": now.isoformat(),
        "source": "BloombergNEF Live Simulation"
    }

# PENDIENTE COMERCIAL: Carga de Inventario CSV
@app.post("/api/v1/upload-inventory", dependencies=[Depends(get_api_key)])
async def upload_inventory(file: UploadFile = File(...)):
    contents = await file.read()
    decoded = contents.decode('utf-8-sig')
    reader = csv.DictReader(io.StringIO(decoded))
    
    racks = []
    total_power_kw = 0.0
    total_baseline_pue = 0.0
    
    try:
        for row in reader:
            # Standardize keys to lowercase
            row_lower = {k.lower().strip(): v.strip() for k, v in row.items() if k}
            
            # Map common headers
            rack_id = row_lower.get("rack_id") or row_lower.get("id") or "Rack"
            power_kw = float(row_lower.get("power_kw") or row_lower.get("potencia_kw") or 100.0)
            baseline_pue = float(row_lower.get("baseline_pue") or row_lower.get("pue") or 1.80)
            
            total_power_kw += power_kw
            total_baseline_pue += baseline_pue
            racks.append({
                "rack_id": rack_id,
                "power_kw": power_kw,
                "baseline_pue": baseline_pue
            })
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")
        
    if not racks:
        raise HTTPException(status_code=400, detail="CSV file is empty or missing headers (e.g. rack_id, power_kw, baseline_pue)")
        
    avg_pue_baseline = round(total_baseline_pue / len(racks), 3)
    avg_power_kw = round(total_power_kw / len(racks), 2)
    
    return {
        "summary": {
            "filename": file.filename,
            "total_racks": len(racks),
            "total_power_capacity_kw": round(total_power_kw, 2),
            "avg_power_per_rack_kw": avg_power_kw,
            "avg_baseline_pue": avg_pue_baseline,
        },
        "racks": racks
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
