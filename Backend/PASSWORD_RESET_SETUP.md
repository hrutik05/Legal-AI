password Reset Feature Documentation
=====================================

## Overview

The password reset feature allows users to recover access to their accounts if they forget their passwords. The system uses secure token-based links that expire after 1 hour.

## Features

- **Secure Token Generation**: Uses crypto.randomBytes for cryptographically secure tokens
- **Email Verification**: Users receive password reset links via email
- **Token Expiration**: Reset tokens expire after 1 hour for security
- **Password Strength**: Enforces strong password requirements (8+ characters, uppercase, lowercase, numbers)
- **User Feedback**: Clear success/error messages at each step
- **Confirmation Email**: Users receive confirmation when password is successfully reset

## User Flow

### Step 1: Request Password Reset
1. User visits the login page and clicks "Forgot password?"
2. User enters their email address on `/forgot-password`
3. System sends reset email (even if email doesn't exist, for security)
4. User sees confirmation message to check email

### Step 2: Click Reset Link
1. User receives email with password reset link
2. Link contains a unique token: `{FRONTEND_URL}/reset-password?token={TOKEN}`
3. User clicks the link to go to reset password page

### Step 3: Reset Password
1. User enters new password on `/reset-password` page
2. Password must meet requirements (shown on form)
3. User confirms password
4. System validates reset token (must not be expired and must match user)
5. Password is hashed with bcrypt
6. All reset tokens are cleared from user account
7. Confirmation email is sent
8. User is redirected to login page

## Backend Setup

### Database Changes
The User model has been updated with:
```javascript
resetToken: String          // Hashed reset token
resetTokenExpires: Date     // Token expiration time
```

### New Controllers (authController.js)
- `forgotPassword()`: Generates token and sends email
- `resetPassword()`: Validates token and updates password

### New Routes (auth.js)
- `POST /api/auth/forgot-password`: Request password reset
- `POST /api/auth/reset-password`: Complete password reset

### Email Templates
Two types of emails are sent:
1. **Password Reset Email**: Contains reset link with 1-hour expiration
2. **Password Changed Email**: Confirmation after successful reset

## Frontend Components

### Pages
1. **ForgotPassword.tsx** (`/forgot-password`)
   - Email input form
   - Success confirmation screen
   - Auto-redirect to login after 3 seconds

2. **ResetPassword.tsx** (`/reset-password`)
   - Password input with validation indicators
   - Password confirmation field
   - Password strength requirements display
   - Token validation with helpful error messages
   - Visual feedback for password match

3. **Login.tsx** (/login)
   - Updated with "Forgot password?" link

## Configuration

### Email Service Setup

#### Gmail (Recommended for Testing)
1. Enable 2-Factor Authentication on Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env`:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

#### Production Email Services
- **SendGrid**: 
  ```
  EMAIL_SERVICE=sendgrid
  EMAIL_USER=apikey
  EMAIL_PASSWORD=SG.xxxxx
  ```
  
- **Mailgun**:
  ```
  EMAIL_SERVICE=mailgun
  EMAIL_USER=postmaster@mail.example.com
  EMAIL_PASSWORD=your-mailgun-password
  ```

### Environment Variables
```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173

# For production:
# FRONTEND_URL=https://yourdomain.com
```

## Security Features

1. **Token Hashing**: Tokens are hashed with SHA-256 before storage
2. **Token Expiration**: 1-hour expiration time
3. **Single Use**: Token is cleared after successful reset
4. **Password Hashing**: Passwords hashed with bcrypt (10 salt rounds)
5. **Email Verification**: Only subscribed email users can reset
6. **Generic Response**: Forgot password endpoint doesn't reveal if email exists
7. **Rate Limiting**: (Can be added) Limit reset attempts per IP
8. **HTTPS**: Required in production (enforced by browser)

## API Reference

### POST /api/auth/forgot-password
Request: 
```json
{
  "email": "user@example.com"
}
```

Response (200):
```json
{
  "message": "If an account exists with this email, a password reset link has been sent."
}
```

### POST /api/auth/reset-password
Request:
```json
{
  "token": "xxx...xxx",
  "password": "NewPassword123",
  "passwordConfirm": "NewPassword123"
}
```

Response (200):
```json
{
  "message": "Password has been reset successfully. You can now log in with your new password."
}
```

Error Response (400):
```json
{
  "error": "Password reset link is invalid or has expired. Please request a new one."
}
```

## Troubleshooting

### "Email not sending"
1. Check `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASSWORD` in `.env`
2. For Gmail: Verify App Password is 16 characters and correct
3. Check server logs for SMTP errors
4. Verify 2-Factor Authentication is enabled on Gmail account

### "Reset token is invalid"
1. Token may have expired (1-hour limit)
2. User may have already reset their password
3. Request a new reset link

### "Password doesn't meet requirements"
- Minimum 8 characters required
- Must include at least one uppercase letter (A-Z)
- Must include at least one lowercase letter (a-z)
- Must include at least one number (0-9)

## Testing

### Manual Testing Steps
1. Start Backend: `npm run dev`
2. Start Frontend: `npm run dev`
3. Go to login page
4. Click "Forgot password?"
5. Enter test email
6. Check email (or console for Ethereal/test service)
7. Click reset link
8. Enter new password
9. Should redirect to login
10. Try logging in with new password

### Using Ethereal Email (Free Testing)
For testing without real email service:
```javascript
// In emailUtils.js, replace transporter creation with:
const testAccount = await nodemailer.createTestAccount();
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass
  }
});
```

## Production Checklist

- [ ] Email service configured with production credentials
- [ ] FRONTEND_URL points to production domain
- [ ] HTTPS enforced
- [ ] Email templates reviewed for branding
- [ ] Rate limiting added to forget-password endpoint
- [ ] CSRF protection enabled
- [ ] Monitoring set up for email delivery failures
- [ ] Backup email service configured (optional)
- [ ] Token expiration time reviewed (default 1 hour)
- [ ] Password requirements reviewed (default: 8+ chars, uppercase, lowercase, number)
- [ ] Email logs stored for compliance
- [ ] User notification logs implemented

## Future Enhancements

1. **Rate Limiting**: Limit password reset requests per email
2. **Resend Logic**: Allow users to resend reset email
3. **Two-Factor Authentication**: Add optional 2FA
4. **Reset Attempt Logging**: Track failed reset attempts
5. **Custom Email Templates**: Brand emails with logo and styling
6. **SMS Verification**: Optional SMS-based password reset
7. **Backup Codes**: Generate backup codes for account recovery
8. **Security Questions**: Alternative verification method
