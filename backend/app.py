from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import jwt
import os
import logging
from datetime import datetime, timedelta
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from routes.auth import router as auth_router
from routes.image import router as image_router, get_current_user

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Validate required environment variables on startup
REQUIRED_ENV_VARS = [
    'SECRET_KEY',
    'AWS_ACCESS_KEY_ID', 
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'S3_BUCKET_NAME',
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD'
]

missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
if missing_vars:
    logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
    raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

logger.info("All required environment variables are set")

# Rate limiting
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Image Upload API",
    description="Secure image storage and management API with AWS S3 integration",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Environment-based CORS configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

if ENVIRONMENT == "production":
    allowed_origins = [
        "https://samsite.in",
        "https://www.samsite.in",
        "https://d3v8kbw6tdddzh.cloudfront.net",
        "http://aws-bucket-frontend-pages.s3-website.ap-south-1.amazonaws.com",
    ]
else:
    # Development - only allow localhost
    allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail, "status_code": exc.status_code}
    )

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(image_router, prefix="/api", tags=["Images"])

@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {
        "message": "Image Upload API",
        "version": "1.0.0",
        "environment": ENVIRONMENT,
        "endpoints": {
            "auth": "/auth",
            "images": "/api/images"
        }
    }

@app.get("/health")
async def health_check():
    """Comprehensive health check including dependencies"""
    logger.debug("Health check endpoint accessed")
    health_status = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "environment": ENVIRONMENT,
        "checks": {}
    }
    
    # Check database
    try:
        import psycopg2
        from db_config import DB_CONFIG
        conn = psycopg2.connect(**DB_CONFIG)
        conn.close()
        health_status["checks"]["database"] = "connected"
    except Exception as e:
        health_status["checks"]["database"] = f"error: {str(e)}"
        health_status["status"] = "unhealthy"
        logger.error(f"Database health check failed: {e}")
    
    # Check S3
    try:
        import boto3
        s3 = boto3.client('s3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION')
        )
        s3.head_bucket(Bucket=os.getenv('S3_BUCKET_NAME'))
        health_status["checks"]["s3"] = "accessible"
    except Exception as e:
        health_status["checks"]["s3"] = f"error: {str(e)}"
        health_status["status"] = "degraded"
        logger.warning(f"S3 health check failed: {e}")
    
    return health_status

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
