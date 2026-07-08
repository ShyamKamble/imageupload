# Image Upload Backend API

FastAPI backend for user authentication and image management with AWS S3 and PostgreSQL.

## Features

- ✅ User authentication (register/login) with JWT
- ✅ Image upload to AWS S3
- ✅ Image management (list, delete)
- ✅ Presigned URLs for secure image access
- ✅ PostgreSQL database for user and image metadata
- ✅ CORS enabled for frontend integration

## Tech Stack

- **Framework:** FastAPI
- **Database:** PostgreSQL (AWS RDS)
- **Storage:** AWS S3
- **Authentication:** JWT (PyJWT)
- **Password Hashing:** Bcrypt (Passlib)

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region (e.g., ap-south-1)
- `S3_BUCKET_NAME` - S3 bucket name
- `SECRET_KEY` - JWT secret key (min 32 characters)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password

### 3. Run the Application

**Development:**
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

**Or use the run script:**
```bash
chmod +x run.sh
./run.sh
```

**Production:**
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at: `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "username": "username",
    "password": "password123"
  }
  ```

- `POST /auth/login` - Login user
  ```json
  {
    "username": "username",
    "password": "password123"
  }
  ```

- `GET /auth/me` - Get current user info (requires auth)

### Images
- `POST /api/images/upload` - Upload image (requires auth)
- `GET /api/images` - Get all user images (requires auth)
- `DELETE /api/images/{image_id}` - Delete image (requires auth)
- `POST /api/images/presigned-upload` - Get presigned URL for direct upload (requires auth)

### Health
- `GET /` - API information
- `GET /health` - Health check

## Database Schema

### users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### users_images_table
```sql
CREATE TABLE users_images_table (
    image_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    file_name VARCHAR(255),
    s3_key VARCHAR(500) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security

- Passwords hashed with bcrypt
- JWT tokens for authentication (24-hour expiry)
- Presigned URLs with 1-hour expiration
- CORS configured for specific origins
- User-specific S3 paths (users/user_{id}/)

## Project Structure

```
backend/
├── app.py                 # Main FastAPI application
├── db_config.py          # Database configuration
├── requirements.txt      # Python dependencies
├── run.sh               # Run script
├── .env.example         # Environment variables template
├── routes/
│   ├── __init__.py
│   ├── auth.py          # Authentication routes
│   └── image.py         # Image management routes
└── README.md
```

## CORS Configuration

Update `app.py` to restrict CORS origins in production:

```python
allow_origins=[
    "https://your-production-domain.com",
    "http://localhost:3000"  # Remove in production
]
```

## Deployment

### AWS EC2
1. Upload code to EC2
2. Install dependencies
3. Create `.env` file with production credentials
4. Run with uvicorn or use systemd service
5. Configure security groups (port 8000)
6. Use nginx as reverse proxy (recommended)

### Docker (Optional)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Testing

```bash
# Health check
curl http://localhost:8000/health

# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"test123"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

## License

MIT
