import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import date

# --- CONFIG ---
sender_email = "contacto@fixusconsulting.com"
target_email = "ismasegoviavial@gmail.com"
password = os.getenv("FIXUS_ZOHO_APP_PASSWORD", "")

# If env var not set in this context, read it
if not password:
    env_path = "C:/Users/Fernanda/AppData/Local/hermes/.env"
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line.startswith("FIXUS_ZOHO_APP_PASSWORD="):
                password = line.split("=", 1)[1]

subject = "📊 Prospección B2B: Inteligencia Artificial Integrada a Innovación"

# --- HTML BODY ---
html_body = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; color: #333; max-width: 720px; margin: auto; background: #f5f7fa;">

  <!-- HEADER -->
  <div style="background: linear-gradient(135deg, #0a1628, #1a3a6c); padding: 30px 24px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 26px;">🚀 Inteligencia Artificial Integrada a Innovación</h1>
    <p style="color: #8ab4f8; margin: 8px 0 0 0; font-size: 15px;">📅 {date.today().strftime('%d de %B, %Y')} · Prospección B2B — Fixus</p>
  </div>

  <!-- BODY -->
  <div style="background: #ffffff; padding: 28px 24px; border-left: 1px solid #e0e4ec; border-right: 1px solid #e0e4ec;">

    <!-- SECTORS -->
    <h2 style="color: #1a3a6c; font-size: 18px; border-bottom: 2px solid #1a3a6c; padding-bottom: 8px;">🎯 Sectores & Cruces Estratégicos IA + Innovación</h2>

    <table style="width:100%; border-collapse:collapse; font-size:13px; margin: 12px 0;">
      <tr style="background:#1a3a6c; color:white;">
        <th style="padding:8px; text-align:left;">Sector</th>
        <th style="padding:8px; text-align:left;">Oportunidad IA + Innovación</th>
        <th style="padding:8px; text-align:left;">Impacto Estimado</th>
      </tr>
      <tr style="background:#f8faff;">
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;"><strong>⛏️ Minería</strong></td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">Mantenimiento predictivo + optimización de flotas con IA sobre BigQuery. Agentes autónomos que anticipan fallos 15-30 días antes.</td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">−15-20% downtime<br>−12% combustible<br>ROI 4-6 meses</td>
      </tr>
      <tr style="background:#ffffff;">
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;"><strong>🌿 Sostenibilidad</strong></td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">Agentes IA para monitoreo ESG automatizado (CSRD/GRI). Detección de anomalías y reportes automáticos listos para auditoría.</td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">−40-60% FTE compliance<br>$150-500K ahorro/año<br>ROI 6-9 meses</td>
      </tr>
      <tr style="background:#f8faff;">
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;"><strong>🌎 Medio Ambiente</strong></td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">Optimización de consumo hídrico/energético con IA + IoT. Data Center Intelligence para reducir el footprint ambiental de la IA misma.</td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">−15-25% energía<br>$350K-$1.1M ahorro/año<br>Payback 8-10 meses</td>
      </tr>
      <tr style="background:#ffffff;">
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;"><strong>🚚 Logística</strong></td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">Smart Routing Agent + Predictive Inventory. Agentes IA que optimizan rutas en tiempo real y predicen demanda logística.</td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">−12-18% km recorridos<br>−40% stockouts<br>Payback 3-5 meses</td>
      </tr>
      <tr style="background:#f8faff;">
        <td style="padding:8px;"><strong>🛒 Retail</strong></td>
        <td style="padding:8px;">Data Harmonization + Agentes predictivos de demanda. Unificación de datos POS/ecommerce/ERP en BigQuery + IA generativa.</td>
        <td style="padding:8px;">$375K-$560K ROI/año<br>−20% mermas<br>Payback 1.2-1.8 meses</td>
      </tr>
    </table>

    <!-- RESEARCH PILLS -->
    <h2 style="color: #1a3a6c; font-size: 18px; border-bottom: 2px solid #1a3a6c; padding-bottom: 8px; margin-top: 28px;">🔬 Pilotos Rápidos para Venta Inmediata</h2>

    <div style="background:#f0f6ff; border-left:4px solid #1a3a6c; padding:14px; margin:12px 0; border-radius:0 8px 8px 0;">
      <h3 style="margin:0 0 6px 0; font-size:14px; color:#1a3a6c;">🏢 Data Center Optimizer (Energía + Sostenibilidad)</h3>
      <p style="margin:0; font-size:13px;">Agente IA integrado con sensores IoT del DC que analiza patrones en BigQuery para ajustar climatización y distribución de cargas. <strong>ROI: 15-25% reducción factura eléctrica.</strong></p>
    </div>

    <div style="background:#f0f6ff; border-left:4px solid #e67e22; padding:14px; margin:12px 0; border-radius:0 8px 8px 0;">
      <h3 style="margin:0 0 6px 0; font-size:14px; color:#e67e22;">⛏️ Supply Chain Autónoma Minera (Minería + Logística)</h3>
      <p style="margin:0; font-size:13px;">Agente que centraliza datos de flotas y puertos en BigQuery, optimiza rutas en tiempo real y predice fallos. <strong>ROI: +10-15% productividad flota, -30% costos mantenimiento.</strong></p>
    </div>

    <div style="background:#f0f6ff; border-left:4px solid #27ae60; padding:14px; margin:12px 0; border-radius:0 8px 8px 0;">
      <h3 style="margin:0 0 6px 0; font-size:14px; color:#27ae60;">🛒 Agente de Inventario Inteligente (Retail + Frutícola)</h3>
      <p style="margin:0; font-size:13px;">Agente que integra POS, clima y logística en BigQuery para predecir demanda por SKU y minimizar desperdicio. <strong>ROI: -20-30% mermas, +5% margen bruto.</strong></p>
    </div>

    <!-- KEY INSIGHT -->
    <h2 style="color: #1a3a6c; font-size: 18px; border-bottom: 2px solid #1a3a6c; padding-bottom: 8px; margin-top: 28px;">💡 Insight Estratégico</h2>
    <div style="background:#fffde7; border:1px solid #f9e074; padding:16px; border-radius:8px; margin:8px 0;">
      <p style="margin:0; font-size:13px; line-height:1.6;">
        <strong>El mercado no solo pide eficiencia, pide eficiencia verde.</strong> El consumo energético de la IA está bajo escrutinio (data centers consumirán hasta 9% de la electricidad mundial para 2030). Fixus debe posicionar sus soluciones como herramientas que <em>usan IA para reducir el consumo de energía, agua y desperdicios</em> — traduciéndose directamente en ahorro de costos y cumplimiento normativo. La estrategia: <strong>no vender "IA", vender "Ahorro de Costos Garantizado + Cumplimiento ESG".</strong>
      </p>
    </div>

    <!-- LEADS TABLE -->
    <h2 style="color: #1a3a6c; font-size: 18px; border-bottom: 2px solid #1a3a6c; padding-bottom: 8px; margin-top: 28px;">👥 Leads Identificados</h2>
    <table style="width:100%; border-collapse:collapse; font-size:13px; margin: 12px 0;">
      <tr style="background:#1a3a6c; color:white;">
        <th style="padding:8px; text-align:left;">Nombre</th>
        <th style="padding:8px; text-align:left;">Empresa</th>
        <th style="padding:8px; text-align:left;">Cargo</th>
        <th style="padding:8px; text-align:left;">Industria</th>
      </tr>
      <tr style="background:#f8faff;">
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">Roberto Sanchez</td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">Minera Las Cenizas</td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">Gerente de Operaciones</td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">⚒️ Minería</td>
      </tr>
      <tr style="background:#ffffff;">
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">Carla Silva</td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">Cencosud</td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">Directora de Innovación</td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">🛒 Retail</td>
      </tr>
    </table>

    <!-- NEXT STEPS -->
    <h2 style="color: #1a3a6c; font-size: 18px; border-bottom: 2px solid #1a3a6c; padding-bottom: 8px; margin-top: 28px;">✅ Próximos Pasos Comerciales</h2>
    <table style="width:100%; border-collapse:collapse; font-size:13px; margin: 12px 0;">
      <tr style="background:#1a3a6c; color:white;">
        <th style="padding:8px; text-align:left;">Acción</th>
        <th style="padding:8px; text-align:left;">Prioridad</th>
      </tr>
      <tr style="background:#f8faff;">
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">📞 Contactar leads identificados</td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;"><span style="color:#e74c3c; font-weight:bold;">🔴 Alta</span></td>
      </tr>
      <tr style="background:#ffffff;">
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">📊 Preparar deck de piloto IA segmentado</td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;"><span style="color:#e67e22; font-weight:bold;">🟠 Media</span></td>
      </tr>
      <tr style="background:#f8faff;">
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">💡 Validar propuestas con equipo técnico</td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;"><span style="color:#27ae60; font-weight:bold;">🟢 Normal</span></td>
      </tr>
      <tr style="background:#ffffff;">
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;">📧 Enviar correos de venta personalizados</td>
        <td style="padding:8px; border-bottom:1px solid #e0e4ec;"><span style="color:#e74c3c; font-weight:bold;">🔴 Alta</span></td>
      </tr>
      <tr style="background:#f8faff;">
        <td style="padding:8px;">🔍 Investigar nuevos leads Hunter.io</td>
        <td style="padding:8px;"><span style="color:#e67e22; font-weight:bold;">🟠 Media</span></td>
      </tr>
    </table>
  </div>

  <!-- FOOTER -->
  <div style="background: #0a1628; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="color: #8ab4f8; font-size: 12px; margin: 0;">⚡ Generado automáticamente por tu Agente de Prospección B2B · <strong>Fixus Intelligence System</strong></p>
    <p style="color: #5a7ca8; font-size: 11px; margin: 4px 0 0 0;">contacto@fixusconsulting.com | <a href="https://calendly.com/fixus/reunion-descubrimiento" style="color:#8ab4f8;">Agenda una reunión</a></p>
  </div>

</body>
</html>"""

# --- SEND ---
print(f"Enviando a: {target_email}")
print(f"Desde: {sender_email}")
print(f"Password configurada: {'SÍ' if password else 'NO'}")

if not password:
    print("ERROR: No se encontró FIXUS_ZOHO_APP_PASSWORD")
    exit(1)

msg = MIMEMultipart("alternative")
msg["From"] = sender_email
msg["To"] = target_email
msg["Subject"] = subject
msg.attach(MIMEText(html_body, "html"))

try:
    server = smtplib.SMTP_SSL("smtp.zoho.com", 465)
    server.login(sender_email, password)
    server.send_message(msg)
    server.quit()
    print("✅ CORREO ENVIADO EXITOSAMENTE a ismasegoviavial@gmail.com")
except Exception as e:
    print(f"Error al enviar: {e}")
    import traceback
    traceback.print_exc()
