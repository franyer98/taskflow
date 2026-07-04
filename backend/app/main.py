from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine
from app.routers import auth, boards, tasks

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TaskFlow API",
    description="API REST del gestor de proyectos Kanban TaskFlow",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(boards.router)
app.include_router(tasks.router)


@app.get("/", tags=["health"])
def health():
    return {"status": "ok", "app": "TaskFlow API"}
