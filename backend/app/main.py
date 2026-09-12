from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.db import close_db, connect_db
from app.routers import catalog, commerce, products


@asynccontextmanager
async def lifespan(_app: FastAPI):
    await connect_db()
    yield
    await close_db()


settings = get_settings()
app = FastAPI(title="Boutique API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api")
app.include_router(catalog.router, prefix="/api")
app.include_router(commerce.router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok"}
