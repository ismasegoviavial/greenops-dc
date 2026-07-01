import smtplib
import os
import sys
sys.path.insert(0, "C:/Users/Fernanda/.gemini/antigravity/scratch/fixus_ltda_website")
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from datetime import date

load_dotenv()

sender_email = "contacto@fixusconsulting.com"
sender_password = os.getenv("FIXUS_ZOHO_APP_PASSWORD", "AQUI_TU_PASSWORD")
target_email = "ismasegoviavial@gmail.com"
subject = "Rutina Matutina - Fixus Oportunidades B2B"

# Read research output from the file that was just generated
research_output_path = os.path.join(os.path.dirname(__file__), "research_output.txt")
if os.path.exists(research_output_path):
    with open(research_output_path, "r", encoding="utf-8") as rf:
        research_output = rf.read()
else:
    research_output = "No se encontró el archivo de output del research agent."

html_body = f"""
<html>
  <body style="font-family: Arial, sans-serif; color: #333; max-width: 700px; margin: auto;">
    <div style="background: linear-gradient(135deg, #1a2a4a, #2c4a7c); padding: 24px; border-radius: 10px 10px 0 0;">
      <h1 style="color: #ffffff; margin: 0; font-size: 22px;">🏭 Rutina Matutina — Fixus Oportunidades B2B</h1>
      <p style="color: #a8c4e8; margin: 6px 0 0 0; font-size: 14px;">📅 {date.today().strftime('%d de %B, %Y')}</p>
    </div>

    <div style="background: #f4f7fb; padding: 20px; border-left: 4px solid #2c4a7c; border-right: 4px solid #2c4a7c;">

      <h2 style="color: #2c4a7c; font-size: 17px;">🎯 Sectores Analizados Hoy</h2>
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
        <span style="background:#e8f0fe; color:#1a2a4a; padding:4px 10px; border-radius:20px; font-size:13px; border:1px solid #2c4a7c;">⛏️ Minería</span>
        <span style="background:#e8f8f0; color:#1a4a2c; padding:4px 10px; border-radius:20px; font-size:13px; border:1px solid #27ae60;">🌿 Sostenibilidad</span>
        <span style="background:#fffdf0; color:#4a451a; padding:4px 10px; border-radius:20px; font-size:13px; border:1px solid #f1c40f;">⚡ Energía</span>
        <span style="background:#fce8f8; color:#4a1a3a; padding:4px 10px; border-radius:20px; font-size:13px; border:1px solid #8e44ad;">🛒 Retail</span>
        <span style="background:#fff8e8; color:#4a3a1a; padding:4px 10px; border-radius:20px; font-size:13px; border:1px solid #e67e22;">🚚 Logística</span>
        <span style="background:#e8fdf5; color:#1a4a35; padding:4px 10px; border-radius:20px; font-size:13px; border:1px solid #2ecc71;">🍎 Frutícola</span>
        <span style="background:#edf3fc; color:#1a2b4a; padding:4px 10px; border-radius:20px; font-size:13px; border:1px solid #3498db;">🎓 Educación</span>
      </div>

      <h2 style="color: #2c4a7c; font-size: 17px;">🤖 Análisis & Propuestas Fixus IA</h2>
      <div style="background: #ffffff; padding: 16px; border-radius: 8px; border-left: 4px solid #e67e22; font-size: 13px; line-height: 1.7; white-space: pre-wrap; font-family: Georgia, serif;">
{research_output}
      </div>

      <br>

      <h2 style="color: #2c4a7c; font-size: 17px;">✅ Próximos Pasos Comerciales</h2>
      <table style="width:100%; border-collapse:collapse; font-size:13px;">
        <tr style="background:#2c4a7c; color:white;">
          <th style="padding:8px; text-align:left;">Acción</th>
          <th style="padding:8px; text-align:left;">Sector</th>
          <th style="padding:8px; text-align:left;">Prioridad</th>
        </tr>
        <tr style="background:#ffffff;">
          <td style="padding:8px; border-bottom:1px solid #e0e0e0;">📞 Contactar leads identificados</td>
          <td style="padding:8px; border-bottom:1px solid #e0e0e0;">Todos</td>
          <td style="padding:8px; border-bottom:1px solid #e0e0e0;"><span style="color:#e74c3c; font-weight:bold;">🔴 Alta</span></td>
        </tr>
        <tr style="background:#f9f9f9;">
          <td style="padding:8px; border-bottom:1px solid #e0e0e0;">📊 Preparar deck de piloto IA</td>
          <td style="padding:8px; border-bottom:1px solid #e0e0e0;">Minería / Logística</td>
          <td style="padding:8px; border-bottom:1px solid #e0e0e0;"><span style="color:#e67e22; font-weight:bold;">🟠 Media</span></td>
        </tr>
        <tr style="background:#ffffff;">
          <td style="padding:8px;">💡 Validar propuesta con equipo técnico</td>
          <td style="padding:8px;">Sostenibilidad</td>
          <td style="padding:8px;"><span style="color:#27ae60; font-weight:bold;">🟢 Normal</span></td>
        </tr>
      </table>
    </div>

    <div style="background: #1a2a4a; padding: 14px; border-radius: 0 0 10px 10px; text-align: center;">
      <p style="color: #a8c4e8; font-size: 11px; margin: 0;">⚡ Generado automáticamente a las 08:30 AM · Fixus Intelligence System</p>
    </div>
  </body>
</html>
"""

print(f"Preparando reporte ejecutivo HTML para {target_email}...")

msg = MIMEMultipart("alternative")
msg["From"] = sender_email
msg["To"] = target_email
msg["Subject"] = subject
msg.attach(MIMEText(html_body, "html"))

if sender_password == "AQUI_TU_PASSWORD":
    print("MODO DRY-RUN: No se encontró FIXUS_ZOHO_APP_PASSWORD en .env.")
    print(f"El reporte HTML habría sido enviado a {target_email} con asunto '{subject}'.")
    print(f"Preview (primeros 500 chars):\n{html_body[:500]}...")
else:
    try:
        server = smtplib.SMTP_SSL("smtp.zoho.com", 465)
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        print(f"✅ Reporte enviado exitosamente a {target_email}!")
    except Exception as e:
        print(f"❌ Error al enviar: {e}")
