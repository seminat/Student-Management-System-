# Phase 2 Setup Guide - Student Management Dashboard

## 🎯 Overview

This guide will help you set up the complete development environment for the Student Management Dashboard. Follow these steps in order.

---

## ✅ Prerequisites Installation

### Step 1: Install Node.js

1. **Download Node.js**:
   - Visit: https://nodejs.org/
   - Download the **LTS version** (v20.x or higher)
   - Choose the Windows Installer (.msi)

2. **Install Node.js**:
   - Run the downloaded installer
   - Accept the license agreement
   - Use default installation path
   - **Important**: Check the box "Automatically install the necessary tools"
   - Click "Install"
   - Restart your computer after installation

3. **Verify Installation**:
   ```powershell
   node --version
   # Should show: v20.x.x or higher
   
   npm --version
   # Should show: 10.x.x or higher
   ```

### Step 2: Install Docker Desktop (Recommended)

1. **Download Docker Desktop**:
   - Visit: https://www.docker.com/products/docker-desktop/
   - Download Docker Desktop for Windows

2. **Install Docker Desktop**:
   - Run the installer
   - Enable WSL 2 if prompted
   - Start Docker Desktop
   - Wait for Docker to start (whale icon in system tray)

3. **Verify Installation**:
   ```powershell
   docker --version
   # Should show: Docker version 24.x.x or higher
   
   docker-compose --version
   # Should show: Docker Compose version v2.x.x or higher
   ```

### Step 3: Install Git (if not already installed)

1. **Download Git**:
   - Visit: https://git-scm.com/download/win
   - Download the installer

2. **Install Git**:
   - Run the installer
   - Use default settings
   - Choose "Use Git from Git Bash and also from Windows Command Prompt"

3. **Verify Installation**:
   ```powershell
   git --version
   # Should show: git version 2.x.x or higher
   ```

---

## 🚀 Project Setup

### Step 4: Initialize Git Repository

```powershell
# Navigate to project directory
cd "C:\Users\Admin\OneDrive\Desktop\student management"

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Phase 1 & 2 setup complete"
```

### Step 5: Create Environment File

```powershell
# Copy the example environment file
copy .env.example .env

# The .env file is already configured for local development
# No changes needed unless you want custom settings
```

### Step 6: Start Docker Services

```powershell
# Start PostgreSQL and Redis
docker-compose up -d

# Verify services are running
docker-compose ps

# You should see:
# - student-management-db (PostgreSQL)
# - student-management-redis (Redis)
# - student-management-pgadmin (pgAdmin)
```

**Access pgAdmin** (Database Management UI):
- URL: http://localhost:5050
- Email: admin@studentmanagement.com
- Password: admin

---

## 📦 Backend Setup

### Step 7: Install Backend Dependencies

```powershell
# Navigate to backend directory
cd backend

# Install all dependencies
npm install

# This will install:
# - Express, Prisma, bcrypt, JWT, etc.
# - All TypeScript dependencies
# - Development tools
```

### Step 8: Set up Database

```powershell
# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# When prompted for migration name, enter: init

# Seed the database with sample data
npm run prisma:seed
```

**Expected Output**:
```
✓ Created admin user
✓ Created teacher user
✓ Created classes
✓ Created student: Sam Smith
✓ Created student: Olivier Jones
✓ Created student: Michelle Marie
✓ Created student: Cassandra Brit

✅ Seed data created successfully!

Default credentials:
Admin: admin@school.com / admin123
Teacher: kayla@school.com / teacher123
Student: sam.smith@student.com / student123
```

### Step 9: Test Backend (Optional)

```powershell
# Start the backend development server
npm run dev

# You should see:
# Server running on port 3001
# Database connected successfully
```

Press `Ctrl+C` to stop the server.

---

## 🎨 Frontend Setup

### Step 10: Install Frontend Dependencies

```powershell
# Navigate back to project root
cd ..

# Install frontend dependencies
npm install

# This will install:
# - Next.js, React, TailwindCSS
# - Recharts, Zustand, React Query
# - All development tools
```

### Step 11: Configure Frontend

The frontend is already configured with:
- ✅ TailwindCSS
- ✅ TypeScript
- ✅ ESLint
- ✅ Prettier

No additional configuration needed!

---

## 🧪 Verify Everything Works

### Step 12: Test the Complete Setup

