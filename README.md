# 🚀 Smart Student Workspace

> **Practice. Track. Optimize.**

An intelligent, all-in-one productivity and exam preparation platform built for JEE and competitive exam aspirants. Smart Student Workspace unifies quiz practice, performance analytics, formula flashcards, task management, and focused study tools into a single structured learning ecosystem.

---

## 🌟 Why This Exists

Most students juggle multiple scattered tools — one for notes, another for quizzes, another for timers, with no unified analytics. Smart Student Workspace changes that.

Instead of:
> *"I think I'm weak in calculus..."*

You get:
> *"You scored 42% in Limits over the last 7 days — revise immediately."*

---

## ✨ Features

### 🏠 Immersive Landing Page
- 3D animated Earth background (Three.js)
- Scroll-triggered GSAP animations
- Clean, modern onboarding experience

### 🔐 Authentication System
- Secure signup & login with bcrypt password hashing
- JWT-based session management with auto-expiry
- Middleware-protected routes
- Unauthorized access prevention

### 🧭 Dashboard — Command Center
- Personalized greeting with rotating motivational quotes
- Quick-access cards for all modules
- Sidebar navigation across all features

### 🧠 Quiz Engine (JEE-Focused)
- Subject selection: **Mathematics, Physics, Chemistry**
- Chapter-level question banks with exam metadata
- Multiple-choice format with correct answer tracking
- Performance stored after every attempt

### 📊 Advanced Analytics Engine
Every quiz attempt generates structured performance data. The analytics layer surfaces:

| Insight | Description |
|---|---|
| Total Attempts | Overall practice consistency |
| Overall Accuracy | Mastery percentage across all quizzes |
| Current Streak | Consecutive active study days |
| Subject Mastery | Visual progress per subject |
| Chapter Accuracy | Precision tracking per chapter |
| Weakest Chapters (7d) | Lowest-performing topics this week |
| Inactive Chapters (14d) | Topics not practiced recently |
| 30-Day Activity Heatmap | Study consistency visualization |
| Performance Trend | Improvement tracked over time |
| Focus Recommendations | Data-driven chapter suggestions |

### ✨ Formula Flashcards
- Categorized by subject (Physics, Math, Chemistry)
- Clean card interface for quick visual recall
- Designed for pre-exam brushing and memory reinforcement

### ⏱ Study Timer
- **Stopwatch Mode** — track open-ended study sessions
- **Pomodoro Mode** — 25-minute focus sessions with auto-reset
- Builds deep work habits and time awareness

### ✅ To-Do Manager
- Add, complete, and delete tasks
- LocalStorage persistence
- Minimal UI to reduce cognitive overhead

### 👤 Profile System
- View name and email
- Secure logout
- Protected route access

---

## 🧩 Tech Stack

**Frontend**
- HTML5, CSS3 (modern light theme)
- Vanilla JavaScript
- [Chart.js](https://www.chartjs.org/) — analytics visualizations
- [Three.js](https://threejs.org/) — 3D landing page visuals
- [GSAP](https://greensock.com/gsap/) — animations

**Backend**
- Node.js + Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt password hashing
- REST API architecture

---

## 🔄 Data Flow

```
User signs up → Account stored in MongoDB
         ↓
User logs in → JWT token generated & stored in localStorage
         ↓
Token validated via middleware on every protected request
         ↓
User attempts quiz → Performance saved to localStorage
         ↓
Analytics engine processes raw attempt data
         ↓
Dashboard visualizes insights in real time
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/smart-student-workspace.git
cd smart-student-workspace

# Install backend dependencies
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Add your MONGO_URI and JWT_SECRET

# Start the server
npm start
```

Open `frontend/index.html` in your browser or serve via a local server.

---

## 🔮 Roadmap

- [ ] Cloud-based quiz history (replace localStorage)
- [ ] AI-based weak topic prediction
- [ ] Personalized quiz recommendations
- [ ] Adaptive difficulty system
- [ ] Multi-device sync
- [ ] Study plan generator
- [ ] Leaderboard system
- [ ] Push notification reminders

---

## 🎓 Who Is This For?

- JEE / NEET / competitive exam aspirants
- Self-driven learners who want structured study
- Students who want data — not guesswork — driving their preparation

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built to transform <strong>random studying</strong> into <strong>measured, optimized, strategic preparation.</strong>
</p>
