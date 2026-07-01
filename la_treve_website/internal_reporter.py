#!/usr/bin/env python3
import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import date

ZOHO_USER = "notificaciones@latreve.cl"
ZOHO_PASS = os.environ.get("ZOHO_SMTP_PASSWORD", "")
ZOHO_HOST = "smtp.zoho.com"
ZOHO_PORT = 587

def send_internal_report(target_email: str, subject: str, body: str) -> dict:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = ZOHO_USER
    msg["To"]      = target_email
    msg.attach(MIMEText(body, "html", "utf-8"))

    if not ZOHO_PASS:
        dry_file = "dry_run_report_{}.html".format(date.today().isoformat())
        with open(dry_file, "w", encoding="utf-8") as f:
            header = "<!-- DRY RUN | To: {} | Subject: {} -->\n".format(target_email, subject)
            f.write(header)
            f.write(body)
        print("[DRY RUN] ZOHO_SMTP_PASSWORD no configurado.")
        print("[DRY RUN] Reporte guardado localmente: {}".format(dry_file))
        print("[DRY RUN] Destinatario: {}".format(target_email))
        print("[DRY RUN] Asunto: {}".format(subject))
        return {"status": "dry_run", "file": dry_file}

    try:
        with smtplib.SMTP(ZOHO_HOST, ZOHO_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(ZOHO_USER, ZOHO_PASS)
            server.sendmail(ZOHO_USER, [target_email], msg.as_string())
        print("[OK] Email enviado exitosamente a {}".format(target_email))
        return {"status": "sent", "to": target_email}
    except Exception as e:
        print("[ERROR] Fallo el envio SMTP: {}".format(e))
        return {"status": "error", "error": str(e)}
