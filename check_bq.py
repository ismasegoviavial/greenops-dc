from google.cloud import bigquery

def main():
    try:
        client = bigquery.Client(project="project-5ca89b0c-e364-4245-a61")
        print("BigQuery client initialized successfully.")
        datasets = list(client.list_datasets())
        print(f"Datasets in project: {[d.dataset_id for d in datasets]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
