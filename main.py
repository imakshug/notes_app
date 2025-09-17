# This is a monorepo with frontend and backend
# The backend is in the /backend directory
# Railway should deploy the FastAPI backend

from backend.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)