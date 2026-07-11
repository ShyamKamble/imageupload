from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
import psycopg2
from psycopg2.extras import RealDictCursor
import jwt
from datetime import datetime, timedelta
import os
from db_config import DB_CONFIG

router = APIRouter()
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Database helper
def get_db():
    conn = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
    return conn

# Initialize database
def init_db():
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')
    conn.commit()
    cursor.close()
    conn.close()

# Initialize on module load
init_db()

# Pydantic models
class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Helper functions
def verify_password(plain_password, hashed_password):
    # Truncate password to 72 bytes for bcrypt compatibility
    truncated = plain_password[:72] if isinstance(plain_password, str) else plain_password
    return pwd_context.verify(truncated, hashed_password)

def get_password_hash(password):
    # Truncate password to 72 bytes for bcrypt compatibility
    truncated = password[:72] if isinstance(password, str) else password
    return pwd_context.hash(truncated)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Routes
@router.post("/register", response_model=Token)
async def register(user: UserRegister):
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = %s OR username = %s", 
                      (user.email, user.username))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Hash password and create user
        hashed_password = get_password_hash(user.password)
        cursor.execute(
            "INSERT INTO users (email, username, password_hash) VALUES (%s, %s, %s) RETURNING id",
            (user.email, user.username, hashed_password)
        )
        user_id = cursor.fetchone()[0]
        conn.commit()
        
        # Create access token
        access_token = create_access_token(data={"sub": user.username, "user_id": user_id})
        
        return {"access_token": access_token, "token_type": "bearer"}
        
    except psycopg2.IntegrityError:
        conn.rollback()
        raise HTTPException(status_code=400, detail="User already exists")
    finally:
        cursor.close()
        conn.close()

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT id, username, password_hash FROM users WHERE username = %s", 
                      (user.username,))
        db_user = cursor.fetchone()
        
        if not db_user or not verify_password(user.password, db_user['password_hash']):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create access token
        access_token = create_access_token(
            data={"sub": db_user['username'], "user_id": db_user['id']}
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
        
    finally:
        cursor.close()
        conn.close()

@router.get("/me")
async def get_current_user_info(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        user_id = payload.get("user_id")
        
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, username, created_at FROM users WHERE username = %s", 
                      (username,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "id": user['id'],
            "email": user['email'],
            "username": user['username'],
            "created_at": user['created_at']
        }
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
