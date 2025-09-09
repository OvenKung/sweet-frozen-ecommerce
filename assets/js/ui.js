import { Cart } from './cart.js';
import { currentUser, logout } from './auth.js';

// Initialize global styles and theme
export function initializeGlobalStyles() {
  // Add fonts and Font Awesome to head if not already present
  if (!document.head.querySelector('link[href*="font-awesome"]')) {
    const fontAwesome = document.createElement('link');
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    fontAwesome.rel = 'stylesheet';
    document.head.appendChild(fontAwesome);
  }
  
  if (!document.head.querySelector('link[href*="fonts.googleapis"]')) {
    const fonts = document.createElement('link');
    fonts.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Nunito:wght@300;400;500;600;700;800;900&family=Prompt:wght@300;400;500;600;700&family=Kanit:wght@300;400;500;600;700&display=swap';
    fonts.rel = 'stylesheet';
    document.head.appendChild(fonts);
  }
  
  // Add bubble font class to body
  if (!document.body.classList.contains('font-bubble')) {
    document.body.className = 'font-bubble bg-gradient-to-br from-pastel-pink via-pastel-lavender to-pastel-mint min-h-screen';
  }
  
  // Initialize theme
  initializeDarkMode();
}

// Dark Mode functionality
let isDarkTheme = localStorage.getItem('darkMode') === 'true';

export function initializeDarkMode() {
  const body = document.body;
  
  if (isDarkTheme) {
    body.classList.add('dark-theme');
  }
  
  // Add dark mode styles to head if not present
  if (!document.head.querySelector('#dark-mode-styles')) {
    const darkStyles = document.createElement('style');
    darkStyles.id = 'dark-mode-styles';
    darkStyles.textContent = `
      .dark-theme {
        background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460) !important;
        color: #ffffff !important;
      }
      
      .dark-theme .bg-white {
        background-color: rgba(30, 41, 59, 0.9) !important;
        color: #ffffff !important;
      }
      
      .dark-theme .bg-white\\/90 {
        background-color: rgba(30, 41, 59, 0.9) !important;
        color: #ffffff !important;
      }
      
      .dark-theme .bg-white\\/50 {
        background-color: rgba(30, 41, 59, 0.7) !important;
        color: #ffffff !important;
      }
      
      .dark-theme .text-gray-800,
      .dark-theme .text-gray-700,
      .dark-theme .text-gray-600,
      .dark-theme .text-gray-500 {
        color: #e2e8f0 !important;
      }
      
      .dark-theme .border-gray-300 {
        border-color: rgba(71, 85, 105, 0.5) !important;
      }
      
      .dark-theme .bg-gradient-to-br {
        background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460) !important;
      }
    `;
    document.head.appendChild(darkStyles);
  }
}

export function toggleTheme() {
  const body = document.body;
  const themeBtn = document.querySelector('[onclick="toggleTheme()"]');
  
  if (!isDarkTheme) {
    // Switch to dark theme
    body.classList.add('dark-theme');
    if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    toast('<i class="fas fa-moon mr-1"></i> เปลี่ยนเป็นธีมกลางคืนแล้ว!', 'info');
    isDarkTheme = true;
  } else {
    // Switch to light theme
    body.classList.remove('dark-theme');
    if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    toast('<i class="fas fa-sun mr-1"></i> เปลี่ยนเป็นธีมกลางวันแล้ว!', 'info');
    isDarkTheme = false;
  }
  
  localStorage.setItem('darkMode', isDarkTheme.toString());
}

