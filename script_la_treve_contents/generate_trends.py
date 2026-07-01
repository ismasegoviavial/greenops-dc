import pandas as pd
import requests
import vertexai
from vertexai.generative_models import GenerativeModel, Part
from vertexai.preview.vision_models import ImageGenerationModel
import os
import io

PROJECT_ID = "project-5ca89b0c-e364-4245-a61"
LOCATION = "us-central1"

LA_TREVE_BRANDBOOK = """
Antecedentes: La Trêve nace como una respuesta al mobiliario producido en masa. En un mundo donde los muebles se compran rápidamente y se reemplazan con facilidad, la marca propone lo contrario: tiempo, dedicación y materia. Cada pieza comienza con un diseño pensado para un cliente y un espacio específico. Ese diseño es llevado a manos de maestros carpinteros y ebanistas que lo materializan con precisión artesanal. La Trêve no busca llenar casas con objetos. Busca crear piezas que construyan hogar.
Comportamiento: La marca no busca atención, la merece. No compite, se posiciona. No vende directamente, construye valor. Cada publicación debe sentirse como el producto mismo: medido, trabajado, honesto y duradero.
Misión: Crear muebles de alta gama diseñados con sensibilidad estética y medioambiental construidos artesanalmente por maestros carpinteros y ebanistas, utilizando materiales de primera calidad.
Visión: Posicionarse como una marca referente de mobiliario de autor en Chile y Latinoamérica, reconocida por su diseño, calidad material, carácter artesanal y compromiso con la sustentabilidad.
Identidad: La Trêve representa pausa, intimidad y reconciliación con el espacio doméstico.
Pilares: Artesanía contemporánea. Hogar como refugio. Permanencia material.
Valores centrales: Artesanía, Calidad material, Diseño atemporal, Calidez, Identidad personal, Exclusividad, Sustentabilidad.
Palabras asociadas: materia, oficio, permanencia, diseño, hogar, pausa, detalle, proporción, textura, tiempo.
Lenguaje de marca: La marca habla desde la calma, la precisión y la autoridad silenciosa. No explica de más. Sugiere, demuestra.
Materialidad: madera maciza, veta, textura, densidad, acabado, nobleza.
Oficio: ebanistería, ensamblaje, precisión, proceso, mano, técnica.
Diseño: proporción, equilibrio, detalle, composición.
"""

def download_image_as_part(url):
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return Part.from_data(data=response.content, mime_type="image/jpeg")
    except:
        pass
    return None

def main():
    print("Iniciando conexión con Vertex AI...")
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    
    print("Cargando el catálogo unificado de muebles extraídos...")
    try:
        df = pd.read_excel("muebles_chile_data.xlsx")
    except Exception as e:
        print("Error al abrir 'muebles_chile_data.xlsx'. Asegúrate de haber corrido main.py primero para tener datos.", e)
        return
        
    categorias_top = df['Tipo de Producto'].value_counts().head(5).index.tolist()
    print(f"Analizaremos el top 5 de categorías del mercado: {categorias_top}")
    
    if not os.path.exists("renders_ideales"):
        os.makedirs("renders_ideales")
        
    vision_model = GenerativeModel("gemini-1.5-pro-002")
    
    try:
        image_model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-001")
        print("Motor Imagen 3 activado.")
    except Exception as e:
        print("No se pudo cargar Vertex AI Imagen 3. Se generarán solo los prompts de texto:", e)
        image_model = None

    for cat in categorias_top:
        if str(cat).lower() in ['nan', 'none', '']: continue
        print(f"\n======================================")
        print(f"--- FASE 1: PROCESANDO '{cat.upper()}' ---")
        
        # Filtramos para tener muestras representativas de esta categoría
        subset = df[df['Tipo de Producto'] == cat].dropna(subset=['URL Imagen']).head(25)
        
        image_parts = []
        for url in subset['URL Imagen'].unique():
            part = download_image_as_part(url)
            if part:
                image_parts.append(part)
            if len(image_parts) >= 10:  # 10 imágenes es suficiente contexto de mercado para la IA
                break
                
        if not image_parts:
            print(f"No se pudieron descargar imágenes de referencia para {cat}. Saltando...")
            continue
            
        print(f"Digeridas {len(image_parts)} fotografías de {cat} de la competencia pura.")
        print("Consultando a nuestro Director Creativo IA (Gemini)...")
        
        prompt = f"""
Actúa como el Director Creativo, Analista de Mercado y Maestro Ebanista de la exclusiva marca de muebles "La Trêve".
A continuación te he anexado las fotografías de los modelos de "{cat}" más comunes y populares extraídos automáticamente de 16 tiendas competidoras en Chile.

Este es tu libro de marca (Brandbook):
{LA_TREVE_BRANDBOOK}

TAREA OBLIGATORIA:
1. BREVE ANÁLISIS: Critica constructivamente lo que ves en las imágenes basándote en que es "producido en masa", identificando la paleta y geometrías. 
2. INTERVENCIÓN LA TRÊVE: Cómo tu taller reimaginaría este concepto de negocio para crear el Mueble Definitivo en esta categoría. Evoca madera maciza, proporción, quietud y refugio.
3. INSTRUCCIÓN GRÁFICA: Basado en tu intervención, redacta un prompt en INGLÉS EXTREMADAMENTE DETALLADO (máximo 60 palabras) para enviárselo a un fotógrafo/renderizador IA. El prompt debe enfocarse en la foto hiperrealista de la pieza de mobiliario final de La Trêve. Incluye "High-end photography, solid wood craftsmanship, timeless design, cinematic lighting, extreme attention to wood grain and joinery detail".

IMPORTANTE: Pon tu instrucción en INGLÉS en un bloque al último, precedido por la etiqueta exacta "PROMPT_IMAGEN:"
"""
        
        try:
            response = vision_model.generate_content([prompt] + image_parts)
            respuesta_texto = response.text
            print("\n>> VEREDICTO DE LA MARCA:")
            print(respuesta_texto)
            
            # Extraer el prompt en inglés
            if "PROMPT_IMAGEN:" in respuesta_texto:
                img_prompt = respuesta_texto.split("PROMPT_IMAGEN:")[1].strip()
            else:
                img_prompt = "A photorealistic high-end furniture photography of a " + cat + " focusing on solid wood craftsmanship, timeless design, warm natural lighting, minimalist studio background."
                
            print(f"\n--- FASE 2: RENDERIZADO VISUAL ---")
            print(f"Instrucción despachada: {img_prompt[:90]}...")
            
            if image_model:
                images = image_model.generate_images(
                    prompt=img_prompt,
                    number_of_images=1,
                    aspect_ratio="1:1"
                )
                output_path = f"renders_ideales/La_Treve_{cat.replace(' ', '_').replace('/', '_')}.jpeg"
                images[0].save(location=output_path)
                print(f"✅ ¡Renders terminados! Imagen guardada físicamente en la carpeta: {output_path}")
            else:
                print("⚠️ Copia y pega el PROMPT_IMAGEN en un generador como Midjourney o OpenAI ya que no tienes activada la API de Imagen en tu proyecto.")
                
        except Exception as e:
            print(f"Error en el proceso de IA para {cat}: {e}")

if __name__ == "__main__":
    main()
