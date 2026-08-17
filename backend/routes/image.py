from dotenv import load_dotenv

# Load environment variables FIRST before any other imports
load_dotenv()

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import boto3
import psycopg2
from psycopg2.extras import RealDictCursor
import uuid
import os
import jwt
import logging
import io
from botocore.exceptions import ClientError
from db_config import DB_CONFIG

router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger(__name__)

# Image MIME types mapping
IMAGE_MIME_TYPES = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/gif': ['gif'],
    'image/webp': ['webp'],
    'image/bmp': ['bmp'],
    'image/svg+xml': ['svg']
}

# AWS S3 Configuration - ONLY from environment variables
s3_client = boto3.client('s3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION', 'ap-south-1')
)

BUCKET_NAME = os.getenv('S3_BUCKET_NAME')
if not BUCKET_NAME:
    raise ValueError("S3_BUCKET_NAME environment variable is required")

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is required")
ALGORITHM = "HS256"

# Database initialization
def init_db():
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users_images_table (
        image_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        file_name VARCHAR(255),
        s3_key VARCHAR(500) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_user_images ON users_images_table(user_id);
    CREATE INDEX IF NOT EXISTS idx_s3_key_images ON users_images_table(s3_key);
    ''')
    conn.commit()
    cursor.close()
    conn.close()

def get_db():
    try:
        conn = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
        return conn
    except psycopg2.OperationalError as e:
        raise HTTPException(
            status_code=503, 
            detail="Database connection failed. Please try again later."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail="Database error occurred"
        )

# Initialize database on module load
init_db()

# Auth helper
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        username = payload.get("sub")
        
        if user_id is None or username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return {"user_id": user_id, "username": username}
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def create_presigned_url(bucket_name, object_name, expiration=3600):
    try:
        response = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': object_name},
            ExpiresIn=expiration
        )
        return response 
    except ClientError as e:
        logger.error(f"Error generating presigned URL: {e}")
        return None

# Routes
@router.post("/images/upload")
async def upload_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload image to S3 and save metadata to database"""
    user_id = current_user["user_id"]
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Validate file size (limit to 10MB)
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()  # Get position (file size)
    file.file.seek(0)  # Reset to beginning
    
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB in bytes
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400, 
            detail=f"File too large. Maximum size is 10MB, your file is {file_size / (1024*1024):.2f}MB"
        )
    
    # Generate unique filename with validated extension
    ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'}
    file_extension = file.filename.split('.')[-1].lower() if '.' in file.filename else 'jpg'
    
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file extension. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    s3_key = f"users/user_{user_id}/{unique_filename}"
    
    try:
        # Upload to S3
        s3_client.upload_fileobj(
            file.file,
            BUCKET_NAME,
            s3_key,
            ExtraArgs={"ContentType": file.content_type}
        )
        
        # Generate presigned URL
        presigned_url = create_presigned_url(BUCKET_NAME, s3_key)
        
        # Save metadata to database
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            '''INSERT INTO users_images_table (user_id, file_name, s3_key) 
               VALUES (%s, %s, %s) RETURNING image_id''',
            (user_id, file.filename, s3_key)
        )
        image_id = cursor.fetchone()['image_id']
        conn.commit()
        conn.close()
        
        return {
            "image_id": image_id,
            "file_name": file.filename,
            "s3_key": s3_key,
            "url": presigned_url,
            "message": "Image uploaded successfully"
        }
        
    except Exception as e:
        logger.error(f"Error uploading image: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/images")
async def get_all_images(
    limit: int = 50, 
    offset: int = 0,
    current_user: dict = Depends(get_current_user)
):
    """Get paginated images for the current user"""
    user_id = current_user["user_id"]
    
    # Validate pagination params
    if limit < 1 or limit > 100:
        raise HTTPException(status_code=400, detail="Limit must be between 1 and 100")
    if offset < 0:
        raise HTTPException(status_code=400, detail="Offset must be non-negative")
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Get total count
        cursor.execute(
            'SELECT COUNT(*) FROM users_images_table WHERE user_id = %s',
            (user_id,)
        )
        total_count = cursor.fetchone()['count']
        
        # Get paginated images
        cursor.execute(
            '''SELECT image_id, file_name, s3_key, created_at 
               FROM users_images_table 
               WHERE user_id = %s 
               ORDER BY created_at DESC
               LIMIT %s OFFSET %s''',
            (user_id, limit, offset)
        )
        db_images = cursor.fetchall()
        conn.close()
        
        # Generate presigned URLs for each image
        result = []
        for img in db_images:
            presigned_url = create_presigned_url(BUCKET_NAME, img['s3_key'])
            if presigned_url:
                result.append({
                    "id": img['image_id'],
                    "fileName": img['file_name'],
                    "url": presigned_url,
                    "s3_key": img['s3_key'],
                    "created_at": img['created_at'].isoformat() if img['created_at'] else None
                })
        
        return {
            "images": result, 
            "count": len(result),
            "total": total_count,
            "limit": limit,
            "offset": offset,
            "hasMore": (offset + len(result)) < total_count
        }
        
    except Exception as e:
        logger.error(f"Error fetching images: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch images: {str(e)}")

@router.delete("/images/{image_id}")
async def delete_image(image_id: int, current_user: dict = Depends(get_current_user)):
    """Delete image from S3 and database"""
    user_id = current_user["user_id"]
    
    try:
        # Get s3_key from database
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'SELECT s3_key FROM users_images_table WHERE image_id = %s AND user_id = %s',
            (image_id, user_id)
        )
        result = cursor.fetchone()
        
        if not result:
            conn.close()
            raise HTTPException(status_code=404, detail="Image not found")
        
        s3_key = result['s3_key']
        
        # Delete from S3
        s3_client.delete_object(Bucket=BUCKET_NAME, Key=s3_key)
        
        # Delete from database
        cursor.execute(
            'DELETE FROM users_images_table WHERE image_id = %s AND user_id = %s',
            (image_id, user_id)
        )
        conn.commit()
        conn.close()
        
        return {"message": "Image deleted successfully", "image_id": image_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting image: {e}")
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

@router.post("/delete-image")
async def delete_image_by_path(request: dict = Body(...), current_user: dict = Depends(get_current_user)):
    """Delete image by fullPath (for frontend compatibility)"""
    user_id = current_user["user_id"]
    full_path = request.get("fullPath")
    
    if not full_path:
        raise HTTPException(status_code=400, detail="fullPath is required")
    
    try:
        # Get image_id from s3_key
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'SELECT image_id, s3_key FROM users_images_table WHERE s3_key = %s AND user_id = %s',
            (full_path, user_id)
        )
        result = cursor.fetchone()
        
        if not result:
            conn.close()
            raise HTTPException(status_code=404, detail="Image not found")
        
        image_id = result['image_id']
        s3_key = result['s3_key']
        
        # Delete from S3
        s3_client.delete_object(Bucket=BUCKET_NAME, Key=s3_key)
        
        # Delete from database
        cursor.execute(
            'DELETE FROM users_images_table WHERE image_id = %s AND user_id = %s',
            (image_id, user_id)
        )
        conn.commit()
        conn.close()
        
        return {"message": "Image deleted successfully", "image_id": image_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting image by path: {e}")
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

@router.post("/images/presigned-upload")
async def generate_presigned_upload(
    file_name: str = Form(...),
    content_type: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    """Generate presigned URL for direct upload from frontend"""
    user_id = current_user["user_id"]
    
    # Generate unique filename
    file_extension = file_name.split('.')[-1] if '.' in file_name else 'jpg'
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    s3_key = f"users/user_{user_id}/{unique_filename}"
    
    try:
        presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': BUCKET_NAME,
                'Key': s3_key,
                'ContentType': content_type
            },
            ExpiresIn=3600
        )
        
        return {
            "uploadUrl": presigned_url,
            "s3_key": s3_key,
            "fileName": unique_filename
        }
        
    except Exception as e:
        logger.error(f"Error generating presigned URL: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate upload URL: {str(e)}")