export function renderHeader(forceRender = false){
  const el = document.getElementById('app-header');
  if(!el) return;
  
  // Check if navbar already shows logged-in state and don't overwrite unless forced
  const userMenuBtn = document.getElementById('userMenuBtn');
  const u = currentUser();
  
  // If user is logged in and navbar already shows login state, don't re-render
  if (!forceRender && u && userMenuBtn) {
    return;
  }
  
  // If no user and navbar already shows logged-out state, don't re-render
  if (!forceRender && !u && !userMenuBtn) {
    const loginLinks = el.querySelector('a[href="/login.html"]');
    if (loginLinks) return;
  }
  el.innerHTML = `
  <header class="header sticky top-0 bg-white/95 backdrop-blur-lg border-b-2 border-pastel-pink z-50 shadow-lg">
    <div class="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3 flex items-center justify-between">
      <a href="./index.html" class="flex items-center gap-2 sm:gap-3 font-black text-base sm:text-lg lg:text-xl text-primary animate-float">
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-lg sm:text-2xl animate-pulse shadow-lg">🍦</div> 
        <span class="hidden sm:block">Sweet Frozen</span>
        <span class="sm:hidden text-sm">SF</span>
      </a>
      
      <!-- Mobile Menu Button -->
      <button class="sm:hidden bg-white border-2 border-pastel-pink text-purple-700 font-bold py-2 px-3 rounded-full transition-all duration-300" id="mobileMenuBtn">
        ☰
      </button>
      
      <!-- Desktop Navigation -->
      <nav class="hidden sm:flex items-center gap-1 lg:gap-2">
        <a class="bg-white border-2 border-pastel-pink text-purple-700 font-bold py-2 px-2 lg:px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-xs lg:text-sm" href="./index.html">🏠 <span class="hidden lg:inline">หน้าแรก</span></a>
        <a class="bg-white border-2 border-pastel-pink text-purple-700 font-bold py-2 px-2 lg:px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-xs lg:text-sm" href="./reviews.html">⭐ <span class="hidden lg:inline">รีวิว</span></a>
        <a class="bg-white border-2 border-pastel-pink text-purple-700 font-bold py-2 px-2 lg:px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative animate-float text-xs lg:text-sm" href="./cart.html" aria-label="Cart">
          🛒 <span class="absolute -top-2 -right-2 bg-gradient-to-r from-primary-hover to-primary text-white rounded-full text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 font-bold animate-pulse shadow-lg" id="cartCount">${Cart.count()}</span>
        </a>
        ${u ? `
          <div class="relative">
            <div class="bg-white border-2 border-pastel-pink text-purple-700 font-bold py-2 px-2 lg:px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer text-xs lg:text-sm" id="userMenuBtn">👤 <span class="hidden lg:inline">${u.name}</span></div>
            <div class="hidden absolute top-12 right-0 bg-white border-2 border-gray-200 rounded-2xl p-2 min-w-40 lg:min-w-48 shadow-xl z-50" id="userMenu">
              <a class="block bg-white border-2 border-pastel-pink text-purple-700 font-bold py-2 px-3 lg:px-4 rounded-xl mb-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center text-xs lg:text-sm" href="./account.html">👤 บัญชีผู้ใช้</a>
              <button class="w-full bg-gradient-to-r from-red-300 to-red-400 border-2 border-red-300 text-white font-bold py-2 px-3 lg:px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-xs lg:text-sm" id="logoutBtn">🚪 ออกจากระบบ</button>
            </div>
          </div>
        ` : `
          <button onclick="toggleTheme()" class="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 mr-2" title="เปลี่ยนธีม">
            <i class="fas fa-moon text-xs lg:text-sm"></i>
          </button>
          <a class="bg-white border-2 border-pastel-pink text-purple-700 font-bold py-2 px-2 lg:px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-xs lg:text-sm" href="./login.html"><span class="lg:hidden"><i class="fas fa-user"></i></span><span class="hidden lg:inline">เข้าสู่ระบบ</span></a>
          <a class="bg-gradient-to-r from-primary to-primary-hover text-white font-bold py-2 px-2 lg:px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-primary text-xs lg:text-sm" href="./register.html"><span class="lg:hidden"><i class="fas fa-user-plus"></i></span><span class="hidden lg:inline">สมัครสมาชิก</span></a>
        `}
      </nav>
      
      <!-- Mobile Navigation Menu -->
      <div class="hidden sm:hidden fixed inset-0 w-screen h-screen bg-black/80 backdrop-blur-sm z-40" id="mobileMenuOverlay" style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important;"></div>
      <div class="hidden sm:hidden fixed top-0 right-0 w-80 h-screen bg-white shadow-2xl z-50 transform translate-x-full transition-transform duration-300" id="mobileMenu">
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <span class="font-bold text-primary">Sweet Frozen</span>
            <button class="text-gray-600 hover:text-gray-800" id="closeMobileMenu">✕</button>
          </div>
        </div>
        <nav class="p-4 space-y-3">
          <a class="block bg-white border-2 border-pastel-pink text-purple-700 font-bold py-3 px-4 rounded-xl transition-all duration-300 text-center" href="./index.html">🏠 หน้าแรก</a>
          <a class="block bg-white border-2 border-pastel-pink text-purple-700 font-bold py-3 px-4 rounded-xl transition-all duration-300 text-center" href="./reviews.html">⭐ รีวิว</a>
          <a class="block bg-white border-2 border-pastel-pink text-purple-700 font-bold py-3 px-4 rounded-xl transition-all duration-300 relative text-center" href="./cart.html">
            🛒 ตะกร้าสินค้า <span class="absolute top-0 right-2 bg-gradient-to-r from-primary-hover to-primary text-white rounded-full text-xs px-2 py-1 font-bold" id="mobileCartCount">${Cart.count()}</span>
          </a>
          ${u ? `
            <a class="block bg-white border-2 border-pastel-pink text-purple-700 font-bold py-3 px-4 rounded-xl transition-all duration-300 text-center" href="./account.html">👤 ${u.name}</a>
            <button class="w-full bg-gradient-to-r from-red-300 to-red-400 border-2 border-red-300 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300" id="mobileLogoutBtn">🚪 ออกจากระบบ</button>
          ` : `
            <a class="block bg-white border-2 border-pastel-pink text-purple-700 font-bold py-3 px-4 rounded-xl transition-all duration-300 text-center" href="./login.html">👤 เข้าสู่ระบบ</a>
            <a class="block bg-gradient-to-r from-primary to-primary-hover text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 border-2 border-primary text-center" href="./register.html">✍️ สมัครสมาชิก</a>
          `}
        </nav>
      </div>
    </div>
  </header>
  `;
  
  // เรียกฟังก์ชันเพิ่ม event listeners ทันทีหลังจาก render
  setupHeaderEvents();
}

