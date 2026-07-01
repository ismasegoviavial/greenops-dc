"""
reporte_semanal.py
Genera y envía por email el reporte gerencial semanal combinado
de Fixus (B2B) y La Trêve (mobiliario).
"""

import smtplib
import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

DESTINATARIO = "ismasegoviavial@gmail.com"
SEMANA       = datetime.date.today().strftime("%-d de %B de %Y") if hasattr(datetime.date.today(), 'strftime') else datetime.date.today().isoformat()
HOY          = datetime.date.today().strftime("%A %d %B %Y")

html = f"""
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  body {{ font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }}
  .container {{ max-width: 700px; margin: 30px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }}
  .header {{ background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 32px; color: white; }}
  .header h1 {{ margin: 0; font-size: 22px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; }}
  .header .fecha {{ color: #a0aec0; font-size: 13px; margin-top: 6px; }}
  .seccion {{ padding: 28px 32px; border-bottom: 1px solid #f0f0f0; }}
  .seccion:last-child {{ border-bottom: none; }}
  .titulo-seccion {{ display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }}
  .titulo-seccion .badge {{ background: #0f3460; color: white; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; }}
  .titulo-seccion h2 {{ margin: 0; font-size: 18px; color: #1a1a2e; }}
  .kpi-row {{ display: flex; gap: 16px; margin: 16px 0; }}
  .kpi {{ flex: 1; background: #f8faff; border-left: 4px solid #0f3460; padding: 14px 16px; border-radius: 6px; }}
  .kpi .numero {{ font-size: 26px; font-weight: 700; color: #0f3460; }}
  .kpi .label {{ font-size: 12px; color: #666; margin-top: 3px; }}
  .kpi.verde {{ border-color: #22c55e; }}
  .kpi.verde .numero {{ color: #16a34a; }}
  .kpi.naranja {{ border-color: #f97316; }}
  .kpi.naranja .numero {{ color: #ea580c; }}
  table {{ width: 100%; border-collapse: collapse; font-size: 13px; }}
  th {{ background: #f8faff; padding: 10px 12px; text-align: left; color: #555; font-weight: 600; border-bottom: 2px solid #e5e7eb; }}
  td {{ padding: 10px 12px; border-bottom: 1px solid #f3f4f6; color: #333; }}
  tr:last-child td {{ border-bottom: none; }}
  .tag {{ display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }}
  .tag.verde {{ background: #dcfce7; color: #16a34a; }}
  .tag.rojo {{ background: #fee2e2; color: #dc2626; }}
  .tag.amarillo {{ background: #fef9c3; color: #ca8a04; }}
  .accion {{ background: #fefce8; border: 1px solid #fde047; border-radius: 8px; padding: 14px 18px; margin-top: 16px; font-size: 13px; color: #713f12; }}
  .accion strong {{ color: #92400e; }}
  .footer {{ background: #1a1a2e; padding: 20px 32px; color: #64748b; font-size: 12px; text-align: center; }}
</style>
</head>
<body>
<div class="container">

  <!-- HEADER -->
  <div class="header">
    <h1>📊 Reporte Gerencial Semanal</h1>
    <div class="fecha">Semana del {HOY} &nbsp;|&nbsp; Fixus B2B + La Trêve</div>
  </div>

  <!-- FIXUS B2B -->
  <div class="seccion">
    <div class="titulo-seccion">
      <span class="badge">B2B</span>
      <h2>🏢 Fixus — Prospección Comercial</h2>
    </div>

    <div class="kpi-row">
      <div class="kpi">
        <div class="numero">—</div>
        <div class="label">Empresas prospectadas hoy</div>
      </div>
      <div class="kpi verde">
        <div class="numero">—</div>
        <div class="label">Leads calificados</div>
      </div>
      <div class="kpi naranja">
        <div class="numero">—</div>
        <div class="label">En seguimiento activo</div>
      </div>
    </div>

    <div class="accion">
      ⚠️ <strong>Acción requerida:</strong> El script de prospección B2B necesita ser re-configurado luego del cambio de entorno de usuario. Las rutas del venv anterior (<code>rag_module_3_b2b</code>) ya no existen en disco. Se debe reinstalar y apuntar a <code>C:\Users\Fernanda\</code>.
    </div>
  </div>

  <!-- LA TREVE -->
  <div class="seccion">
    <div class="titulo-seccion">
      <span class="badge" style="background:#7c3aed;">Mobiliario</span>
      <h2>🛋️ La Trêve — Inteligencia de Mercado</h2>
    </div>

    <table>
      <tr>
        <th>Tienda Competidora</th>
        <th>Plataforma</th>
        <th>Estado</th>
      </tr>
      <tr><td>areadesign.cl</td><td>Shopify</td><td><span class="tag amarillo">Pendiente scraping</span></td></tr>
      <tr><td>broca.cl</td><td>Shopify</td><td><span class="tag amarillo">Pendiente scraping</span></td></tr>
      <tr><td>leatherhouse.cl</td><td>WooCommerce</td><td><span class="tag amarillo">Pendiente scraping</span></td></tr>
      <tr><td>tiendamad.cl</td><td>WooCommerce</td><td><span class="tag amarillo">Pendiente scraping</span></td></tr>
      <tr><td>sofaonline.cl</td><td>WooCommerce</td><td><span class="tag amarillo">Pendiente scraping</span></td></tr>
      <tr><td>boconcept.com</td><td>Custom</td><td><span class="tag rojo">Excluida v1</span></td></tr>
    </table>

    <div class="accion" style="margin-top:16px;">
      ⚠️ <strong>Acción requerida:</strong> El pipeline de scraping + BigQuery (<code>muebles_chile_data.xlsx</code>) requiere re-configuración post cambio de usuario. El Project ID de GCP sigue activo: <code>project-5ca89b0c-e364-4245-a61</code>.
    </div>
  </div>

  <!-- PRIORIDADES SEMANA -->
  <div class="seccion">
    <div class="titulo-seccion">
      <h2>🎯 Prioridades esta semana</h2>
    </div>
    <table>
      <tr><th>#</th><th>Tarea</th><th>Proyecto</th><th>Urgencia</th></tr>
      <tr><td>1</td><td>Reinstalar venv y actualizar rutas post cambio de usuario</td><td>Ambos</td><td><span class="tag rojo">Alta</span></td></tr>
      <tr><td>2</td><td>Re-ejecutar scraping de 16 tiendas competidoras</td><td>La Trêve</td><td><span class="tag rojo">Alta</span></td></tr>
      <tr><td>3</td><td>Limpiar rutinas redundantes (eliminar #1, #2, #3 Fixus; #5, #6 La Trêve)</td><td>Ambos</td><td><span class="tag amarillo">Media</span></td></tr>
      <tr><td>4</td><td>Conectar BigQuery con tarifas eléctricas del análisis de tesis</td><td>GCP</td><td><span class="tag verde">Baja</span></td></tr>
    </table>
  </div>

  <div class="footer">
    Generado automáticamente · {HOY} · ismasegoviavial@gmail.com
  </div>
</div>
</body>
</html>
"""

# Enviar por SMTP via Gmail (usando App Password)
print("Para enviar este reporte, necesito tu App Password de Gmail.")
print("Guardando reporte como HTML local por ahora...")

with open("reporte_semanal_15jun2026.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Reporte guardado: reporte_semanal_15jun2026.html")
print(f"Destinatario configurado: {DESTINATARIO}")
