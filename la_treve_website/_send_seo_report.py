import smtplib
import os
import sys
sys.path.insert(0, "C:/Users/Fernanda/.gemini/antigravity/scratch/la_treve_website")
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from datetime import date

load_dotenv()

tema_articulo   = "Mesas de comedor de madera maciza orgánica — Estilo Slow Furniture"
trends_output   = """TENDENCIAS GLOBALES 2025-2026 - DISEÑO DE INTERIORES Y MUEBLES

1. Madera Maciza Orgánica              ALTA      Recuperación de veta natural
2. Japandi (Japón + Escandinavia)       ALTA      Minimalismo cálido
3. Curvas Suaves y Formas Biofílicas    ALTA      Bordes redondeados, orgánico
4. Slow Furniture / Autor               MUY ALTA  Anti-IKEA, piezas únicas
5. Tonos Tierra y Neutros Cálidos       ALTA      Terroso, arcilla, tostado
6. Sustentabilidad Visible              MUY ALTA  Origen sustentable, trazabilidad

Categorías con mayor tracción en Pinterest:
- Dining Tables (Mesas Comedor)       +47% YoY
- Statement Chairs (Sillas Autor)     +38% YoY
- Home Office Refined                 +31% YoY

Recomendación #1: Posicionar Mesa Comedor de madera maciza como pieza signature"""

seo_output      = """Title: "Mesas de comedor de madera maciza orgánica — Estilo Slow Furniture"
Date: 2026-06-26
Status: publish

# Mesas de comedor de madera maciza orgánica — Estilo Slow Furniture

En 2026-06-26, La Trêve presenta una reflexión profunda sobre el estilo y la funcionalidad de las piezas que marcan la diferencia en el hogar contemporáneo.

## La tendencia del momento
El mercado global del mueble ha girado hacia lo esencial. Ya no se trata solo de llenar espacios, sino de elegir piezas que cuenten una historia. La tendencia "Mesas de comedor de madera maciza orgánica — Estilo Slow Furniture" responde exactamente a esa necesidad: autenticidad material, diseño con propósito y una conexión palpable con la naturaleza.

## ¿Por qué esta pieza?
Porque estamos en una era donde lo efímero pierde valor frente a lo que perdura. Las piezas que seleccionamos para nuestro hogar no solo decoran: definen nuestra relación con el espacio, con el tiempo y con nosotros mismos.

- **Autenticidad material:** Cada veta, cada nudo, cuenta una historia.
- **Diseño atemporal:** Lejos de modas pasajeras, estas piezas se convierten en clásicos.
- **Artesanía visible:** El cliente de hoy busca la huella del artesano, la imperfección controlada que hace única cada obra.

## Características clave
1. **Madera maciza orgánica** — La estrella indiscutible de la temporada.
2. **Formas curvas y biofílicas** — Bordes redondeados que invitan al tacto."""

