from contextlib import asynccontextmanager
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .utils import simple_generate_unique_route_id
from app.config import settings
from app.routes.action_detection import router as action_detection_router
from app.routes.chatbot import router as chatbot_router
from app.services.rag_engine import RAGEngine
import logging

logger = logging.getLogger(__name__)

def run_auto_ingestion():
    try:
        engine = RAGEngine()
        status = engine.get_status()
        
        # Only ingest if collections are empty to speed up normal restarts
        if status["asl_chunks"] == 0 and status["project_chunks"] == 0:
            logger.info("Database is empty. Auto-scanning and ingesting documents on startup...")
            engine.ingest_asl_documents()
            engine.ingest_project_files()
            logger.info("Startup auto-ingestion complete.")
        else:
            logger.info(f"Database already has data ({status['asl_chunks']} ASL, {status['project_chunks']} Project chunks). Skipping auto-ingestion.")
    except Exception as e:
        logger.error(f"Error during startup auto-ingestion check: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run auto ingestion in background to not block server startup
    asyncio.get_event_loop().run_in_executor(None, run_auto_ingestion)
    yield
    # Shutdown logic if needed

app = FastAPI(
    lifespan=lifespan,
    generate_unique_id_function=simple_generate_unique_route_id,
    openapi_url=settings.OPENAPI_URL,
)

# Middleware for CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(action_detection_router)
app.include_router(chatbot_router)

@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}
