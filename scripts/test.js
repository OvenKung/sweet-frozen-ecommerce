#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Running Sweet Frozen E-commerce tests...\n');

let testsPassed = 0;
let testsFailed = 0;

function test(description, testFunction) {
  try {
    testFunction();
    console.log(`✅ ${description}`);
    testsPassed++;
  } catch (error) {
    console.log(`❌ ${description}: ${error.message}`);
    testsFailed++;
  }
}

// สร้างโฟลเดอร์สำหรับผลการทดสอบ
if (!fs.existsSync('test-results')) {
  fs.mkdirSync('test-results');
}

console.log('🔧 Testing core functionality...\n');

// ทดสอบไฟล์ข้อมูลผลิตภัณฑ์
test('Ice cream data should be valid array', () => {
  const iceCreams = JSON.parse(fs.readFileSync('assets/data/ice-creams.json', 'utf8'));
  if (!Array.isArray(iceCreams)) throw new Error('Ice creams data is not an array');
  if (iceCreams.length === 0) throw new Error('No ice cream products found');
  
  // ตรวจสอบ structure ของสินค้า
  const firstProduct = iceCreams[0];
  const requiredFields = ['id', 'name', 'price', 'image', 'description'];
  requiredFields.forEach(field => {
    if (!firstProduct.hasOwnProperty(field)) {
      throw new Error(`Product missing required field: ${field}`);
    }
  });
});

// ทดสอบไฟล์ข้อมูลผู้ใช้
test('Users data should be valid array', () => {
  const users = JSON.parse(fs.readFileSync('assets/data/users.json', 'utf8'));
  if (!Array.isArray(users)) throw new Error('Users data is not an array');
  
  if (users.length > 0) {
    const firstUser = users[0];
    const requiredFields = ['id', 'email', 'name'];
    requiredFields.forEach(field => {
      if (!firstUser.hasOwnProperty(field)) {
        throw new Error(`User missing required field: ${field}`);
      }
    });
  }
});

// ทดสอบข้อมูล categories
test('Categories data should be valid', () => {
  const categories = JSON.parse(fs.readFileSync('assets/data/categories.json', 'utf8'));
  if (!Array.isArray(categories)) throw new Error('Categories data is not an array');
  
  if (categories.length > 0) {
    const firstCategory = categories[0];
    if (!firstCategory.id || !firstCategory.name) {
      throw new Error('Category missing required fields');
    }
  }
});

// ทดสอบข้อมูล reviews
test('Reviews data should be valid', () => {
  const reviews = JSON.parse(fs.readFileSync('assets/data/reviews.json', 'utf8'));
  if (!Array.isArray(reviews)) throw new Error('Reviews data is not an array');
  
  if (reviews.length > 0) {
    const firstReview = reviews[0];
    const requiredFields = ['id', 'productId', 'userId', 'rating', 'comment'];
    requiredFields.forEach(field => {
      if (!firstReview.hasOwnProperty(field)) {
        throw new Error(`Review missing required field: ${field}`);
      }
    });
    
    if (firstReview.rating < 1 || firstReview.rating > 5) {
      throw new Error('Review rating should be between 1-5');
    }
  }
});

// ทดสอบข้อมูล coupons
test('Coupons data should be valid', () => {
  const coupons = JSON.parse(fs.readFileSync('assets/data/coupons.json', 'utf8'));
  if (!Array.isArray(coupons)) throw new Error('Coupons data is not an array');
  
  if (coupons.length > 0) {
    const firstCoupon = coupons[0];
    const requiredFields = ['id', 'code', 'type', 'value'];
    requiredFields.forEach(field => {
      if (!firstCoupon.hasOwnProperty(field)) {
        throw new Error(`Coupon missing required field: ${field}`);
      }
    });
  }
});

// ทดสอบข้อมูล orders
test('Orders data should be valid', () => {
  const orders = JSON.parse(fs.readFileSync('assets/data/orders.json', 'utf8'));
  if (!Array.isArray(orders)) throw new Error('Orders data is not an array');
  
  if (orders.length > 0) {
    const firstOrder = orders[0];
    const requiredFields = ['id', 'userId', 'items', 'total', 'status'];
    requiredFields.forEach(field => {
      if (!firstOrder.hasOwnProperty(field)) {
        throw new Error(`Order missing required field: ${field}`);
      }
    });
  }
});

// ทดสอบการมีอยู่ของไฟล์ HTML หลัก
test('All required HTML files exist', () => {
  const requiredFiles = [
    'index.html', 'cart.html', 'checkout.html', 
    'login.html', 'register.html', 'account.html', 
    'product.html', 'contact.html'
  ];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      throw new Error(`Required file missing: ${file}`);
    }
  });
});

// ทดสอบการมีอยู่ของไฟล์ CSS และ JS
test('All required asset files exist', () => {
  const requiredAssets = [
    'assets/css/styles.css',
    'assets/js/app.js',
    'assets/js/auth.js',
    'assets/js/cart.js',
    'assets/js/ui.js',
    'assets/js/products.js'
  ];
  
  requiredAssets.forEach(file => {
    if (!fs.existsSync(file)) {
      throw new Error(`Required asset missing: ${file}`);
    }
  });
});

// บันทึกผลการทดสอบ
const testResults = {
  timestamp: new Date().toISOString(),
  passed: testsPassed,
  failed: testsFailed,
  total: testsPassed + testsFailed,
  success: testsFailed === 0
};

fs.writeFileSync('test-results/results.json', JSON.stringify(testResults, null, 2));

// สรุปผล
console.log('\n' + '='.repeat(50));
console.log(`📊 Test Results: ${testsPassed} passed, ${testsFailed} failed`);

if (testsFailed > 0) {
  console.log('❌ Tests FAILED');
  process.exit(1);
} else {
  console.log('✅ All tests PASSED!');
  console.log('🎉 Sweet Frozen E-commerce is ready!');
}
