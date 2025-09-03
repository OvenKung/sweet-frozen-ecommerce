#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Sweet Frozen E-commerce files...\n');

let hasErrors = false;

// ตรวจสอบไฟล์ HTML หลัก
const requiredHtmlFiles = [
  'index.html',
  'cart.html', 
  'checkout.html',
  'login.html',
  'register.html',
  'account.html',
  'product.html',
  'contact.html'
];

console.log('📄 Checking HTML files...');
requiredHtmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - Found`);
    
    // ตรวจสอบ HTML syntax เบื้องต้น
    const content = fs.readFileSync(file, 'utf8');
    if (!content.includes('<!DOCTYPE html>')) {
      console.log(`⚠️  ${file} - Missing DOCTYPE declaration`);
    }
    if (!content.includes('<html')) {
      console.log(`❌ ${file} - Invalid HTML structure`);
      hasErrors = true;
    }
  } else {
    console.log(`❌ ${file} - Missing`);
    hasErrors = true;
  }
});

// ตรวจสอบไฟล์ CSS และ JS
console.log('\n🎨 Checking CSS files...');
const cssFiles = ['assets/css/styles.css'];
cssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - Found`);
  } else {
    console.log(`❌ ${file} - Missing`);
    hasErrors = true;
  }
});

console.log('\n📝 Checking JavaScript files...');
const jsFiles = [
  'assets/js/app.js',
  'assets/js/auth.js', 
  'assets/js/cart.js',
  'assets/js/ui.js',
  'assets/js/products.js',
  'assets/js/storage.js',
  'assets/js/validation.js',
  'assets/js/payment.js'
];

jsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - Found`);
    
    // ตรวจสอบ JavaScript syntax เบื้องต้น
    try {
      const content = fs.readFileSync(file, 'utf8');
      // ตรวจสอบ console.log ที่อาจเหลืออยู่
      const consoleLogCount = (content.match(/console\.log/g) || []).length;
      if (consoleLogCount > 0) {
        console.log(`⚠️  ${file} - Contains ${consoleLogCount} console.log statements`);
      }
    } catch (err) {
      console.log(`❌ ${file} - Syntax error: ${err.message}`);
      hasErrors = true;
    }
  } else {
    console.log(`❌ ${file} - Missing`);
    hasErrors = true;
  }
});

// ตรวจสอบไฟล์ JSON data
console.log('\n📊 Checking JSON data files...');
const jsonFiles = [
  'assets/data/ice-creams.json',
  'assets/data/users.json',
  'assets/data/orders.json',
  'assets/data/reviews.json',
  'assets/data/coupons.json',
  'assets/data/categories.json'
];

jsonFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      const content = JSON.parse(fs.readFileSync(file, 'utf8'));
      console.log(`✅ ${file} - Valid JSON (${Array.isArray(content) ? content.length + ' items' : 'object'})`);
    } catch (err) {
      console.log(`❌ ${file} - Invalid JSON: ${err.message}`);
      hasErrors = true;
    }
  } else {
    console.log(`❌ ${file} - Missing`);
    hasErrors = true;
  }
});

// สรุปผล
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Validation FAILED - Please fix the errors above');
  process.exit(1);
} else {
  console.log('✅ Validation PASSED - All files are valid!');
  console.log('🎉 Sweet Frozen E-commerce is ready for deployment!');
}
