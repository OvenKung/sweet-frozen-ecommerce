// Coupon Management System
import { Storage } from './storage.js';
import { currentUser } from './auth.js';
import { Cart } from './cart.js';

const COUPONS_KEY = 'app.coupons.v1';
const USER_COUPONS_KEY = 'app.user.coupons.v1';

let COUPONS_DATA = [];

// Load coupons from JSON file
async function loadCoupons() {
  try {
    const response = await fetch('./assets/data/coupons.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Coupons data is not an array');
    }
    
    COUPONS_DATA = data;
    
    // Cache in localStorage for offline use
    Storage.set(COUPONS_KEY, data);
    
    return data;
  } catch (error) {
    console.error('❌ Failed to load coupons:', error);
    
    // Fallback to localStorage
    const cached = Storage.get(COUPONS_KEY, []);
    COUPONS_DATA = cached;
    return cached;
  }
}

// Get all active coupons
export function getActiveCoupons() {
  const now = new Date();
  return COUPONS_DATA.filter(coupon => {
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);
    
    return coupon.isActive && 
           now >= validFrom && 
           now <= validUntil;
  });
}

// Get coupon by code
export function getCouponByCode(code) {
  return COUPONS_DATA.find(coupon => 
    coupon.code.toUpperCase() === code.toUpperCase() && 
    coupon.isActive
  );
}

// Get user's coupon usage
function getUserCouponUsage() {
  const user = currentUser();
  if (!user) return {};
  
  return Storage.get(`${USER_COUPONS_KEY}.${user.email}`, {});
}

// Save user coupon usage
function saveUserCouponUsage(usage) {
  const user = currentUser();
  if (!user) return false;
  
  Storage.set(`${USER_COUPONS_KEY}.${user.email}`, usage);
  return true;
}

// Validate coupon
export function validateCoupon(code, orderAmount = 0) {
  const coupon = getCouponByCode(code);
  
  if (!coupon) {
    return {
      valid: false,
      message: 'ไม่พบคูปองนี้ในระบบ',
      coupon: null
    };
  }

  // Check if coupon is active
  if (!coupon.isActive) {
    return {
      valid: false,
      message: 'คูปองนี้ถูกยกเลิกแล้ว',
      coupon: null
    };
  }

  // Check date validity
  const now = new Date();
  const validFrom = new Date(coupon.validFrom);
  const validUntil = new Date(coupon.validUntil);

  if (now < validFrom) {
    return {
      valid: false,
      message: `คูปองนี้ใช้ได้ตั้งแต่ ${validFrom.toLocaleDateString('th-TH')}`,
      coupon: null
    };
  }

  if (now > validUntil) {
    return {
      valid: false,
      message: 'คูปองนี้หมดอายุแล้ว',
      coupon: null
    };
  }

  // Check minimum order amount
  if (orderAmount < coupon.minOrderAmount) {
    return {
      valid: false,
      message: `ต้องสั่งซื้อครบ ฿${coupon.minOrderAmount.toLocaleString()} ถึงจะใช้คูปองนี้ได้`,
      coupon: null
    };
  }

  // Check usage limit
  const userUsage = getUserCouponUsage();
  const currentUsage = userUsage[coupon.code] || 0;
  
  if (currentUsage >= coupon.usageLimit) {
    return {
      valid: false,
      message: 'คุณใช้คูปองนี้ครบจำนวนที่กำหนดแล้ว',
      coupon: null
    };
  }

  return {
    valid: true,
    message: 'คูปองใช้ได้',
    coupon: coupon
  };
}

// Calculate discount
export function calculateDiscount(coupon, orderAmount, shippingFee = 0) {
  if (!coupon || orderAmount <= 0) return 0;

  let discount = 0;

  switch (coupon.type) {
    case 'percentage':
      discount = (orderAmount * coupon.value) / 100;
      // Apply max discount limit
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
      break;

    case 'fixed':
      discount = coupon.value;
      // Don't exceed order amount
      if (discount > orderAmount) {
        discount = orderAmount;
      }
      break;

    case 'shipping':
      discount = Math.min(shippingFee, coupon.maxDiscount || shippingFee);
      break;

    default:
      discount = 0;
  }

  return Math.max(0, discount);
}

// Apply coupon (record usage)
export function applyCoupon(code, orderAmount, shippingFee = 0) {
  const validation = validateCoupon(code, orderAmount);
  
  if (!validation.valid) {
    return {
      success: false,
      message: validation.message,
      discount: 0,
      coupon: null
    };
  }

  const coupon = validation.coupon;
  const discount = calculateDiscount(coupon, orderAmount, shippingFee);

  // Record usage
  const userUsage = getUserCouponUsage();
  userUsage[coupon.code] = (userUsage[coupon.code] || 0) + 1;
  saveUserCouponUsage(userUsage);

  return {
    success: true,
    message: 'ใช้คูปองสำเร็จ',
    discount: discount,
    coupon: coupon
  };
}

// Get coupon description for UI
export function getCouponDescription(coupon) {
  if (!coupon) return '';

  let desc = '';
  
  switch (coupon.type) {
    case 'percentage':
      desc = `ลด ${coupon.value}%`;
      if (coupon.maxDiscount) {
        desc += ` (สูงสุด ฿${coupon.maxDiscount.toLocaleString()})`;
      }
      break;
    case 'fixed':
      desc = `ลด ฿${coupon.value.toLocaleString()}`;
      break;
    case 'shipping':
      desc = 'ฟรีค่าจัดส่ง';
      break;
    default:
      desc = coupon.description;
  }

  if (coupon.minOrderAmount > 0) {
    desc += ` เมื่อซื้อครบ ฿${coupon.minOrderAmount.toLocaleString()}`;
  }

  return desc;
}

// Get available coupons for current user and cart
export function getAvailableCoupons() {
  const cart = Cart.get();
  const total = Cart.total();
  const activeCoupons = getActiveCoupons();
  const userUsage = getUserCouponUsage();

  return activeCoupons.map(coupon => {
    const usage = userUsage[coupon.code] || 0;
    const validation = validateCoupon(coupon.code, total);
    
    return {
      ...coupon,
      description: getCouponDescription(coupon),
      canUse: validation.valid,
      reason: validation.valid ? '' : validation.message,
      usageLeft: coupon.usageLimit - usage,
      discount: validation.valid ? calculateDiscount(coupon, total) : 0
    };
  }).sort((a, b) => {
    // Sort by usability first, then by discount amount
    if (a.canUse && !b.canUse) return -1;
    if (!a.canUse && b.canUse) return 1;
    return b.discount - a.discount;
  });
}

// Initialize coupons system
export async function initializeCoupons() {
  try {
    await loadCoupons();
    console.log('✅ Coupons system initialized');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize coupons:', error);
    return false;
  }
}

// Export for testing
export { COUPONS_DATA, loadCoupons };
