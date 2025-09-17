import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPEx    async def _create_thumbnail(self, image_path: Path, filename: str):
        """Create thumbnail for image - temporarily disabled."""
        # TODO: Re-enable when Pillow is working
        return
        # try:
        #     with Image.open(image_path) as img:
        #         # Convert to RGB if necessary
        #         if img.mode in ('RGBA', 'P'):
        #             img = img.convert('RGB')
        #         
        #         # Create thumbnail
        #         img.thumbnail((300, 300), Image.Resampling.LANCZOS)rom pathlib import Path
# from PIL import Image  # Temporarily disabled for deployment
import io
from typing import Optional

# Configuration
UPLOAD_DIR = Path("uploads")
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_AUDIO_TYPES = {"audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/webm"}

# Create upload directories
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "images").mkdir(exist_ok=True)
(UPLOAD_DIR / "audio").mkdir(exist_ok=True)
(UPLOAD_DIR / "thumbnails").mkdir(exist_ok=True)

class FileHandler:
    def __init__(self):
        self.base_url = os.getenv("BASE_URL", "http://localhost:8000")
    
    async def save_file(self, file: UploadFile, file_type: str) -> str:
        """Save uploaded file and return URL."""
        # Validate file size
        file.file.seek(0, 2)  # Seek to end
        size = file.file.tell()
        file.file.seek(0)  # Reset position
        
        if size > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="File too large")
        
        # Validate content type
        if file_type == "images" and file.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail="Invalid image type")
        elif file_type == "audio" and file.content_type not in ALLOWED_AUDIO_TYPES:
            raise HTTPException(status_code=400, detail="Invalid audio type")
        
        # Generate unique filename
        file_extension = self._get_extension(file.filename, file.content_type)
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / file_type / unique_filename
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Create thumbnail for images
        if file_type == "images":
            await self._create_thumbnail(file_path, unique_filename)
        
        return f"{self.base_url}/files/{file_type}/{unique_filename}"
    
    def delete_file(self, file_url: str) -> bool:
        """Delete file from storage."""
        try:
            # Extract filename from URL
            filename = file_url.split("/")[-1]
            file_type = file_url.split("/")[-2]
            
            file_path = UPLOAD_DIR / file_type / filename
            if file_path.exists():
                file_path.unlink()
            
            # Delete thumbnail if exists
            if file_type == "images":
                thumb_path = UPLOAD_DIR / "thumbnails" / f"thumb_{filename}"
                if thumb_path.exists():
                    thumb_path.unlink()
            
            return True
        except Exception as e:
            print(f"Error deleting file: {e}")
            return False
    
    async def _create_thumbnail(self, image_path: Path, filename: str):
        """Create thumbnail for image."""
        try:
            with Image.open(image_path) as img:
                # Convert RGBA to RGB if necessary
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')
                
                # Create thumbnail
                img.thumbnail((300, 300), Image.Resampling.LANCZOS)
                
                # Save thumbnail
                thumb_path = UPLOAD_DIR / "thumbnails" / f"thumb_{filename}"
                img.save(thumb_path, "JPEG", quality=85)
        except Exception as e:
            print(f"Error creating thumbnail: {e}")
    
    def _get_extension(self, filename: Optional[str], content_type: str) -> str:
        """Get file extension from filename or content type."""
        if filename and "." in filename:
            return Path(filename).suffix.lower()
        
        # Fallback to content type
        type_map = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/gif": ".gif",
            "image/webp": ".webp",
            "audio/mpeg": ".mp3",
            "audio/wav": ".wav",
            "audio/ogg": ".ogg",
            "audio/mp4": ".mp4",
            "audio/webm": ".webm"
        }
        return type_map.get(content_type, ".bin")

# Service instance
file_handler = FileHandler()

async def save_file(file: UploadFile, file_type: str) -> str:
    """Public function to save file."""
    return await file_handler.save_file(file, file_type)

def delete_file(file_url: str) -> bool:
    """Public function to delete file."""
    return file_handler.delete_file(file_url)