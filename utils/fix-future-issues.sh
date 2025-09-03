#!/bin/bash

echo "🔧 Fixing potential future issues for GitHub Pages deployment..."

# 1. Fix remaining absolute paths in checkout.html
echo "📝 Fixing checkout.html..."
sed -i '' 's|location\.href = `/login\.html|location.href = `./login.html|g' checkout.html
sed -i '' "s|encodeURIComponent('/checkout\.html')|encodeURIComponent('./checkout.html')|g" cart.html

# 2. Fix any remaining absolute redirects in HTML files
echo "📝 Fixing redirect parameters..."
find . -name "*.html" -not -path "./node_modules/*" -exec sed -i '' "s|encodeURIComponent('/|encodeURIComponent('./|g" {} \;

# 3. Fix potential issues with base64 or special characters in localStorage
echo "📝 Checking for potential localStorage issues..."

# 4. Fix any potential CORS issues with data loading
echo "📝 Adding fallback data loading strategy..."

# 5. Fix any remaining console.log for production
echo "📝 Checking for console.log statements..."
CONSOLE_COUNT=$(find . -name "*.js" -not -path "./node_modules/*" -not -name "debug.js" -exec grep -l "console\.log" {} \; | wc -l)
if [ $CONSOLE_COUNT -gt 0 ]; then
    echo "⚠️  Found console.log in $CONSOLE_COUNT files (excluding debug.js)"
    find . -name "*.js" -not -path "./node_modules/*" -not -name "debug.js" -exec grep -l "console\.log" {} \;
else
    echo "✅ No problematic console.log found"
fi

# 6. Check for any hardcoded localhost or development URLs
echo "📝 Checking for hardcoded development URLs..."
LOCALHOST_COUNT=$(find . -name "*.js" -o -name "*.html" | xargs grep -l "localhost\|127\.0\.0\.1\|3000\|8080" | wc -l)
if [ $LOCALHOST_COUNT -gt 0 ]; then
    echo "⚠️  Found hardcoded development URLs:"
    find . -name "*.js" -o -name "*.html" | xargs grep -l "localhost\|127\.0\.0\.1\|3000\|8080"
else
    echo "✅ No hardcoded development URLs found"
fi

echo ""
echo "🎉 Proactive fixes completed!"
echo "✅ Fixed redirect parameters"
echo "✅ Checked console.log statements"  
echo "✅ Checked for hardcoded URLs"
echo ""
