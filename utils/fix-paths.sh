#!/bin/bash

echo "🔧 Fixing JavaScript import paths for GitHub Pages deployment..."

# List of HTML files to fix
HTML_FILES=(
  "cart.html"
  "checkout.html" 
  "login.html"
  "register.html"
  "account.html"
  "product.html"
  "contact.html"
  "forgot-password.html"
)

# Fix each HTML file
for file in "${HTML_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Fixing $file..."
    
    # Fix CSS link
    sed -i '' 's|href="/assets/css/|href="./assets/css/|g' "$file"
    
    # Fix script src
    sed -i '' 's|src="/assets/js/|src="./assets/js/|g' "$file"
    
    # Fix import statements
    sed -i '' "s|from '/assets/js/|from './assets/js/|g" "$file"
    
    echo "✅ Fixed $file"
  else
    echo "⚠️  $file not found"
  fi
done

# Fix JavaScript files themselves
echo "📝 Fixing JavaScript import paths..."

JS_FILES=(
  "assets/js/app.js"
  "assets/js/auth.js"
  "assets/js/cart.js"
  "assets/js/ui.js"
  "assets/js/products.js"
  "assets/js/storage.js"
  "assets/js/validation.js"
  "assets/js/payment.js"
)

for file in "${JS_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Fixing imports in $file..."
    sed -i '' "s|from './|from './|g" "$file"
    sed -i '' "s|from '/assets/js/|from './|g" "$file"
    echo "✅ Fixed $file"
  fi
done

echo ""
echo "🎉 All files have been fixed for GitHub Pages deployment!"
echo "✅ CSS and JS paths now use relative paths (./assets/...)"
echo "✅ Import statements updated to work with GitHub Pages"
echo ""
echo "Next steps:"
echo "1. git add ."
echo "2. git commit -m '🔧 Fix paths for GitHub Pages deployment'"
echo "3. git push origin main"
