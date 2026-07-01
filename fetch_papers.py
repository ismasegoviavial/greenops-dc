import requests
import json

def fetch_openalex(query):
    url = "https://api.openalex.org/works"
    params = {
        "search": query,
        "filter": "publication_year:>2022,has_oa_hosted_version:true",
        "sort": "cited_by_count:desc",
        "per-page": 5
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json().get("results", [])
    else:
        print(f"Error {response.status_code} on query {query}")
        return []

print("Buscando papers sobre Consumo de IA en Data Centers...")
ai_papers = fetch_openalex("data center energy consumption artificial intelligence generative")

print("Buscando papers sobre Enfriamiento y Termosifones Bifásicos...")
cooling_papers = fetch_openalex("two phase thermosyphon immersion cooling data center")

results = {
    "ai_energy_consumption": [],
    "cooling_technologies": []
}

for p in ai_papers:
    results["ai_energy_consumption"].append({
        "title": p.get("title"),
        "doi": p.get("doi"),
        "year": p.get("publication_year"),
        "abstract": p.get("abstract_inverted_index"),
        "url": p.get("open_access", {}).get("oa_url")
    })

for p in cooling_papers:
    results["cooling_technologies"].append({
        "title": p.get("title"),
        "doi": p.get("doi"),
        "year": p.get("publication_year"),
        "abstract": p.get("abstract_inverted_index"),
        "url": p.get("open_access", {}).get("oa_url")
    })

with open("papers_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("¡Búsqueda completada! Resultados en papers_results.json")