**Terminal 1 - Start Backend**:
```powershell
cd backend
npm run dev
```

**Terminal 2 - Start Frontend**:
```powershell
npm run dev
```

**Access the Application**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- pgAdmin: http://localhost:5050
- Prisma Studio: Run `npm run prisma:studio` in backend folder

---

## 📁 Project Structure

After setup, your project should look like this:

```
student management/
├── .git/                       # Git repository
├── .vscode/                    # VS Code settings
│   ├── extensions.json
│   └── settings.json
├── backend/                    # Backend API
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/                    # (To be created in Phase 3)
│   ├── package.json
│   └── tsconfig.json
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── DESIGN_SYSTEM.md
│   ├── PHASE_1_SUMMARY.md
│   ├── REQUIREMENTS.md
│   └── USER_FLOWS.md
├── .env                        # Environment variables (gitignored)
├── .env.example                # Environment template
├── .eslintrc.json              # ESLint config
├── .gitignore                  # Git ignore rules
├── .prettierrc                 # Prettier config
├── docker-compose.yml          # Docker services
├── package.json                # Frontend dependencies
└── README.md                   # Project overview
```

---

## 🔧 Useful Commands

### Docker Commands

```powershell
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart postgres

# Remove all data and start fresh
docker-compose down -v
docker-compose up -d
```

### Database Commands

```powershell
cd backend

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Create a new migration
npm run prisma:migrate

# Reset database (WARNING: Deletes all data)
npm run prisma:reset

# Generate Prisma Client after schema changes
npm run prisma:generate
```

### Development Commands

```powershell
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Format code

# Backend
cd backend
npm run dev          # Start dev server
npm run build        # Build TypeScript
npm run lint         # Run ESLint
```

---

## 🐛 Troubleshooting

### Issue: "node is not recognized"

**Solution**: Node.js not installed or not in PATH
1. Reinstall Node.js
2. Restart your computer
3. Open a new PowerShell window

### Issue: "docker is not recognized"

**Solution**: Docker not installed or not running
1. Install Docker Desktop
2. Start Docker Desktop
3. Wait for Docker to fully start
4. Open a new PowerShell window

### Issue: "Port 5432 already in use"

**Solution**: PostgreSQL already running locally
1. Stop local PostgreSQL service
2. OR change port in docker-compose.yml to "5433:5432"
3. Update DATABASE_URL in .env to use port 5433

### Issue: "Prisma migrate failed"

**Solution**: Database connection issue
1. Ensure Docker is running: `docker-compose ps`
2. Check .env file has correct DATABASE_URL
3. Try: `docker-compose restart postgres`
4. Wait 10 seconds and try migration again

### Issue: "npm install fails"

**Solution**: Network or permission issue
1. Run PowerShell as Administrator
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules: `Remove-Item -Recurse -Force node_modules`
4. Try again: `npm install`

---

## ✅ Phase 2 Completion Checklist

- [ ] Node.js installed and verified
- [ ] Docker Desktop installed and running
- [ ] Git repository initialized
- [ ] Docker services running (PostgreSQL, Redis, pgAdmin)
- [ ] Backend dependencies installed
- [ ] Database migrated and seeded
- [ ] Frontend dependencies installed
- [ ] Backend dev server starts successfully
- [ ] Frontend dev server starts successfully
- [ ] Can access pgAdmin at http://localhost:5050

---

## 🎉 Next Steps

Once Phase 2 is complete, you're ready for:

**Phase 3: Backend Development**
- Create Express server
- Implement authentication
- Build API endpoints
- Add middleware

**Phase 4: Frontend Development**
- Create UI components
- Build dashboard pages
- Implement state management
- Connect to backend API

---

## 📞 Need Help?

If you encounter any issues:

1. Check the Troubleshooting section above
2. Review error messages carefully
3. Ensure all prerequisites are installed
4. Try restarting Docker and your computer
5. Check that all services are running: `docker-compose ps`

---

## 🔗 Useful Links

- **Node.js Documentation**: https://nodejs.org/docs/
- **Docker Documentation**: https://docs.docker.com/
- **Prisma Documentation**: https://www.prisma.io/docs/
- **Next.js Documentation**: https://nextjs.org/docs
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

---

**Status**: Ready for Phase 2 Execution ✅

Follow the steps above in order, and you'll have a fully configured development environment ready for building the Student Management Dashboard!
