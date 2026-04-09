# Tracktern 🚀
### AI-Powered Internship Tracker with Smart Email Detection & Analytics

> *From applied to offered — every step tracked.*

Engineering students apply to 30–50 companies and lose track of everything. Tracktern organizes every application, auto-detects offer and rejection emails via Gmail, and prepares you for every interview — all in one place.

---

## 🌐 Live Demo

> 🚧 Deployment in progress — live link will be added shortly.
> Clone and run locally using the steps below.

---

## 🎯 The Problem

During internship season, most engineering students manage their hunt over WhatsApp forwards and messy Excel sheets:
- Which companies replied vs ghosted?
- Which ones have interviews pending?
- What do I revise before tomorrow's interview?
- Did I follow up with that company from last week?

There is no free tool built for students that solves all of this together. Tracktern does.

---

## ✅ Current Status

| Feature | Status |
|---|---|
| User auth (register/login) | ✅ Implemented |
| Add & manage companies | ✅ Implemented |
| Kanban board with drag & drop | ✅ Implemented |
| Application funnel dashboard | ✅ Implemented |
| Follow-up reminders (Nodemailer) | ✅ Implemented |
| Gmail auto-detection | 🔄 In development |
| AI interview prep (Gemini) | 🔄 In development |
| Skill gap analyzer | 🔄 In development |
| Streak system | 🔄 In development |

---

## ✨ Features

### 📋 Application Tracking
- Kanban board: **Applied → Shortlisted → Interview → Offer → Rejected**
- Add company name, role, job URL, deadline, and notes
- Drag and drop cards between stages

### 📧 Gmail Auto-Detection *(Unique Feature)*
- Connect Gmail via OAuth2 — app scans for offer/rejection/interview emails
- Auto-updates your tracker status with zero manual work
- Detects keywords like *"pleased to offer"*, *"not moving forward"*, *"schedule an interview"*

### 🤖 AI Interview Prep
- Enter a company + role → get top 10 interview questions instantly
- AI generates a 3-day prep plan tailored to the role
- Skills to revise, based on job description

### 📊 Analytics Dashboard
- Visual funnel showing conversion rate at every stage
- Stat cards: total applied, shortlisted, interviews, offers
- Weekly application goal with progress bar

### ✉️ Smart Follow-up Reminders
- Auto-reminder if no response after 7 days
- AI-generated follow-up email draft, one-click copy

### 🧠 Skill Gap Analyzer
- Enter your skills → app compares against all your target roles
- Shows which skills appear most and which ones you're missing

### 🔥 Streak System
- Apply daily to maintain your streak
- Dashboard tracks current and longest streak

### 📓 Interview Journal
- Log questions asked, difficulty (1–5), and outcome
- Entries shared anonymously to build a community question bank

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Auth | JWT + Google OAuth2 |
| Email Sync | Gmail API (OAuth2) |
| AI | Google Gemini API (free tier) |
| Charts | Recharts |
| Reminders | Nodemailer |
| Deploy | Vercel + Render |

---

## 📁 Folder Structure

```
tracktern/
├── client/                   # React frontend
│   └── src/
│       ├── components/       # KanbanBoard, FunnelChart, AIPrepPanel...
│       ├── pages/            # Dashboard, Applications, AIPrep, Journal, Login
│       ├── context/          # AuthContext
│       └── App.jsx
│
├── server/                   # Node.js backend
│   ├── routes/               # auth, companies, gmail, ai, journal
│   ├── models/               # User, Company, Interview
│   ├── middleware/           # authMiddleware
│   ├── utils/                # gmailParser, geminiHelper
│   └── index.js
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Google Cloud Console account (Gmail API + Gemini API)

### 1. Clone the repo
```bash
git clone https://github.com/ayushoncode/Tracktern.git
cd Tracktern
```

### 2. Setup environment variables
Create `.env` in `/server`:
```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GMAIL_CLIENT_ID=your_google_client_id
GMAIL_CLIENT_SECRET=your_google_client_secret
GMAIL_REDIRECT_URI=http://localhost:5000/api/gmail/callback
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Install & run
```bash
# Backend
cd server && npm install && npm run dev

# Frontend (new terminal)
cd client && npm install && npm start
```

App runs at `http://localhost:3000`

---

## 📸 Screenshots

*(Coming soon — dashboard, kanban board, and AI prep panel)*

---

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] LinkedIn job scraper
- [ ] Resume ATS score analyzer
- [ ] Company review system

---


## 📄 License

MIT License — feel free to fork and build on top of this.

---

*Found this useful? Drop a ⭐ on GitHub!*
