import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.app.config import settings
from backend.app.db.database import init_db
from backend.app.db.seed_data import seed_demo_data
from backend.app.api import voice, documents, medicines, family, timeline, profile

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="A Multilingual, Voice-First AI Healthcare Accessibility Companion powered by Sarvam AI."
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event: Initialize SQLite and seed data
@app.on_event("startup")
def on_startup():
    init_db()
    seed_demo_data()

# Register API Routers
app.include_router(voice.router, prefix="/api")
app.include_router(documents.router, prefix="/api")
app.include_router(medicines.router, prefix="/api")
app.include_router(family.router, prefix="/api")
app.include_router(timeline.router, prefix="/api")
app.include_router(profile.router, prefix="/api")

# Static uploads directory
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

# Frontend directory
FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "public"

if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")

    @app.get("/")
    async def serve_index():
        return FileResponse(FRONTEND_DIR / "index.html")

    @app.get("/manifest.json")
    async def serve_manifest():
        return FileResponse(FRONTEND_DIR / "manifest.json")

    @app.get("/sw.js")
    async def serve_sw():
        return FileResponse(FRONTEND_DIR / "sw.js", media_type="application/javascript")
