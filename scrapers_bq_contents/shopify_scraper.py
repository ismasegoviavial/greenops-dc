import requests
import time
import pandas as pd

def scrape_shopify_store(store_url):
    print(f"Scraping Shopify store: {store_url}", flush=True)
    base_url = store_url.rstrip('/')
    products_data = []
    
    since_id = 0
    limit = 250
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    while True:
        url = f"{base_url}/products.json?limit={limit}&since_id={since_id}"
        print(f"Fetching {url}", flush=True)
        try:
            r = requests.get(url, headers=headers, timeout=10)
            if r.status_code != 200:
                print(f"Failed to fetch {url} - Status Code: {r.status_code}")
                # Sometimes pagination using page instead of since_id is needed on older Shopify themes
                if since_id == 0:
                    return scrape_shopify_store_legacy(base_url)
                break
                
            data = r.json()
            products = data.get('products', [])
            
            if not products:
                break
                
            for product in products:
                handle = product.get('handle', '')
                product_url = f"{base_url}/products/{handle}"
                title = product.get('title', '')
                product_type = product.get('product_type', '')
                
                # Main image
                images = product.get('images', [])
                image_url = images[0].get('src', '') if images else ''
                
                # Variants
                for variant in product.get('variants', []):
                    variant_title = variant.get('title', '')
                    price = variant.get('price', '0')
                    compare_at_price = variant.get('compare_at_price', '')
                    available = variant.get('available', False)
                    
                    products_data.append({
                        'Tienda': base_url,
                        'Nombre de Producto': title,
                        'Tipo de Producto': product_type,
                        'Variacion': variant_title,
                        'Precio Oferta': price,
                        'Precio Normal': compare_at_price if compare_at_price else price,
                        'Stock': 'Disponible' if available else 'Agotado',
                        'URL Imagen': image_url,
                        'URL Producto': product_url
                    })
                    
            new_since_id = products[-1].get('id')
            if new_since_id == since_id:
                print(f"since_id did not progress ({since_id}). Breaking pagination loop.")
                break
            since_id = new_since_id
            time.sleep(1) # Be polite
        except Exception as e:
            print(f"Error scraping {base_url}: {e}", flush=True)
            break
            
    return products_data

def scrape_shopify_store_legacy(base_url):
    print(f"Attempting legacy Shopify scraping for: {base_url}")
    products_data = []
    page = 1
    limit = 250
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    while True:
        url = f"{base_url}/products.json?limit={limit}&page={page}"
        print(f"Fetching {url}")
        try:
            r = requests.get(url, headers=headers, timeout=10)
            if r.status_code != 200:
                break
                
            data = r.json()
            products = data.get('products', [])
            
            if not products:
                break
                
            for product in products:
                handle = product.get('handle', '')
                product_url = f"{base_url}/products/{handle}"
                title = product.get('title', '')
                product_type = product.get('product_type', '')
                
                # Main image
                images = product.get('images', [])
                image_url = images[0].get('src', '') if images else ''
                
                # Variants
                for variant in product.get('variants', []):
                    variant_title = variant.get('title', '')
                    price = variant.get('price', '0')
                    compare_at_price = variant.get('compare_at_price', '')
                    available = variant.get('available', False)
                    
                    products_data.append({
                        'Tienda': base_url,
                        'Nombre de Producto': title,
                        'Tipo de Producto': product_type,
                        'Variacion': variant_title,
                        'Precio Oferta': price,
                        'Precio Normal': compare_at_price if compare_at_price else price,
                        'Stock': 'Disponible' if available else 'Agotado',
                        'URL Imagen': image_url,
                        'URL Producto': product_url
                    })
            page += 1
            time.sleep(1)
        except Exception as e:
            print(f"Error scraping legacy {base_url}: {e}")
            break
    return products_data

if __name__ == "__main__":
    # Test run
    test_urls = ["https://areadesign.cl", "https://tiendaladeco.cl"]
    all_data = []
    for url in test_urls:
        all_data.extend(scrape_shopify_store(url))
        
    df = pd.DataFrame(all_data)
    df.to_csv("shopify_test.csv", index=False, encoding='utf-8')
    print(f"Test finished. Data saved to shopify_test.csv. Total Rows: {len(df)}")
