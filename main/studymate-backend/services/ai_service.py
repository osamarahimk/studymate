# services/ai_service.py
import google.generativeai as genai
from google.cloud import texttospeech
import pdfplumber
import io
import os

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

# Configure Google Cloud Text-to-Speech
# Make sure GOOGLE_APPLICATION_CREDENTIALS points to your service account key file
tts_client = texttospeech.TextToSpeechClient()

def extract_text_from_pdf(file_bytes: bytes) -> str:
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

async def summarize_text(text: str) -> str:
    prompt = f"Summarize the following academic text concisely:\n\n{text}"
    response = await model.generate_content_async(prompt)
    return response.text

async def explain_text(text: str) -> str:
    prompt = f"Explain the following academic content in simple terms:\n\n{text}"
    response = await model.generate_content_async(prompt)
    return response.text

async def generate_mcqs(text: str, num_questions: int = 5) -> list:
    prompt = f"Generate {num_questions} multiple-choice questions (MCQs) from the following academic text. For each question, provide 4 options (A, B, C, D) and indicate the correct answer.\n\n{text}"
    response = await model.generate_content_async(prompt)
    # You'll need to parse this response to extract questions, options, and answers
    return response.text.split('\n\n') # Example: Further parsing needed

async def text_to_speech(text: str) -> bytes:
    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(language_code="en-US", ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL)
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
    response = tts_client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
    return response.audio_content