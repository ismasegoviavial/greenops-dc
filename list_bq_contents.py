from google.cloud import bigquery

def main():
    client = bigquery.Client(project="project-5ca89b0c-e364-4245-a61")
    dataset_id = "data_center_research"
    dataset_ref = client.dataset(dataset_id)
    
    print("Tables:")
    tables = list(client.list_tables(dataset_ref))
    for t in tables:
        print(f" - {t.table_id}")
        
    print("\nModels:")
    models = list(client.list_models(dataset_ref))
    for m in models:
        print(f" - {m.model_id}")

if __name__ == "__main__":
    main()
