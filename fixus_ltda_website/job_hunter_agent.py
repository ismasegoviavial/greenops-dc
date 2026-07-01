import os
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import requests
from duckduckgo_search import DDGS

# Configuración
load_dotenv()
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
ZOHO_PASSWORD = os.getenv("FIXUS_ZOHO_APP_PASSWORD")
ZOHO_EMAIL = "contacto@fixusconsulting.com"  # Asumido por el dominio de la empresa
RECIPIENT_EMAIL = "ismasegoviavial@gmail.com"

DB_FILE = "jobs_db.json"
PROFILE_FILE = "user_profile.md"

def load_db():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_db(db):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=4)

def load_profile():
    with open(PROFILE_FILE, "r", encoding="utf-8") as f:
        return f.read()

def ask_deepseek(prompt):
    url = "https://api.deepseek.com/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
    }
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "Eres un experto reclutador de TI (Headhunter). Tu trabajo es evaluar ofertas de trabajo frente al currículum de un candidato y redactar cartas de presentación altamente persuasivas."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 1500,
        "temperature": 0.7
    }
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        print(f"Error DeepSeek: {response.status_code} - {response.text}")
        return "ERROR"

def send_email(subject, body):
    msg = MIMEMultipart()
    msg['From'] = ZOHO_EMAIL
    msg['To'] = RECIPIENT_EMAIL
    msg['Subject'] = subject
    
    msg.attach(MIMEText(body, 'html'))
    
    try:
        server = smtplib.SMTP_SSL('smtp.zoho.com', 465)
        server.login(ZOHO_EMAIL, ZOHO_PASSWORD)
        server.sendmail(ZOHO_EMAIL, RECIPIENT_EMAIL, msg.as_string())
        server.quit()
        print("Correo enviado exitosamente.")
    except Exception as e:
        print(f"Error enviando correo: {e}")

import time

def main():
    print("Iniciando Hermes Job Hunter...")
    cv_text = load_profile()
    db = load_db()
    
    queries = [
        "data manager",
        "inteligencia artificial",
        "machine learning",
        "head of data",
        "data lead"
    ]
    
    found_jobs = []
    
    # Buscar en Get On Board usando API oficial
    for query in queries:
        print(f"Buscando en GetOnBoard API: {query}")
        try:
            url = f"https://www.getonbrd.com/api/v0/search/jobs?query={query}"
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json().get("data", [])
                for job in data:
                    attributes = job.get("attributes", {})
                    # Solo tomamos Chile o Remoto
                    country = attributes.get("country", "")
                    remote = attributes.get("remote", False)
                    if country == "Chile" or remote:
                        found_jobs.append({
                            "title": attributes.get("title", ""),
                            "href": job.get("links", {}).get("public_url", ""),
                            "body": attributes.get("description", "")[:500] # Primeros 500 caracteres
                        })
            time.sleep(1) # Pausa amigable para no saturar la API
        except Exception as e:
            print(f"Error en API GetOnBoard: {e}")
            
    SERPAPI_KEY = os.getenv("SERPAPI_API_KEY")
    queries_serpapi = [
        "Jefatura Datos Chile",
        "Lider Inteligencia Artificial Chile",
        "Data Manager Chile",
        "Head of Data Remoto"
    ]
    
    # Buscar en SerpApi (Google Jobs)
    for query in queries_serpapi:
        if not SERPAPI_KEY: break
        print(f"Buscando en Google Jobs (SerpApi): {query}")
        try:
            url = f"https://serpapi.com/search.json?engine=google_jobs&q={query}&hl=es&api_key={SERPAPI_KEY}"
            response = requests.get(url)
            if response.status_code == 200:
                jobs_results = response.json().get("jobs_results", [])
                for job in jobs_results:
                    found_jobs.append({
                        "title": job.get("title", ""),
                        "href": job.get("share_link", ""),
                        "body": job.get("description", "")[:500]
                    })
            time.sleep(1)
        except Exception as e:
            print(f"Error en SerpApi: {e}")
            
    matches_found = []
    
    for job in found_jobs:
        url = job.get("href", "")
        if not url or url in db:
            continue
            
        title = job.get("title", "")
        snippet = job.get("body", "")
        
        print(f"Evaluando: {title}")
        
        prompt = f"""
Aquí tienes el CV de Ismael Segovia Vial:
{cv_text}

Acabo de encontrar esta oferta de trabajo en internet:
- Título: {title}
- Resumen/Descripción: {snippet}

Instrucciones:
1. Evalúa si este puesto de trabajo representa un cargo de liderazgo/jefatura en Datos o Inteligencia Artificial y si hace match con el perfil de Ismael.
2. Si NO hace match (ej. es para programador junior, o no tiene nada que ver), simplemente responde con la palabra "NO_MATCH".
3. Si SÍ hace match, redacta un párrafo persuasivo (en español) dirigido a los reclutadores explicando por qué Ismael es el candidato ideal para este puesto, destacando sus logros. NO incluyas saludos formales, solo el texto de la propuesta de valor.
"""
        evaluation = ask_deepseek(prompt)
        
        if "NO_MATCH" not in evaluation and "ERROR" not in evaluation:
            matches_found.append({
                "title": title,
                "url": url,
                "snippet": snippet,
                "cover_letter": evaluation
            })
            
        db.append(url)
        
    save_db(db)
    
    if matches_found:
        print(f"\n--- HERMES JOB HUNTER: SE ENCONTRARON {len(matches_found)} MATCHES ---")
        for m in matches_found:
            print(f"\n### {m['title']}")
            print(f"**Link:** {m['url']}")
            print(f"**Resumen:** {m['snippet']}")
            print(f"**Carta Generada:**\n{m['cover_letter']}\n")
            print("-" * 40)
            
        with open("ofertas_del_dia.json", "w", encoding="utf-8") as f:
            json.dump(matches_found, f, indent=4)
            
        print("Guardado en 'ofertas_del_dia.json'. Esperando aprobación del usuario para proceder con la postulación o guardar enlace.")
    else:
        print("No se encontraron matches interesantes el día de hoy.")

if __name__ == "__main__":
    main()
