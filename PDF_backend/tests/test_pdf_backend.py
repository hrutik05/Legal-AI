import io

import fitz
from fastapi.testclient import TestClient

from app.main import app
from app.services.gemini_service import build_document_analysis
from app.utils.chunker import chunk_text


client = TestClient(app)


def make_pdf_bytes(text: str) -> bytes:
    document = fitz.open()
    page = document.new_page()
    page.insert_text((72, 72), text)
    pdf_bytes = document.tobytes()
    document.close()
    return pdf_bytes


def test_root_endpoint_returns_service_message():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "PDF Legal Analyzer Backend"}


def test_health_endpoint_returns_healthy_status():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_pdf_upload_rejects_non_pdf_file():
    response = client.post(
        "/pdf/upload",
        files={"file": ("notes.txt", io.BytesIO(b"plain text"), "text/plain")},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "File must be a PDF"


def test_pdf_upload_extracts_text_from_valid_pdf():
    pdf_text = "This is a legal contract under Indian law."
    pdf_bytes = make_pdf_bytes(pdf_text)

    response = client.post(
        "/pdf/upload",
        files={"file": ("sample.pdf", io.BytesIO(pdf_bytes), "application/pdf")},
    )

    body = response.json()
    assert response.status_code == 200
    assert body["status"] == "success"
    assert pdf_text in body["text"]
    assert body["text_length"] > 0


def test_summarize_requires_pdf_content():
    response = client.post("/ai/summarize", json={"context": "   "})

    assert response.status_code == 200
    assert response.json() == {
        "error": "PDF content is required for summarization",
        "summary": None,
    }


def test_summarize_returns_summary_and_analysis_with_mocked_model(monkeypatch):
    from app.routes import ai_routes

    monkeypatch.setattr(ai_routes, "summarize_pdf", lambda context: "Short legal summary.")

    response = client.post(
        "/ai/summarize",
        json={"context": "Section 10 explains contract liability and damages under law."},
    )

    body = response.json()
    assert response.status_code == 200
    assert body["summary"] == "Short legal summary."
    assert body["analysis"]["document_stats"]["word_count"] > 0
    assert body["analysis"]["legal_relevance_percent"] > 0


def test_ask_question_returns_answer_with_mocked_model(monkeypatch):
    from app.routes import ai_routes

    monkeypatch.setattr(ai_routes, "ask_gemini", lambda context, question: "Mocked answer.")

    response = client.post(
        "/ai/ask",
        json={"context": "Article 21 protects life and liberty.", "question": "What is Article 21?"},
    )

    assert response.status_code == 200
    assert response.json() == {"answer": "Mocked answer."}


def test_chunk_text_splits_large_text():
    chunks = chunk_text("line one\nline two\nline three", chunk_size=10)

    assert len(chunks) >= 2
    assert all(chunk.strip() for chunk in chunks)


def test_build_document_analysis_returns_expected_metrics():
    analysis = build_document_analysis(
        "Contract law section liability damages court court.",
        "Contract liability summary.",
    )

    assert analysis["document_stats"]["word_count"] == 7
    assert analysis["compression_percent"] >= 0
    assert analysis["legal_relevance_percent"] > 0
    assert "important_factors" in analysis
