# About Repositoy
Access to reliable legal information in India is frequently constrained by high consultation costs, complex statutory language, limited legal literacy, and inadequate multilingual support. These challenges disproportionately affect citizens in rural and semi-urban regions, who often remain unaware of fundamental legal rights and procedures. This paper presents the design and development of an AI-based legal chatbot that provides firstlevel legal guidance grounded in Indian laws. The proposed system integrates Natural Language Processing (NLP), retrieval-based information access, and Large Language Models (LLMs) to interpret user queries, retrieve relevant statutory provisions from verified Indian legal sources, and generate simplified, context-aware responses. Multilingual and voice-based interaction is supported to enhance accessibility for users with low literacy levels. Experimental evaluation demonstrates that the system achieves an accuracy of 82–87% in mapping queries to appropriate legal provisions, with an average response time of 2–4 seconds. The proposed solution aims to enhance legal awareness, promote digital inclusion, and complement existing legal aid mechanisms in India


###clone repo 
```bash
git clone https://github.com/hrutik05/Legal-AI.git
cd Legal-AI
```

### frontend setup 
create .env file and put in 
- VITE_API_BASE_URL=http://localhost:4000

```bash
cd frontend
npm install
npm  run dev
```

### chatbot_backend setup
```bash
cd chatbot_backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

### backend setup 
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
  npm install cors express dotenv mongoose helmet morgan rateLimit authRoutes GoogleGenerativeAI nodemon
  nodemon index.js
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
  
