import fitz
import logging

logger = logging.getLogger(__name__)

def extract_text(file):
    """
    Extract text from PDF file
    ✅ FIX: Better error handling and logging
    """
    try:
        # Read file content
        file_content = file.file.read()
        
        if not file_content:
            raise ValueError("Empty PDF file")
        
        # Open PDF
        doc = fitz.open(stream=file_content, filetype="pdf")
        
        if doc.page_count == 0:
            raise ValueError("PDF has no pages")
        
        # Extract text from all pages
        pages = []
        for page_num in range(doc.page_count):
            try:
                page = doc[page_num]
                text = page.get_text()
                if text.strip():  # Only add non-empty pages
                    pages.append(text)
            except Exception as e:
                logger.warning(f"Error extracting page {page_num}: {str(e)}")
                continue
        
        doc.close()
        
        if not pages:
            raise ValueError("No text could be extracted from any page")
        
        return "\n\n".join(pages)
    
    except Exception as e:
        logger.error(f"PDF extraction error: {str(e)}")
        raise ValueError(f"PDF processing failed: {str(e)}")
