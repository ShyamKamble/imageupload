from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import jwt
import os
from datetime import datetime, timedelta
from routes.auth import router as auth_router
from routes.image import router as image_router, get_current_user

app = FastAPI(title="Image Upload API")

# Environment-based CORS configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

if ENVIRONMENT == "production":
    allowed_origins = [
        "http://aws-bucket-frontend-pages.s3-website.ap-south-1.amazonaws.com",
    ]
else:
    allowed_origins = [
        "http://localhost:3000",
        "http://aws-bucket-frontend-pages.s3-website.ap-south-1.amazonaws.com",
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
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
