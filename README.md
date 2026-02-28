# 🏠 Sahyadri Hostel — Complaint & Maintenance System

> A full-stack web app built to make hostel life a little less frustrating. Students can report issues, track them in real time, and admins can manage everything from one clean dashboard.

---

## ✨ What's this about?

Ever had a broken tap in your hostel room and had no idea who to tell, or whether anyone even read your complaint? That's what this fixes.

**Sahyadri Hostel** is a complaint and maintenance management system designed for the Sahyadri hostel. Students submit issues, admins resolve them — simple, fast, and transparent.

Built with a modern Apple-inspired dark UI that actually feels good to use.

---

## 🚀 Features

### For Students
- 📝 Submit complaints with category, priority, and description
- 🏠 Room number shown on your dashboard and sidebar
- 📊 Track status of all your complaints in real time
- 🔔 Toast notifications for every action
- 🎨 Beautiful dark UI that's actually enjoyable to use

### For Admins
- 👀 View all complaints across the hostel
- 🔍 Search by name, description, or category
- 🏷️ Filter by status (Pending / In Progress / Resolved)
- ✏️ Update complaint status with a single click
- 🚨 High-priority alert banner for urgent issues

### General
- 🔐 JWT authentication with 7-day sessions
- 🌙 Animated full-screen loader
- 💨 Smooth Framer Motion animations throughout
- 📱 Designed for desktops (mobile-ready sidebar)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | NeonDB (PostgreSQL, serverless) |
| Auth | JWT via `jose` + httpOnly cookies |
| Passwords | bcrypt (cost 12) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Toasts | react-hot-toast |
| Deployment | Docker + Nginx |
| CI/CD | GitHub Actions → Docker Hub (`dhyan11/sahyadri-hostel`) |

---

## ⚡ Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Dhyan5/sKILL_lab2026.git
cd sKILL_lab2026/sahyadri-hostel
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL=postgresql://your_user:your_password@your_host/your_db?sslmode=require
JWT_SECRET=your_super_secret_key_here
```

> You can get a free PostgreSQL database at [neon.tech](https://neon.tech) — takes 2 minutes.

### 3. Initialize the database

Start the dev server first, then visit this URL once:

```
http://localhost:3000/api/init
```

This creates the `users` and `complaints` tables automatically. You only need to do this once.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're good to go.

---

## 🐳 Docker

### Build and run the image

```bash
docker build \
  --build-arg DATABASE_URL="your_neondb_url" \
  --build-arg JWT_SECRET="your_secret" \
  -t sahyadri-hostel:latest .

docker run -p 3000:3000 \
  -e DATABASE_URL="your_neondb_url" \
  -e JWT_SECRET="your_secret" \
  sahyadri-hostel:latest
```

### Or use Docker Compose

```bash
# Copy and fill in your env values
cp .env.example .env

docker compose up --build
```

### Pull the pre-built image (if pushed to Docker Hub)

```bash
docker pull dhyan11/sahyadri-hostel:latest
docker run -p 3000:3000 -e DATABASE_URL="..." -e JWT_SECRET="..." dhyan11/sahyadri-hostel:latest
```

---

## 📁 Project Structure

```
sahyadri-hostel/
│
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── auth/               # register, login, logout
│   │   ├── complaints/         # CRUD for complaints
│   │   └── init/               # DB table setup
│   │
│   ├── dashboard/
│   │   ├── student/            # Student pages (overview, submit, my complaints)
│   │   └── admin/              # Admin pages (overview, all complaints)
│   │
│   ├── login/                  # Login page
│   ├── register/               # Registration page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Apple Pro design system tokens
│
├── components/
│   ├── Loader.tsx              # Full-screen animated loader
│   ├── Sidebar.tsx             # Collapsible nav with room number badge
│   ├── Navbar.tsx              # Top bar with dark mode toggle
│   └── ComplaintCard.tsx       # Complaint card with room info for admins
│
├── lib/
│   ├── db.ts                   # NeonDB pool + table initialization
│   └── auth.ts                 # JWT sign/verify using jose
│
├── .github/workflows/          # GitHub Actions CI/CD
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml          # Docker Compose setup
├── nginx.conf                  # Nginx reverse proxy config
└── .env.example                # Example environment variables
```

---

## 🔐 How auth works

1. Student/Admin registers → password is hashed with bcrypt → JWT issued
2. JWT stored as httpOnly cookie (XSS-safe) + in localStorage for API calls
3. Every protected API route verifies the JWT and checks the user's role
4. Admins can only see/update all complaints. Students can only see their own.

---

## 🏠 Room Number Feature

When students register, they enter their room number (e.g. `A-204`). This shows up:
- In the sidebar as a blue pill badge below their name
- As a "YOUR ROOM" card on the dashboard
- On each complaint card visible to admins (so they know exactly which room to go to)

---

## 🤝 Contributing

This project was built for the Sahyadri Hostel as part of a college skill lab project. Feel free to fork it and adapt it for your own hostel!

---

## 📄 License

MIT — do whatever you want with it.

---

