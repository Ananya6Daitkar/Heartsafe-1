#!/bin/bash

# HeartSafe AI - Push to GitHub Script

echo "🚀 HeartSafe AI - GitHub Push Script"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Run 'git init' first."
    exit 1
fi

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required."
    exit 1
fi

# Repository name
REPO_NAME="heartsafe-ai"

echo ""
echo "📋 Configuration:"
echo "  Username: $GITHUB_USERNAME"
echo "  Repository: $REPO_NAME"
echo "  URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo ""

# Confirm
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled."
    exit 1
fi

echo ""
echo "📦 Checking git status..."
git status

echo ""
echo "🔗 Adding remote..."
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

echo ""
echo "🌿 Renaming branch to main..."
git branch -M main

echo ""
echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "🎉 Your repository is now available at:"
echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "📝 Next steps:"
echo "   1. Visit your GitHub repository"
echo "   2. Add a description and topics"
echo "   3. Enable GitHub Pages (optional)"
echo "   4. Add to your portfolio"
echo ""
