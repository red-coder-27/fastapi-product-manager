#!/bin/bash

# FastAPI + React Deployment Helper Script

echo "🚀 FastAPI + React Deployment Helper"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git branch -M main
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

echo ""
echo "📝 Checking deployment files..."

# Check requirements.txt
if [ -f requirements.txt ]; then
    echo "✅ requirements.txt exists"
else
    echo "⚠️  requirements.txt missing - generating..."
    source myenv/bin/activate
    pip freeze > requirements.txt
    echo "✅ requirements.txt created"
fi

# Check Procfile
if [ -f Procfile ]; then
    echo "✅ Procfile exists"
else
    echo "⚠️  Procfile missing - creating..."
    echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile
    echo "✅ Procfile created"
fi

# Check .gitignore
if [ -f .gitignore ]; then
    echo "✅ .gitignore exists"
else
    echo "⚠️  .gitignore missing - please create one"
fi

echo ""
echo "🔧 Git Status:"
git status --short

echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Add files to git:"
echo "   git add ."
echo ""
echo "2️⃣  Commit changes:"
echo "   git commit -m 'Prepare for deployment'"
echo ""
echo "3️⃣  Create GitHub repository and push:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo "   git push -u origin main"
echo ""
echo "4️⃣  Deploy Backend (Choose one):"
echo "   📍 Render: https://render.com (Recommended)"
echo "   📍 Railway: https://railway.app"
echo "   📍 Heroku: https://heroku.com"
echo ""
echo "5️⃣  Deploy Frontend:"
echo "   📍 Vercel: https://vercel.com"
echo "   📍 Netlify: https://netlify.com"
echo "   📍 Render: https://render.com"
echo ""
echo "📖 For detailed instructions, see: DEPLOYMENT_GUIDE.md"
echo ""
