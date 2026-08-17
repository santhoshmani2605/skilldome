const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// ── Test route ──
app.get('/', (req, res) => {
  res.json({ message: 'Skilldome backend is running!' });
});

// ── Subscribe route ──
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ status: 'invalid', message: 'Please enter a valid email address.' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM subscribers WHERE email = ?', [email]);

    if (existing.length > 0) {
      return res.status(200).json({ status: 'already_subscribed', message: 'You are already subscribed!' });
    }

    await db.query('INSERT INTO subscribers (email) VALUES (?)', [email]);

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
      await transporter.sendMail({
        from: `"Skilldome Careers" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: 'New Subscriber!',
        html: `<h2>New subscriber on Skilldome Careers</h2><p><strong>Email:</strong> ${email}</p><p><strong>Time:</strong> ${new Date().toLocaleString()}</p>`,
      });
    } catch (mailError) {
      console.error('Email sending failed (subscriber saved):', mailError.message);
    }

    return res.status(201).json({ status: 'success', message: 'Subscribed successfully!' });

  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({ status: 'error', message: 'Something went wrong. Please try again.' });
  }
});

// ── Export subscribers as CSV ──
app.get('/api/subscribers/export', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, email, subscribed_at FROM subscribers ORDER BY subscribed_at DESC');
    const csv = ['id,email,subscribed_at', ...rows.map(r => `${r.id},${r.email},${r.subscribed_at}`)].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Export failed' });
  }
});

// ── Contact form route ──
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // 1. Validate
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !name.trim()) {
    return res.status(400).json({ status: 'invalid', message: 'Please enter your name.' });
  }
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ status: 'invalid', message: 'Please enter a valid email address.' });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ status: 'invalid', message: 'Please enter your message.' });
  }

  try {
    // 2. Check duplicate email
    const [existing] = await db.query('SELECT id FROM contact_messages WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(200).json({ status: 'duplicate', message: 'This email has already been used to submit a message.' });
    }

    // 3. Save to DB
    await db.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name.trim(), email.trim(), subject ? subject.trim() : null, message.trim()]
    );

    // 4. Send email notification (non-blocking)
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
      await transporter.sendMail({
        from: `"Skilldome Careers" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `New Contact Message: ${subject || 'No Subject'}`,
        html: `
          <h2>New contact form submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || '—'}</p>
          <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        `,
      });
    } catch (mailError) {
      console.error('Email sending failed (message saved):', mailError.message);
    }

    return res.status(201).json({ status: 'success', message: 'Your message has been sent successfully!' });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ status: 'error', message: 'Something went wrong. Please try again.' });
  }
});

// ── Start server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});