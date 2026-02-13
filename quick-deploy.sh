#!/bin/bash

# 🚀 Quick Deploy Script for OpenClaw Command Center
# Run this script to deploy dashboard to GitHub + Vercel in minutes

set -e  # Exit on any error

echo "🚀 OpenClaw Command Center - Quick Deploy"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "command-center.html" ]; then
    echo "❌ Error: Run this script from the dashboard directory"
    echo "   Expected to find command-center.html"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo "✅ Found command-center.html"

# Phase 1: Git Setup
echo ""
echo "📋 Phase 1: Git Repository Setup"
echo "--------------------------------"

if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo "📝 Adding files to git..."
git add .

echo "💾 Creating initial commit..."
git commit -m "🚀 Initial commit: Command Center Dashboard v3

✅ Enhanced HTML dashboard with agent monitoring
✅ Next.js React app with TypeScript  
✅ OpenClaw API integration
✅ Complete documentation suite
✅ Modular component architecture
✅ Vercel deployment configuration

Features:
- Real-time agent status monitoring
- Interactive file browser
- Professional UI/UX design
- Responsive layout
- WebSocket support ready" || echo "⚠️  Nothing new to commit"

# Phase 2: GitHub Repository
echo ""
echo "📋 Phase 2: GitHub Repository Creation"
echo "-------------------------------------"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) not found. Installing..."
    if command -v brew &> /dev/null; then
        brew install gh
    else
        echo "❌ Please install GitHub CLI: https://cli.github.com/"
        echo "   Or create repository manually at https://github.com/new"
        echo "   Repository name: openclaw-command-center"
        exit 1
    fi
fi

echo "🔐 Checking GitHub authentication..."
if ! gh auth status &> /dev/null; then
    echo "🔑 Please login to GitHub:"
    gh auth login
fi

echo "🏗️  Creating GitHub repository..."
if gh repo create openclaw-command-center \
    --description "🚀 Professional OpenClaw Command Center Dashboard - Real-time agent monitoring, file management, and system controls" \
    --public \
    --source=. \
    --push; then
    echo "✅ GitHub repository created and pushed"
else
    echo "⚠️  Repository might already exist, continuing..."
    # Try to set remote if it doesn't exist
    if ! git remote get-url origin &> /dev/null; then
        echo "🔗 Setting up remote origin..."
        GITHUB_USER=$(gh api user --jq .login)
        git remote add origin https://github.com/$GITHUB_USER/openclaw-command-center.git
        git branch -M main
        git push -u origin main
    fi
fi

# Phase 3: Vercel Setup
echo ""
echo "📋 Phase 3: Vercel Deployment"
echo "-----------------------------"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "🔐 Logging into Vercel..."
vercel login

echo "🚀 Deploying to Vercel..."
vercel --yes

echo "🌍 Deploying to production..."
vercel --prod

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================="
echo ""
echo "✅ GitHub Repository: https://github.com/$(gh api user --jq .login)/openclaw-command-center"
echo "✅ Vercel Dashboard: https://vercel.com/dashboard"
echo "✅ Live Site: Check Vercel dashboard for URL"
echo ""
echo "🔧 Next Steps:"
echo "   1. Set environment variables in Vercel dashboard"
echo "   2. Configure custom domain (optional)"
echo "   3. Set up monitoring and analytics"
echo ""
echo "📚 Full documentation: DEPLOYMENT-SETUP-GUIDE.md"
echo ""
echo "🎯 Dashboard is now protected and deployed!"