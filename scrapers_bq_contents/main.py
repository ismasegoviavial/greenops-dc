import sys
import traceback
import pandas as pd
import pandas_gbq
from datetime import datetime
from shopify_scraper import scrape_shopify_store
from woocommerce_scraper import scrape_woocommerce_store_api

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')


# ===== CONFIGURACIÓN BIGQUERY =====
BQ_PROJECT_ID = "project-5ca89b0c-e364-4245-a61"
BQ_TABLE_ID = "muebles_db.scrapes"
BQ_AGREGAR_HISTORICO = True
# ==================================

# Categorizadas tras analizar / products.json y wp-json/wc
SHOPIFY_STORES = [
    "https://areadesign.cl", "https://tiendaladeco.cl", "https://broca.cl",
    "https://mushkabazar.cl", "https://www.rusticchic.cl", "https://www.theproductculture.cl",
    "https://manifestodesignstore.com", "https://cristian-valdes.com", "https://www.ankataller.com",
    "https://interdesign.cl"
]

WOOCOMMERCE_STORES = [
    "https://leatherhouse.cl", "https://tiendamad.cl", "https://primamuebles.cl",
    "https://sofaroller.cl", "https://www.sofaonline.cl", "https://angelarestrepo.cl"
]

OTHER_STORES = [
    "https://forastero.life", "https://amoble.cl", "https://www.maderistica.cl",
    "https://www.boconcept.com", "https://www.roche-bobois.com"
]

def main():
    all_data = []
    
    print("=== INICIANDO EXTRACCIÓN DE SHOPIFY ===")
    for url in SHOPIFY_STORES:
        try:
            data = scrape_shopify_store(url)
            all_data.extend(data)
            print(f"[OK] {url} -> {len(data)} productos total.")
        except Exception as e:
            print(f"[ERROR] Falló {url}: {e}")

    print("\n=== INICIANDO EXTRACCIÓN DE WOOCOMMERCE ===")
    for url in WOOCOMMERCE_STORES:
        try:
            data = scrape_woocommerce_store_api(url)
            all_data.extend(data)
            print(f"[OK] {url} -> {len(data)} productos total.")
        except Exception as e:
            print(f"[ERROR] Falló {url}: {e}")
            
    print("\nLas tiendas de plataformas custom/VTEX se han omitido en esta v1 principal por requerir desarrollos dedicados.")

    # Guardar a Excel
    if all_data:
        df = pd.DataFrame(all_data)
        df = df.drop_duplicates(subset=['URL Producto', 'Variacion'])
        
        output_file = "muebles_chile_data.xlsx"
        df.to_excel(output_file, index=False)
        print(f"\n✅ EXTRACCIÓN FINALIZADA. Archivo guardado: {output_file} con {len(df)} variaciones.")
        
        # Guardar en BigQuery
        print("\n=== INICIANDO EXPORTACIÓN A BIGQUERY ===")
        try:
            # Agregar la fecha de ejecución al registro para diferenciar las semanas
            df['Fecha Scraping'] = datetime.now().strftime('%Y-%m-%d')
            
            if BQ_AGREGAR_HISTORICO:
                comportamiento = 'append'
            else:
                comportamiento = 'replace'
                
            pandas_gbq.to_gbq(
                df,
                destination_table=BQ_TABLE_ID, 
                project_id=BQ_PROJECT_ID, 
                if_exists=comportamiento,
                progress_bar=True
            )
            print(f"✅ ¡Datos subidos exitosamente a BigQuery en {BQ_PROJECT_ID}:{BQ_TABLE_ID}!")
        except Exception as e:
            print(f"❌ Error al intentar subir a BigQuery. Asegúrate de que el proyecto '{BQ_PROJECT_ID}' sea válido y de tener permisos: {e}")
            
    else:
        print("No se encontraron datos.")

if __name__ == "__main__":
    main()
