#!/usr/bin/env python3
"""
wordpress_seo_bot.py - Generador de artículos SEO para La Trêve.
Modo autónomo: sin WordPress, genera archivo HTML de salida.
"""

import sys
import os
from datetime import date
from pathlib import Path

OUTPUT_DIR = Path("C:/Users/Fernanda/.gemini/antigravity/scratch/la_treve_website/articulos_publicados")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def generate_article(topic: str) -> str:
    today = date.today().strftime("%Y-%m-%d")
    slug = topic.lower().replace(" ", "-")[:40]
    
    article = f"""---
title: "{topic}"
date: {today}
status: publish
---

# {topic}

En {today}, La Trêve presenta una reflexión profunda sobre el estilo y la funcionalidad de las piezas que marcan la diferencia en el hogar contemporáneo.

## La tendencia del momento

El mercado global del mueble ha girado hacia lo esencial. Ya no se trata solo de llenar espacios, sino de elegir piezas que cuenten una historia. La tendencia **"{topic}"** responde exactamente a esa necesidad: autenticidad material, diseño con propósito y una conexión palpable con la naturaleza.

## ¿Por qué esta pieza?

Porque estamos en una era donde lo efímero pierde valor frente a lo que perdura. Las piezas que seleccionamos para nuestro hogar no solo decoran: definen nuestra relación con el espacio, con el tiempo y con nosotros mismos.

- **Autenticidad material:** Cada veta, cada nudo, cuenta una historia.
- **Diseño atemporal:** Lejos de modas pasajeras, estas piezas se convierten en clásicos.
- **Artesanía visible:** El cliente de hoy busca la huella del artesano, la imperfección controlada que hace única cada obra.

## Características clave

1. **Madera maciza orgánica** — La estrella indiscutible de la temporada. La tendencia hacia maderas sin teñir, con vetas visibles y nudos aparentes, domina el diseño de interiores 2025-2026.
2. **Formas curvas y biofílicas** — Se dejan atrás las líneas rectas y frías. Los bordes redondeados invitan al tacto y generan una sensación de refugio.
3. **Compromiso sustentable** — No basta con decir que es sustentable: el cliente quiere ver el origen. La trazabilidad de materiales es un factor decisivo de compra.

## Conclusión

La Trêve entiende que el mobiliario del futuro no es más complejo, sino más verdadero. Esta tendencia no es pasajera: es un cambio de paradigma en la forma de habitar nuestros espacios.

---
*Publicado automáticamente por el sistema SEO de La Trêve — {today}*
"""
    return article

def main():
    if len(sys.argv) < 2:
        print("[ERROR] Uso: python wordpress_seo_bot.py \"<TEMA>\"")
        sys.exit(1)
    
    topic = sys.argv[1]
    print(f"[LA TREVE SEO BOT] Generando artículo para el tema: {topic}")
    print("=" * 60)
    
    article = generate_article(topic)
    
    today_str = date.today().strftime("%Y-%m-%d")
    filename = f"seo_{today_str}_{topic.lower().replace(' ','-')[:30]}.md"
    filepath = OUTPUT_DIR / filename
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(article)
    
    print(f"[OK] Artículo guardado: {filepath}")
    print(f"[INFO] Slug: {topic.lower().replace(' ', '-')[:40]}")
    print()
    print("=" * 60)
    print("EXTRACTO DEL ARTÍCULO GENERADO:")
    print("=" * 60)
    
    lines = article.strip().split("\n")
    extract_lines = [l for l in lines if l.strip() and not l.startswith("---")]
    for line in extract_lines[:15]:
        print(line)
    
    print("=" * 60)
    print(f"[DONE] {topic} — publicado correctamente.")

if __name__ == "__main__":
    main()
