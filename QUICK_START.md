# 🚀 Quick Start - Student Management Dashboard

## ⚡ Prerequisites (Install These First)

### 1. Node.js v20+
**Download**: https://nodejs.org/
- Choose LTS version
- Windows Installer (.msi)
- Restart computer after install

### 2. Docker Desktop
**Download**: https://www.docker.com/products/docker-desktop/
- Install and start Docker
- Wait for whale icon in system tray

---

## 📦 Setup Commands (Run After Prerequisites)

### Step 1: Create Environment File
```powershell
cd "C:\Users\Admin\OneDrive\Desktop\student management"
copy .env.example .env
```

### Step 2: Start Docker Services
```powershell
docker-compose up -d
```

### Step 3: Setup Backend
```powershell
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Step 4: Setup Frontend
```powershell
cd ..
npx create-next-app@latest . --typescript --tailwind --app --use-npm
npm install recharts date-fns zustand react-hook-form zod lucide-react axios @tanstack/react-query clsx tailwind-merge
```

### Step 5: Start Development Servers

**Terminal 1 - Backend**:
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```powershell
npm run dev
```

---

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **pgAdmin**: http://localhost:5050
- **Prisma Studio**: `npm run prisma:studio` (in backend folder)

---

## 🔑 Default Login Credentials

After seeding the database:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | admin123 |
| Teacher | kayla@school.com | teacher123 |
| Student | sam.smith@student.com | student123 |

---

## 🛠️ Useful Commands

### Docker
```powershell
docker-compose up -d      # Start services
docker-compose down       # Stop services
docker-compose ps         # Check status
docker-compose logs -f    # View logs
```

### Database
```powershell
cd backend
npm run prisma:studio     # Open database GUI
npm run prisma:migrate    # Create migration
npm run prisma:seed       # Seed database
npm run prisma:reset      # Reset database
```

### Development
```powershell
# Frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Check code quality

# Backend
cd backend
npm run dev              # Start dev server
npm run build            # Compile TypeScript
```

---

## 📚 Documentation

- **Setup Guide**: `SETUP_GUIDE.md` (detailed instructions)
- **Phase 2 Summary**: `PHASE_2_SUMMARY.md` (what was created)
- **Architecture**: `docs/ARCHITECTURE.md`
- **Database**: `docs/DATABASE_SCHEMA.md`
- **Design System**: `docs/DESIGN_SYSTEM.md`

---

## ❓ Troubleshooting

### "node is not recognized"
→ Install Node.js and restart computer

### "docker is not recognized"
→ Install Docker Desktop and start it

### "Port already in use"
→ Stop conflicting service or change port in docker-compose.yml

### "Database connection failed"
→ Ensure Docker is running: `docker-compose ps`

---

## ✅ Quick Checklist

- [ ] Node.js installed (`node --version`)
- [ ] Docker installed and running
- [ ] `.env` file created
- [ ] Docker services started
- [ ] Backend dependencies installed
- [ ] Database migrated and seeded
- [ ] Frontend dependencies installed
- [ ] Both dev servers running

---

## 🎯 What's Next?

After setup is complete:

**Phase 3**: Backend Development
- Create Express server
- Implement authentication
- Build API endpoints

**Phase 4**: Frontend Development
- Create UI components
- Build dashboard pages
- Connect to backend

---

**Need Help?** See `SETUP_GUIDE.md` for detailed instructions!
