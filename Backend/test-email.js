import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmailConfiguration() {
  console.log('\n=== Email Configuration Test ===\n');
  
  console.log('Environment Variables:');
  console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'NOT SET');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 5)}...` : 'NOT SET');
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET');
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'NOT SET');
  console.log('');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ Email credentials not configured in .env file!');
    console.log('\nPlease add to your .env file:');
    console.log('EMAIL_SERVICE=gmail');
    console.log('EMAIL_USER=your-email@gmail.com');
    console.log('EMAIL_PASSWORD=your-app-password');
    process.exit(1);
  }

  try {
    console.log('Creating email transporter...');
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER.trim(),
        pass: process.env.EMAIL_PASSWORD.trim()
      }
    });

    console.log('Testing email connection...');
    await transporter.verify();
    console.log('✅ Email configuration is valid!');
    console.log('✅ Transporter connected successfully');

    // Try to send a test email
    console.log('\n=== Sending Test Email ===\n');
    
    const testEmail = process.env.EMAIL_USER;
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: testEmail,
      subject: 'Test Email - LegalAI Password Reset',
      html: '<p>This is a test email from your LegalAI application. If you received this, your email configuration is working correctly!</p>',
      text: 'This is a test email from your LegalAI application.'
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('\n📧 Check your email inbox for the test message.');

  } catch (err) {
    console.error('❌ Email configuration error:');
    console.error('Error type:', err.code || err.name);
    console.error('Error message:', err.message);
    
    if (err.code === 'EAUTH') {
      console.error('\n🔐 Authentication Failed - Possible causes:');
      console.error('1. Your app password is incorrect or has spaces');
      console.error('2. 2-Factor Authentication is not enabled on your Gmail account');
      console.error('3. You\'re using your regular Gmail password instead of App Password');
      console.error('\nSolution for Gmail:');
      console.error('1. Enable 2-Factor Authentication: https://myaccount.google.com/security');
      console.error('2. Generate App Password: https://myaccount.google.com/apppasswords');
      console.error('3. Copy the 16-character password and paste into EMAIL_PASSWORD in .env');
      console.error('4. Remove any spaces from the password');
    }
    
    if (err.code === 'ENOTFOUND' || err.code === 'EHOSTUNREACH') {
      console.error('\n🌐 Network Error - Check your internet connection');
    }

    process.exit(1);
  }
}

testEmailConfiguration().catch(console.error);
