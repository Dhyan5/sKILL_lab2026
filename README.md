# Sahyadri Hostel — Complaint & Maintenance Management System

A production-ready, full-stack hostel management system built with **Next.js 15 (App Router)**, **NeonDB (PostgreSQL)**, **Framer Motion**, and **Tailwind CSS**.

---

## 🚀 Features

### Student Module
- Register & Login
- Submit complaints with category, description, and priority
- View complaint history and status

### Admin Module
- View all complaints across the hostel
- Filter by status and category
- Search by student name, category, or description
- Update complaint status inline

### UI / UX
- 🌙 Dark Mode (Slate + Purple palette)
- 💎 Glassmorphism cards with backdrop blur
- ⚡ Framer Motion animations on all elements
- 🔄 Animated full-screen loader
- 🦴 Skeleton loading for dashboard cards
- 📱 Responsive layout

---

## 🛠 Tech Stack

| Layer       | Technology                  |
|-------------|-----------------------------|
| Framework   | Next.js 15 (App Router)     |
| Database    | NeonDB (PostgreSQL via `pg`)|
| Auth        | JWT (`jose`) + HTTP cookies |
| Styling     | Tailwind CSS v4             |
| Animation   | Framer Motion               |
| Icons       | Lucide React                |
| Toasts      | react-hot-toast             |

---

## ⚙️ Setup & Run

### 1. Clone & install
```bash
git clone <repo>
cd sahyadri-hostel
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Edit .env.local with your NeonDB connection string and JWT secret
```

### 3. Initialize the database
Visit **`http://localhost:3000/api/init`** once after starting the server.  
This creates the `users` and `complaints` tables on NeonDB (idempotent).

### 4. Start the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 5. Production build
```bash
npm run build
npm start
```

---

## 🐳 Docker

```bash
# Build the image
docker build -t sahyadri-hostel .

# Run with environment variables
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your_secret" \
  sahyadri-hostel
```

---

## 🏗️ Folder Structure

```
sahyadri-hostel/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── register/route.ts
│   │   ├── complaints/
│   │   │   ├── route.ts        ← GET + POST
│   │   │   └── [id]/route.ts   ← PUT
│   │   └── init/route.ts       ← DB init
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   └── complaints/page.tsx
│   │   └── student/
│   │       ├── page.tsx
│   │       ├── submit/page.tsx
│   │       └── complaints/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ComplaintCard.tsx
│   ├── Loader.tsx
│   ├── Navbar.tsx
│   └── Sidebar.tsx
├── lib/
│   ├── auth.ts     ← JWT helpers (jose)
│   └── db.ts       ← NeonDB pool + initDB
├── Dockerfile
├── nginx.conf
├── .env.example
└── .env.local      ← Do NOT commit to git
```

---

## 🔄 Request Lifecycle

```
Browser → Next.js App Router
  ↓
  /api/auth/login
    ↓ Extract body
    ↓ Query NeonDB users table via pg Pool
    ↓ bcrypt.compare password
    ↓ signToken (jose HS256)
    ↓ Set httpOnly cookie "token"
  ← Return user + token

Browser navigates to /dashboard/student
  ↓ localStorage.getItem('user') → role check
  ↓ fetch('/api/complaints', { Authorization: Bearer <token> })
    ↓ extractToken → verifyToken (jose)
    ↓ Query NeonDB complaints WHERE user_id = $1
  ← Return complaints array → render ComplaintCard components
```

---

## 🌐 Nginx (Reverse Proxy)

See `nginx.conf` — configured to proxy `http://localhost:3000` behind port 80 with WebSocket support.

---

## 📄 License

MIT
