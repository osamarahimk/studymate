# services/auth_service.py
import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

# Initialize Firebase Admin SDK (only once)
# For local development: Point to your service account key JSON file
# For Cloud Run/Functions: Google Cloud credentials are often auto-detected
if not firebase_admin._apps:
    try:
        # Check if running in a Google Cloud environment or local
        if os.getenv("K_SERVICE"): # K_SERVICE is set in Cloud Run
             cred = credentials.ApplicationDefault()
        else:
             cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_PATH"))

        firebase_admin.initialize_app(cred)
    except ValueError as e:
        print(f"Firebase Admin SDK already initialized or error: {e}")
        pass # Already initialized or similar error

security = HTTPBearer()

async def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {e}")