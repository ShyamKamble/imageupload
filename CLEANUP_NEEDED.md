# Manual Cleanup Required

## Empty Folders to Delete

The following empty folders should be deleted manually as they serve no purpose:

1. **`src/app/api/images/`** - Empty Next.js API route folder (not used)
2. **`src/app/api/delete-image/`** - Empty Next.js API route folder (not used)
3. **`src/app/for-you/index/`** - Now empty after moving upload page to `/upload`

### How to Delete (Windows PowerShell):

```powershell
Remove-Item -Recurse -Force "src/app/api/images"
Remove-Item -Recurse -Force "src/app/api/delete-image"
Remove-Item -Recurse -Force "src/app/for-you/index"
```

### Why These Exist:

- The API route folders were likely created when planning to use Next.js API routes
- Since your backend is Python FastAPI, these Next.js routes are unnecessary
- The `/for-you/index` folder was the old location for upload functionality (now at `/upload`)

---

## Structural Changes Made

### Route Reorganization:

**BEFORE:**
- `/` → Home page
- `/for-you` → Gallery view (FocusCards)
- `/for-you/index` → Upload page (confusing structure)
- `/upload` → Unused basic page

**AFTER:**
- `/` → Home page ✅
- `/for-you` → Gallery view (renamed to "Gallery" in navbar) ✅
- `/upload` → Upload page (fully functional) ✅

### Navigation Updates:

**Navbar now has:**
- Home → `/`
- Gallery → `/for-you` (was "For You")
- Upload → `/upload` (new link)
- Sign In / Sign Up (on right)

### Benefits:

✅ Clear separation of concerns
✅ Intuitive URL structure
✅ No nested redundant routes
✅ Consistent naming across UI
