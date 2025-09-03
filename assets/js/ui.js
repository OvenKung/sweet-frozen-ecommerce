import { Cart } from './cart.js';
import { currentUser, logout } from './auth.js';

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
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <a href="./index.html" class="flex items-center gap-3 font-black text-xl text-primary animate-float">
        <div class="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-2xl animate-pulse shadow-lg">🍦</div> 
        <span>Sweet Frozen</span>
      </a>
      
      <nav class="flex items-center gap-2">
        <a class="bg-white border-2 border-pastel-pink text-purple-700 font-bold py-2 px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1" href="./index.html">🏠 หน้าแรก</a>
        <a class="bg-white border-2 border-pastel-pink text-purple-700 font-bold py-2 px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1" href="./reviews.html">⭐ รีวิว</a>
        <a class="bg-white border-2 border-pastel-pink text-purple-700 font-bold py-2 px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative animate-float" href="./cart.html" aria-label="Cart">
          🛒 <span class="absolute -top-2 -right-2 bg-gradient-to-r from-primary-hover to-primary text-white rounded-full text-xs px-2 py-1 font-bold animate-pulse shadow-lg" id="cartCount">${Cart.count()}</span>
        </a>
        ${u ? `
          <div class="relative">
            <div class="bg-white border-2 border-pastel-pink text-purple-700 font-bold py-2 px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer" id="userMenuBtn">👤 ${u.name}</div>
            <div class="hidden absolute top-12 right-0 bg-white border-2 border-gray-200 rounded-2xl p-2 min-w-48 shadow-xl z-50" id="userMenu">
              <a class="block bg-white border-2 border-pastel-pink text-purple-700 font-bold py-2 px-4 rounded-xl mb-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center" href="./account.html">👤 บัญชีผู้ใช้</a>
              <button class="w-full bg-gradient-to-r from-red-300 to-red-400 border-2 border-red-300 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1" id="logoutBtn">🚪 ออกจากระบบ</button>
            </div>
          </div>
        ` : `
          <a class="bg-white border-2 border-pastel-pink text-purple-700 font-bold py-2 px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1" href="./login.html">เข้าสู่ระบบ</a>
          <a class="bg-gradient-to-r from-primary to-primary-hover text-white font-bold py-2 px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-primary" href="./register.html">สมัครสมาชิก</a>
        `}
      </nav>
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
}

export function renderFooter(){
  const el = document.getElementById('app-footer');
  if(!el) return;
  el.innerHTML = `
  <footer class="mt-16 border-t-2 border-pastel-pink bg-gradient-to-br from-white to-purple-50 animate-slide-in-up">
    <!-- Newsletter Section -->
    <div class="bg-gradient-to-r from-primary to-accent py-12">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h3 class="text-white text-2xl font-black mb-4">📧 รับข่าวสารและโปรโมชันพิเศษ</h3>
        <p class="text-white/90 mb-6">สมัครรับข้อมูลไอศกรีมใหม่ๆ และส่วนลดพิเศษก่อนใคร</p>
        <div class="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
          <input type="email" id="newsletterEmail" placeholder="กรอกอีเมลของคุณ..." 
                 class="flex-1 px-4 py-3 rounded-full border-0 focus:outline-none focus:ring-4 focus:ring-white/30">
          <button onclick="subscribeNewsletter()" 
                  class="bg-white text-primary font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105">
            📬 สมัครรับข่าวสาร
          </button>
        </div>
      </div>
    </div>
    
    <!-- Main Footer -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="md:col-span-2">
          <strong class="text-primary text-2xl font-black flex items-center gap-2 mb-4">
            🍦 Sweet Frozen
          </strong>
          <p class="text-purple-600 text-sm mb-4">ร้านไอศกรีมออนไลน์ชั้นนำ ส่งไอศกรีมคุณภาพสูง สดใหม่ อร่อย ถึงบ้านคุณทุกวัน</p>
          
          <!-- Social Media -->
          <div class="flex gap-3">
            <a href="#" class="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">📘</a>
            <a href="#" class="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">📷</a>
            <a href="#" class="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">📱</a>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div>
          <h4 class="font-bold text-purple-700 mb-4">🔗 ลิงก์ด่วน</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="./index.html" class="text-purple-600 hover:text-primary transition-colors">หน้าแรก</a></li>
            <li><a href="./reviews.html" class="text-purple-600 hover:text-primary transition-colors">รีวิวลูกค้า</a></li>
            <li><a href="./cart.html" class="text-purple-600 hover:text-primary transition-colors">ตะกร้าสินค้า</a></li>
            <li><a href="./account.html" class="text-purple-600 hover:text-primary transition-colors">บัญชีผู้ใช้</a></li>
            <li><a href="./contact.html" class="text-purple-600 hover:text-primary transition-colors">ติดต่อเรา</a></li>
          </ul>
        </div>
        
        <!-- Customer Service -->
        <div>
          <h4 class="font-bold text-purple-700 mb-4">📞 บริการลูกค้า</h4>
          <ul class="space-y-2 text-sm text-purple-600">
            <li>📱 โทร: 02-123-4567</li>
            <li>📧 อีเมล: support@sweetfrozen.com</li>
            <li>🕐 เวลาทำการ: 9:00-18:00</li>
            <li>📦 ส่งฟรี เมื่อซื้อครบ ฿1,500</li>
          </ul>
        </div>
      </div>
      
      <!-- Copyright -->
      <div class="border-t border-purple-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
        <div class="text-purple-600 text-sm">
          © 2025 Sweet Frozen. สงวนสิทธิ์ทุกประการ
        </div>
        <div class="text-purple-600 text-sm mt-2 md:mt-0">
          กด <kbd class="bg-pastel-yellow border-2 border-pastel-peach rounded px-2 py-1 font-bold">Alt</kbd>+<kbd class="bg-pastel-yellow border-2 border-pastel-peach rounded px-2 py-1 font-bold">Shift</kbd>+<kbd class="bg-pastel-yellow border-2 border-pastel-peach rounded px-2 py-1 font-bold">R</kbd> เพื่อรีเซ็ตข้อมูลสาธิต
        </div>
      </div>
    </div>
  </footer>`;
}

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