// Function to update header after login/logout
export function updateHeader() {
  renderHeader(true); // Force re-render
}

function setupHeaderEvents() {
  const btn = document.getElementById('userMenuBtn');
  const menu = document.getElementById('userMenu');
  
  if (btn && menu) {
    // เมื่อคลิกที่ชื่อผู้ใช้
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      menu.classList.toggle('hidden');
    });

    // เมื่อคลิกที่อื่นให้ปิด dropdown
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.add('hidden');
      }
    });

    // ป้องกันการปิด dropdown เมื่อคลิกภายใน menu
    menu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  
  const lo = document.getElementById('logoutBtn');
  if(lo){ 
    lo.addEventListener('click', ()=>{ 
      logout(); 
      updateHeader(); // Update header after logout
      location.href='./index.html'; 
    }); 
  }
  
  // Mobile menu functionality
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const closeMobileMenu = document.getElementById('closeMobileMenu');
  const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
  
  if (mobileMenuBtn && mobileMenu && mobileMenuOverlay) {
    // Open mobile menu
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
      mobileMenuOverlay.classList.remove('hidden');
      setTimeout(() => {
        mobileMenu.classList.remove('translate-x-full');
      }, 10);
    });
    
    // Close mobile menu
    const closeMobileMenuHandler = () => {
      mobileMenu.classList.add('translate-x-full');
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
        mobileMenuOverlay.classList.add('hidden');
      }, 300);
    };
    
    if (closeMobileMenu) {
      closeMobileMenu.addEventListener('click', closeMobileMenuHandler);
    }
    
    mobileMenuOverlay.addEventListener('click', closeMobileMenuHandler);
    
    // Mobile logout
    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener('click', () => {
        logout();
        updateHeader();
        location.href = './index.html';
      });
    }
  }
}

