# S3 Static Website Routing Fix

## Problem
Next.js static export creates `.html` files, but S3 static hosting doesn't automatically append `.html` to URLs, causing 404 errors.

## Changes Made

### 1. Separated Login and Signup Pages
- Created separate `/login` and `/signup` pages instead of toggle UI
- Updated all navigation links to use `.html` extensions:
  - `/login` → `/login.html`
  - `/signup` → `/signup.html`
  - `/for-you` → `/for-you.html`
  - `/` → `/index.html`

### 2. Updated Components
- **Navbar.jsx**: Added both "Sign In" and "Sign Up" buttons with `.html` paths
- **login/page.jsx**: Removed toggle, pure login page
- **signup/page.jsx**: New dedicated signup page
- **for-you/page.jsx**: Updated redirect to `/login.html`
- **api.js**: Updated all redirects to use `.html` extensions

### 3. Created 404 Handler
- Added `public/404.html` with client-side redirect logic
- Automatically appends `.html` to paths without extensions

## S3 Configuration Required

### Option 1: Configure Error Document (Recommended)
1. Go to S3 Console → Your bucket → Properties → Static website hosting
2. Set **Error document** to: `404.html`
3. This enables the automatic redirect logic in `public/404.html`

### Option 2: Use CloudFront (Better for Production)
Add CloudFront in front of S3 with custom error responses:

```
Error Code: 404
Response Page Path: /404.html
Response Code: 404
```

Or for seamless routing:
```
Error Code: 404
Response Page Path: /index.html
Response Code: 200
```

### Option 3: Update Next.js Config (Alternative)
If you want to remove `.html` extensions entirely, you need a server or CloudFront Functions:

**CloudFront Function:**
```javascript
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Check if URI doesn't have an extension
    if (!uri.includes('.')) {
        // Append .html
        request.uri = uri + '.html';
    } else if (uri.endsWith('/')) {
        // Append index.html for directory requests
        request.uri = uri + 'index.html';
    }
    
    return request;
}
```

## Testing After Deployment

1. **Test root path**: `http://aws-bucket-frontend-pages.s3-website.ap-south-1.amazonaws.com/`
   - Should load home page

2. **Test login**: Click "Sign In" button or go to `/login.html`
   - Should show login form

3. **Test signup**: Click "Sign Up" button or go to `/signup.html`
   - Should show signup form with email field

4. **Test authenticated page**: After login, should redirect to `/for-you.html`

## Backend API Errors (400/422)

The 400 and 422 errors are coming from the backend validation:
- **400 Bad Request**: User already exists (email or username taken)
- **422 Unprocessable Entity**: Invalid data format

Make sure:
1. Backend API URL is correct in `.env.local`: `NEXT_PUBLIC_API_URL=http://13.233.12.14:8000`
2. Backend is running and accessible
3. Database is properly configured
4. CORS is enabled on backend for S3 domain

## Rebuild and Deploy

```bash
# Install dependencies
npm install

# Build the static site
npm run build

# The 'out' folder contains the static files
# Upload contents of 'out' folder to S3 bucket
aws s3 sync out/ s3://aws-bucket-frontend-pages --delete

# Or use S3 console to upload files
```

## Current Deployment URL
After fixes: `http://aws-bucket-frontend-pages.s3-website.ap-south-1.amazonaws.com/`

All navigation should work with `.html` extensions.
