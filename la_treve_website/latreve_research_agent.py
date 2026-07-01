import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

def generate_email_draft(lead):
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        return "Error: Faltan credenciales de DeepSeek."

    print(f"Redactando correo para {lead['empresa']} ({lead['nicho']})...")

    # Adaptar la propuesta según el rubro
    if lead['nicho'] == 'hamburgueseria':
        propuesta = "tablas de madera maciza para servir, diseñadas para resistir uso rudo comercial y darle un toque rústico y premium a la presentación de sus hamburguesas"
    else:
        propuesta = "mesas de comedor y mobiliario estilo Japandi en madera maciza, perfectas para aportar calidez, diseño atemporal y sustentabilidad a sus próximos proyectos de interiorismo"

    prompt = f"""
Eres el Gerente Comercial de "La Trêve", una marca chilena de diseño y fabricación de mobiliario premium en madera maciza orgánica.
Debes redactar un correo B2B muy breve (máximo 120 palabras), directo y cálido dirigido a {lead['nombre']}, de la empresa {lead['empresa']}.

El objetivo es ofrecerles una alianza o venta corporativa de: {propuesta}.

Reglas:
- No uses saludos anticuados. Sé fresco y moderno.
- Destaca que somos fabricantes y diseñamos a medida.
- Termina con un Call to Action (CTA) claro para agendar una breve llamada de 10 minutos.
- El asunto (Subject) debe estar en la primera línea precedido por "ASUNTO: ".
"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "Eres un experto en ventas B2B."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post("https://api.deepseek.com/chat/completions", headers=headers, json=payload, timeout=60)
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error generando correo: {e}")
    return "Error generando borrador."

def main():
    if not os.path.exists("latreve_leads.json"):
        print("No se encontró latreve_leads.json. Ejecuta b2b_lead_gen.py primero.")
        return

    with open("latreve_leads.json", "r", encoding="utf-8") as f:
        leads = json.load(f)

    if not leads:
        print("No hay leads en el archivo.")
        return

    print("=== REDACCIÓN DE CORREOS B2B (LA TRÊVE) ===")
    
    for lead in leads:
        draft = generate_email_draft(lead)
        print("\n" + "="*50)
        print(f"LEAD: {lead['email']} | EMPRESA: {lead['empresa']}")
        print("="*50)
        print(draft)
        print("="*50)

if __name__ == "__main__":
    main()
