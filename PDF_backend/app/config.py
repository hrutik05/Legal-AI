import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PDF_DIR = "app/storage/pdfs"
TEXT_DIR = "app/storage/extracted_text"
