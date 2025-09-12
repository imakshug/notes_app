#!/usr/bin/env python3
"""
FastAPI Notes App Backend Startup Script
"""

import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is 3.8+"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ is required")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")

def install_dependencies():
    """Install Python dependencies"""
    print("📦 Installing dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
        print("✅ Dependencies installed")
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies")
        sys.exit(1)

def setup_environment():
    """Set up environment file"""
    env_file = Path(".env")
    env_example = Path(".env.example")
    
    if not env_file.exists() and env_example.exists():
        print("🔧 Creating .env file from example...")
        with open(env_example) as f:
            content = f.read()
        
        with open(env_file, "w") as f:
            f.write(content)
        print("✅ .env file created")
        print("⚠️  Please update .env with your actual configuration")
    elif env_file.exists():
        print("✅ .env file exists")
    else:
        print("⚠️  No .env.example found")

def create_directories():
    """Create necessary directories"""
    directories = ["uploads", "uploads/images", "uploads/audio", "uploads/thumbnails"]
    for dir_path in directories:
        Path(dir_path).mkdir(exist_ok=True)
    print("✅ Upload directories created")

def run_server():
    """Start the FastAPI server"""
    print("🚀 Starting FastAPI server...")
    print("📱 API will be available at: http://localhost:8000")
    print("📚 API docs will be available at: http://localhost:8000/docs")
    print("🔄 Press Ctrl+C to stop the server")
    
    try:
        import uvicorn
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except ImportError:
        print("❌ uvicorn not found. Please install dependencies first.")
        sys.exit(1)

def main():
    """Main startup function"""
    print("🎵 Notes App Backend Setup")
    print("=" * 30)
    
    check_python_version()
    install_dependencies()
    setup_environment()
    create_directories()
    run_server()

if __name__ == "__main__":
    main()