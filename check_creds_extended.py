import google.auth
import os

def main():
    try:
        # Check environment variables
        print("Environment Variables:")
        for var in ["GOOGLE_APPLICATION_CREDENTIALS", "CLOUDSDK_CORE_PROJECT", "GCLOUD_PROJECT", "GOOGLE_CLOUD_PROJECT"]:
            print(f" - {var}: {os.environ.get(var)}")
            
        credentials, project = google.auth.default()
        print(f"\nDefault project: {project}")
        print(f"Credentials class: {credentials.__class__.__name__}")
        
        # If it's a ServiceAccountCredentials or similar, let's see if we can get email
        if hasattr(credentials, 'service_account_email'):
            print(f"Service Account Email: {credentials.service_account_email}")
        
        # If it's user credentials (e.g. from gcloud auth application-default login), try to get client info
        if hasattr(credentials, 'signer_email'):
            print(f"Signer/User Email: {credentials.signer_email}")
            
    except Exception as e:
        print(f"Error checking credentials: {e}")

if __name__ == "__main__":
    main()
