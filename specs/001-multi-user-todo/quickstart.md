# Quickstart Guide: Multi-User Todo Application

**Feature**: 001-multi-user-todo
**Date**: 2026-01-07
**Purpose**: Enable developers to set up and run the application locally

## Overview

This guide will help you set up the Multi-User Todo Application on your local machine for development. The application consists of a Next.js frontend, FastAPI backend, and Neon PostgreSQL database.

**Estimated Setup Time**: 15-20 minutes

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (v20.x or later)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **Python** (v3.11 or later)
   - Download: https://www.python.org/downloads/
   - Verify: `python --version` or `python3 --version`

3. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

4. **Package Managers**
   - npm (comes with Node.js)
   - pip (comes with Python)

### Optional but Recommended

- **VS Code** or your preferred code editor
- **Postman** or **Thunder Client** for API testing
- **PostgreSQL client** (e.g., pgAdmin, DBeaver) for database inspection

---

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd TodoApp
git checkout 001-multi-user-todo
```

---

## Step 2: Database Setup (Neon PostgreSQL)

### Create Neon Account and Database

1. Go to https://neon.tech and sign up for a free account
2. Create a new project named "todo-app"
3. Copy the connection string (format: `postgresql://user:pass@host/db`)

### Configure Database Connection

The connection string will be used in environment variables (next step).

**Note**: Neon automatically creates the database and handles connection pooling. No manual database creation needed.

---

## Step 3: Environment Configuration

### Backend Environment Variables

Create `backend/.env` file:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host/db?sslmode=require

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long-random-string
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# CORS
CORS_ORIGINS=http://localhost:3000

# Application
APP_ENV=development
DEBUG=true
```

**Important**: Replace `DATABASE_URL` with your Neon connection string. Change `postgresql://` to `postgresql+asyncpg://` for async support.

**Security Note**: Generate a strong JWT_SECRET using:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Frontend Environment Variables

Create `frontend/.env.local` file:

```bash
cd ../frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Configuration
BETTER_AUTH_SECRET=your-super-secret-auth-key-min-32-chars-long-random-string
BETTER_AUTH_URL=http://localhost:3000
```

**Important**: Generate a strong BETTER_AUTH_SECRET using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Step 4: Backend Setup

### Install Python Dependencies

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Run Database Migrations

```bash
# Initialize Alembic (first time only)
alembic init migrations

# Generate initial migration
alembic revision --autogenerate -m "Initial schema"

# Apply migrations
alembic upgrade head
```

**Note**: If migrations fail, check your DATABASE_URL and ensure Neon database is accessible.

### Start Backend Server

```bash
# Development server with auto-reload
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Verify Backend**:
- Open http://localhost:8000/docs in your browser
- You should see the FastAPI Swagger UI with API documentation

---

## Step 5: Frontend Setup

Open a new terminal (keep backend running).

### Install Node Dependencies

```bash
cd frontend

# Install dependencies
npm install
```

**Expected Duration**: 2-3 minutes

### Start Frontend Development Server

```bash
npm run dev
```

**Expected Output**:
```
▲ Next.js 16.x.x
- Local:        http://localhost:3000
- Ready in 2.5s
```

**Verify Frontend**:
- Open http://localhost:3000 in your browser
- You should see the application home page

---

## Step 6: Test the Application

### Create a Test Account

1. Navigate to http://localhost:3000/signup
2. Enter test credentials:
   - Email: `test@example.com`
   - Password: `testpassword123`
3. Click "Sign Up"
4. You should be redirected to the dashboard

### Create a Test Task

1. On the dashboard, click "New Task" or "+"
2. Enter task details:
   - Title: "Test Task"
   - Description: "This is a test task"
   - Priority: "High"
   - Due Date: Tomorrow's date
3. Click "Create"
4. Task should appear in your task list

### Test Task Operations

1. **View**: Click on the task to see details
2. **Edit**: Click "Edit" and modify the title
3. **Complete**: Click the checkbox to mark as complete
4. **Filter**: Use the filter dropdown to show only completed tasks
5. **Search**: Type "test" in the search box
6. **Delete**: Click "Delete" to remove the task

### Test Authentication

1. Log out using the logout button
2. Try to access http://localhost:3000/dashboard directly
3. You should be redirected to the login page
4. Log back in with your test credentials

---

## Step 7: Verify API Endpoints

### Using Swagger UI

1. Open http://localhost:8000/docs
2. Click "Authorize" button
3. Log in to get JWT token (use frontend to log in, then inspect browser cookies or localStorage)
4. Enter token in format: `Bearer <your-token>`
5. Try the following endpoints:
   - `GET /api/{user_id}/tasks` - List tasks
   - `POST /api/{user_id}/tasks` - Create task
   - `GET /api/{user_id}/tasks/{task_id}` - Get specific task

### Using cURL

```bash
# Get JWT token (after logging in via frontend)
TOKEN="your-jwt-token-here"
USER_ID="your-user-id-here"

