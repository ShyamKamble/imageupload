# Deployment Setup Guide

## Backend Configuration Changes ✅

### 1. CORS Configuration (`backend/app.py`)
Updated to allow connections from:
- `http://localhost:3000` (local development)
- `http://13.126.105.133:3000` (EC2 frontend)
- `*` (all origins - for testing, restrict in production)

### 2. Backend API Endpoints
Your backend is running on: **http://13.126.105.133:8000**

**Authentication Routes:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

**Image Routes:**
- `POST /api/images/upload` - Upload image
- `GET /api/images` - Get all user images
- `DELETE /api/images/{image_id}` - Delete image
- `POST /api/images/presigned-upload` - Get presigned URL for direct upload

## Frontend Configuration Changes ✅

### 1. API Configuration (`src/lib/api.js`)
Fixed to match backend endpoints:
- Changed base URL from `/api` to root
- Updated login/register to match backend request format
- Fixed image upload endpoints
- Added proper JWT token handling

### 2. Environment Variables (`.env.local`)
Created with backend URL:
```env
NEXT_PUBLIC_API_URL=http://13.126.105.133:8000
```

## Testing Checklist

### Backend Testing
```bash
# Test health check
curl http://13.126.105.133:8000/health

# Test root endpoint
curl http://13.126.105.133:8000/

# Test register
curl -X POST http://13.126.105.133:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"testpass123"}'

# Test login
curl -X POST http://13.126.105.133:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

### Frontend Testing
1. Start your Next.js frontend:
   ```bash
   npm run dev
   ```

2. Open browser to `http://localhost:3000`

3. Test:
   - User registration
   - User login
   - Image upload
   - View images
   - Delete images

## Deployment Steps

### Backend (EC2)
1. SSH to your EC2 instance:
   ```bash
   ssh -i your-key.pem ec2-user@13.126.105.133
   ```

2. Install dependencies:
   ```bash
   cd /path/to/backend
   pip install -r requirements.txt
   ```

3. Create `.env` file with credentials:
   ```env
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   AWS_REGION=ap-south-1
   S3_BUCKET_NAME=your-bucket-name
   SECRET_KEY=your-jwt-secret
   DB_HOST=your-db-host
   DB_NAME=image_app
   DB_USER=postgres
   DB_PASSWORD=your-password
   DB_PORT=5432
   ```

4. Run with uvicorn:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000
   ```

   Or use systemd service for production

### Frontend (Local or EC2)
1. Install dependencies:
   ```bash
   npm install
   ```

2. Update `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://13.126.105.133:8000
   ```

3. Build and run:
   ```bash
   npm run build
   npm start
   ```

## Security Notes

### For Production:
1. **CORS**: Update `allow_origins` in `backend/app.py` to specific domains only
2. **HTTPS**: Use SSL certificates (Let's Encrypt) for both frontend and backend
3. **Environment Variables**: Never commit `.env` files
4. **AWS Credentials**: Rotate regularly and use IAM roles when possible
5. **JWT Secret**: Use a strong, random secret key
6. **Database**: Use RDS with proper security groups

### Security Groups (AWS)
Ensure these ports are open:
- **8000**: Backend API (or use nginx reverse proxy on 80/443)
- **3000**: Frontend (or use nginx reverse proxy on 80/443)
- **5432**: PostgreSQL (only from backend security group)

## Troubleshooting

### CORS Errors
- Check backend CORS configuration
- Verify frontend is using correct API URL
- Check browser console for specific errors

### Authentication Errors
- Verify JWT token is being stored in localStorage
- Check token format matches backend expectations
- Verify SECRET_KEY matches between frontend and backend

### Image Upload Errors
- Verify AWS credentials are correct
- Check S3 bucket permissions
- Verify bucket name in `.env` file
- Check S3 bucket CORS configuration

### Database Errors
- Verify PostgreSQL is running
- Check database credentials
- Verify security group allows connection
- Check database tables are created

## Next Steps

1. ✅ Backend CORS configured
2. ✅ Frontend API endpoints fixed
3. ⚠️ Test the complete flow locally
4. ⚠️ Deploy backend to EC2 with proper .env file
5. ⚠️ Set up systemd service for backend
6. ⚠️ Set up nginx reverse proxy (optional)
7. ⚠️ Configure HTTPS with Let's Encrypt
8. ⚠️ Deploy frontend (S3 + CloudFront or EC2)
