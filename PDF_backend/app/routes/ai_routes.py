from fastapi import APIRouter
from app.services.gemini_service import ask_gemini, summarize_pdf, build_document_analysis

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/ask")
async def ask_question(data: dict):
    try:
        context = data.get("context", "") or ""
        question = data.get("question", "") or "Summarize this PDF"

        # limit context size to avoid huge payloads and API failures
        max_len = 150_000  # characters (~20k tokens)
        if len(context) > max_len:
            # log truncation
            logger = __import__('logging').getLogger(__name__)
            logger.warning(f"Context length {len(context)} exceeds {max_len}, truncating")
            context = context[:max_len] + "\n...[truncated]"

        answer = ask_gemini(context, question)
        return {"answer": answer}
    except Exception as e:
        return {
            "error": str(e),
            "answer": None
        }


@router.post("/summarize")
async def summarize_document(data: dict):
    try:
        context = data.get("context", "") or ""

        if not context.strip():
            return {
                "error": "PDF content is required for summarization",
                "summary": None
            }

        max_len = 150_000
        if len(context) > max_len:
            logger = __import__('logging').getLogger(__name__)
            logger.warning(f"Context length {len(context)} exceeds {max_len}, truncating")
            context = context[:max_len] + "\n...[truncated]"

        summary = summarize_pdf(context)
        analysis = build_document_analysis(context, summary)

        return {
            "summary": summary,
            "analysis": analysis
        }
    except Exception as e:
        return {
            "error": str(e),
            "summary": None,
            "analysis": None
        }
