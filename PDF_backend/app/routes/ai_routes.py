from fastapi import APIRouter
from app.services.gemini_service import ask_gemini

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/ask")
async def ask_question(data: dict):
    try:
        answer = ask_gemini(data["context"], data["question"])
        return {"answer": answer}
    except Exception as e:
        return {
            "error": str(e),
            "answer": None
        }
