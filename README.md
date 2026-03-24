# 🚀 NavAIgate India – AI Powered Smart Travel Planning Platform

> Full-stack MERN application with AI itinerary generation, real-time chat, budget tracking, weather integration, and Google Maps navigation.

---

## 📸 Screenshots
The app matches the design from the provided screenshots — dark theme with gold accents, Playfair Display typography.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Real-time | Socket.io |
| Auth | JWT + bcrypt |
| AI | OpenAI GPT-3.5-turbo |
| Weather | OpenWeather API |

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- OpenAI API key (optional — fallback plans available)
- OpenWeather API key (optional — mock data available)

---

### 1️⃣ Clone / Extract the project

```bash
cd navaigate
```

---

### 2️⃣ Setup Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/navaigate
JWT_SECRET=your_super_secret_key_change_this
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENWEATHER_API_KEY=your-openweather-api-key-here
CLIENT_URL=http://localhost:3000
```

Start backend:
```bash
npm run dev
# or: npm start
```

Backend runs at: **http://localhost:5000**

---

### 3️⃣ Setup Frontend

```bash
cd ../client
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🔑 API Keys Required

### OpenAI (for AI itinerary generation + chatbot)
1. Go to https://platform.openai.com/api-keys
2. Create new key
3. Add to `server/.env` as `OPENAI_API_KEY`
4. ⚡ Without key: fallback plans are used automatically

### OpenWeather (for weather-based adjustments)
1. Go to https://openweathermap.org/api
2. Sign up → API Keys → Copy key
3. Add to `server/.env` as `OPENWEATHER_API_KEY`
4. ⚡ Without key: mock weather data is used

### MongoDB
- **Local**: Install MongoDB Community → runs on `mongodb://localhost:27017`
- **Atlas (free cloud)**: https://www.mongodb.com/atlas → Get connection string

---

## 🌐 All Features

### Frontend Pages
- `/` – Homepage with hero, features, destinations, how it works
- `/login` – Login form with JWT auth
- `/signup` – Registration with validation
- `/dashboard` – User profile, saved plans, stats (protected)
- `/my-plan` – Core AI trip planner (4-step flow)
- `/tours` – All 20 destinations with search & filter
- `/gallery` – Masonry photo gallery
- `/group-travel` – Group trips with join functionality
- `/blogs` – Travel blog posts
- `/about` – Team & mission
- `/contact` – Contact form

### Backend APIs
```
POST   /api/auth/signup      → Register user
POST   /api/auth/login       → Login, get JWT
GET    /api/auth/me          → Get current user
PUT    /api/auth/theme       → Update user theme

POST   /api/plans            → Save plan
GET    /api/plans            → Get user's plans
GET    /api/plans/:id        → Get single plan
PUT    /api/plans/:id        → Update plan
DELETE /api/plans/:id        → Delete plan

POST   /api/ai/generate      → Generate 4 AI plans
POST   /api/ai/modify        → Modify plan with AI
POST   /api/ai/chat          → AI chatbot response

GET    /api/weather/:city    → Get weather data
```

### Socket.io Events
```
join_room       → Join destination chat room
send_message    → Send message in room
receive_message → Receive message
room_history    → Load chat history
user_joined     → User joined notification
user_left       → User left notification
```

---

## 🎨 Theme System
Themes: `dark` | `light` | `beach` | `mountain` | `gradient`
- Click 🎨 in navbar
- Saved per user in MongoDB + localStorage

---

## 📁 Project Structure

```
navaigate/
├── server/
│   ├── index.js          # Express + Socket.io server
│   ├── models/
│   │   ├── User.js       # User model (bcrypt)
│   │   └── Plan.js       # Plan model
│   ├── routes/
│   │   ├── auth.js       # Auth routes
│   │   ├── plans.js      # Plan CRUD
│   │   ├── ai.js         # OpenAI integration
│   │   ├── weather.js    # OpenWeather integration
│   │   └── chat.js       # Chat REST endpoint
│   ├── middleware/
│   │   └── auth.js       # JWT middleware
│   ├── package.json
│   └── .env.example
│
└── client/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js
    │   ├── index.js
    │   ├── index.css      # CSS variables + custom styles
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── ToastContext.js
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Footer.js
    │   │   └── Chatbot.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Signup.js
    │   │   ├── Dashboard.js
    │   │   ├── MyPlan.js
    │   │   ├── Tours.js
    │   │   ├── Gallery.js
    │   │   ├── GroupTravel.js
    │   │   ├── Blogs.js
    │   │   ├── About.js
    │   │   └── Contact.js
    │   └── utils/
    │       └── data.js    # Destinations, blogs, gallery data
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## 🚀 Production Build

```bash
cd client
npm run build
```

Then serve the `build/` folder with any static host (Vercel, Netlify, etc.)

For backend: Deploy to Railway, Render, or Heroku.

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| MongoDB connection error | Ensure MongoDB is running: `mongod` |
| Port 5000 in use | Change `PORT` in `.env` |
| CORS error | Check `CLIENT_URL` in server `.env` matches your React URL |
| AI plans not generating | Check `OPENAI_API_KEY` — app falls back gracefully |

---

Built with ♥ by NavAIgate India Team
