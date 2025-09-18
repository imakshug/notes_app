from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import os
from typing import List, Optional
import uvicorn

from database import get_db, engine, Base
from models import Note, User, Label
from schemas import (
    NoteCreate, NoteUpdate, NoteResponse, 
    UserCreate, UserLogin, UserResponse,
    LabelCreate, LabelResponse,
    LinkPreviewResponse,
    ForgotPasswordRequest, ResetPasswordRequest, MessageResponse
)
from auth import (
    get_current_user, create_access_token, verify_password, get_password_hash,
    create_password_reset_token, verify_password_reset_token, send_password_reset_email,
    PASSWORD_RESET_EXPIRE_MINUTES
)
from link_preview import get_link_preview
from file_handler import save_file, delete_file

app = FastAPI(
    title="Notes App API",
    description="FastAPI backend for React Notes App with themes and link previews",
    version="1.0.0"
)

# Create tables (with error handling)
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")
except Exception as e:
    print(f"⚠️ Database connection issue: {e}")
    print("App will start but database features may not work")

# CORS middleware - Production ready
allowed_origins = [
    "http://localhost:3000", 
    "http://localhost:5173",
    "http://localhost:5174", 
    "http://localhost:5175", 
    "http://localhost:5176", 
    "http://localhost:5177", 
    "http://localhost:5178", 
    "http://localhost:5179", 
    "http://localhost:5180", 
    "http://localhost:5181", 
    "http://localhost:5182"
]

# Add production origins from environment variable
production_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
allowed_origins.extend([origin.strip() for origin in production_origins if origin.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

@app.on_event("startup")
async def startup_event():
    print("🚀 Notes App API starting up...")
    print(f"📊 Environment: {os.getenv('ENVIRONMENT', 'development')}")
    print(f"🌐 Port: {os.getenv('PORT', '8000')}")
    print(f"🔗 Allowed Origins: {os.getenv('ALLOWED_ORIGINS', 'localhost only')}")

@app.get("/")
async def root():
    return {"message": "Notes App API", "version": "1.0.0", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint for Railway deployment."""
    try:
        # Test database connection
        db = next(get_db())
        db.execute("SELECT 1")
        db_status = "connected"
    except Exception as e:
        print(f"Database health check failed: {e}")
        db_status = "disconnected"
    
    return {
        "status": "healthy", 
        "message": "Notes App API is running",
        "database": db_status,
        "version": "1.0.0"
    }

# Authentication endpoints
@app.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = await get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token = create_access_token(data={"sub": db_user.email})
    
    return UserResponse(
        id=db_user.id,
        email=db_user.email,
        username=db_user.username,
        access_token=access_token
    )

@app.post("/auth/login", response_model=UserResponse)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    # Authenticate user
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not await verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token
    access_token = create_access_token(data={"sub": db_user.email})
    
    return UserResponse(
        id=db_user.id,
        email=db_user.email,
        username=db_user.username,
        access_token=access_token
    )

@app.post("/auth/forgot-password", response_model=MessageResponse)
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(User.email == request.email).first()
    if not db_user:
        # Don't reveal if email exists or not for security
        return MessageResponse(message="If the email exists, a password reset link has been sent.")
    
    # Create password reset token
    reset_token = create_password_reset_token(db_user.email)
    
    # Store token in database with expiry (optional, for tracking)
    db_user.reset_token = reset_token
    db_user.reset_token_expires = datetime.utcnow() + timedelta(minutes=PASSWORD_RESET_EXPIRE_MINUTES)
    db.commit()
    
    # Send email (in development, this will just print to console)
    email_sent = send_password_reset_email(db_user.email, reset_token)
    
    if not email_sent:
        raise HTTPException(status_code=500, detail="Failed to send password reset email")
    
    return MessageResponse(message="If the email exists, a password reset link has been sent.")

@app.post("/auth/reset-password", response_model=MessageResponse)
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    # Verify the reset token
    email = verify_password_reset_token(request.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Find user by email
    db_user = db.query(User).filter(User.email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Validate that the token matches (optional additional security)
    if db_user.reset_token != request.token:
        raise HTTPException(status_code=400, detail="Invalid reset token")
    
    # Check token expiry (additional check)
    if db_user.reset_token_expires and db_user.reset_token_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Reset token has expired")
    
    # Update password
    db_user.hashed_password = get_password_hash(request.new_password)
    db_user.reset_token = None
    db_user.reset_token_expires = None
    db.commit()
    
    return MessageResponse(message="Password has been reset successfully")

# Notes endpoints
@app.get("/notes", response_model=List[NoteResponse])
async def get_notes(
    skip: int = 0, 
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notes = db.query(Note).filter(Note.user_id == current_user.id).offset(skip).limit(limit).all()
    return notes

@app.post("/notes", response_model=NoteResponse)
async def create_note(
    note: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_note = Note(**note.dict(), user_id=current_user.id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.get("/notes/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@app.put("/notes/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: int,
    note_update: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    for key, value in note_update.dict(exclude_unset=True).items():
        setattr(note, key, value)
    
    db.commit()
    db.refresh(note)
    return note

@app.delete("/notes/{note_id}")
async def delete_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Delete associated files
    if note.image_url:
        delete_file(note.image_url)
    if note.audio_url:
        delete_file(note.audio_url)
    
    db.delete(note)
    db.commit()
    return {"message": "Note deleted successfully"}

# File upload endpoints
@app.post("/upload/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    file_url = await save_file(file, "images")
    return {"file_url": file_url}

@app.post("/upload/audio")
async def upload_audio(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be an audio file")
    
    file_url = await save_file(file, "audio")
    return {"file_url": file_url}

# Link preview endpoint
@app.get("/link-preview", response_model=LinkPreviewResponse)
async def get_link_preview_endpoint(url: str):
    try:
        preview = await get_link_preview(url)
        return preview
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch preview: {str(e)}")

# Labels endpoints
@app.get("/labels", response_model=List[LabelResponse])
async def get_labels(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    labels = db.query(Label).filter(Label.user_id == current_user.id).all()
    return labels

@app.post("/labels", response_model=LabelResponse)
async def create_label(
    label: LabelCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if label already exists
    existing = db.query(Label).filter(
        Label.name == label.name, 
        Label.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Label already exists")
    
    db_label = Label(**label.dict(), user_id=current_user.id)
    db.add(db_label)
    db.commit()
    db.refresh(db_label)
    return db_label

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)