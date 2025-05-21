from fastapi import FastAPI
from dotenv import load_dotenv
from app.api.v1.endpoints import router as api_router

load_dotenv()

app = FastAPI(title="Instagram Analytics API")

app.include_router(api_router, prefix="/api/v1")

