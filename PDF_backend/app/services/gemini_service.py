import requests
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
