# Quick Start - Forgot Password Feature

## Prerequisites
- Node.js installed
- MongoDB connection working (already have it in .env)
- Gmail account with 2FA and App Password set up
- Email credentials in Backend/.env

## Quick Start Steps

### 1. Clear Node Processes (if needed)
```powershell
# In PowerShell, kill any running node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### 2. Start Backend Server
```powershell
cd "c:\Users\hruti\OneDrive\Desktop\Sigma4.0\Final Year Project\Backend"
npm run dev
```

Wait for this message:
```
Server is running on port 4000
Connected to MongoDB successfully
```

### 3. In New Terminal, Start Frontend Server
```powershell
cd "c:\Users\hruti\OneDrive\Desktop\Sigma4.0\Final Year Project\Frontend"
npm run dev
```

Wait for this message:
```
➜  Local:   http://localhost:5173/
```

### 4. Test Feature
1. Open http://localhost:5173/ in browser
2. Go to login page (click "Sign In" or "Sign up" → "here" → login)
3. Click "Forgot password?" link
4. Enter email: itshwme1@gmail.com
5. Click "Send Reset Link"
6. ✅ Should see success message and auto-redirect
7. Check Gmail inbox for reset email
8. Click the reset link
9. Enter new password (8+ chars, uppercase, lowercase, number)
10. Click "Reset Password"
11. ✅ Should see success and redirect to login
12. Try logging in with new password

## Email Test (Optional)
```powershell
cd "c:\Users\hruti\OneDrive\Desktop\Sigma4.0\Final Year Project\Backend"
node test-email.js
```

## Common Issues

### Backend shows error on start
- Make sure MongoDB connection string is valid in .env
- Make sure PORT 4000 is not in use

### Frontend shows 404 or CORS error
- Make sure Backend is already running on port 4000
- Check that Frontend is using correct API URL: http://localhost:4000/auth/forgot-password

### Email not sending
- Run `node test-email.js` to verify Gmail setup
- Check Backend console for email errors
- Make sure EMAIL_PASSWORD has no spaces and is the App Password (not Gmail password)

### Reset link invalid
- Token expires in 1 hour
- Make sure you're using the correct email you signed up with
- Try requesting a new reset link

## Further Documentation
See these files for detailed information:
- TROUBLESHOOTING_FORGOT_PASSWORD.md - Detailed troubleshooting guide
- Backend/PASSWORD_RESET_SETUP.md - Technical setup documentation
- FORGOT_PASSWORD_SETUP.md - Implementation summary
