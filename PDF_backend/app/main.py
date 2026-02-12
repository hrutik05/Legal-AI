from fastapi import FastAPI
from app.routes import pdf_routes, ai_routes
from fastapi.middleware.cors import CORSMiddleware
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="PDF Legal Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pdf_routes.router)
app.include_router(ai_routes.router)

# ✅ FIX: Add health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "PDF Backend is running"}

@app.get("/")
async def root():
    return {"message": "PDF Legal Analyzer Backend"}

if __name__ == "__main__":
    logger.info("Starting PDF Backend...")
