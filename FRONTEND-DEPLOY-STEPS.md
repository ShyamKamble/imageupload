# Frontend Deployment Steps

## 1️⃣ Rebuild Frontend with New Backend URL

```powershell
# Clean build
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Build with new API URL
npm run build
```

## 2️⃣ Upload to S3

**Open the `out` folder and select ALL contents:**
- index.html
- 404.html  
- _next/ folder
- login/ folder
- for-you/ folder
- All other files

**Drag and drop to S3 bucket root (NOT the out folder itself)**

Your S3 structure should be:
```
s3://aws-bucket-frontend-pages/
├── index.html
├── 404.html
├── login/
│   └── index.html
├── for-you/
│   ├── index.html
│   └── index/
│       └── index.html
└── _next/
    └── static/
        ├── css/
        └── js/
```

## 3️⃣ Verify S3 Website Configuration

Ensure static website hosting is enabled:
- Index document: `index.html`
- Error document: `404.html`

## 4️⃣ Update Backend on EC2

```bash
# SSH to EC2
ssh -i your-key.pem ec2-user@13.233.12.14

# Navigate to backend
cd ~/imageupload/backend

# Pull latest changes (with updated CORS)
git pull origin main

# Restart backend service
sudo systemctl restart backend

# Or if running manually:
# Kill the process and restart
pkill -f uvicorn
uvicorn app:app --host 0.0.0.0 --port 8000 &
```

## 5️⃣ Test Everything

### Test Backend API:
```bash
# Health check
curl http://13.233.12.14:8000/health

# Root endpoint
curl http://13.233.12.14:8000/
```

### Test Frontend:
Open in browser:
```
http://aws-bucket-frontend-pages.s3-website-ap-south-1.amazonaws.com
```

### Test Authentication Flow:
1. Click "Sign In" (should go to /login)
2. Try to register a new user
3. Try to login
4. Upload an image
5. View images in "For You" section

## 🔍 Debugging

### Check Browser Console (F12):
- Look for CORS errors
- Check Network tab for failed API calls
- Verify API calls go to: `http://13.233.12.14:8000`

### Check Backend Logs:
```bash
sudo journalctl -u backend -f
```

## ✅ Configuration Summary

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://13.233.12.14:8000
```

**Backend (app.py):**
```python
allow_origins=[
    "http://aws-bucket-frontend-pages.s3-website-ap-south-1.amazonaws.com",
    "http://localhost:3000",
    "*"
]
```

**Backend Environment (.env on EC2):**
```env
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your-bucket
SECRET_KEY=your-jwt-secret
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password
```

## 🚀 Files to Upload

**To GitHub (backend):**
- backend/app.py (updated CORS)

**To S3 (frontend):**
- All contents of `out/` folder after rebuild
