# Build & Deployment Checklist

## ✅ Completed Cleanup
- [x] Removed `@clerk/nextjs` from package.json
- [x] Removed `@supabase/supabase-js` from package.json
- [x] Deleted middleware.js (Clerk auth)
- [x] Deleted src/lib/superbaseClient.js
- [x] Deleted src/components/AuthUI.jsx
- [x] Deleted src/app/delete-image/route.js
- [x] Deleted src/app/images/route.js
- [x] Removed all Clerk imports from components
- [x] Removed all Supabase imports from components
- [x] Updated Navbar with custom auth
- [x] Configured Next.js for static export

## 📋 Before Building

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://13.126.105.133:8000
```
✅ File exists with correct configuration

### Backend (.env.production)
Required environment variables:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION
- S3_BUCKET_NAME
- SECRET_KEY (JWT secret)
- DB_HOST
- DB_PORT
- DB_NAME
- DB_USER
- DB_PASSWORD

⚠️ **WARNING**: Backend .env.production has placeholder values

## 🚀 Build Commands

### 1. Clean Install
```bash
rm -rf node_modules package-lock.json
npm install
```

### 2. Build Frontend
```bash
npm run build
```

### 3. Deploy to S3
```bash
aws s3 sync out/ s3://YOUR-BUCKET-NAME --delete
```

### 4. Invalidate CloudFront (if using)
```bash
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🔍 Potential Issues to Check

### 1. ⚠️ Backend Authentication
**Check**: Backend expects `username` for login (not email)
**Frontend**: ✅ Updated to send `username`

### 2. ⚠️ Image API Response Format
**Backend returns**:
```json
{
  "images": [
    {
      "id": 1,
      "fileName": "image.jpg",
      "url": "https://...",
      "s3_key": "...",
      "created_at": "..."
    }
  ]
}
```
**Frontend expects**: ✅ `data.images` array with `id`, `fileName`, `url`

### 3. ⚠️ CORS Configuration
**Backend** (backend/app.py):
```python
allow_origins=[
    "http://localhost:3000",
    "http://13.126.105.133:3000",
    "*"
]
```
✅ Configured for development

**Production**: Change `"*"` to specific domain

### 4. ⚠️ JWT Token Storage
**Frontend**: Uses `localStorage.getItem('authToken')`
**Backend**: Expects `Authorization: Bearer <token>`
✅ Both aligned

## 🔐 Security Checklist (Production)

### Frontend
- [ ] Update CORS to specific domain (not *)
- [ ] Use HTTPS URLs
- [ ] Set up CloudFront with HTTPS
- [ ] Add CSP headers

### Backend
- [ ] Replace placeholder AWS credentials
- [ ] Generate strong SECRET_KEY (min 32 chars)
- [ ] Remove DB password from .env.production (use secrets manager)
- [ ] Update CORS to whitelist only production domain
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Add logging

## 📊 Architecture

```
Frontend (Next.js Static)
    ↓
   S3 + CloudFront
    ↓
Backend (Python FastAPI)
    ↓
RDS PostgreSQL + S3
```

## ✅ All Systems Ready
- [x] Frontend: Next.js with custom auth
- [x] Backend: Python FastAPI with JWT
- [x] Database: PostgreSQL (RDS)
- [x] Storage: AWS S3
- [x] No external auth services (Clerk removed)
- [x] No external storage services (Supabase removed)

## 🐛 Known Issues
None - all Clerk and Supabase dependencies removed

## 📝 Notes
- Frontend uses `output: 'export'` for static S3 deployment
- Images are unoptimized (required for static export)
- Auth state managed via localStorage
- API calls go directly to Python backend
