import os
import json
import random
import requests
from ddgs import DDGS
from dotenv import load_dotenv

load_dotenv()

DB_PATH = "content_db.json"

def load_db():
    if not os.path.exists(DB_PATH):
        print("No se encontró content_db.json")
        return None
    with open(DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_db(db):
    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

def select_next_topic(db):
    last_type = db.get("last_posted_type")
    
    # Decidir qué tipo toca hoy (rotación)
    target_type = "ai_advancement" if last_type == "industry" else "industry"
    
    # Filtrar los que no se han publicado de ese tipo
    available = [t for t in db["topics"] if t["type"] == target_type and not t["posted"]]
    
    # Si ya se publicaron todos de este tipo, resetear el estado de ese tipo
    if not available:
        print(f"Todos los temas de tipo '{target_type}' ya fueron publicados. Reseteando...")
        for t in db["topics"]:
            if t["type"] == target_type:
                t["posted"] = False
        available = [t for t in db["topics"] if t["type"] == target_type and not t["posted"]]
    
    # Seleccionar uno al azar de los disponibles
    selected = random.choice(available)
    return selected

def research_topic(topic_name, topic_type):
    print(f"[Hermes] Investigando en DuckDuckGo: {topic_name}...")
    try:
        ddgs = DDGS()
        import datetime
        current_date_str = datetime.datetime.now().strftime("%Y-%m")
        if topic_type == "industry":
            query = f"principales problemas {topic_name} solucion inteligencia artificial datos casos de exito reales {current_date_str} -site:instagram.com -site:tiktok.com -site:facebook.com -site:twitter.com -site:x.com -site:linkedin.com -site:youtube.com"
        else:
            query = f"ultimos avances inteligencia artificial impacto empresarial casos de uso reales {current_date_str} -site:instagram.com -site:tiktok.com -site:facebook.com -site:twitter.com -site:x.com -site:linkedin.com -site:youtube.com"
            
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

def generate_post(topic_name, topic_type, context, sources):
    print(f"[Hermes] Generando contenido con DeepSeek para: {topic_name}...")
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        return "Error: Falta DEEPSEEK_API_KEY en archivo .env."
        
    system_prompt = "Eres un experto en I+D de Inteligencia Artificial y Datos B2B. Escribes para LinkedIn con un tono informativo, profesional y persuasivo."
    
    import datetime
    current_date_full = datetime.datetime.now().strftime("%d-%m-%Y")

    if topic_type == "industry":
        user_prompt = f"""
Crea un post para LinkedIn sobre la industria: {topic_name}. Considera que la fecha exacta de hoy es {current_date_full}. Adapta la redacción para que los eventos mencionados suenen muy recientes.

Contexto de la investigación reciente:
{context}

Reglas estrictas para el post:
1. El post DEBE tener un MÁXIMO ABSOLUTO de 2000 caracteres (unas 250-300 palabras). Sé muy conciso y directo.
2. Identifica los principales dolores de esta industria, PERO asegúrate de que estos problemas se puedan resolver en un 100% con Análisis de Datos o Inteligencia Artificial.
3. Usa emojis estratégicos para estructurar el texto y hacerlo visualmente atractivo, propio de un feed de LinkedIn.
2. Muestra ejemplos o casos de éxito reales basados en el contexto proporcionado.
3. El tono debe ser puramente informativo, aportando valor al lector.
4. Incluye las siguientes fuentes al final del post (solo la lista de URLs):
{', '.join(sources)}
5. Al final del mensaje, OBLIGATORIAMENTE incluye exactamente esta firma:
"Este análisis fue investigado, redactado y publicado de forma 100% autónoma por Hermes (nuestro Agente de Inteligencia Artificial en Fixus Consulting, diseñado para automatizar flujos de trabajo end-to-end sin intervención humana). ¿Quieres saber cómo podemos crear agentes como yo para tu empresa? Escríbenos."
"""
    else:
        user_prompt = f"""
Crea un post para LinkedIn sobre: {topic_name}. Considera que la fecha exacta de hoy es {current_date_full}. Muestra los datos de la investigación bajo la óptica de que este es el panorama actual y las noticias son de las últimas semanas.

Contexto de la investigación reciente:
{context}

Reglas estrictas para el post:
1. El post DEBE tener un MÁXIMO ABSOLUTO de 2000 caracteres (unas 250-300 palabras). Sé muy conciso y directo.
2. Habla sobre los principales y más recientes avances en Inteligencia Artificial y su impacto empresarial.
3. Usa emojis estratégicos para estructurar el texto y hacerlo visualmente atractivo, propio de un feed de LinkedIn.
2. Muestra cómo estos avances están revolucionando la forma en que operan las empresas y capta el interés de potenciales clientes B2B.
3. El tono debe ser puramente informativo y visionario.
4. Incluye las siguientes fuentes al final del post (solo la lista de URLs):
{', '.join(sources)}
5. Al final del mensaje, OBLIGATORIAMENTE incluye exactamente esta firma:
"Este análisis fue investigado, redactado y publicado de forma 100% autónoma por Hermes (nuestro Agente de Inteligencia Artificial en Fixus Consulting, diseñado para automatizar flujos de trabajo end-to-end sin intervención humana). ¿Quieres saber cómo podemos crear agentes como yo para tu empresa? Escríbenos."
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

def post_to_linkedin(content):
    print("[Hermes] Intentando publicar en LinkedIn...")
    access_token = os.getenv("LINKEDIN_ACCESS_TOKEN")
    org_id = os.getenv("LINKEDIN_ORG_ID", "126234039")
    
    if not access_token:
        print("[!] Advertencia: No se encontró LINKEDIN_ACCESS_TOKEN en el .env.")
        print("[!] Ejecutando en modo DRY-RUN (simulación). El post no se publicará realmente.")
        print("\n=== CONTENIDO DEL POST ===\n")
        print(content)
        print("\n==========================\n")
        return True # Retorna True para simular éxito en el dry-run
        
    url = "https://api.linkedin.com/v2/ugcPosts"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0"
    }
    
    post_data = {
        "author": f"urn:li:organization:{org_id}",
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {
                    "text": content
                },
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    }
    
    response = requests.post(url, headers=headers, json=post_data)
    if response.status_code == 201:
        print("¡Post publicado en LinkedIn exitosamente!")
        return True
    else:
        print(f"Error al publicar en LinkedIn: {response.status_code} - {response.text}")
        return False

def main():
    print("=== Iniciando Agente Hermes (LinkedIn Poster) ===")
    db = load_db()
    if not db:
        return
        
    topic = select_next_topic(db)
    print(f"Tema seleccionado para hoy: {topic['name']} ({topic['type']})")
    
    context, sources = research_topic(topic['name'], topic['type'])
    if not context:
        print("No se pudo obtener contexto. Abortando.")
        return
        
    post_content = generate_post(topic['name'], topic['type'], context, sources)
    if post_content.startswith("Error"):
        print(post_content)
        return
        
    print("\n=== BORRADOR DEL POST PARA LINKEDIN ===\n")
    print(post_content)
    print("\n=======================================\n")
    
    # Guardar borrador para aprobación
    db["draft"] = {
        "topic_name": topic["name"],
        "topic_type": topic["type"],
        "content": post_content
    }
    save_db(db)
    print("Borrador guardado. Esperando aprobación por Discord para publicar.")

if __name__ == "__main__":
    main()