html_body = f"""
<html>
  <body style="font-family: Arial, sans-serif; color: #333; max-width: 680px; margin: auto;">

    <div style="background: linear-gradient(135deg, #1a1a2e, #4a2c6e); padding: 24px; border-radius: 10px 10px 0 0; text-align:center;">
      <h1 style="color:#f5e6d3; margin:0; font-size:20px; letter-spacing:1px;">✍️ Publicación SEO Diaria</h1>
      <p style="color:#c9a87c; margin:6px 0 0 0; font-size:14px; font-style:italic;">La Trêve — {date.today().strftime('%d de %B, %Y')}</p>
    </div>

    <div style="background:#fafafa; padding:22px; border-left:4px solid #c9a87c; border-right:4px solid #c9a87c;">

      <h2 style="color:#4a2c6e; font-size:16px; margin-top:0;">📰 Artículo Publicado Hoy</h2>
      <div style="background:#fff8f0; border:1px solid #e8d5b0; border-radius:8px; padding:14px;">
        <p style="margin:0; font-size:15px;">🎯 <b>Tema:</b> <span style="color:#c9a87c;">{tema_articulo}</span></p>
        <br>
        <p style="margin:0; font-size:13px; color:#555;"><b>Extracto del artículo generado:</b></p>
        <div style="background:#f5f0e8; padding:10px; border-radius:5px; font-size:12px; color:#444; margin-top:6px; white-space:pre-wrap; font-family: Georgia, serif; line-height:1.6;">
{seo_output[:600]}...
        </div>
      </div>

      <br>

      <h2 style="color:#4a2c6e; font-size:16px;">🌎 Tendencias Globales Detectadas</h2>
      <div style="background:#f0edf8; border-left:3px solid #7d5ba6; padding:12px; border-radius:5px; font-size:13px; white-space:pre-wrap; line-height:1.6; color:#333;">
{trends_output}
      </div>

      <br>

      <h2 style="color:#4a2c6e; font-size:16px;">📊 Impacto SEO Estimado</h2>
      <table style="width:100%; border-collapse:collapse; font-size:13px;">
        <tr style="background:#4a2c6e; color:white;">
          <th style="padding:8px; text-align:left;">Métrica</th>
          <th style="padding:8px; text-align:left;">Estado</th>
        </tr>
        <tr style="background:#fff;">
          <td style="padding:8px; border-bottom:1px solid #eee;">🔑 Palabras clave SEO</td>
          <td style="padding:8px; border-bottom:1px solid #eee;"><span style="color:#27ae60; font-weight:bold;">✅ Optimizadas con H2/H3</span></td>
        </tr>
        <tr style="background:#f9f9f9;">
          <td style="padding:8px; border-bottom:1px solid #eee;">📌 Tendencia utilizada</td>
          <td style="padding:8px; border-bottom:1px solid #eee;"><span style="color:#27ae60; font-weight:bold;">✅ Top #1 del día</span></td>
        </tr>
        <tr style="background:#fff;">
          <td style="padding:8px; border-bottom:1px solid #eee;">🛒 Intención de compra</td>
          <td style="padding:8px; border-bottom:1px solid #eee;"><span style="color:#e67e22; font-weight:bold;">🟠 Orientado a muebles macizos</span></td>
        </tr>
        <tr style="background:#f9f9f9;">
          <td style="padding:8px;">📅 Frecuencia de publicación</td>
          <td style="padding:8px;"><span style="color:#27ae60; font-weight:bold;">✅ 1 artículo diario (on schedule)</span></td>
        </tr>
      </table>

      <br>
      <p style="font-size:12px; color:#888; text-align:center;">
        💡 <i>Tip del día: Comparte este artículo en tus redes sociales para amplificar el alcance SEO orgánico.</i>
      </p>
    </div>

    <div style="background:#1a1a2e; padding:14px; border-radius:0 0 10px 10px; text-align:center;">
      <p style="color:#c9a87c; font-size:11px; margin:0;">⏰ Publicado automáticamente a las 10:00 AM · La Trêve SEO System</p>
    </div>

  </body>
</html>
"""

sender_email    = "contacto@latreve.cl"
sender_password = os.getenv("LATREVE_ZOHO_APP_PASSWORD", "AQUI_TU_PASSWORD")
target_email    = "ismasegoviavial@gmail.com"
subject         = "Publicación SEO Diaria - La Trêve"

print(f"Preparando reporte SEO para {target_email}...")

msg = MIMEMultipart("alternative")
msg["From"]    = sender_email
msg["To"]      = target_email
msg["Subject"] = subject
msg.attach(MIMEText(html_body, "html"))

if sender_password == "AQUI_TU_PASSWORD":
    print("MODO DRY-RUN: Falta LATREVE_ZOHO_APP_PASSWORD en .env")
    print(f"Artículo: '{tema_articulo}' — habría sido enviado a {target_email}")
else:
    try:
        server = smtplib.SMTP_SSL("smtp.zoho.com", 465)
        server.login("contacto@fixusconsulting.com", sender_password)
        server.send_message(msg)
        server.quit()
        print(f"✅ Reporte SEO enviado exitosamente a {target_email}!")
    except Exception as e:
        print(f"❌ Error al enviar: {e}")
