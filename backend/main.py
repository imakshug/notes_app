from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import os
from typing import List, Optional
import uvicorn

from database import get_db, engine, Base
from models import Note, User, Label
from schemas import (
    NoteCreate, NoteUpdate, NoteResponse, 
    UserCreate, UserLogin, UserResponse,
    LabelCreate, LabelResponse,
    LinkPreviewResponse
)
from auth import get_current_user, create_access_token, verify_password, get_password_hash
from link_preview import get_link_preview
from file_handler import save_file, delete_file

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Notes App API",
    description="FastAPI backend for React Notes App with themes and link previews",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:5178", "http://localhost:5179", "http://localhost:5180", "http://localhost:5181", "http://localhost:5182"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

@app.get("/")
async def root():
    return {"message": "Notes App API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

# Authentication endpoints
@app.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
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
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token
    access_token = create_access_token(data={"sub": db_user.email})
    
    return UserResponse(
        id=db_user.id,
        email=db_user.email,
        username=db_user.username,
        access_token=access_token
    )

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