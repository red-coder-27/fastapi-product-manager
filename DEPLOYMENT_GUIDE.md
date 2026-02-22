# 🚀 Deployment Guide - FastAPI + React App

This guide covers multiple deployment options for your Product Management System.

## 📋 Table of Contents
1. [Quick Overview](#quick-overview)
2. [Option 1: Render (Recommended - Free)](#option-1-render-recommended)
3. [Option 2: Vercel + Railway](#option-2-vercel--railway)
4. [Option 3: DigitalOcean/AWS (Production)](#option-3-digitaloceanaws)
5. [Database Hosting](#database-hosting)
6. [Environment Variables](#environment-variables)

---

## Quick Overview

### What You Need to Deploy:
1. **Backend (FastAPI)** - Python application on port 8000
2. **Frontend (React)** - Static files built from React
3. **Database (PostgreSQL)** - Hosted database

### Deployment Strategy:
- **Backend & Database**: Deploy together or separately
- **Frontend**: Deploy as static site pointing to backend API

---

## Option 1: Render (Recommended - Free Tier Available)

### ✅ Advantages:
- Free tier available
- Supports Python, Node.js, PostgreSQL
- Easy deployment from GitHub
- Automatic HTTPS
- No credit card required for free tier

### Step-by-Step Instructions:

#### 1. Prepare Your Code

**A. Create `requirements.txt` in root directory:**

```bash
cd "/home/red-eye/Desktop/Learn Fast-api"
pip freeze > requirements.txt
```

**B. Create `render.yaml` (optional - for automatic setup):**

```yaml
# render.yaml
databases:
  - name: productdb
    databaseName: fastapi_todo
    user: postgres

services:
  - type: web
    name: fastapi-backend
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: productdb
          property: connectionString
      - key: PYTHON_VERSION
        value: 3.13.0
```

**C. Update `main.py` CORS settings:**

```python
# Update CORS to allow your frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend-app.vercel.app",  # Add after deploying frontend
        "*"  # Remove this in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 2. Deploy Backend on Render

1. **Create account**: Go to [render.com](https://render.com) and sign up
2. **Connect GitHub**: Push your code to GitHub first
3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `fastapi-product-api`
     - **Environment**: `Python 3`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
     - **Instance Type**: Free

4. **Add PostgreSQL Database**:
   - Click "New +" → "PostgreSQL"
   - **Name**: `productdb`
   - Choose free tier
   - Copy the "Internal Database URL"

5. **Set Environment Variables** in your web service:
   - Add `DATABASE_URL` = (paste the internal database URL)

6. **Deploy**: Click "Create Web Service"

7. **Your backend URL**: `https://fastapi-product-api.onrender.com`

#### 3. Deploy Frontend on Render

**A. Update frontend API URL:**

Create `frontend/.env.production`:
```env
REACT_APP_API_URL=https://fastapi-product-api.onrender.com
```

Update `frontend/src/App.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

**B. Build the frontend locally:**
```bash
cd frontend
npm run build
```

**C. Deploy on Render:**
1. Create new "Static Site"
2. Connect your GitHub repo
3. Configure:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
4. Deploy

---

## Option 2: Vercel + Railway

### Backend on Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **New Project** → "Deploy from GitHub repo"
4. **Add PostgreSQL**:
   - Click "New" → "Database" → "Add PostgreSQL"
5. **Configure Backend**:
   - Add environment variable `DATABASE_URL` (auto-filled from PostgreSQL)
   - Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Generate Domain**: Click "Settings" → "Generate Domain"

### Frontend on Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up with GitHub**
3. **New Project** → Import your repository
4. **Configure**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. **Environment Variables**:
   - Add `REACT_APP_API_URL` = your Railway backend URL
6. **Deploy**

---

## Option 3: DigitalOcean/AWS (Production Grade)

### Using DigitalOcean App Platform

1. **Create Droplet or use App Platform**
2. **Deploy Backend**:
   - Use Docker container or direct Python deployment
   - Connect to managed PostgreSQL database
3. **Deploy Frontend**:
   - Build static files
   - Serve via Nginx or CDN

### Using AWS

1. **Backend**: Deploy on EC2 or Elastic Beanstalk
2. **Database**: RDS PostgreSQL
3. **Frontend**: S3 + CloudFront
4. **Domain**: Route 53

---

## Database Hosting Options

### Free Options:

1. **Render PostgreSQL** (recommended)
   - Free tier: 90 days, then expires
   - Easy integration with Render apps

2. **ElephantSQL** (free-db.elephantsql.com)
   - Free tier: 20MB storage
   - Reliable for small projects

3. **Supabase** (supabase.com)
   - Free tier: 500MB storage
   - Includes bonus features

4. **Railway** (railway.app)
   - $5 free credit monthly
   - Easy to use

### Paid Options:

1. **DigitalOcean Managed PostgreSQL** - $15/month
2. **AWS RDS** - Pay as you go
3. **Heroku Postgres** - $5/month+

---

## Preparing for Deployment

### 1. Create `requirements.txt`

```bash
cd "/home/red-eye/Desktop/Learn Fast-api"
pip freeze > requirements.txt
```

### 2. Create `Procfile` (for Heroku/some platforms)

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 3. Create `.gitignore`

```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
myenv/
venv/
env/

# Environment
.env
.env.local

# React
frontend/node_modules/
frontend/build/
frontend/.env.production.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

### 4. Update Frontend for Production

**Create `frontend/.env.production`:**
```env
REACT_APP_API_URL=https://your-backend-url.com
```

**Update `frontend/package.json`** add proxy (optional):
```json
"proxy": "http://localhost:8000"
```

### 5. Build Frontend

```bash
cd frontend
npm run build
```

This creates optimized production files in `frontend/build/`

---

## Environment Variables Needed

### Backend (.env):
```env
DATABASE_URL=postgresql://user:password@host:port/dbname
PORT=8000
CORS_ORIGINS=https://your-frontend-url.com
```

### Frontend (.env.production):
```env
REACT_APP_API_URL=https://your-backend-url.com
```

---

## Post-Deployment Checklist

- [ ] Backend is accessible at your URL
- [ ] Database connection works
- [ ] API docs accessible at `/docs`
- [ ] Frontend loads correctly
- [ ] Frontend can fetch data from backend
- [ ] CORS is properly configured
- [ ] Environment variables are set
- [ ] HTTPS is enabled (automatic on most platforms)
- [ ] Test all CRUD operations

---

## Quick Deploy Commands

### Push to GitHub:
```bash
cd "/home/red-eye/Desktop/Learn Fast-api"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### Build Frontend:
```bash
cd frontend
npm run build
```

### Test Production Build Locally:
```bash
# Backend
uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend (install serve first: npm install -g serve)
cd frontend
serve -s build -l 3000
```

---

## Troubleshooting

### CORS Errors:
1. Update `allow_origins` in `main.py`
2. Add your frontend URL
3. Redeploy backend

### Database Connection:
1. Check `DATABASE_URL` format
2. Ensure database is accessible from your host
3. Check firewall rules

### Frontend Can't Reach Backend:
1. Verify `REACT_APP_API_URL` is correct
2. Check CORS settings
3. Ensure backend is running

### Build Failures:
1. Check `requirements.txt` is complete
2. Verify Python version compatibility
3. Check logs for specific errors

---

## Cost Estimates

### Free Tier (Hobby Projects):
- **Render**: Free backend + Free PostgreSQL (90 days)
- **Vercel**: Free frontend
- **Total**: $0/month (great for learning)

### Basic Production:
- **Backend**: Render Starter ($7/month)
- **Database**: Render PostgreSQL ($7/month)
- **Frontend**: Vercel Pro ($20/month) or Render ($7/month)
- **Total**: $14-34/month

### Recommended for Beginners:
**Render (All-in-One)**:
- Backend + Database + Frontend: Free tier to start
- Upgrade as needed

---

## Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/

---

## Your Next Steps:

1. ✅ Create accounts on Render/Vercel
2. ✅ Push code to GitHub
3. ✅ Deploy backend first (with database)
4. ✅ Update frontend with backend URL
5. ✅ Deploy frontend
6. ✅ Test everything works
7. ✅ Share your live app! 🎉
