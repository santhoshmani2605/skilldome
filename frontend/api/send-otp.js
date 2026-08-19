import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Missing email or otp' });
  }

  // Ensure these environment variables are set in your Vercel project settings
  const smtpEmail = process.env.SMTP_EMAIL || process.env.EMAIL_USER;
  const smtpPassword = process.env.SMTP_PASSWORD || process.env.EMAIL_PASS;

  if (!smtpEmail || !smtpPassword) {
    console.error('SMTP credentials not configured in Vercel environment variables.');
    return res.status(500).json({ success: false, message: 'Server email configuration is missing.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this if you are not using Gmail
    auth: {
      user: smtpEmail,
      pass: smtpPassword,
    },
  });

  try {
    await transporter.sendMail({
      from: `"SkillDome Assessments" <${smtpEmail}>`,
      to: email,
      subject: 'Your SkillDome OTP Code',
      text: `Your OTP for account recovery is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0f172a;">SkillDome Account Recovery</h2>
          <p style="color: #64748b; font-size: 16px;">You requested a password reset. Your One-Time Password (OTP) is:</p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <h1 style="color: #4f46e5; letter-spacing: 6px; margin: 0; font-size: 32px;">${otp}</h1>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">If you didn't request this code, please safely ignore this email.</p>
        </div>
      `
    });

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP email', error: error.message });
  }
}
