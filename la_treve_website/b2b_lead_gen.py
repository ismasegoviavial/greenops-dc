import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

def search_companies_serpapi(query):
    print(f"Buscando empresas en Google (SERP): '{query}'")
    api_key = os.getenv("SERPAPI_API_KEY")
    if not api_key:
        print("Error: SERPAPI_API_KEY no encontrada.")
        return []

    url = "https://serpapi.com/search.json"
    params = {
        "engine": "google",
        "q": query,
        "location": "Chile",
        "google_domain": "google.cl",
        "gl": "cl",
        "hl": "es",
        "api_key": api_key
    }
    try:
        response = requests.get(url, params=params, timeout=30)
        if response.status_code == 200:
            results = response.json().get("organic_results", [])
            companies = []
            for r in results:
                domain = r.get("link", "").replace("https://", "").replace("http://", "").split("/")[0]
                if domain and "instagram" not in domain and "facebook" not in domain:
                    companies.append({
                        "name": r.get("title", ""),
                        "domain": domain
                    })
            return companies
        else:
            print(f"Error SERP API: {response.status_code}")
    except Exception as e:
        print(f"Error conexión SERP: {e}")
    return []

def find_emails_hunter(domain):
    api_key = os.getenv("HUNTER_API_KEY")
    if not api_key:
        return []
    
    url = f"https://api.hunter.io/v2/domain-search?domain={domain}&api_key={api_key}"
    try:
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            emails = response.json().get("data", {}).get("emails", [])
            return [{"email": e["value"], "first_name": e.get("first_name"), "last_name": e.get("last_name")} for e in emails if e["value"]]
    except:
        pass
    return []

def main():
    print("=== INICIANDO PROSPECCIÓN B2B (LA TRÊVE) ===")
    queries = [
        ("arquitectura", "estudio de arquitectura e interiorismo Chile"),
        ("hamburgueseria", "mejores hamburgueserias santiago chile restaurante")
    ]
    
    all_leads = []
    
    for niche, query in queries:
        companies = search_companies_serpapi(query)
        for c in companies[:5]: # Top 5 por rubro
            print(f"Investigando dominio: {c['domain']}")
            emails = find_emails_hunter(c["domain"])
            if emails:
                best_email = emails[0] # Tomar el primero encontrado
                lead = {
                    "empresa": c["name"],
                    "nicho": niche,
                    "dominio": c["domain"],
                    "email": best_email["email"],
                    "nombre": best_email.get("first_name") or "Equipo",
                    "apellido": best_email.get("last_name") or ""
                }
                all_leads.append(lead)
                print(f" -> Lead encontrado: {lead['email']}")
            else:
                print(" -> Sin correos.")
                
    with open("latreve_leads.json", "w", encoding="utf-8") as f:
        json.dump(all_leads, f, indent=4, ensure_ascii=False)
        
    print(f"\n[OK] Se guardaron {len(all_leads)} leads en latreve_leads.json")

if __name__ == "__main__":
    main()
