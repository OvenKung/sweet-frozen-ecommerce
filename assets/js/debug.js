// Debug helper for GitHub Pages
window.sweetFrozenDebug = {
  // Check if localStorage works
  testLocalStorage() {
    try {
      localStorage.setItem('test', 'value');
      const result = localStorage.getItem('test');
      localStorage.removeItem('test');
      console.log('✅ localStorage works:', result === 'value');
      return result === 'value';
    } catch (e) {
      console.error('❌ localStorage error:', e);
      return false;
    }
  },

  // Check if data files can be loaded
  async testDataFiles() {
    const files = [
      './assets/data/users.json',
      './assets/data/ice-creams.json',
      './assets/data/categories.json',
      './assets/data/reviews.json',
      './assets/data/coupons.json',
      './assets/data/orders.json'
    ];
    
    for (const file of files) {
      try {
        const response = await fetch(file);
        console.log(`${response.ok ? '✅' : '❌'} ${file}:`, response.status);
      } catch (error) {
        console.error(`❌ ${file} error:`, error.message);
      }
    }
  },

  // Test auth functions
  async testAuth() {
    try {
      const { loadUsers, demoLogin } = await import('./auth.js');
      
      console.log('🔍 Testing auth functions...');
      
      // Test loading users
      const users = await loadUsers();
      console.log('✅ Users loaded:', users.length, 'users');
      
      // Test demo login
      const user = await demoLogin('somchai@email.com');
      console.log('✅ Demo login result:', user ? `Logged in as ${user.name}` : 'Login failed');
      
      return { users, user };
    } catch (error) {
      console.error('❌ Auth test error:', error);
      return null;
    }
  },

  // Test product loading
  async testProducts() {
    try {
      const { PRODUCTS, loadIceCreamProducts } = await import('./products.js');
      
      console.log('🔍 Testing product functions...');
      
      const products = await loadIceCreamProducts();
      console.log('✅ Products loaded:', products.length, 'products');
      
      return products;
    } catch (error) {
      console.error('❌ Products test error:', error);
      return null;
    }
  },

  // Run all tests
  async runAllTests() {
    console.log('🧪 Running Sweet Frozen debug tests...');
    
    this.testLocalStorage();
    await this.testDataFiles();
    await this.testAuth();
    await this.testProducts();
    
    console.log('✅ Debug tests completed! Check the logs above for any issues.');
  }
};

// Auto-run tests if in debug mode
if (window.location.hostname.includes('github.io') || window.location.search.includes('debug=true')) {
  console.log('🔧 GitHub Pages detected - running debug tests...');
  sweetFrozenDebug.runAllTests();
}

// Make available globally for manual testing
console.log('🛠️ Debug tools available: sweetFrozenDebug.runAllTests()');

export default sweetFrozenDebug;
