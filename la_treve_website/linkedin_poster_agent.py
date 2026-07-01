import os
import random
import requests
from ddgs import DDGS
from dotenv import load_dotenv
import datetime

load_dotenv()

def research_topic(topic):
    print(f"[Hermes] Investigando en DuckDuckGo: {topic}...")
    try:
        ddgs = DDGS()
        current_date_str = datetime.datetime.now().strftime("%Y-%m")
        # Exclusion of social media from DDG search
        query = f"tendencias de diseño {topic} interiorismo chile {current_date_str} -site:instagram.com -site:tiktok.com -site:facebook.com -site:twitter.com -site:x.com -site:linkedin.com -site:youtube.com"
            
        results = ddgs.text(query, max_results=4, timelimit='m')
        
        context_parts = []
        sources = []
        for r in results:
            context_parts.append(f"- Título: {r['title']}\n  Snippet: {r['body']}\n  URL: {r['href']}")
            sources.append(r['href'])
            
        context = "\n\n".join(context_parts)
        return context, sources
    except Exception as e:
        print(f"Error en búsqueda: {e}")
        return "", []

def generate_post(topic, context, sources):
    print(f"[Hermes] Generando contenido con DeepSeek para: {topic}...")
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        return "Error: Falta DEEPSEEK_API_KEY en archivo .env."
        
    system_prompt = "Eres un experto en Interiorismo, Arquitectura y Muebles de Diseño. Escribes para LinkedIn con un tono elegante, orgánico y profesional."
    current_date_full = datetime.datetime.now().strftime("%d-%m-%Y")

    user_prompt = f"""
Crea un post para LinkedIn sobre: {topic}. Considera que la fecha exacta de hoy es {current_date_full}. Muestra los datos de la investigación bajo la óptica de que este es el panorama actual del diseño.

Contexto de la investigación reciente:
{context}

Reglas estrictas para el post:
1. El post DEBE tener un MÁXIMO ABSOLUTO de 2000 caracteres (unas 250-300 palabras). Sé muy conciso, directo y elegante.
2. Habla sobre la tendencia, cómo impacta los espacios modernos y la importancia de los materiales nobles (como la madera maciza).
3. Usa emojis estratégicos en tonos tierra o neutros (🤎, 🌿, 🪵, ✨, 📐).
4. El tono debe posicionar a "La Trêve" como referente en fabricación artesanal de lujo y mobiliario premium.
5. Incluye las siguientes fuentes al final del post (solo la lista de URLs):
{', '.join(sources)}
6. Al final del mensaje, OBLIGATORIAMENTE incluye exactamente esta firma:
"Este análisis fue investigado, redactado y publicado de forma 100% autónoma por Hermes (Agente de Inteligencia Artificial de La Trêve). Descubre nuestras colecciones en madera maciza y solicita una cotización para tus proyectos en latreve.cl"
"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7
    }
    
    try:
        response = requests.post("https://api.deepseek.com/chat/completions", headers=headers, json=payload, timeout=60)
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        pass
    return "Error generando post."

def main():
    print("=== INICIANDO AGENTE LINKEDIN POSTER (LA TRÊVE) ===")
    topics = ["Estilo Japandi", "Slow Furniture", "Madera Maciza en Interiorismo Corporativo"]
    topic = random.choice(topics)
    print(f"Tema seleccionado: {topic}")
    
    context, sources = research_topic(topic)
    if not context:
        print("No se pudo obtener contexto.")
        return
        
    post = generate_post(topic, context, sources)
    print("\n=== BORRADOR DEL POST PARA LINKEDIN (LA TRÊVE) ===\n")
    print(post)
    print("\n===================================================\n")
    print("Borrador listo. Esperando aprobación por Discord para publicar.")

if __name__ == "__main__":
    main()
