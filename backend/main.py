"""
AI_GYM_FITNESS & ASSISTANT (PhysioRecover AI Edition)
Backend API Entrypoint

Author: P. Durga Naik
Project: Clinical Physical Therapy, Joint ROM Biomechanics & Smart Gym Assistant
"""

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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