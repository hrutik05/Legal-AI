# 📄 PDF Legal Analyzer

PDF Legal Analyzer that allows users to upload legal PDF documents, extract text, and ask AI-powered legal questions using the Gemini API.

This is part of project  built for learning and practical use, without FAISS or embeddings.

---

## 🚀 Features

- 📤 Upload legal PDF files  
- 📄 Extract text from PDF  
- 🤖 Ask legal questions using Gemini AI  
- ⏳ Loading indicators & error handling  
- 🎨 Clean and responsive UI with Tailwind CSS  

---

## 🛠 Tech Stack

### Backend
- FastAPI
- Python
- Uvicorn
- PyMuPDF (PDF text extraction)

### AI
- Google Gemini (Free API)

---

### 🔧 PDF-Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
GEMINI_API_KEY=your_gemini_api_key_here
uvicorn app.main:app --reload
```
---

### Important Notes
- Backend must be running before frontend
- Only PDF files are supported
- Gemini API key is required
- This project does NOT use FAISS or embeddings
