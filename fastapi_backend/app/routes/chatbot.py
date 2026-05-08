from typing import List, Dict, Any, Optional
from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel, Field
from app.services.rag_engine import RAGEngine
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/v1/chatbot", tags=["chatbot"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1)
    history: List[ChatMessage] = []
    current_route: str = "/"

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]

class IngestRequest(BaseModel):
    target: str = Field(..., description="Target to ingest: 'asl', 'project', or 'all'")

@router.post("/ask", response_model=ChatResponse)
async def ask_question(request: ChatRequest):
    try:
        engine = RAGEngine()
        history_dicts = [{"role": msg.role, "content": msg.content} for msg in request.history]
        result = engine.ask(request.question, history_dicts, request.current_route)
        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"]
        )
    except Exception as e:
        logger.error(f"Error answering question: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while processing the question.")

@router.post("/ingest")
async def trigger_ingestion(request: IngestRequest, background_tasks: BackgroundTasks):
    engine = RAGEngine()
    
    def run_ingest(target: str):
        try:
            if target in ["asl", "all"]:
                engine.ingest_asl_documents()
            if target in ["project", "all"]:
                engine.ingest_project_files()
        except Exception as e:
            logger.error(f"Error during ingestion: {e}")

    if request.target not in ["asl", "project", "all"]:
        raise HTTPException(status_code=400, detail="Invalid target. Must be 'asl', 'project', or 'all'.")
        
    background_tasks.add_task(run_ingest, request.target)
    return {"message": f"Ingestion for {request.target} started in the background."}

@router.get("/status")
async def get_status():
    try:
        engine = RAGEngine()
        return engine.get_status()
    except Exception as e:
        logger.error(f"Error getting status: {e}")
        raise HTTPException(status_code=500, detail="Error getting RAG status.")
