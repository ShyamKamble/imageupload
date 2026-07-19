# Form Validation Requirements

This document outlines the validation rules for user registration and login based on backend constraints.

## Registration Form Validation

### Email Field
- **Required**: Yes
- **Format**: Must be a valid email (contains @ and domain)
- **Example**: `user@example.com`
- **Backend validation**: Uses Pydantic `EmailStr` validator
- **Error messages**:
  - Empty: "Please enter a valid email address"
  - Invalid format: "Please enter a valid email address"
  - Already exists: "User already exists"

### Username Field
- **Required**: Yes
- **Min length**: 3 characters
- **Max length**: 100 characters
- **Allowed characters**: Letters (a-z, A-Z), numbers (0-9), underscore (_), hyphen (-)
- **Pattern**: `^[a-zA-Z0-9_-]+$`
- **Example**: `john_doe`, `johndoe123`, `john-doe`
- **Backend constraints**: 
  - Database column: `VARCHAR(100) UNIQUE NOT NULL`
  - Must be unique
- **Error messages**:
  - Too short: "Username must be at least 3 characters long"
  - Too long: "Username must be less than 100 characters"
  - Invalid chars: "Username can only contain letters, numbers, underscores, and hyphens"
  - Already exists: "User already exists"

### Password Field
- **Required**: Yes
- **Min length**: 6 characters (recommended minimum)
- **Max length**: 72 characters (bcrypt limit)
- **Backend constraints**: 
  - Automatically truncated to 72 bytes for bcrypt compatibility
  - Hashed using bcrypt before storage
- **Error messages**:
  - Too short: "Password must be at least 6 characters long"
  - Too long: "Password must be less than 72 characters"

## Login Form Validation

### Username Field
- **Required**: Yes
- **Min length**: 3 characters (for consistency)
- **Max length**: 100 characters
- **Example**: Same username used during registration
- **Error messages**:
  - Empty: "Username is required"
  - Invalid credentials: "Invalid username or password. Please try again."

### Password Field
- **Required**: Yes
- **Min length**: 6 characters (for consistency)
- **Example**: Same password used during registration
- **Error messages**:
  - Empty: "Password is required"
  - Invalid credentials: "Invalid username or password. Please try again."

## Backend HTTP Status Codes

### 400 Bad Request
- User already exists (duplicate email or username)
- Invalid request format

### 401 Unauthorized
- Invalid login credentials (wrong username or password)
- Token expired
- Invalid token

### 422 Unprocessable Entity
- Pydantic validation failed
- Email format is invalid
- Required fields are missing
- Data type mismatch

## Frontend Implementation

### Signup Page (`src/app/signup/page.jsx`)
```javascript
// Email validation
if (!email.includes("@") || !email.includes(".")) {
  setError("Please enter a valid email address");
  return;
}

// Username validation
if (username.length < 3) {
  setError("Username must be at least 3 characters long");
  return;
}

if (username.length > 100) {
  setError("Username must be less than 100 characters");
  return;
}

if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
  setError("Username can only contain letters, numbers, underscores, and hyphens");
  return;
}

// Password validation
if (password.length < 6) {
  setError("Password must be at least 6 characters long");
  return;
}

if (password.length > 72) {
  setError("Password must be less than 72 characters");
  return;
}
```

### Login Page (`src/app/login/page.jsx`)
```javascript
// Basic validation before API call
if (username.length < 3) {
  setError("Username must be at least 3 characters");
  return;
}

if (password.length < 6) {
  setError("Password must be at least 6 characters");
  return;
}
```

## Input Field Attributes

### HTML5 Validation Attributes Used

**Email Input:**
```jsx
<Input
  type="email"
  placeholder="user@example.com"
  required
/>
```

**Username Input:**
```jsx
<Input
  type="text"
  placeholder="john_doe or johndoe123"
  minLength={3}
  maxLength={100}
  pattern="[a-zA-Z0-9_-]+"
  required
/>
```

**Password Input:**
```jsx
<Input
  type="password"
  placeholder="Min 6 characters"
  minLength={6}
  maxLength={72}
  required
/>
```

## User-Friendly Messages

All validation messages are displayed in a red error box at the top of the form with specific guidance:

- **Visual indicators**: Red border box with clear text
- **Label hints**: Small text next to labels showing requirements
- **Placeholder examples**: Show valid format examples
- **Helper text**: Below input showing exact requirements

## Testing Validation

### Valid Test Cases
1. **Email**: `test@example.com`
2. **Username**: `testuser123` (3-100 chars, alphanumeric)
3. **Password**: `password123` (6-72 chars)

### Invalid Test Cases
1. **Email**: 
   - `notanemail` → "Please enter a valid email address"
   - `missing@domain` → "Please enter a valid email address"

2. **Username**:
   - `ab` → "Username must be at least 3 characters long"
   - `user@name` → "Username can only contain letters, numbers, underscores, and hyphens"
   - 101 characters → "Username must be less than 100 characters"

3. **Password**:
   - `pass` → "Password must be at least 6 characters long"
   - 73+ characters → "Password must be less than 72 characters"

## Common Backend Error Responses

### Registration Errors
```json
{
  "detail": "User already exists"
}
```
Status: 400 - Returned when email or username is already taken

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```
Status: 422 - Returned when email format is invalid

### Login Errors
```json
{
  "detail": "Invalid credentials"
}
```
Status: 401 - Returned when username/password combination is wrong
