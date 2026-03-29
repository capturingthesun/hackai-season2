# 🤖 Hack AI — Season 2 | Official Website

A full-stack hackathon registration website with admin dashboard and email confirmations.

---

## 📁 Project Structure

```
hackai/
├── public/
│   ├── index.html      ← Main website (copy here)
│   ├── style.css       ← Styles (copy here)
│   ├── script.js       ← Frontend JS (copy here)
│   └── admin.html      ← Admin dashboard (copy here)
├── server.js           ← Express backend
├── package.json
├── .env.example        ← Copy to .env and fill in
└── README.md
```

---

## ⚡ Quick Setup

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Configure environment
```bash
cp .env.example .env
# Edit .env with your details
```

### Step 3 — Set up MongoDB
**Option A: Local MongoDB**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start: `mongod`
- URI: `mongodb://localhost:27017/hackai`

**Option B: MongoDB Atlas (Free Cloud)**
- Create free account at https://cloud.mongodb.com
- Create a cluster → Get connection string
- Set `MONGO_URI` in `.env`

### Step 4 — Set up Gmail for emails
1. Go to your Google Account → Security
2. Enable 2-Factor Authentication
3. Go to App Passwords → Generate one for "Mail"
4. Set `EMAIL_USER` and `EMAIL_PASS` in `.env`

### Step 5 — Run the server
```bash
# Production
npm start

# Development (auto-restart)
npm run dev
```

### Step 6 — Move HTML files
```bash
mkdir public
cp index.html style.css script.js admin.html public/
```

---

## 🌐 Access

| Page | URL |
|------|-----|
| Main Website | http://localhost:3000 |
| Admin Dashboard | http://localhost:3000/admin |

---

## 🔐 Admin Login

Default credentials (change in `.env`):
- **Username:** `admin`  
- **Password:** `hackai@2026`

---

## 🚀 Deploy to Production

**Option A: Railway (Recommended, Free)**
1. Push to GitHub
2. Connect to https://railway.app
3. Add environment variables in Railway dashboard
4. Deploy!

**Option B: Render (Free)**
1. Push to GitHub
2. Create Web Service at https://render.com
3. Set environment variables
4. Deploy!

**Option C: VPS (DigitalOcean/Hostinger)**
```bash
# Install Node.js + PM2
npm install -g pm2
pm2 start server.js --name hackai
pm2 startup
```

---

## 📊 Admin Features

- 📈 Real-time registration stats (total, by type)
- 🔍 Search & filter registrations
- 📥 Export to CSV
- 🗑️ Delete registrations
- 🔐 JWT-protected dashboard

---

## 📧 Email Features

- Automatic confirmation email on registration
- Styled HTML email with event details
- Registration summary included
- Payment reminder (₹49 at venue)

---

## 🛠 Tech Stack

- **Frontend:** HTML, CSS, Vanilla JS
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT
- **Email:** Nodemailer + Gmail
- **Deploy:** Railway / Render / VPS
