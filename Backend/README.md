# LegalAI Backend (Auth)

This is a minimal Node.js + Express backend that provides signup, login, and password reset endpoints backed by MongoDB. It uses bcrypt for password hashing and JWT for authentication tokens.

## Quick start (PowerShell):

1. Copy the example env and edit values:

```powershell
cd "C:\Users\hruti\OneDrive\Desktop\Final Year Project\Backend"
cp .env.example .env
# then edit .env to set MONGODB_URI, JWT_SECRET, and email configuration
```

2. Install dependencies and run in dev mode:

```powershell
npm install
npm run dev
```

## Email Configuration (for password reset)

To enable password reset functionality, you need to configure SMTP credentials in your `.env` file:

### Gmail Setup:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Add to `.env`:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-specific-password
   ```

### Other Email Services:
- SendGrid: Use `sendgrid` as EMAIL_SERVICE and your API key as EMAIL_PASSWORD
- Mailgun: Configure similarly with your Mailgun credentials
- Office 365: Use `Office365` as EMAIL_SERVICE

## API Endpoints:

### Authentication
- **POST /api/auth/signup**
  - body: { fullName, email, phone, password }
  - returns: { user, token }

- **POST /api/auth/login**
  - body: { email, password }
  - returns: { user, token }

- **POST /api/auth/forgot-password**
  - body: { email }
  - returns: { message } (returns 200 even if email doesn't exist for security)
  - Sends password reset email with token-based link

- **POST /api/auth/reset-password**
  - body: { token, password, passwordConfirm }
  - returns: { message }
  - Validates reset token and updates user password
  - Token expires in 1 hour

### Chat History
- POST /api/auth/chat-history
  - body: { userId, query, response }
  - returns: { success, message }

- GET /api/auth/chat-history/:userId
  - returns: { success, data: [messages] }

- DELETE /api/auth/chat-history/:userId
  - returns: { success, message }

### Chatbot
- POST /api/auth/chatbot/query
  - body: { query, sessionId, userId? }
  - returns: { response }

## Notes:
- This is intentionally minimal. In production you should:
  - Use HTTPS
  - Use stronger logging and metrics
  - Rotate and protect the JWT secret
  - Add email verification for new accounts
  - Add account lockout after repeated failed login attempts
  - Implement rate limiting on sensitive endpoints
  - Use environment-specific SMTP configurations

