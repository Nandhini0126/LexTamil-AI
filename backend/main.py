from pathlib import Path
import json
from datetime import datetime, UTC
from uuid import uuid4
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

from ml.asr import asr_service
from ml.rag import rag_service

app = FastAPI(title="Lextamil AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AskRequest(BaseModel):
    query: str
    category: str | None = None

class SearchRequest(BaseModel):
    query: str
    category: str = "all"
    top_k: int = 6

class DraftRequest(BaseModel):
    scenario: str
    objective: str
    key_facts: str
    desired_relief: str
    language: str = "english"

class WorkspaceSaveRequest(BaseModel):
    title: str
    module: str
    query: str
    answer: str
    sources: list[dict[str, Any]] = Field(default_factory=list)
    notes: str | None = None

def _workspace_file() -> Path:
    p = Path(__file__).resolve().parent / "data" / "processed" / "workspace_sessions.json"
    p.parent.mkdir(parents=True, exist_ok=True)
    if not p.exists():
        p.write_text("[]", encoding="utf-8")
    return p

def _read_workspace() -> list[dict[str, Any]]:
    p = _workspace_file()
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Invalid workspace JSON: {p}") from e

    if not isinstance(data, list):
        raise RuntimeError(f"Workspace JSON must contain a list: {p}")
    return data

def _write_workspace(items: list[dict[str, Any]]) -> None:
    p = _workspace_file()
    p.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")

@app.get("/")
def root():
    return {"message": "Lextamil AI API running"}

@app.post("/api/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    text = await asr_service.transcribe_upload(audio)
    return {"text": text}

@app.post("/api/ask")
def ask(req: AskRequest):
    context = rag_service.retrieve(req.query, category=req.category)
    answer = rag_service.generate_answer(req.query, context)
    return {"answer": answer, "sources": context}

@app.post("/api/search")
def search(req: SearchRequest):
    top_k = max(1, min(req.top_k, 12))
    results = rag_service.retrieve(req.query, top_k=top_k, category=req.category, min_score=0.25)
    return {
        "results": [
            {
                "title": r["title"],
                "snippet": r["content"][:200],
                "content": r["content"],
                "category": r["category"],
                "section": r["section"],
                "score": r["score"],
                "dataset": r["dataset"],
            }
            for r in results
        ]
    }

@app.get("/api/datasets")
def datasets():
    return rag_service.get_dataset_overview()

@app.post("/api/draft")
def draft(req: DraftRequest):
    draft_text = rag_service.generate_draft(
        scenario=req.scenario,
        objective=req.objective,
        key_facts=req.key_facts,
        desired_relief=req.desired_relief,
        language=req.language,
    )
    return {"draft": draft_text}

@app.get("/api/workspace/sessions")
def list_workspace_sessions():
    sessions = _read_workspace()
    sessions.sort(key=lambda s: s.get("created_at", ""), reverse=True)
    return {"sessions": sessions}

@app.post("/api/workspace/sessions")
def create_workspace_session(req: WorkspaceSaveRequest):
    sessions = _read_workspace()
    session = {
        "id": str(uuid4()),
        "created_at": datetime.now(UTC).isoformat(),
        "title": req.title,
        "module": req.module,
        "query": req.query,
        "answer": req.answer,
        "sources": req.sources,
        "notes": req.notes or "",
    }
    sessions.append(session)
    _write_workspace(sessions)
    return {"saved": True, "session": session}

@app.delete("/api/workspace/sessions/{session_id}")
def delete_workspace_session(session_id: str):
    sessions = _read_workspace()
    remaining = [s for s in sessions if s.get("id") != session_id]
    _write_workspace(remaining)
    return {"deleted": len(remaining) != len(sessions)}

@app.get("/api/workspace/export")
def export_workspace_report():
    sessions = _read_workspace()
    lines = ["Lextamil AI Workspace Report", "============================", ""]
    for i, session in enumerate(sessions, start=1):
        lines.append(f"{i}. {session.get('title', 'Untitled')} [{session.get('module', 'unknown')}]")
        lines.append(f"   Time: {session.get('created_at', '-')}")
        lines.append(f"   Query: {session.get('query', '-')}")
        lines.append("   Output:")
        answer = str(session.get("answer", "")).strip().replace("\n", "\n   ")
        lines.append(f"   {answer}")
        source_count = len(session.get("sources", []))
        lines.append(f"   Sources saved: {source_count}")
        notes = str(session.get("notes", "")).strip()
        if notes:
            lines.append(f"   Notes: {notes}")
        lines.append("")
    return {"count": len(sessions), "report": "\n".join(lines)}