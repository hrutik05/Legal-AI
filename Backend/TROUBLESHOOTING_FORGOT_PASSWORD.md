TROUBLESHOOTING - FORGOT PASSWORD NOT WORKING
==============================================

## Issue Fixed! ✅

The problem was that the Frontend was using an incorrect API endpoint URL:
- ❌ OLD: `http://localhost:4000/api/auth/forgot-password`
- ✅ NEW: `http://localhost:4000/auth/forgot-password`

The Backend auth routes are mounted directly on `/auth`, not `/api/auth`.

## Email Configuration Status ✅

Your Gmail configuration is working correctly:
- ✅ EMAIL_SERVICE: gmail
- ✅ EMAIL_USER: itshwme1@gmail.com
- ✅ EMAIL_PASSWORD: Valid (verified via test)
- ✅ SMTP Connection: Working
- ✅ Test Email: Successfully sent

## Steps to Test the Fixed Feature

### Step 1: Verify Frontend is Updated
The following files have been corrected to use the right endpoint:
1. `Frontend/src/pages/ForgotPassword.tsx` - Now uses `/auth/forgot-password`
2. `Frontend/src/pages/ResetPassword.tsx` - Now uses `/auth/reset-password`

### Step 2: Stop Old Servers
Make sure to stop both old Frontend and Backend servers if they're still running.

### Step 3: Start Fresh Servers

**Terminal 1 - Backend:**
```powershell
cd "c:\Users\hruti\OneDrive\Desktop\Sigma4.0\Final Year Project\Backend"
npm run dev
```

Expected output:
```
> legalai-backend@0.1.0 dev
> nodemon --watch src --exec node index.js

[nodemon] restarting due to file changes...
Server is running on port 4000
Connected to MongoDB successfully
```

**Terminal 2 - Frontend:**
```powershell
cd "c:\Users\hruti\OneDrive\Desktop\Sigma4.0\Final Year Project\Frontend"
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

### Step 4: Test Full Flow

1. **Go to Login Page:**
   - Open http://localhost:5173/login
   - Click "Forgot password?" link

2. **Request Reset:**
   - Enter your email: itshwme1@gmail.com (or any email)
   - Click "Send Reset Link"
   - ✅ Should show success message
   - ✅ Should redirect to login automatically

3. **Check Email:**
   - Check your Gmail inbox for reset email
   - Look for: "Password Reset Request - Legal AI Chatbot"
   - Click the reset link in the email

4. **Reset Password:**
   - You'll be redirected to http://localhost:5173/reset-password?token=xxx
   - Enter new password meeting requirements:
     - At least 8 characters
     - One uppercase letter
     - One lowercase letter
     - One number
   - Confirm password
   - Click "Reset Password"
   - ✅ Should show success message
   - ✅ Should redirect to login

5. **Login with New Password:**
   - Email: itshwme1@gmail.com
   - Password: Your new password
   - Click "Sign In"
   - ✅ Should successfully log in

## Debugging if Still Not Working

### Check 1: Is Backend Running?
Open http://localhost:4000/health in browser
- ✅ Should show: `{"status":"ok"}`

### Check 2: Check Backend Console
Look for these logs when you click "Send Reset Link":
```
Attempting to send password reset email, to: user@example.com
Password reset email sent successfully, email: user@example.com
```

### Check 3: Check Frontend Console (F12)
Look for any network errors when clicking "Send Reset Link"
- Should be a POST request to `http://localhost:4000/auth/forgot-password`
- Status should be 200

### Check 4: Verify Network
Open Developer Tools (F12) → Network tab
- Filter for XHR requests
- Click "Send Reset Link"
- You should see a POST request to `forgot-password`
- Response should be 200 with message

## Common Issues & Solutions

### 1. "Failed to send reset email" Error

**Solution:**
1. Check Backend console for detailed error messages
2. Verify `.env` file has correct Gmail credentials:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=itshwme1@gmail.com
   EMAIL_PASSWORD=ztqi fcyw mirp nhlh
   ```
3. Make sure no extra spaces in password

### 2. Network Error / 404 Response

**Solution:**
1. Verify Frontend is calling correct URL: `http://localhost:4000/auth/forgot-password` (NOT `/api/auth/forgot-password`)
2. Check that Backend is running on port 4000
3. Verify CORS is enabled (it should be)

### 3. Email Not Received

**Causes & Solutions:**
1. **Spam Folder:** Gmail might filter emails as spam
2. **Email Service:** Gmail might be blocking the connection
   - Check if Less Secure App Access is needed: https://myaccount.google.com/lesssecureapps
3. **App Password Issue:**
   - Regenerate App Password at https://myaccount.google.com/apppasswords
   - Copy-paste the 16-character password with NO SPACES

### 4. "Invalid or expired token" After Clicking Reset Link

**Possible Causes:**
1. **Token Expired:** Wait 1 hour and try again
2. **Link Copied Wrong:** Make sure the full URL with token is correct
3. **Database Issue:** User might not be in database
   - Try signing up first, then forgot password

## Manual Email Testing

Run this to test email independently:
```bash
cd Backend
node test-email.js
```

Expected output:
```
✅ Email configuration is valid!
✅ Transporter connected successfully
✅ Test email sent successfully!
```

## Logs to Monitor

### Backend Logs to Watch:
```
[DEBUG] Attempting to send password reset email
[INFO] Password reset email sent successfully
[ERROR] Email sending error (if there's an issue)
```

### Frontend Logs to Watch (F12 Console):
```
POST http://localhost:4000/auth/forgot-password 200
POST http://localhost:4000/auth/reset-password 200
```

## Production Deployment Notes

Before going live, update:
1. `FRONTEND_URL` in Backend `.env` to your production domain
2. Email configuration for production service (SendGrid, Mailgun, etc.)
3. Run `npm run build` for Frontend
4. Deploy to production server

## Database Notes

The password reset token is:
- Stored HASHED in the database (SHA-256)
- Never stored in plain text
- Expires in 1 hour
- Cleared from database after successful reset

## Files Updated

✅ Frontend/src/pages/ForgotPassword.tsx - Corrected API endpoint
✅ Frontend/src/pages/ResetPassword.tsx - Corrected API endpoint
✅ Backend/src/utils/emailUtils.js - Enhanced error logging
✅ Backend/test-email.js - Email configuration test script

## Support

If problems persist:
1. Check Backend server is running
2. Run `node test-email.js` to verify email setup
3. Check browser console (F12) for network errors
4. Check Backend console for detailed error logs
5. Verify .env file has all required variables
