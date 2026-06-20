# Image Upload Backend API

FastAPI backend for image upload and management with AWS S3 and PostgreSQL.

## Features

- User authentication (register/login) with JWT
- Image upload to AWS S3
- Image management (list, delete)
- Presigned URLs for secure image access
- PostgreSQL database for metadata
- AWS Secrets Manager integration for RDS credentials

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your-bucket-name

# RDS Configuration (optional - will try Secrets Manager first)
SECRET_ID=rds-db-credentials

# JWT Secret
SECRET_KEY=your-super-secret-jwt-key

# Database Fallback (if Secrets Manager is not available)
DB_HOST=localhost
DB_NAME=image_app
DB_USER=postgres
DB_PASSWORD=your-password
DB_PORT=5432
```

### 3. Run the Application

```bash
# Using uvicorn directly
uvicorn app:app --reload

# Or using the run script
chmod +x run.sh
./run.sh
```

The API will be available at: `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

### Images
- `POST /api/images/upload` - Upload image
- `GET /api/images` - Get all user images
- `DELETE /api/images/{image_id}` - Delete image
- `POST /api/images/presigned-upload` - Get presigned URL for direct upload

### Health
- `GET /` - API information
- `GET /health` - Health check

## Security

- All credentials are loaded from environment variables
- JWT tokens for authentication
- Presigned URLs with expiration for S3 access
- CORS configured for frontend access

## Database Schema

### users
- id (SERIAL PRIMARY KEY)
- email (VARCHAR UNIQUE)
- username (VARCHAR UNIQUE)
- password_hash (VARCHAR)
- created_at (TIMESTAMP)

### users_images_table
- image_id (SERIAL PRIMARY KEY)
- user_id (INTEGER)
- file_name (VARCHAR)
- s3_key (VARCHAR UNIQUE)
- created_at (TIMESTAMP)
