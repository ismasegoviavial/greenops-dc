import google.auth
from google.cloud import bigquery

def main():
    try:
        credentials, project = google.auth.default()
        print(f"Project: {project}")
        print(f"Credentials type: {type(credentials).__name__}")
        
        # Try to get service account email or active account if available
        if hasattr(credentials, 'service_account_email'):
            print(f"Service Account Email: {credentials.service_account_email}")
        
        client = bigquery.Client(project=project)
        # Check current user/account by calling a simple API or listing project details
        print("Success: authentication details retrieved.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
