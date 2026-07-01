import requests

urls = [
    "https://areadesign.cl", "https://forastero.life", "https://amoble.cl",
    "https://tiendaladeco.cl", "https://broca.cl", "https://leatherhouse.cl",
    "https://tiendamad.cl", "https://mushkabazar.cl", "https://primamuebles.cl",
    "https://www.rusticchic.cl", "https://sofaroller.cl", "https://www.sofaonline.cl",
    "https://angelarestrepo.cl", "https://www.theproductculture.cl", "https://www.maderistica.cl",
    "https://manifestodesignstore.com", "https://cristian-valdes.com", "https://www.ankataller.com",
    "https://interdesign.cl", "https://www.boconcept.com", "https://www.roche-bobois.com"
]

results = {"shopify": [], "wordpress": [], "vtex": [], "other": []}
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for url in urls:
    try:
        base_url = url.split('?')[0].rstrip('/')
        
        # Check Shopify by looking at products.json
        r = requests.get(base_url + '/products.json?limit=1', headers=headers, timeout=5)
        if r.status_code == 200 and 'products' in r.json():
            results["shopify"].append(base_url)
            print(f"{base_url} -> Shopify")
            continue
    except Exception:
        pass
        
    try:
        # Check WordPress by looking at wp-json
        r = requests.get(base_url + '/wp-json/', headers=headers, timeout=5)
        if r.status_code == 200 and ('name' in r.json() or 'routes' in r.json()):
            results["wordpress"].append(base_url)
            print(f"{base_url} -> WordPress/WooCommerce")
            continue
    except Exception:
        pass

    try:
        # Generic HTML inspection to find Shopify or WooCommerce or VTEX
        r = requests.get(base_url, headers=headers, timeout=5)
        html = r.text.lower()
        if 'cdn.shopify.com' in html or 'shopify' in html:
            results["shopify"].append(base_url)
            print(f"{base_url} -> Shopify (HTML detected)")
            continue
        elif 'wp-content' in html or 'woocommerce' in html:
            results["wordpress"].append(base_url)
            print(f"{base_url} -> WordPress/WooCommerce (HTML detected)")
            continue
        elif 'vtex' in html:
            results["vtex"].append(base_url)
            print(f"{base_url} -> VTEX (HTML detected)")
            continue
            
    except Exception:
        pass

    results["other"].append(base_url)
    print(f"{base_url} -> Other/Unknown")

print("\n--- Summary ---")
for k, v in results.items():
    print(f"{k.upper()}: {len(v)} stores")
    for s in v:
        print(f"  - {s}")
