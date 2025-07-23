# main.py
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from services.ai_service import extract_text_from_pdf, summarize_text, explain_text, generate_mcqs, text_to_speech
from services.db_service import get_documents_collection, get_discussions_collection
from services.auth_service import verify_firebase_token
from models.document import DocumentMetadata
from google.cloud import storage
import os
import io
from dotenv import load_dotenv
from datetime import datetime

load_dotenv() # Load environment variables from .env

app = FastAPI()

# CORS settings - adjust for production
origins = [
    "http://localhost:3000", # Your React app's local development URL
    "https://your-firebase-project-id.web.app", # Your Firebase Hosting URL
    "https://your-firebase-project-id.firebaseapp.com",
    # Add your custom domain if you have one
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Google Cloud Storage client (for interacting with Firebase Storage from backend)
# This assumes GOOGLE_APPLICATION_CREDENTIALS is set for your service account
storage_client = storage.Client()
bucket_name = os.getenv("FIREBASE_STORAGE_BUCKET_NAME") # e.g., your-project-id.appspot.com
bucket = storage_client.get_bucket(bucket_name)

@app.get("/")
async def root():
    return {"message": "StudyMate Backend is running!"}

# Endpoint for document upload
@app.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    title: str = "",
    subject: str = "",
    topic: str = "",
    user: dict = Depends(verify_firebase_token) # Authenticate user
):
    if not file.content_type in ["application/pdf", "image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDFs and images are allowed.")

    file_bytes = await file.read()
    user_id = user["uid"]
    file_name = f"{user_id}/{file.filename}" # Store under user's ID

    try:
        # Upload to Firebase Storage
        blob = bucket.blob(file_name)
        blob.upload_from_string(file_bytes, content_type=file.content_type)

        # Store metadata in MongoDB
        doc_meta = DocumentMetadata(
            title=title,
            subject=subject,
            topic=topic,
            storage_path=file_name,
            user_id=user_id,
            created_at=datetime.utcnow().isoformat()
        )
        get_documents_collection().insert_one(doc_meta.model_dump())

        return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Document uploaded successfully", "file_name": file_name})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload document: {e}")

# Endpoint to list documents
@app.get("/documents/list")
async def list_documents(user: dict = Depends(verify_firebase_token)):
    user_id = user["uid"]
    documents = list(get_documents_collection().find({"user_id": user_id}, {"_id": 0})) # Exclude MongoDB _id
    return JSONResponse(status_code=status.HTTP_200_OK, content={"documents": documents})

# AI Endpoints
@app.post("/ai/summarize")
async def summarize_document(storage_path: str, user: dict = Depends(verify_firebase_token)):
    try:
        blob = bucket.blob(storage_path)
        file_bytes = blob.download_as_bytes()
        text = extract_text_from_pdf(file_bytes)
        summary = await summarize_text(text)
        return JSONResponse(status_code=status.HTTP_200_OK, content={"summary": summary})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI summarization failed: {e}")

@app.post("/ai/explain")
async def explain_document(storage_path: str, user: dict = Depends(verify_firebase_token)):
    try:
        blob = bucket.blob(storage_path)
        file_bytes = blob.download_as_bytes()
        text = extract_text_from_pdf(file_bytes)
        explanation = await explain_text(text)
        return JSONResponse(status_code=status.HTTP_200_OK, content={"explanation": explanation})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI explanation failed: {e}")

@app.post("/ai/quiz")
async def generate_quiz(storage_path: str, num_questions: int = 5, user: dict = Depends(verify_firebase_token)):
    try:
        blob = bucket.blob(storage_path)
        file_bytes = blob.download_as_bytes()
        text = extract_text_from_pdf(file_bytes)
        quiz = await generate_mcqs(text, num_questions)
        return JSONResponse(status_code=status.HTTP_200_OK, content={"quiz": quiz})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI quiz generation failed: {e}")

@app.post("/ai/text-to-speech")
async def convert_text_to_speech(text: str, user: dict = Depends(verify_firebase_token)):
    try:
        audio_content = await text_to_speech(text)
        return StreamingResponse(io.BytesIO(audio_content), media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text-to-speech conversion failed: {e}")

# Discussion Board Endpoints (MongoDB)
@app.post("/discussions/{document_id}")
async def post_discussion_message(document_id: str, message: str, user: dict = Depends(verify_firebase_token)):
    user_id = user["uid"]
    user_name = user.get("name", user.get("email", "Anonymous")) # Get display name
    discussion_entry = {
        "document_id": document_id,
        "user_id": user_id,
        "user_name": user_name,
        "message": message,
        "timestamp": datetime.utcnow().isoformat()
    }
    get_discussions_collection().insert_one(discussion_entry)
    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Discussion posted"})

@app.get("/discussions/{document_id}")
async def get_discussion_messages(document_id: str, user: dict = Depends(verify_firebase_token)):
    messages = list(get_discussions_collection().find({"document_id": document_id}).sort("timestamp", 1))
    # Optional: Format messages for client, exclude _id
    return JSONResponse(status_code=status.HTTP_200_OK, content={"messages": messages})

# You'll need to define a Dockerfile and potentially a `cloudbuild.yaml` for deployment.