"""
AI_GYM_FITNESS & ASSISTANT (PhysioRecover AI Edition)
Backend API Entrypoint

Author: P. Durga Naik
Project: Clinical Physical Therapy, Joint ROM Biomechanics & Smart Gym Assistant
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from create_tables import init_db
from routers.health import router as health_router
from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.workouts import router as workouts_router
from routers.nutrition import router as nutrition_router
from routers.buddy import router as buddy_router
from routers.habit import router as habit_router
from routers.planner import router as planner_router
from routers.iot import router as iot_router
from routers.analytics import router as analytics_router
from routers.media import router as media_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize all SQLAlchemy database tables and default seeds on startup
    init_db()
    yield


app = FastAPI(
    title="AI_GYM_FITNESS & ASSISTANT - PhysioRecover AI",
    description="Physical Rehabilitation, Joint Range-of-Motion (ROM), Injury Prevention & Smart Fitness Assistant API by P. Durga Naik",
    version="2.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------
# Production & Local CORS Configuration
# ---------------------------------------------------------
# Default allowed origins (Production Vercel + Local Development)
DEFAULT_ALLOWED_ORIGINS = [
    # Production Vercel Frontend Deployments
    "https://ai-gym-fitness-assistant-lsk5ipcd6-pathalavath.vercel.app",
    "https://ai-gym-fitness-assistant.vercel.app",
    # Local Development Frontend
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3002",
    # Local Development Backend
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

# Read optional environment-configured CORS origins
# Supported env vars: CORS_ORIGINS, ALLOWED_ORIGINS, FRONTEND_URL
env_cors = os.getenv("CORS_ORIGINS") or os.getenv("ALLOWED_ORIGINS") or os.getenv("FRONTEND_URL") or ""
parsed_origins = [
    origin.strip().rstrip("/")
    for origin in env_cors.split(",")
    if origin.strip()
]

# De-duplicate while preserving insertion order
allowed_origins = list(dict.fromkeys(DEFAULT_ALLOWED_ORIGINS + parsed_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^(http://(localhost|127\.0\.0\.1)(:\d+)?|https://.*\.vercel\.app)$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,
)


@app.get("/")
def root():
    return {
        "status": "online",
        "project": "AI_GYM_FITNESS & ASSISTANT (PhysioRecover AI)",
        "author": "P. Durga Naik",
        "message": "Physical Therapy, Biomechanical Range-of-Motion & Smart Gym Assistant API is fully operational.",
        "version": "2.0.0",
    }


app.include_router(health_router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(workouts_router)
app.include_router(nutrition_router)
app.include_router(buddy_router)
app.include_router(habit_router)
app.include_router(planner_router)
app.include_router(iot_router)
app.include_router(analytics_router)
app.include_router(media_router)