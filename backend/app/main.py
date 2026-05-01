from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import engine, Base
from app.routes.shop_routes import router as shop_router
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(shop_router)


@app.get("/")
def root():
    return {
        "message": f"{settings.PROJECT_NAME} v{settings.PROJECT_VERSION}",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}
