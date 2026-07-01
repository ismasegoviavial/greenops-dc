import requests
import json
import pandas as pd
import time
from bs4 import BeautifulSoup

def scrape_woocommerce_store_api(base_url):
    print(f"Scraping WooCommerce via API: {base_url}", flush=True)
    base_url = base_url.rstrip('/')
    products_data = []
    page = 1
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    while True:
        url = f"{base_url}/wp-json/wc/store/products?per_page=100&page={page}"
        print(f"Fetching {url}", flush=True)
        try:
            r = requests.get(url, headers=headers, timeout=10)
            if r.status_code != 200:
                print(f"Failed to fetch {url} - Status Code: {r.status_code}", flush=True)
                break
                
            products = r.json()
            if not products:
                break
                
            for product in products:
                title = product.get('name', '')
                product_url = product.get('permalink', '')
                product_type = product.get('type', 'simple')
                
                # Main image
                images = product.get('images', [])
                image_url = images[0].get('src', '') if images else ''
                
                prices = product.get('prices', {})
                price = prices.get('price', '')
                regular_price = prices.get('regular_price', price)
                
                available = product.get('is_in_stock', False)
                # Ensure price is formatted as an integer without decimals if needed, or leave as string
                price = str(price)[:-2] if str(price).endswith('00') and len(str(price)) > 4 else str(price)
                regular_price = str(regular_price)[:-2] if str(regular_price).endswith('00') and len(str(regular_price)) > 4 else str(regular_price)


                # For variations, the store API sometimes returns a list of variations or basic price range.
                # If we need deeper variations, we will just store the main product for WC for now, 
                # or if it has 'variations' array, we loop it. 
                # Most modern WC json omit deeper variation details without another request,
                # but 'price' represents the base/from price.
                
                products_data.append({
                    'Tienda': base_url,
                    'Nombre de Producto': title,
                    'Tipo de Producto': product_type,
                    'Variacion': 'Default / Multiple',
                    'Precio Oferta': price,
                    'Precio Normal': regular_price,
                    'Stock': 'Disponible' if available else 'Agotado',
                    'URL Imagen': image_url,
                    'URL Producto': product_url
                })
                
            page += 1
            time.sleep(1) # Be polite
        except Exception as e:
            print(f"Error scraping {base_url}: {e}", flush=True)
            break
            
    return products_data

if __name__ == "__main__":
    # Test run
    test_urls = ["https://leatherhouse.cl"]
    all_data = []
    for url in test_urls:
        all_data.extend(scrape_woocommerce_store_api(url))
        
    df = pd.DataFrame(all_data)
    df.to_csv("woo_test.csv", index=False, encoding='utf-8')
    print(f"Test finished. Data saved to woo_test.csv. Total Rows: {len(df)}", flush=True)
