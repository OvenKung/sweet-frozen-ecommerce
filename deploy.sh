#!/bin/bash

echo "🚀 Sweet Frozen E-commerce - Final Deployment"
echo "=============================================="
echo ""

# ตรวจสอบสถานะ Git
echo "📋 Checking Git status..."
git status --short

echo ""
echo "🔍 Running final production check..."
npm run production-check

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Production check passed! Ready for deployment."
    echo ""
    
    # เพิ่มไฟล์ทั้งหมด
    echo "📦 Adding all files..."
    git add .
    
    # Commit พร้อม timestamp
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    echo "💾 Committing changes..."
    git commit -m "🚀 Production deployment with comprehensive monitoring - $TIMESTAMP

✅ Features implemented:
- Complete CI/CD pipeline with GitHub Actions
- JavaScript path fixes for GitHub Pages compatibility  
- Production-grade error handling and monitoring
- Real-time performance tracking
- Fallback data systems for reliability
- Automated deployment validation
- Comprehensive debugging tools

🏥 Production monitoring includes:
- Health checks every 30 seconds
- Error tracking and recovery
- Performance analytics
- User experience monitoring
- Resource loading validation

🎯 Ready for production deployment!"
    
    echo ""
    echo "🌐 Pushing to GitHub..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 SUCCESS! Deployment initiated!"
        echo ""
        echo "📍 Your website will be available at:"
        echo "   https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/' | sed 's/\//.github.io\//')"
        echo ""
        echo "⏰ Note: It may take 2-5 minutes for changes to appear on GitHub Pages"
        echo ""
        echo "🔧 To monitor deployment:"
        echo "   1. Check GitHub Actions: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
        echo "   2. Enable GitHub Pages in repository settings if not already enabled"
        echo "   3. Open browser console on your site to see production monitoring data"
        echo ""
        echo "📊 Debug commands after deployment:"
        echo "   getProductionHealth()    - Check site health"
        echo "   getProductionErrors()    - View error summary"
        echo "   window.PathManager.test() - Test path management"
        echo ""
        echo "🎯 Happy coding! Your e-commerce site is now live with full monitoring! 🛍️"
    else
        echo "❌ Error: Failed to push to GitHub. Please check your connection and try again."
        exit 1
    fi
else
    echo ""
    echo "❌ Production check failed. Please fix the issues above before deploying."
    exit 1
fi
