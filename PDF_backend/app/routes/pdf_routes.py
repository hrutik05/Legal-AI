from fastapi import APIRouter, UploadFile, HTTPException, status
from app.services.pdf_service import extract_text
import logging

router = APIRouter(prefix="/pdf", tags=["PDF"])
logger = logging.getLogger(__name__)

@router.post("/upload")
async def upload_pdf(file: UploadFile):
    try:
        # ✅ FIX: Validate file type
        if file.content_type != "application/pdf" and not file.filename.endswith(".pdf"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be a PDF"
            )
        
        if not file.file:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No file provided"
            )
        
        # ✅ FIX: Extract text with error handling
        text = extract_text(file)
        
        if not text or text.strip() == "":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Could not extract text from PDF. The PDF may be empty, scanned, or encrypted."
            )
        
        return {
            "status": "success",
            "message": "PDF received",
            "text": text,
            "text_length": len(text)
        }
    except HTTPException as e:
        logger.error(f"PDF upload HTTP error: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"PDF upload error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process PDF: {str(e)}"
        )
