# ❄️ Winter AI

A full-stack conversational AI app powered by **Google Gemini 2.0 Flash**. Built with a React frontend and an Express/MongoDB backend, featuring persistent chat threads, secure JWT authentication with refresh token rotation, and a polished dark space-themed UI.

---

## ✨ Features

- 🤖 AI chat powered by **Gemini 2.0 Flash**
- 🔐 JWT auth with **access + refresh token rotation** via httpOnly cookies
- 💬 **Persistent threaded conversations** stored in MongoDB
- 🎨 Dark space-themed UI built with **React + CSS Modules**
- 🛡️ Protected routes with automatic token refresh
- ⚡ Fast dev experience with **Vite**
- 🗑️ Full account & thread management (delete thread, delete account)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios, Vite |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB |
| AI | Google Gemini 2.0 Flash (`@google/genai`) |
| Auth | JWT (httpOnly cookies), bcryptjs |
| Styling | CSS Modules, Sora + JetBrains Mono fonts |

---

## 📁 Project Structure

```
winter-ai/
├── backend/
│   ├── controllers/
│   │   ├── auth.controllers.js
│   │   └── AI.controllers.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── thread.model.js
│   │   └── message.model.js
│   ├── routers/
│   │   ├── user.route.js
│   │   └── AI.route.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── uttils/
│   │   ├── winter.AI.js
│   │   ├── ApiResponse.js
│   │   └── ErrorClass.js
│   ├── db/
│   │   └── config.db.js
│   ├── app.js
│   └── index.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── ui/          # Button, Input, Avatar, Spinner
        │   ├── layout/      # Sidebar, AppLayout, ProtectedRoute
        │   └── chat/        # ChatMessage, ChatInput, WelcomeScreen
        ├── context/         # AuthContext, ChatContext
        ├── hooks/           # useAutoScroll, useThreadId
        ├── pages/           # ChatPage, LoginPage, RegisterPage, ProfilePage
        └── services/        # api.js, auth.service.js, ai.service.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Google Gemini API key → [aistudio.google.com](https://aistudio.google.com)

---

### 1. Clone the repo

```bash
git clone https://github.com/your-username/winter-ai.git
cd winter-ai
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see below)
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔑 Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
```

---

## 🔌 API Reference

### Auth — `/auth/v1`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login, sets cookies |
| POST | `/logout` | ✅ | Logout, clears cookies |
| POST | `/refresh` | ❌ | Refresh access token |
| GET | `/profile` | ✅ | Get current user |
| GET | `/users` | ✅ | Get all other users |
| POST | `/delete` | ✅ | Delete account |

### AI — `/ai/v1`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/threads` | ✅ | Get all threads |
| GET | `/thread/:threadId` | ✅ | Get thread with messages |
| DELETE | `/thread/:threadId` | ✅ | Delete thread |
| POST | `/chat/:threadId` | ✅ | Send message, get AI reply |


## 📄 License

MIT © 2025
