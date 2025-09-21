#!/usr/bin/env python3
"""
Production startup script for Notes App Backend
"""
import os
import uvicorn
from main import app

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")

    # Production configuration
    uvicorn.run(
        app,
        host=host,
        port=port,
        log_level="info",
        access_log=True,
        use_colors=True,
        server_header=False,
        date_header=False
    )
