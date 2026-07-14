# Resumen de Fuentes de Datos de GreenOps DC

Este documento resume las fuentes oficiales utilizadas para respaldar el análisis termodinámico y económico en la plataforma GreenOps DC, estructuradas de forma clara para presentaciones comerciales o reuniones con inversionistas.

---

## 1. Clima y Meteorología (Cálculo de Free Cooling)

* **Copernicus Climate Change Service (ERA5 Reanalysis) & NASA POWER:**
  * **Qué es:** La base de datos satelital de modelamiento climático más grande y respetada del mundo (Unión Europea / EE. UU.).
  * **Datos aportados:** Historial horario de temperaturas secas y de bulbo húmedo de 3 años completos (2023-2025, equivalentes a **26,280 registros horarios**).
  * **Uso en el proyecto:** Pre-calcula con total rigor científico el potencial real de *Free Cooling* para las 39 localidades del estudio base.
* **Open-Meteo API (Conexión Satelital en Vivo):**
  * **Qué es:** Una plataforma meteorológica abierta que mapea modelos numéricos globales de clima.
  * **Datos aportados:** Telemetría climática histórica y proyecciones meteorológicas en tiempo real de cualquier coordenada del planeta.
  * **Uso en el proyecto:** Respalda el módulo de "Coordenadas Personalizadas" en el Feasibility Studio. Al ingresar latitud y longitud, el software descarga en vivo las 8,760 horas de clima del sitio para calcular el PUE instantáneo.

---

## 2. Tarifas y Operación Eléctrica (Cálculo de OPEX)

* **Coordinador Eléctrico Nacional (CEN) API (Chile):**
  * **Qué es:** El organismo público e independiente que opera el Sistema Eléctrico Nacional en Chile.
  * **Datos aportados:** Historial de costos marginales por barra/subestación y la tarifa de generación eléctrica industrial en tiempo real.
  * **Uso en el proyecto:** Permite simular los costos eléctricos industriales chilenos reales para compararlos con tarifas globales, evidenciando la ventaja o desventaja arancelaria de cada región de Chile.

---

## 3. Emisiones y Sustentabilidad (Reporte Scope 2 / ESG)

* **Electricity Maps API (Global):**
  * **Qué es:** La plataforma líder global de monitoreo de intensidad de carbono de las redes eléctricas en tiempo real.
  * **Datos aportados:** Intensidad de carbono horaria de las redes de generación de Islandia, Finlandia, Suecia, Canadá y Chile ($g\text{CO}_2\text{e/kWh}$).
  * **Uso en el proyecto:** Sustenta matemáticamente el cálculo de huella de carbono Scope 2 evitada, asegurando que el reporte emitido por GreenOps cumpla de forma estricta con el estándar global del **GHG Protocol**.

---

## 4. Benchmarks Financieros y de Mercado (CAPEX / OPEX de la Industria)

* **Uptime Institute & BloombergNEF (BNEF) Reports (2024-2025):**
  * **Qué es:** Los dos referentes y consultores de mayor renombre mundial en análisis de infraestructura digital y energía limpia.
  * **Datos aportados:** 
    * El PUE de referencia promedio global para centros de datos enfriados por aire tradicional (1.80).
    * Costos estimados de CAPEX de equipamiento especializado para refrigeración líquida ($15k a $40k USD por rack de alta densidad).
  * **Uso en el proyecto:** Valida los supuestos financieros del ROI, como la tasa de descuento (10%), vida útil estándar de activos tecnológicos y costos promedio de mantenimiento OPEX.
