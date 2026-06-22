# Deploy Frontend to S3

## ✅ Changes Made

- Removed Clerk authentication (replaced with Python backend auth)
- Removed Supabase (replaced with S3 for image storage)
- Configured for static export to S3
- Added Python backend API integration

## 📋 Prerequisites

1. AWS CLI installed and configured
2. Python backend running with the following endpoints:
   - `POST /api/auth/login` - Login
   - `POST /api/auth/register` - Register
   - `GET /api/images` - Get user images
   - `POST /api/images/upload-url` - Get S3 presigned URL
   - `POST /api/images/complete` - Complete upload
   - `DELETE /api/images/:id` - Delete image

## 🚀 Deploy to S3

### Step 1: Build the Static Site

```bash
npm run build
```

This creates an `out/` directory with all static files.

### Step 2: Create S3 Bucket

```bash
aws s3 mb s3://YOUR-BUCKET-NAME --region us-east-1
```

### Step 3: Enable Static Website Hosting

```bash
aws s3 website s3://YOUR-BUCKET-NAME \
  --index-document index.html \
  --error-document 404.html
```

### Step 4: Set Bucket Policy (Public Access)

Create `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

Apply the policy:

```bash
aws s3api put-bucket-policy \
  --bucket YOUR-BUCKET-NAME \
  --policy file://bucket-policy.json
```

### Step 5: Deploy Files to S3

```bash
aws s3 sync out/ s3://YOUR-BUCKET-NAME --delete
```

### Step 6: Access Your Website

```
http://YOUR-BUCKET-NAME.s3-website-us-east-1.amazonaws.com
```

## ⚙️ Configuration

### Environment Variables

Create `.env.local` for local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For production, set:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

**Note**: This variable is baked into the build, so rebuild after changing it.

## 🔄 Update Deployment

To update the site after changes:

```bash
npm run build
aws s3 sync out/ s3://YOUR-BUCKET-NAME --delete
```

## 📝 Python Backend Requirements

Your Python backend should:

1. **Handle authentication** with JWT tokens
2. **Generate S3 presigned URLs** for uploads
3. **Store image metadata** in database
4. **Serve image URLs** from S3

### Expected API Response Formats

**Login Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Get Upload URL Response:**
```json
{
  "uploadUrl": "https://s3-presigned-url",
  "fileUrl": "https://s3-public-url",
  "fileName": "unique-filename.jpg"
}
```

**Get Images Response:**
```json
[
  {
    "id": 1,
    "fileName": "image.jpg",
    "url": "https://s3-url/image.jpg",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

## 🚨 Important Notes

- Frontend stores auth token in `localStorage`
- API calls include `Authorization: Bearer <token>` header
- Images are uploaded directly to S3 using presigned URLs
- Backend should validate all operations

## 🔗 CloudFront (Optional)

For HTTPS and better performance:

1. Create CloudFront distribution pointing to S3 bucket
2. Update `NEXT_PUBLIC_API_URL` if backend is behind CloudFront
3. Configure custom domain via Route 53

## 📊 Cost Estimate

- S3 storage: ~$0.023/GB/month
- S3 requests: $0.0004 per 1,000 GET requests
- Data transfer: First 100GB free/month
- Typical cost: $1-5/month for small app

## ✨ Features

- ✅ Static export (no Node.js server needed)
- ✅ Python backend authentication
- ✅ S3 direct uploads via presigned URLs
- ✅ Image gallery with delete functionality
- ✅ Responsive design with dark mode
- ✅ Login/Register pages

## 🔧 Troubleshooting

### CORS Issues

If you get CORS errors, configure CORS on your S3 bucket:

```bash
aws s3api put-bucket-cors --bucket YOUR-BUCKET-NAME --cors-configuration file://cors.json
```

`cors.json`:
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### 404 on Page Refresh

Use CloudFront with custom error responses:
- Error code: 404
- Response page: `/index.html`
- Response code: 200

### API Not Connecting

Check:
1. `NEXT_PUBLIC_API_URL` is set correctly
2. Backend is running and accessible
3. CORS is enabled on backend
4. Network tab in browser console for errors
