#!/bin/bash

echo "🔧 Fixing ALL absolute paths to relative paths for GitHub Pages..."

# Fix all HTML files for navigation links in JavaScript code blocks
find . -name "*.html" -not -path "./node_modules/*" -exec sed -i '' 's|href="/product\.html|href="./product.html|g' {} \;
find . -name "*.html" -not -path "./node_modules/*" -exec sed -i '' 's|href="/index\.html|href="./index.html|g' {} \;
find . -name "*.html" -not -path "./node_modules/*" -exec sed -i '' 's|href="/cart\.html|href="./cart.html|g' {} \;
find . -name "*.html" -not -path "./node_modules/*" -exec sed -i '' 's|href="/login\.html|href="./login.html|g' {} \;
find . -name "*.html" -not -path "./node_modules/*" -exec sed -i '' 's|href="/register\.html|href="./register.html|g' {} \;
find . -name "*.html" -not -path "./node_modules/*" -exec sed -i '' 's|href="/account\.html|href="./account.html|g' {} \;
find . -name "*.html" -not -path "./node_modules/*" -exec sed -i '' 's|href="/contact\.html|href="./contact.html|g' {} \;
find . -name "*.html" -not -path "./node_modules/*" -exec sed -i '' 's|href="/checkout\.html|href="./checkout.html|g' {} \;
find . -name "*.html" -not -path "./node_modules/*" -exec sed -i '' 's|href="/forgot-password\.html|href="./forgot-password.html|g' {} \;

# Fix home link
find . -name "*.html" -not -path "./node_modules/*" -exec sed -i '' 's|href="/"|href="./index.html"|g' {} \;

# Fix any remaining CSS links
find . -name "*.html" -not -path "./node_modules/*" -exec sed -i '' 's|href="/assets/css/|href="./assets/css/|g' {} \;

# Check for any location.href redirects in JavaScript inline code
find . -name "*.html" -not -path "./node_modules/*" -exec sed -i '' 's|location\.href *= *"/|location.href = "./|g' {} \;
find . -name "*.html" -not -path "./node_modules/*" -exec sed -i '' "s|location\.href *= *'/|location.href = './|g" {} \;

# Check JavaScript files for any missed redirects
find . -name "*.js" -not -path "./node_modules/*" -exec sed -i '' 's|location\.href *= *"/|location.href = "./|g' {} \;
find . -name "*.js" -not -path "./node_modules/*" -exec sed -i '' "s|location\.href *= *'/|location.href = './|g" {} \;

echo "✅ Fixed all absolute paths to relative paths"
echo "📝 Updated paths in:"
echo "   - Navigation links in HTML"
echo "   - CSS asset links"
echo "   - JavaScript redirects"
echo "   - Product links"
echo ""
echo "🚀 Ready for GitHub Pages deployment!"
