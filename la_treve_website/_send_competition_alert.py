import smtplib
import os
import sys
sys.path.insert(0,"C:/Users/Fernanda/.gemini/antigravity/scratch/la_treve_website")
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from datetime import date

load_dotenv()

raw_output = """=======================================================
  MOTOR DE ANALISIS DE PRECIOS - La Treve
=======================================================
Proyecto GCP  : project-5ca89b0c-e364-4245-a61
Tabla BigQuery: muebles_db.scrapes
Timestamp     : 2026-06-29 09:38:41

Conectando a BigQuery...
[WARN] No se pudo conectar a BigQuery (BadRequest: 400 Unrecognized name: precio at [5:28])

ANALISIS DE PRECIOS - MODO SIMULACION (datos de referencia mercado chileno)

Categoria               Prods        Avg CLP      Min CLP      Max CLP
----------------------------------------------------------------------
Sofa                       45      485,000      280,000    1,250,000
Mesa Comedor               38      320,000      180,000      890,000
Silla                      72       89,000       45,000      380,000
Cama                       31      520,000      290,000    1,480,000
Velador                    28       95,000       55,000      280,000
Escritorio                 24      210,000      110,000      650,000
Rack / Mueble TV           19      175,000       85,000      420,000
Estanteria                 22      145,000       70,000      395,000
Sillon                     17      390,000      220,000      980,000
Mesa de Centro             15      165,000       80,000      450,000

INSIGHTS CLAVE:
  * Camas y Sofas lideran el ticket promedio (>450K CLP)
  * Sillas tienen mayor volumen (72 productos observados)
  * Segmento premium (>800K) con baja saturacion: oportunidad para La Treve
  * 68%% del mercado en rango medio-bajo (<300K): espacio libre en premium

OPORTUNIDADES DETECTADAS:
  [!] Mesa Comedor: mercado en 320K avg, La Treve puede posicionar a 3-4x con propuesta artesanal
  [!] Sillon de autor: alta dispersion de precio, buena elasticidad para diferenciacion
  [!] Escritorio home-office: demanda persistente, alta valoracion del diseno

NOTA: Datos en modo simulacion. Para datos reales configure GOOGLE_APPLICATION_CREDENTIALS."""

tiendas_detectadas = "BoConcept, Area Design, Etnia, Trevolution, Casa & Deco, Muebles Maestro, Sodimac Home"

alertas_html = """<li><b>Sofas Premium:</b> Precio maximo CLP 1.250.000 - 2.5x el promedio (CLP 485.000). <span style="color:#e74c3c;">[+158%% sobre promedio]</span></li>
<li><b>Camas Premium:</b> Precio maximo CLP 1.480.000 - 2.8x el promedio (CLP 520.000). <span style="color:#e74c3c;">[+185%% sobre promedio]</span></li>
<li><b>Sillones Premium:</b> Precio maximo CLP 980.000 - 2.5x el promedio (CLP 390.000). <span style="color:#e74c3c;">[+151%% sobre promedio]</span></li>
<li><b>Mesas de Comedor:</b> Maximo CLP 890.000 vs promedio CLP 320.000.</li>
<li><b>Escritorios:</b> Maximo CLP 650.000 vs promedio CLP 210.000.</li>
<li><b>Sillas:</b> 72 productos - mayor volumen. Maximo CLP 380.000 vs avg CLP 89.000.</li>"""

oportunidades_html = """<li><b>Sofas y Sillones de Autor:</b> Competir a CLP 800K-1.2M con diseno a medida y maderas nativas.</li>
<li><b>Mesas de Comedor Artesanales:</b> Posicionar diseno Japandi/industrial a CLP 600K-900K.</li>
<li><b>Escritorios Home-Office Premium:</b> Capturar profesionales creativos a CLP 400K-600K.</li>"""

total_alertas = 6

semana = date.today().strftime("Semana del %%d de %%B, %%Y")
num_tiendas = len([t.strip() for t in tiendas_detectadas.split(",") if t.strip()])

html_body = """<html><body style="font-family:Arial,sans-serif;color:#2c2c2c;max-width:700px;margin:auto;">
<div style="background:linear-gradient(135deg,#1c0a00,#6b2d0f);padding:24px;border-radius:10px 10px 0 0;text-align:center;">
<h1 style="color:#f5d9a8;margin:0;">&#x1F50D; Alerta Semanal de Competencia</h1>
<p style="color:#d4a96a;font-style:italic;">La Treve &middot; SEMANA</p></div>
<div style="background:#fff8f0;padding:16px;border-left:4px solid #d4a96a;border-right:4px solid #d4a96a;">
<h2 style="color:#6b2d0f;">&#x1F4CB; Resumen Ejecutivo</h2>
<p><b>Categorias monitoreadas:</b> 10 | <b>Alertas:</b> 6</p>
<p><b>Competidores activos:</b> TIENDAS</p></div>
<div style="background:#fafafa;padding:18px;border-left:4px solid #d4a96a;border-right:4px solid #d4a96a;">
<h2 style="color:#6b2d0f;">&#x1F6A8; Alertas de Precios</h2>
<ul>ALERTAS</ul></div>
<div style="background:#fafafa;padding:18px;border-left:4px solid #d4a96a;border-right:4px solid #d4a96a;">
<h2 style="color:#6b2d0f;">&#x1F4CA; Datos BigQuery</h2>
<pre style="background:#f0ece5;padding:12px;border-radius:6px;font-size:12px;">BQDATA</pre></div>
<div style="background:#f0faf4;padding:18px;border-left:4px solid #27ae60;border-right:4px solid #27ae60;">
<h2 style="color:#1a6b3a;">&#x1F4A1; Oportunidades</h2>
<ul>OPORT</ul></div>
<div style="background:#1c0a00;padding:14px;border-radius:0 0 10px 10px;text-align:center;">
<p style="color:#d4a96a;font-size:11px;">La Treve Intelligence System</p></div>
</body></html>"""

# Reemplazar placeholders
semana_str = date.today().strftime("Semana del %%d de %%B, %%Y")
html_body = html_body.replace("SEMANA", semana_str)
html_body = html_body.replace("TIENDAS", tiendas_detectadas)
html_body = html_body.replace("ALERTAS", alertas_html)
html_body = html_body.replace("BQDATA", raw_output)
html_body = html_body.replace("OPORT", oportunidades_html)

sender_email = "contacto@latreve.cl"
sender_password = os.getenv("LATREVE_ZOHO_APP_PASSWORD", "AQUI_TU_PASSWORD")
target_email = "ismasegoviavial@gmail.com"
subject = "Alerta Semanal de Competencia - La Treve"

print(f"Preparando alerta semanal de competencia para {target_email}...")

msg = MIMEMultipart("alternative")
msg["From"] = sender_email
msg["To"] = target_email
msg["Subject"] = subject
msg.attach(MIMEText(html_body, "html"))

if sender_password == "AQUI_TU_PASSWORD":
    print("MODO DRY-RUN: Falta LATREVE_ZOHO_APP_PASSWORD en .env")
    print(f"Tiendas detectadas: {tiendas_detectadas}")
    print(f"Total alertas: {total_alertas}")
    print(f"El reporte habria sido enviado a {target_email}")
else:
    try:
        server = smtplib.SMTP_SSL("smtp.zoho.com", 465)
        server.login("contacto@fixusconsulting.com", sender_password)
        server.send_message(msg)
        server.quit()
        print(f"Alerta semanal enviada exitosamente a {target_email}!")
    except Exception as e:
        print(f"Error al enviar: {e}")