export function renderFooter(){
  const el = document.getElementById('app-footer');
  if(!el) return;
  el.innerHTML = `
  <footer class="mt-8 sm:mt-12 lg:mt-16 border-t-2 border-pastel-pink bg-gradient-to-br from-white to-purple-50 animate-slide-in-up">
    <!-- Newsletter Section -->
    <div class="bg-gradient-to-r from-primary to-accent py-8 sm:py-10 lg:py-12">
      <div class="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 text-center">
        <h3 class="text-white text-lg sm:text-xl lg:text-2xl font-black mb-3 sm:mb-4">📧 รับข่าวสารและโปรโมชันพิเศษ</h3>
        <p class="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base">สมัครรับข้อมูลไอศกรีมใหม่ๆ และส่วนลดพิเศษก่อนใคร</p>
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xs sm:max-w-md mx-auto">
          <input type="email" id="newsletterEmail" placeholder="กรอกอีเมลของคุณ..." 
                 class="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-full border-0 focus:outline-none focus:ring-4 focus:ring-white/30 text-sm sm:text-base">
          <button onclick="subscribeNewsletter()" 
                  class="bg-white text-primary font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-sm sm:text-base min-h-[44px]">
            📬 <span class="hidden sm:inline">สมัครรับข่าวสาร</span><span class="sm:hidden">สมัคร</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Main Footer -->
    <div class="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-6 sm:py-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        <!-- Company Info -->
        <div class="sm:col-span-2 lg:col-span-2">
          <strong class="text-primary text-xl sm:text-2xl font-black flex items-center gap-2 mb-3 sm:mb-4">
            🍦 Sweet Frozen
          </strong>
          <p class="text-purple-600 text-xs sm:text-sm mb-3 sm:mb-4">ร้านไอศกรีมออนไลน์ชั้นนำ ส่งไอศกรีมคุณภาพสูง สดใหม่ อร่อย ถึงบ้านคุณทุกวัน</p>
          
          <!-- Social Media -->
          <div class="flex gap-2 sm:gap-3 justify-center sm:justify-start">
            <a href="#" class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform text-sm sm:text-base">📘</a>
            <a href="#" class="w-8 h-8 sm:w-10 sm:h-10 bg-pink-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform text-sm sm:text-base">📷</a>
            <a href="#" class="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform text-sm sm:text-base">📱</a>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div class="text-center sm:text-left">
          <h4 class="font-bold text-purple-700 mb-3 sm:mb-4 text-sm sm:text-base">🔗 ลิงก์ด่วน</h4>
          <ul class="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li><a href="./index.html" class="text-purple-600 hover:text-primary transition-colors">หน้าแรก</a></li>
            <li><a href="./reviews.html" class="text-purple-600 hover:text-primary transition-colors">รีวิวลูกค้า</a></li>
            <li><a href="./cart.html" class="text-purple-600 hover:text-primary transition-colors">ตะกร้าสินค้า</a></li>
            <li><a href="./account.html" class="text-purple-600 hover:text-primary transition-colors">บัญชีผู้ใช้</a></li>
            <li><a href="./contact.html" class="text-purple-600 hover:text-primary transition-colors">ติดต่อเรา</a></li>
          </ul>
        </div>
        
        <!-- Customer Service -->
        <div class="text-center sm:text-left">
          <h4 class="font-bold text-purple-700 mb-3 sm:mb-4 text-sm sm:text-base">📞 บริการลูกค้า</h4>
          <ul class="space-y-1 sm:space-y-2 text-xs sm:text-sm text-purple-600">
            <li>📱 โทร: 02-123-4567</li>
            <li>📧 อีเมล: support@sweetfrozen.com</li>
            <li>🕐 เวลาทำการ: 9:00-18:00</li>
            <li>📦 ส่งฟรี เมื่อซื้อครบ ฿1,500</li>
          </ul>
        </div>
      </div>
      
      <!-- Copyright -->
      <div class="border-t border-purple-200 mt-6 sm:mt-8 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <div class="text-purple-600 text-xs sm:text-sm text-center sm:text-left">
          © 2025 Sweet Frozen. สงวนสิทธิ์ทุกประการ
        </div>
        <div class="text-purple-600 text-xs sm:text-sm text-center">
          กด <kbd class="bg-pastel-yellow border-2 border-pastel-peach rounded px-1 sm:px-2 py-1 font-bold text-xs">Alt</kbd>+<kbd class="bg-pastel-yellow border-2 border-pastel-peach rounded px-1 sm:px-2 py-1 font-bold text-xs">Shift</kbd>+<kbd class="bg-pastel-yellow border-2 border-pastel-peach rounded px-1 sm:px-2 py-1 font-bold text-xs">R</kbd> เพื่อรีเซ็ตข้อมูลสาธิต
        </div>
      </div>
    </div>
  </footer>`;
}

// Quick Cart functionality
export function initializeQuickCart() {
  // Make sure floating cart count is updated
  updateFloatingCartCount();
  
  // Add global event listener for cart updates
  window.addEventListener('cartUpdated', updateFloatingCartCount);
}

export function updateFloatingCartCount() {
  const floatingCount = document.getElementById('floatingCartCount');
  if (floatingCount) {
    floatingCount.textContent = Cart.count();
  }
}

