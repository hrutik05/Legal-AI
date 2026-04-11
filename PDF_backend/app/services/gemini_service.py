import requests
import re
from collections import Counter
from app.config import (
    GEMINI_API_KEY,
    GEMINI_MODEL,
    GEMINI_FALLBACK_MODELS,
    GEMINI_TIMEOUT_SECONDS,
)

API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"


def _build_url(model_name: str) -> str:
    return f"{API_BASE_URL}/{model_name}:generateContent"


def _extract_error_message(response: requests.Response) -> str:
    try:
        body = response.json()
    except Exception:
        body = None

    if isinstance(body, dict) and "error" in body:
        error = body.get("error") or {}
        code = error.get("code")
        status = error.get("status")
        message = error.get("message", "Unknown Gemini API error")
        return f"Gemini API Error ({code}, {status}): {message}"

    text_preview = (response.text or "").strip()
    if text_preview:
        return f"Gemini API Error ({response.status_code}): {text_preview[:500]}"

    return f"Gemini API Error ({response.status_code})"


def _generate_with_models(prompt_text: str) -> str:
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt_text
            }]
        }]
    }

    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY
    }

    models_to_try = [GEMINI_MODEL] + [m for m in GEMINI_FALLBACK_MODELS if m != GEMINI_MODEL]
    last_error = "Unknown Gemini API error"

    for model_name in models_to_try:
        try:
            response = requests.post(
                _build_url(model_name),
                json=payload,
                headers=headers,
                timeout=GEMINI_TIMEOUT_SECONDS,
            )

            if response.status_code >= 400:
                last_error = _extract_error_message(response)
                continue

            response_data = response.json()

            if "error" in response_data:
                api_error = response_data["error"].get("message", "Unknown Gemini API error")
                last_error = f"Gemini API Error: {api_error}"
                continue

            candidates = response_data.get("candidates") or []
            if not candidates:
                last_error = f"No candidates returned for model '{model_name}'"
                continue

            parts = ((candidates[0].get("content") or {}).get("parts") or [])
            if not parts or "text" not in parts[0]:
                last_error = f"Invalid response format for model '{model_name}'"
                continue

            return parts[0]["text"]

        except requests.exceptions.RequestException as exc:
            last_error = f"Request failed for model '{model_name}': {exc}"
        except Exception as exc:
            last_error = f"Error for model '{model_name}': {exc}"

    raise Exception(last_error)

def ask_gemini(context, question):
    if not GEMINI_API_KEY:
        raise Exception("GEMINI_API_KEY is missing in environment")

    prompt_text = f"""
You are a legal assistant.
Answer only from the given PDF content.

PDF CONTENT:
{context}

QUESTION:
{question}
"""

    return _generate_with_models(prompt_text)


def summarize_pdf(context: str) -> str:
    if not GEMINI_API_KEY:
        raise Exception("GEMINI_API_KEY is missing in environment")

    prompt_text = f"""
You are a legal assistant.
Summarize the provided PDF content in clear and simple language.
Keep the response focused on the document itself.

Return output in this structure:
1. Overview
2. Key points
3. Important legal sections/references (if present)
4. Actionable notes (if any)

PDF CONTENT:
{context}
"""

    return _generate_with_models(prompt_text)


def build_document_analysis(context: str, summary: str) -> dict:
    """
    Build lightweight analytics from extracted PDF text and generated summary.
    This keeps analysis deterministic and fast while still providing meaningful project metrics.
    """
    words = re.findall(r"\b\w+\b", context.lower())
    summary_words = re.findall(r"\b\w+\b", summary.lower())

    total_words = len(words)
    total_chars = len(context)
    summary_word_count = len(summary_words)

    # Percentage of original content represented by summary word count.
    summary_coverage_percent = round(
        (summary_word_count / total_words) * 100, 2
    ) if total_words else 0.0

    # Compression percentage communicates how much shorter the summary is.
    compression_percent = round(max(0.0, 100 - summary_coverage_percent), 2)

    legal_keywords = [
        "act", "section", "article", "court", "judge", "appeal", "petition", "plaintiff",
        "defendant", "evidence", "offence", "liability", "contract", "writ", "constitutional",
        "ipc", "crpc", "civil", "criminal", "statute", "tribunal", "clause", "provision", "law"
    ]

    keyword_counter = Counter(words)
    legal_hits = sum(keyword_counter.get(keyword, 0) for keyword in legal_keywords)
    legal_density = (legal_hits / total_words) if total_words else 0.0

    # Convert density to a bounded percent score for easy UI interpretation.
    legal_relevance_percent = round(min(100.0, legal_density * 1200), 2)

    heading_markers = len(re.findall(r"\n\s*([A-Z][A-Za-z\s]{3,}|\d+\.)\s*\n", context))
    structure_score_percent = round(min(100.0, heading_markers * 6 + 30), 2) if total_words else 0.0

    risk_terms = ["penalty", "imprisonment", "fine", "termination", "breach", "liability", "damages"]
    risk_term_hits = sum(keyword_counter.get(term, 0) for term in risk_terms)
    risk_intensity_percent = round(min(100.0, (risk_term_hits / max(1, total_words)) * 3000), 2)

    top_keywords = [
        token for token, count in keyword_counter.most_common(15)
        if len(token) > 3 and count > 1
    ][:5]

    estimated_reading_minutes = max(1, round(total_words / 220))

    important_factors = [
        {
            "name": "Legal Relevance",
            "score_percent": legal_relevance_percent,
            "description": "How strongly the document matches legal-domain language and references."
        },
        {
            "name": "Document Structure",
            "score_percent": structure_score_percent,
            "description": "Estimated clarity based on heading/section marker patterns."
        },
        {
            "name": "Risk Intensity",
            "score_percent": risk_intensity_percent,
            "description": "Presence of risk-related legal terms such as penalty, breach, or damages."
        },
    ]

    return {
        "summary_coverage_percent": summary_coverage_percent,
        "compression_percent": compression_percent,
        "legal_relevance_percent": legal_relevance_percent,
        "document_stats": {
            "word_count": total_words,
            "character_count": total_chars,
            "estimated_reading_minutes": estimated_reading_minutes,
        },
        "top_keywords": top_keywords,
        "important_factors": important_factors,
    }
