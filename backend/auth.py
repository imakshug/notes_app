from datetime import datetime, timedelta
from typing import Optional
import secrets
import smtplib
import asyncio
from concurrent.futures import ThreadPoolExecutor
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from decouple import config

from database import get_db
from models import User

# Configuration
SECRET_KEY = config("SECRET_KEY", default="your-secret-key-here-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days
PASSWORD_RESET_EXPIRE_MINUTES = 30  # 30 minutes for password reset

# Email configuration
SMTP_SERVER = config("SMTP_SERVER", default="smtp.gmail.com")
SMTP_PORT = config("SMTP_PORT", default=587, cast=int)
SMTP_EMAIL = config("SMTP_EMAIL", default="")
SMTP_PASSWORD = config("SMTP_PASSWORD", default="")

# Password hashing (faster rounds for development)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=4)
security = HTTPBearer()

async def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as executor:
        return await loop.run_in_executor(executor, pwd_context.verify, plain_password, hashed_password)

async def get_password_hash(password: str) -> str:
    """Hash a password."""
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as executor:
        return await loop.run_in_executor(executor, pwd_context.hash, password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    """Verify JWT token and return email if valid."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None

def create_password_reset_token(email: str) -> str:
    """Create a password reset token."""
    expire = datetime.utcnow() + timedelta(minutes=PASSWORD_RESET_EXPIRE_MINUTES)
    to_encode = {"sub": email, "exp": expire, "type": "password_reset"}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_password_reset_token(token: str) -> Optional[str]:
    """Verify password reset token and return email if valid."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if email is None or token_type != "password_reset":
            return None
        return email
    except JWTError:
        return None

def send_password_reset_email(email: str, reset_token: str) -> bool:
    """Send password reset email to user."""
    try:
        # Create the email content
        subject = "Password Reset Request - Notes App"
        
        # For development, we'll just return True and log the token
        # In production, you would implement actual email sending
        print(f"Password reset token for {email}: {reset_token}")
        print(f"Reset link: http://localhost:5188/reset-password?token={reset_token}")
        
        # Uncomment below for actual email sending in production
        # if not SMTP_EMAIL or not SMTP_PASSWORD:
        #     return False
        #     
        # msg = MIMEMultipart()
        # msg['From'] = SMTP_EMAIL
        # msg['To'] = email
        # msg['Subject'] = subject
        # 
        # reset_link = f"http://localhost:5188/reset-password?token={reset_token}"
        # body = f"""
        # Hello,
        # 
        # You have requested to reset your password. Please click the link below to reset your password:
        # 
        # {reset_link}
        # 
        # This link will expire in {PASSWORD_RESET_EXPIRE_MINUTES} minutes.
        # 
        # If you did not request this, please ignore this email.
        # 
        # Best regards,
        # Notes App Team
        # """
        # 
        # msg.attach(MIMEText(body, 'plain'))
        # 
        # server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        # server.starttls()
        # server.login(SMTP_EMAIL, SMTP_PASSWORD)
        # text = msg.as_string()
        # server.sendmail(SMTP_EMAIL, email, text)
        # server.quit()
        
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    email = verify_token(token)
    if email is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user (can extend with user.is_active check)."""
    return current_user