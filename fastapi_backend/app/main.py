from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .utils import simple_generate_unique_route_id
from app.config import settings
from app.routes.action_detection import router as action_detection_router

app = FastAPI(
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

@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}
