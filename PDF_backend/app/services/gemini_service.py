import requests
from app.config import GEMINI_API_KEY

URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

def ask_gemini(context, question):
    payload = {
        "contents": [{
            "parts": [{
                "text": f"""
You are a legal assistant.
Answer only from the given PDF content.

PDF CONTENT:
{context}

QUESTION:
{question}
"""
            }]
        }]
    }

    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY
    }

    try:
        res = requests.post(URL, json=payload, headers=headers)
        res.raise_for_status()
        
        response_data = res.json()
        
        if "error" in response_data:
            error_msg = response_data["error"].get("message", "Unknown error")
            raise Exception(f"API Error: {error_msg}")
        
        if "candidates" not in response_data:
            raise Exception(f"Invalid API response: Missing 'candidates'. Response: {response_data}")
        
        if not response_data["candidates"]:
            raise Exception("API returned empty candidates list")
        
        answer = response_data["candidates"][0]["content"]["parts"][0]["text"]
        return answer
        
    except requests.exceptions.RequestException as e:
        raise Exception(f"Request failed: {str(e)}")
    except (KeyError, IndexError) as e:
        raise Exception(f"Failed to parse API response: {str(e)}")
    except Exception as e:
        raise Exception(f"Error from Gemini API: {str(e)}")
