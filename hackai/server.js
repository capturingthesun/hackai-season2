const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== DB CONNECTION =====
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hackai')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ===== SCHEMA =====
const regSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, lowercase: true, trim: true },
  phone:    { type: String, required: true },
  college:  { type: String, required: true },
  year:     { type: String, required: true },
  type:     { type: String, required: true, enum: ['workshop','hackathon','both'] },
  teamName: { type: String, default: '' },
  source:   { type: String, default: '' },
  createdAt:{ type: Date, default: Date.now },
});
const Registration = mongoose.model('Registration', regSchema);

// ===== EMAIL TRANSPORTER =====
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,   // Use Gmail App Password
  },
});

async function sendConfirmationEmail(reg) {
  const typeLabel = {
    workshop: 'Workshop Only (6th April)',
    hackathon: 'Hackathon Only (6th–7th April)',
    both: 'Workshop + Hackathon (6th–7th April)',
  }[reg.type];

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #020408; color: #e8edf5; margin: 0; padding: 0; }
      .wrap { max-width: 600px; margin: 0 auto; }
      .header { background: linear-gradient(135deg, #070d14, #0a1a28); padding: 3rem 2rem; text-align: center; border-bottom: 2px solid #00f5ff22; }
      .logo { font-size: 3rem; font-weight: 900; letter-spacing: 4px; color: #e8edf5; }
      .logo span { color: #00f5ff; }
      .s2 { color: #ffbe00; font-size: 1rem; }
      .tagline { color: #6b7a8d; font-size: 0.85rem; margin-top: 0.5rem; letter-spacing: 2px; }
      .body { padding: 2.5rem 2rem; background: #070d14; }
      .greeting { font-size: 1.2rem; margin-bottom: 1rem; }
      .greeting strong { color: #00f5ff; }
      .info-box { background: #0a1a28; border: 1px solid #00f5ff22; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; }
      .info-row { display: flex; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid #ffffff08; font-size: 0.9rem; }
      .info-row:last-child { border-bottom: none; }
      .info-row .label { color: #6b7a8d; }
      .info-row .val { color: #e8edf5; font-weight: 600; }
      .highlight { background: #ffbe0015; border: 1px solid #ffbe0030; border-radius: 8px; padding: 1rem; margin: 1.5rem 0; font-size: 0.9rem; color: #ffbe00; }
      .benefits { margin: 1.5rem 0; }
      .benefit-item { padding: 0.4rem 0; font-size: 0.9rem; color: #6b7a8d; }
      .benefit-item::before { content: "✅ "; }
      .footer { background: #020408; padding: 1.5rem 2rem; text-align: center; color: #6b7a8d; font-size: 0.8rem; border-top: 1px solid #ffffff06; }
      .footer a { color: #00f5ff; text-decoration: none; }
    </style>
  </head>
  <body>
  <div class="wrap">
    <div class="header">
      <div class="logo">HACK<span>AI</span> <span class="s2">S2</span></div>
      <div class="tagline">Registration Confirmed 🎉</div>
    </div>
    <div class="body">
      <p class="greeting">Hey <strong>${reg.name}</strong>,</p>
      <p>You're officially registered for <strong>Hack AI — Season 2</strong>! Get ready for an incredible experience. Here are your registration details:</p>
      <div class="info-box">
        <div class="info-row"><span class="label">Name</span><span class="val">${reg.name}</span></div>
        <div class="info-row"><span class="label">Email</span><span class="val">${reg.email}</span></div>
        <div class="info-row"><span class="label">College</span><span class="val">${reg.college}</span></div>
        <div class="info-row"><span class="label">Year</span><span class="val">${reg.year}</span></div>
        <div class="info-row"><span class="label">Participation</span><span class="val">${typeLabel}</span></div>
        ${reg.teamName ? `<div class="info-row"><span class="label">Team</span><span class="val">${reg.teamName}</span></div>` : ''}
      </div>
      <div class="highlight">
        💰 Registration fee: <strong>₹49</strong> is to be paid at the venue on the day of the event.
      </div>
      <p><strong>Event Details:</strong></p>
      <div class="info-box">
        <div class="info-row"><span class="label">Dates</span><span class="val">6th & 7th April 2026</span></div>
        <div class="info-row"><span class="label">Venue</span><span class="val">34 Block Lecture Theatres</span></div>
        <div class="info-row"><span class="label">Day 1</span><span class="val">9AM–5PM Workshop + Hackathon starts 5PM</span></div>
        <div class="info-row"><span class="label">Day 2</span><span class="val">Hackathon continues → Results by 5PM</span></div>
      </div>
      <div class="benefits">
        <p style="margin-bottom:0.75rem;"><strong>What you get:</strong></p>
        <div class="benefit-item">Official Certification</div>
        <div class="benefit-item">EduRev Benefits</div>
        <div class="benefit-item">CA Benefits</div>
        <div class="benefit-item">Networking with industry professionals</div>
        <div class="benefit-item">Prizes worth ₹7,000+</div>
      </div>
      <p style="color:#6b7a8d;font-size:0.85rem;">Organized by <strong style="color:#e8edf5;">SCC — Student Career Committee</strong>, Center for Excellence & Professional Training.</p>
    </div>
    <div class="footer">
      <p>Questions? Contact your event organizer.</p>
      <p style="margin-top:0.5rem;">© 2026 Hack AI Season 2 | SCC</p>
    </div>
  </div>
  </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"Hack AI S2" <${process.env.EMAIL_USER}>`,
    to: reg.email,
    subject: `✅ Registration Confirmed — Hack AI Season 2`,
    html,
  });
}

// ===== AUTH MIDDLEWARE =====
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET || 'hackai_secret_2026');
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// ===== ROUTES =====

// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, college, year, type, teamName, source } = req.body;
    if (!name || !email || !phone || !college || !year || !type) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }
    const existing = await Registration.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'This email is already registered.' });
    }
    const reg = new Registration({ name, email, phone, college, year, type, teamName, source });
    await reg.save();

    // Send email (non-blocking)
    sendConfirmationEmail(reg).catch(err => console.error('Email error:', err));

    res.status(201).json({ message: 'Registration successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'hackai@2026';
  if (username === adminUser && password === adminPass) {
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET || 'hackai_secret_2026', { expiresIn: '8h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// GET /api/admin/registrations
app.get('/api/admin/registrations', authMiddleware, async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json({ registrations });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/registrations/:id
app.delete('/api/admin/registrations/:id', authMiddleware, async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve frontend
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Hack AI server running on http://localhost:${PORT}`));
