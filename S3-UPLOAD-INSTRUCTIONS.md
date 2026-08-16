# Upload Frontend to S3 - Instructions

## ✅ Code Converted for S3 Static Hosting

### Changes Made:
1. ✅ Removed API proxy routes (deleted `/api/images` and `/api/delete-image`)
2. ✅ Enabled static export in `next.config.mjs`
3. ✅ Set `NEXT_PUBLIC_API_URL` to FastAPI backend
4. ✅ Built static `/out` folder

### Upload to S3:

**Method 1: AWS CLI**
```bash
aws s3 sync out/ s3://your-bucket-name/ --delete
aws s3 website s3://your-bucket-name/ --index-document index.html --error-document 404.html
```

**Method 2: AWS Console**
1. Go to S3 bucket
2. Upload all files from `/out` folder
3. Enable "Static website hosting" in bucket properties
4. Set index document: `index.html`
5. Set error document: `404.html`
6. Make bucket public (set bucket policy):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### CORS Configuration (Required):
Add CORS to your S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### Backend CORS Update:
Update `backend/app.py` to allow your S3 URL:

```python
allowed_origins = [
    "http://your-bucket-name.s3-website.region.amazonaws.com",
    "http://13.233.12.14:8000",
]
```

### Access Your Site:
- S3 URL: `http://your-bucket-name.s3-website-region.amazonaws.com`
- CloudFront (optional): Set up for HTTPS and CDN

### Environment Variables:
Ensure `.env.local` has:
```
NEXT_PUBLIC_API_URL=http://13.233.12.14:8000
```

### Test:
1. Upload `/out` folder to S3
2. Visit S3 website URL
3. Test login → should call FastAPI backend
4. Test image upload → should work via backend API

All frontend API calls now go directly to FastAPI backend (no Next.js server needed).
