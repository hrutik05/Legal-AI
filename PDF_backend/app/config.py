import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[1]
APP_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")
load_dotenv(APP_DIR / ".env", override=True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_FALLBACK_MODELS = [
	model.strip()
	for model in os.getenv(
		"GEMINI_FALLBACK_MODELS",
		"gemini-1.5-flash-latest,gemini-1.5-flash-8b,gemini-2.0-flash"
	).split(",")
	if model.strip()
]
GEMINI_TIMEOUT_SECONDS = int(os.getenv("GEMINI_TIMEOUT_SECONDS", "60"))
PDF_DIR = "app/storage/pdfs"
TEXT_DIR = "app/storage/extracted_text"
