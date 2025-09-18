# Railway deployment entry point
import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Import the FastAPI app from backend.main
try:
    from main import app
    print("✅ Successfully imported FastAPI app")
except ImportError as e:
    print(f"❌ Failed to import app: {e}")
    raise

# Export the app so uvicorn can find it
__all__ = ['app']