# ⚖️ Legal AI Chatbot

## AI Chatbot for Legal Advice Based on Indian Laws

Legal AI Chatbot is an AI-powered web application designed to provide **first-level legal guidance based on Indian laws**. The system helps users understand legal concepts, rights, and procedures in a simple and accessible way.

The chatbot uses **Natural Language Processing (NLP)**, **retrieval-based search**, and **Large Language Models (LLMs)** to understand user queries, retrieve relevant legal information, and generate simplified responses.

---

## 📌 Project Overview

Access to reliable legal information in India is often limited due to:

- High consultation costs
- Complex legal terminology
- Low legal awareness
- Lack of multilingual support
- Limited access in rural and semi-urban regions

This project solves the problem by providing an intelligent chatbot that can answer legal queries related to Indian laws in a simple and user-friendly manner.

The system is designed to support:

- Legal query answering
- Indian law-based response generation
- Multilingual accessibility
- Voice-based interaction
- User authentication
- Document and PDF-based legal assistance

---

## 🎯 Objectives

- To provide basic legal guidance based on Indian laws.
- To simplify complex legal language for common users.
- To improve legal awareness among citizens.
- To support multilingual and voice-based interaction.
- To assist users in understanding legal rights and procedures.
- To build an AI-based legal assistant using NLP and LLM technologies.

---

## ✨ Key Features

- AI-powered legal chatbot
- Indian law-based legal query processing
- Gemini API integration
- NLP-based query understanding
- Retrieval-based legal information access
- User authentication using JWT
- MongoDB database integration
- PDF-based legal document Analyzer
- Responsive frontend interface
- API-based backend architecture
- SRS, synopsis, report, and research paper documentation included

---

## 🏗️ System Architecture

The project follows a modular architecture:

```text
User
 ↓
Frontend
 ↓
Node.js Backend
 ↓
Python NLP Backend
 ↓
Legal Dataset / MongoDB / Gemini API
 ↓
Response Generation
 ↓
User Interface
```



## 🚀 Installation and Setup

```bash
git clone https://github.com/hrutik05/Legal-AI.git
cd Legal-AI
```

### 🌐 Frontend setup 
create .env file and put in 
- VITE_API_BASE_URL= local_host_url

```bash
cd frontend
npm install
npm  run dev
```

### ⚙️ Chatbot_backend setup
```bash
cd chatbot_backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

### 📄 Backend setup 
create .env file and put this value 
```bash
- GEMINI_API_KEY="yours key"
- PYTHON_BACKEND_URL=http://localhost:8000
- VITE_API_BASE_URL=http://localhost:4000/api
- JWT_SECRET="secret-1234"
- JWT_EXPIRES_IN=
- MONGO_URI= "your's url"
- PORT=4000
```

  ```bash
  cd backend 
  npm install 
  nodemon index.js
  ```
 ### 📦 Required Node Packages

 ```bash 
 npm install cors express dotenv mongoose helmet morgan express-rate-limit nodemon nodemailer @google/generative-ai
 ```

### 🔧 PDF-Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
GEMINI_API_KEY=your_gemini_api_key_here
uvicorn app.main:app --reload
```
  
### 📘 Documentation
[Download SRS Report](/PDF/SRS_Report[1].pdf) <br>
[Download Final Synopsis](/PDF/final%20synopsis.pdf)<br>
[Download Sem 7 Report](/PDF/FINAL_REPORT_STAGE_1.pdf)<br>
[Download Research Paper](/PDF/Research_paper.pdf)

## 📊 Expected Performance

| Metric                 | Result                         |
| ---------------------- | ------------------------------ |
| Query Mapping Accuracy | 82% – 87%                      |
| Average Response Time  | 2 – 4 seconds                  |
| Supported Query Type   | Natural language legal queries |
| Response Format        | Simplified legal explanation   |

## ⚠️ Legal Disclaimer

This chatbot provides basic legal information and awareness only.
It does not replace professional legal advice from a qualified lawyer or legal expert.

For serious legal issues, users should consult a licensed advocate.

## ✅ Conclusion

Legal AI Chatbot is a practical AI-based solution that improves public access to legal information in India. By combining NLP, LLMs, legal datasets, and chatbot technology, the system helps users understand legal concepts in a simple, fast, and accessible manner.

## 👨‍💻 Author
Hrutik Wakale

Project: AI Chatbot for Legal Advice Based on Indian Laws
