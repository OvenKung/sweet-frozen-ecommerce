#!/usr/bin/env node

// Production readiness checker
console.log('🔍 Checking production readiness...\n');

const fs = require('fs');
const path = require('path');

let issues = [];
let warnings = [];

// 1. Check for absolute paths in HTML/JS files
console.log('📄 Checking for absolute paths...');
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const jsFiles = fs.readdirSync('./assets/js').filter(f => f.endsWith('.js'));

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Check for problematic absolute paths
  if (content.includes('href="/assets') || content.includes('src="/assets')) {
    issues.push(`${file}: Contains absolute asset paths`);
  }
  
  if (content.includes('href="/index.html') || content.includes('href="/cart.html')) {
    issues.push(`${file}: Contains absolute page links`);
  }
  
  if (content.includes('location.href = "/') && !content.includes('location.href = "./')) {
    issues.push(`${file}: Contains absolute redirects`);
  }
});

jsFiles.forEach(file => {
  const content = fs.readFileSync(`./assets/js/${file}`, 'utf8');
  
  if (content.includes("fetch('/assets") && !content.includes("fetch('./assets")) {
    issues.push(`assets/js/${file}: Contains absolute fetch paths`);
  }
  
  if (content.includes("location.href = '/") && !content.includes("location.href = './")) {
    issues.push(`assets/js/${file}: Contains absolute redirects`);
  }
});

// 2. Check for console.log in production files
console.log('🔍 Checking for console.log statements...');
jsFiles.forEach(file => {
  if (file === 'debug.js') return; // Skip debug file
  
  const content = fs.readFileSync(`./assets/js/${file}`, 'utf8');
  const consoleCount = (content.match(/console\.log/g) || []).length;
  
  if (consoleCount > 0) {
    warnings.push(`assets/js/${file}: Contains ${consoleCount} console.log statements`);
  }
});

// 3. Check for required files
console.log('📋 Checking required files...');
const requiredFiles = [
  'index.html',
  'login.html', 
  'cart.html',
  'checkout.html',
  'account.html',
  'assets/js/app.js',
  'assets/js/auth.js',
  'assets/js/cart.js',
  'assets/js/ui.js',
  'assets/js/products.js',
  'assets/css/styles.css',
  '.nojekyll'
];

requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    issues.push(`Missing required file: ${file}`);
  }
});

// 4. Check data files
console.log('📊 Checking data files...');
const dataFiles = [
  'assets/data/users.json',
  'assets/data/ice-creams.json',
  'assets/data/categories.json',
  'assets/data/reviews.json',
  'assets/data/coupons.json',
  'assets/data/orders.json'
];

dataFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        console.log(`✅ ${file}: ${data.length} items`);
      } else {
        warnings.push(`${file}: Empty or invalid data structure`);
      }
    } catch (error) {
      issues.push(`${file}: Invalid JSON - ${error.message}`);
    }
  } else {
    warnings.push(`${file}: Missing (will use fallback data)`);
  }
});

// 5. Check for ES6 module compatibility
console.log('📦 Checking ES6 modules...');
jsFiles.forEach(file => {
  const content = fs.readFileSync(`./assets/js/${file}`, 'utf8');
  
  if (content.includes('import ') && !content.includes('export ')) {
    warnings.push(`assets/js/${file}: Has imports but no exports`);
  }
});

// 6. Check GitHub Pages configuration
console.log('🚀 Checking GitHub Pages config...');
if (!fs.existsSync('.github/workflows/deploy.yml')) {
  warnings.push('Missing GitHub Actions workflow');
}

if (!fs.existsSync('.nojekyll')) {
  issues.push('Missing .nojekyll file (required for GitHub Pages)');
}

// 7. Generate report
console.log('\n' + '='.repeat(60));
console.log('📋 PRODUCTION READINESS REPORT');
console.log('='.repeat(60));

if (issues.length === 0) {
  console.log('✅ No critical issues found!');
} else {
  console.log(`❌ Found ${issues.length} critical issues:`);
  issues.forEach(issue => console.log(`   • ${issue}`));
}

if (warnings.length > 0) {
  console.log(`\n⚠️  Found ${warnings.length} warnings:`);
  warnings.forEach(warning => console.log(`   • ${warning}`));
}

console.log('\n🎯 RECOMMENDATIONS:');
console.log('   • Test all functionality on GitHub Pages after deployment');
console.log('   • Check browser console for JavaScript errors');
console.log('   • Verify all images and assets load correctly'); 
console.log('   • Test login/logout functionality');
console.log('   • Test shopping cart and checkout process');

// Exit with error code if there are critical issues
if (issues.length > 0) {
  console.log('\n❌ Production readiness: FAILED');
  process.exit(1);
} else {
  console.log('\n✅ Production readiness: PASSED');
  process.exit(0);
}
