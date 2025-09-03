#!/bin/bash

# 🚀 Sweet Frozen E-commerce GitHub Setup Script
echo "🍦 Setting up Sweet Frozen E-commerce on GitHub..."

# Check if username is provided
if [ -z "$1" ]; then
    echo "❌ Please provide your GitHub username as an argument"
    echo "Usage: ./setup-github.sh YOUR_GITHUB_USERNAME"
    echo "Example: ./setup-github.sh ovenkung"
    exit 1
fi

USERNAME=$1
REPO_NAME="sweet-frozen-ecommerce"

echo "👤 GitHub Username: $USERNAME"
echo "📁 Repository Name: $REPO_NAME"
echo ""

# Add remote origin
echo "🔗 Adding GitHub remote..."
git remote add origin https://github.com/$USERNAME/$REPO_NAME.git

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your repository is now on GitHub!"
    echo "🌐 Repository URL: https://github.com/$USERNAME/$REPO_NAME"
    echo "📝 Don't forget to:"
    echo "   1. Go to Settings > Pages"
    echo "   2. Set Source to 'GitHub Actions'"
    echo "   3. Wait for deployment to complete"
    echo ""
    echo "🎉 Your website will be available at:"
    echo "   https://$USERNAME.github.io/$REPO_NAME"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "   1. Repository exists on GitHub"
    echo "   2. You have push permissions"
    echo "   3. Your GitHub credentials are correct"
fi
