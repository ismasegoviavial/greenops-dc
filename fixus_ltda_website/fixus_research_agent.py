import os
import sys
import requests
import json
from ddgs import DDGS
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def research_industry_pain_points(industry):
    """Busca en internet los dolores principales de la industria usando DuckDuckGo."""
    print(f"\n[Fixus R&D] Investigando dolores actuales en la industria: {industry}...")
    try:
        # Si el usuario pasa varias industrias separadas por comas, buscar para cada una
        industrias = [i.strip() for i in industry.split(",")]
        all_context = []
        for ind in industrias:
            results = DDGS().text(f"{ind} industry main challenges problems ai data tech", max_results=2)
            all_context.append(f"\n--- Noticias de {ind.upper()} ---")
            all_context.extend([f"- {r['title']}: {r['body']}" for r in results])
        
        return "\n".join(all_context)
    except Exception as e:
        print(f"Error en búsqueda: {e}")
        return "No se encontró información reciente."

def generate_innovation_proposal(industry, context):
    """Usa DeepSeek para generar una propuesta de innovación (Piloto IA) basada en la investigación."""
    print(f"[Fixus R&D] Generando propuesta innovadora con IA (DeepSeek)...")
    
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        return "Error: Falta DEEPSEEK_API_KEY en archivo .env. No se puede generar la propuesta."
    
    prompt = f"""
    Eres el Arquitecto de Soluciones de IA en 'Fixus', una consultora tecnológica avanzada.
    El gerente te ha pedido buscar oportunidades de negocio en los siguientes sectores: '{industry}'.
    
    Basado en estas noticias recientes del mercado:
    {context}
    
    Redacta un reporte ejecutivo de "Oportunidades de Innovación B2B".
    La solución debe usar Agentes IA, Análisis de Datos o BigQuery. 
    Debes:
    1. Identificar cruces u oportunidades en los sectores mencionados.
    2. Proponer 3 "Pilotos Rápidos" (Ej. Automatización Logística, IA en Minería) que Fixus pueda salir a vender hoy mismo.
    3. Ser muy enfocado en el retorno de inversión (ROI) para el cliente final.
    """
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "Eres un experto en I+D de Inteligencia Artificial para B2B."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 2500,
        "temperature": 0.7
    }
    
    try:
        response = requests.post("https://api.deepseek.com/chat/completions", headers=headers, json=payload, timeout=60)
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        else:
            return f"Error con la API de DeepSeek (Status {response.status_code}): {response.text}"
    except Exception as e:
        return f"Error de red/API al llamar a DeepSeek: {e}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python fixus_research_agent.py 'Industria'")
        print("Ejemplo: python fixus_research_agent.py 'Mineria'")
    else:
        industria = sys.argv[1]
        contexto = research_industry_pain_points(industria)
        propuesta = generate_innovation_proposal(industria, contexto)
        print("\n" + "="*50)
        print(f"--- PROPUESTA FIXUS PARA: {industria.upper()} ---")
        print("="*50)
        print(propuesta)
        print("="*50)
