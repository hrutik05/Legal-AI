import nodemailer from 'nodemailer';
import { logInfo, logError } from './logger.js';

// Create transporter - configure with your email service
const createTransporter = () => {
  // For testing: use ethereal email (free)
  // For production: use Gmail, SendGrid, etc.
  
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPassword) {
    logError(new Error('Email credentials not configured'), { location: 'emailUtils' });
    return null;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: emailUser.trim(),
        pass: emailPassword.trim()
      }
    });

    logInfo('Email transporter created successfully', { service: emailService, user: emailUser });
    return transporter;
  } catch (err) {
    logError(err instanceof Error ? err : new Error(String(err)), { 
      location: 'createTransporter',
      service: emailService 
    });
    return null;
  }
};

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email, resetToken, fullName) {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      logError(new Error('Email transporter not configured'), { location: 'sendPasswordResetEmail' });
      return false;
    }

    // Generate reset link (adjust base URL according to your frontend deployment)
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : 'noreply@legalai.com',
      to: email,
      subject: 'Password Reset Request - Legal AI Chatbot',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0;">Password Reset Request</h2>
          </div>

          <p style="color: #555; font-size: 16px;">Hello ${fullName},</p>

          <p style="color: #555; font-size: 16px;">
            We received a request to reset the password for your Legal AI Chatbot account. 
            If you didn't make this request, you can safely ignore this email.
          </p>

          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetLink}" style="background-color: #1e40af; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>

          <p style="color: #888; font-size: 14px;">
            Or copy and paste this link in your browser:
            <br>
            <span style="color: #1e40af; word-break: break-all;">${resetLink}</span>
          </p>

          <p style="color: #888; font-size: 14px;">
            <strong>Important:</strong> This link will expire in 1 hour. If it has expired, please request a new password reset.
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

          <p style="color: #888; font-size: 12px; text-align: center;">
            © 2026 Legal AI Chatbot. All rights reserved.
            <br>
            This is an automated email. Please do not reply directly.
          </p>
        </div>
      `,
      text: `
        Password Reset Request

        Hello ${fullName},

        We received a request to reset the password for your Legal AI Chatbot account.
        If you didn't make this request, you can safely ignore this email.

        Click the link below to reset your password:
        ${resetLink}

        This link will expire in 1 hour. If it has expired, please request a new password reset.

        © 2026 Legal AI Chatbot
      `
    };

    logInfo('Attempting to send password reset email', { to: email, from: mailOptions.from });

    const info = await transporter.sendMail(mailOptions);
    
    logInfo('Password reset email sent successfully', { 
      email, 
      messageId: info.messageId,
      response: info.response 
    });
    return true;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logError(err instanceof Error ? err : new Error(errorMessage), { 
      action: 'sendPasswordResetEmail', 
      email,
      errorDetails: errorMessage
    });
    console.error('Email sending error:', err);
    return false;
  }
}

/**
 * Send password changed confirmation email
 */
export async function sendPasswordChangedEmail(email, fullName) {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      logError(new Error('Email transporter not configured'), { location: 'sendPasswordChangedEmail' });
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : 'noreply@legalai.com',
      to: email,
      subject: 'Password Changed Successfully - Legal AI Chatbot',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0;">Password Changed Successfully</h2>
          </div>

          <p style="color: #555; font-size: 16px;">Hello ${fullName},</p>

          <p style="color: #555; font-size: 16px;">
            Your password has been successfully reset. You can now log in with your new password.
          </p>

          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #4caf50;">
            <p style="color: #2e7d32; margin: 0;">✓ Your account is now secure with your new password.</p>
          </div>

          <p style="color: #888; font-size: 14px;">
            If you didn't make this change or think your account has been compromised, please contact support immediately.
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

          <p style="color: #888; font-size: 12px; text-align: center;">
            © 2026 Legal AI Chatbot. All rights reserved.
            <br>
            This is an automated email. Please do not reply directly.
          </p>
        </div>
      `,
      text: `
        Password Changed Successfully

        Hello ${fullName},

        Your password has been successfully reset. You can now log in with your new password.

        If you didn't make this change or think your account has been compromised, please contact support immediately.

        © 2026 Legal AI Chatbot
      `
    };

    logInfo('Attempting to send password changed confirmation email', { to: email });

    const info = await transporter.sendMail(mailOptions);
    
    logInfo('Password changed confirmation email sent successfully', { 
      email, 
      messageId: info.messageId 
    });
    return true;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logError(err instanceof Error ? err : new Error(errorMessage), { 
      action: 'sendPasswordChangedEmail', 
      email,
      errorDetails: errorMessage
    });
    console.error('Email sending error:', err);
    return false;
  }
}
