# Railway deployment entry point - minimal version
from fastapi import FastAPI
import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Create a minimal FastAPI app for testing

app = FastAPI(title="Notes App API - Minimal", version="1.0.0")


@app.get("/")
async def root():
    return {"message": "Notes App API - Railway Test", "status": "online"}


@app.get("/health")
async def health():
    return {"status": "healthy", "environment": "railway"}

# Export the app so uvicorn can find it
__all__ = ['app']
