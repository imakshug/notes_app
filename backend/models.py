from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)

    # Password reset fields
    reset_token = Column(String(500), nullable=True)
    reset_token_expires = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    notes = relationship("Note", back_populates="user",
                         cascade="all, delete-orphan")
    labels = relationship("Label", back_populates="user",
                          cascade="all, delete-orphan")


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text)
    note_type = Column(String(50), default="text")  # text, checklist, drawing

    # Note properties
    is_pinned = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    color = Column(String(50), default="white")

    # Checklist items (JSON format)
    checklist_items = Column(JSON)

    # File attachments
    image_url = Column(String(500))
    audio_url = Column(String(500))
    drawing_data = Column(Text)  # Base64 encoded drawing

    # Reminders and mood
    reminder_time = Column(DateTime(timezone=True))
    detected_mood = Column(String(50))
    mood_confidence = Column(Float)

    # Links and labels
    link_url = Column(String(500))
    link_text = Column(String(255))
    labels = Column(JSON)  # Array of label names

    # Metadata
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="notes")


class Label(Base):
    __tablename__ = "labels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    color = Column(String(50), default="blue")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="labels")


class LinkPreview(Base):
    __tablename__ = "link_previews"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(500), unique=True, index=True, nullable=False)
    title = Column(String(500))
    description = Column(Text)
    image_url = Column(String(500))
    site_name = Column(String(255))

    # Cache metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_updated = Column(DateTime(timezone=True), onupdate=func.now())
    cache_expiry = Column(DateTime(timezone=True))  # TTL for cache
