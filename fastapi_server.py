import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="GreenOps DC API Gateway",
    description="Production-ready API for ESG reporting and live IoT data ingestion",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    return {"status": "GreenOps API is running", "version": "1.0.0"}

# MÓDULO C: API de Cumplimiento ESG (Scope 2 & PUE)
@app.get("/api/v1/esg-metrics")
def get_esg_metrics(location: str = "Isla Gordon, Chile", racks: int = 10, density: float = 100.0):
    # Mock calculation based on our research values
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
            "reporting_period": "2026-Annual-Projection"
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
            "water_consumption_effectiveness_wue": 0.0 # Phase change is closed-loop
        }
    }

# MÓDULO D: Integración IoT con Sensores Físicos
@app.get("/api/v1/iot-telemetry")
def get_iot_telemetry():
    """Endpoint que consume el front-end para graficar los datos de sensores físicos"""
    return live_telemetry

@app.post("/api/v1/iot-telemetry/update")
def update_iot_telemetry(data: TelemetryUpdate):
    """
    Endpoint para que el script puente de MQTT/Modbus publique lecturas de sensores.
    Calcula la termodinámica del gemelo digital en base a lecturas reales.
    """
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
