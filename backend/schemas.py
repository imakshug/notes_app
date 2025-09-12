from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Any, Dict
from datetime import datetime

# User schemas
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    access_token: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Note schemas
class ChecklistItem(BaseModel):
    text: str
    completed: bool = False

class NoteCreate(BaseModel):
    title: str
    content: Optional[str] = None
    note_type: str = "text"
    is_pinned: bool = False
    is_archived: bool = False
    color: str = "white"
    checklist_items: Optional[List[ChecklistItem]] = None
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    drawing_data: Optional[str] = None
    reminder_time: Optional[datetime] = None
    link_url: Optional[str] = None
    link_text: Optional[str] = None
    labels: Optional[List[str]] = None

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    note_type: Optional[str] = None
    is_pinned: Optional[bool] = None
    is_archived: Optional[bool] = None
    color: Optional[str] = None
    checklist_items: Optional[List[ChecklistItem]] = None
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    drawing_data: Optional[str] = None
    reminder_time: Optional[datetime] = None
    detected_mood: Optional[str] = None
    mood_confidence: Optional[float] = None
    link_url: Optional[str] = None
    link_text: Optional[str] = None
    labels: Optional[List[str]] = None

class NoteResponse(BaseModel):
    id: int
    title: str
    content: Optional[str] = None
    note_type: str
    is_pinned: bool
    is_archived: bool
    color: str
    checklist_items: Optional[List[ChecklistItem]] = None
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    drawing_data: Optional[str] = None
    reminder_time: Optional[datetime] = None
    detected_mood: Optional[str] = None
    mood_confidence: Optional[float] = None
    link_url: Optional[str] = None
    link_text: Optional[str] = None
    labels: Optional[List[str]] = None
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Label schemas
class LabelCreate(BaseModel):
    name: str
    color: str = "blue"

class LabelResponse(BaseModel):
    id: int
    name: str
    color: str
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Link preview schemas
class LinkPreviewResponse(BaseModel):
    url: str
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    site_name: Optional[str] = None

    class Config:
        from_attributes = True

# File upload schemas
class FileUploadResponse(BaseModel):
    file_url: str
    filename: str
    content_type: str
    size: int

# Mood detection schemas
class MoodAnalysis(BaseModel):
    text: str
    mood: str
    confidence: float
    emotions: Dict[str, float]