export function toggleQuickCart() {
  const popup = document.getElementById('quickCartPopup');
  if (!popup) return;
  
  const isVisible = !popup.classList.contains('invisible');
  
  if (isVisible) {
    // Hide
    popup.classList.add('invisible', 'opacity-0', 'translate-y-4');
  } else {
    // Show and update content
    updateQuickCartContent();
    popup.classList.remove('invisible', 'opacity-0', 'translate-y-4');
  }
}

export function updateQuickCartContent() {
  const itemsContainer = document.getElementById('quickCartItems');
  const totalElement = document.getElementById('quickCartTotal');
  
  if (!itemsContainer) return;
  
  const cartItems = Cart.items();
  
  if (cartItems.length === 0) {
    itemsContainer.innerHTML = `
      <div class="text-center py-4 text-gray-500">
        <i class="fas fa-shopping-cart text-2xl mb-2"></i>
        <p>ตะกร้าว่างเปล่า</p>
      </div>
    `;
    if (totalElement) totalElement.textContent = '฿0';
    return;
  }
  
  // Load products data
  let PRODUCTS = [];
  try {
    const productsScript = document.querySelector('script[src*="products.js"]');
    if (productsScript) {
      // Products should be available globally
      PRODUCTS = window.PRODUCTS || [];
    }
  } catch (e) {
    console.error('Could not load products:', e);
  }
  
  itemsContainer.innerHTML = cartItems.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return '';
    
    return `
      <div class="flex items-center gap-3 py-2 border-b border-gray-100">
        <img src="${product.image}" alt="${product.name}" class="w-12 h-12 object-cover rounded-lg">
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-sm truncate">${product.name}</h4>
          <p class="text-xs text-gray-500">฿${product.price.toLocaleString()} × ${item.quantity}</p>
        </div>
        <div class="text-right">
          <p class="font-bold text-primary">฿${(product.price * item.quantity).toLocaleString()}</p>
          <button onclick="removeFromQuickCart('${item.id}')" class="text-red-500 hover:text-red-700 text-xs">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  // Update total
  const total = Cart.total();
  if (totalElement) totalElement.textContent = `฿${total.toLocaleString()}`;
}

export function removeFromQuickCart(productId) {
  Cart.remove(productId);
  updateQuickCartContent();
  updateFloatingCartCount();
  
  // Trigger cart update event
  window.dispatchEvent(new CustomEvent('cartUpdated'));
  
  toast('ลบสินค้าออกจากตะกร้าแล้ว', 'info');
}

// Make functions available globally
window.toggleTheme = toggleTheme;
window.toggleQuickCart = toggleQuickCart;
window.removeFromQuickCart = removeFromQuickCart;

export function toast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Different colors for different types
  const colors = {
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600'
  };
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  toast.className = `fixed bottom-6 right-6 ${colors[type]} text-white px-6 py-4 rounded-2xl z-50 shadow-2xl transform translate-x-full transition-all duration-300 max-w-sm`;
  toast.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="text-xl">${icons[type]}</span>
      <span class="font-medium">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white/80 hover:text-white">✕</button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
}

// Global reset shortcut for demo
export function enableResetHotkey(){
  document.addEventListener('keydown', (e)=>{
    if(e.altKey && e.shiftKey && e.key.toLowerCase()==='r'){
      if(confirm('Reset all demo data?')){ localStorage.clear(); location.reload(); }
    }
  });
}

// Newsletter subscription function
window.subscribeNewsletter = function() {
  const email = document.getElementById('newsletterEmail').value.trim();
  if (!email) {
    toast('กรุณากรอกอีเมลให้ครบถ้วน', 'warning');
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast('รูปแบบอีเมลไม่ถูกต้อง', 'error');
    return;
  }
  
  // Simulate API call
  const btn = document.querySelector('button[onclick="subscribeNewsletter()"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '⏳ กำลังสมัคร...';
  btn.disabled = true;
  
  setTimeout(() => {
    // Simulate successful subscription
    toast('🎉 สมัครรับข่าวสารสำเร็จ! ขอบคุณที่สนใจเรา', 'success');
    document.getElementById('newsletterEmail').value = '';
    
    // Restore button
    btn.innerHTML = originalText;
    btn.disabled = false;
    
    // Store email (for demo purposes)
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
    }
  }, 1500);
};