# List tasks
curl -X GET "http://localhost:8000/api/$USER_ID/tasks" \
  -H "Authorization: Bearer $TOKEN"

# Create task
curl -X POST "http://localhost:8000/api/$USER_ID/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Test Task",
    "description": "Created via cURL",
    "priority": "medium",
    "due_date": "2026-01-15"
  }'
```

---

## Development Workflow

### Running Both Servers

**Option 1: Two Terminals**
- Terminal 1: `cd backend && uvicorn src.main:app --reload`
- Terminal 2: `cd frontend && npm run dev`

**Option 2: Using tmux/screen** (Linux/macOS)
```bash
# Start tmux session
tmux new -s todo-dev

# Split window
Ctrl+B then "

# Navigate between panes
Ctrl+B then arrow keys

# Run backend in one pane, frontend in other
```

**Option 3: Using VS Code Tasks**
Create `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Backend",
      "type": "shell",
      "command": "cd backend && uvicorn src.main:app --reload",
      "isBackground": true
    },
    {
      "label": "Start Frontend",
      "type": "shell",
      "command": "cd frontend && npm run dev",
      "isBackground": true
    }
  ]
}
```

### Hot Reload

Both servers support hot reload:
- **Backend**: Uvicorn auto-reloads on Python file changes
- **Frontend**: Next.js Fast Refresh on React component changes

### Debugging

**Backend (Python)**:
- Add breakpoints in VS Code
- Use Python debugger: `import pdb; pdb.set_trace()`
- Check logs in terminal

**Frontend (Next.js)**:
- Use browser DevTools (F12)
- Check console for errors
- Use React DevTools extension

---

## Common Issues & Solutions

### Issue: Backend won't start - "ModuleNotFoundError"

**Solution**: Ensure virtual environment is activated and dependencies installed
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Issue: Frontend won't start - "Cannot find module"

**Solution**: Delete node_modules and reinstall
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database connection error

**Solution**: Verify DATABASE_URL in backend/.env
- Check Neon dashboard for correct connection string
- Ensure `postgresql+asyncpg://` prefix (not just `postgresql://`)
- Verify `?sslmode=require` is appended

### Issue: CORS errors in browser console

**Solution**: Check CORS_ORIGINS in backend/.env matches frontend URL
```env
CORS_ORIGINS=http://localhost:3000
```

### Issue: JWT token invalid or expired

**Solution**:
- Clear browser cookies/localStorage
- Log out and log back in
- Verify JWT_SECRET matches between frontend and backend

### Issue: Port already in use

**Solution**: Kill process using the port
```bash
# Find process on port 8000 (backend)
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

---

## Testing Checklist

Before considering setup complete, verify:

- [ ] Backend server running on http://localhost:8000
- [ ] Frontend server running on http://localhost:3000
- [ ] Can access Swagger UI at http://localhost:8000/docs
- [ ] Can create a new account via signup page
- [ ] Can log in with created account
- [ ] Can create a new task
- [ ] Can view task list
- [ ] Can edit a task
- [ ] Can mark task as complete
- [ ] Can filter tasks by status
- [ ] Can search tasks by keyword
- [ ] Can delete a task
- [ ] Can log out
- [ ] Protected routes redirect to login when not authenticated

---

## Next Steps

### For Development

1. **Read the specification**: `specs/001-multi-user-todo/spec.md`
2. **Review the plan**: `specs/001-multi-user-todo/plan.md`
3. **Check data model**: `specs/001-multi-user-todo/data-model.md`
4. **Review API contracts**: `specs/001-multi-user-todo/contracts/api-spec.yaml`

### For Implementation

1. Run `/sp.tasks` to generate detailed task breakdown
2. Follow tasks in priority order (P1 → P6)
3. Commit changes regularly
4. Test each feature before moving to next

### For Deployment

See deployment section in `plan.md` for:
- Vercel deployment (frontend)
- Koyeb deployment (backend)
- Environment variable configuration
- Production considerations

---

## Useful Commands

### Backend

```bash
# Start server
uvicorn src.main:app --reload

# Run migrations
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "description"

# Rollback migration
alembic downgrade -1

# Python shell with app context
python -i -c "from src.main import app"
```

### Frontend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npm run type-check
```

### Database

```bash
# Connect to Neon database (using psql)
psql "postgresql://user:pass@host/db?sslmode=require"

# List tables
\dt

# Describe table
\d tasks

# Query tasks
SELECT * FROM tasks LIMIT 10;
```

---

## Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **SQLModel Documentation**: https://sqlmodel.tiangolo.com/
- **Better Auth Documentation**: https://better-auth.com
- **Neon Documentation**: https://neon.tech/docs
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs

---

## Support

If you encounter issues not covered in this guide:

1. Check the specification for requirements clarification
2. Review the implementation plan for architecture decisions
3. Consult the data model for database schema details
4. Check the API contracts for endpoint specifications
5. Ask for help in the project chat/issues

---

**Happy Coding! 🚀**
