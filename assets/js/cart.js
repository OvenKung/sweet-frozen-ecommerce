import { Storage } from './storage.js';

const KEY = 'app.cart.v1';
const SHIPPING_FEE = 50; // ค่าจัดส่งมาตรฐาน

function read(){ return Storage.get(KEY, {items:[], appliedCoupon: null}); }
function write(data){ Storage.set(KEY, data); }
function ensure(){ 
  const c = read(); 
  if(!c.items) c.items=[]; 
  if(!c.appliedCoupon) c.appliedCoupon = null;
  return c; 
}

export const Cart = {
  get(){ return ensure(); },
  count(){ return ensure().items.reduce((a,i)=>a+i.qty,0); },
  
  add(productId, qty=1){
    const c = ensure();
    const found = c.items.find(i=>i.productId===productId);
    if(found){ found.qty += qty; } else { c.items.push({productId, qty}); }
    write(c);
  },
  
  setQty(productId, qty){
    const c = ensure();
    const item = c.items.find(i=>i.productId===productId);
    if(!item) return;
    item.qty = Math.max(1, qty|0);
    write(c);
  },
  
  remove(productId){
    const c = ensure();
    c.items = c.items.filter(i=>i.productId!==productId);
    write(c);
  },
  
  clear(){ write({items:[], appliedCoupon: null}); },
  
  subtotal(priceMap){
    // priceMap: (productId) => price
    return ensure().items.reduce((sum,i)=> sum + (priceMap(i.productId)*i.qty), 0);
  },

  // Calculate total with products data
  total(PRODUCTS = []) {
    const items = this.get().items;
    return items.reduce((sum, item) => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      if (product) {
        return sum + (product.price * item.qty);
      }
      return sum;
    }, 0);
  },

  // Coupon management
  applyCoupon(couponData) {
    const c = ensure();
    c.appliedCoupon = couponData;
    write(c);
  },

  removeCoupon() {
    const c = ensure();
    c.appliedCoupon = null;
    write(c);
  },

  getAppliedCoupon() {
    return ensure().appliedCoupon;
  },

  // Calculate final pricing with coupon and shipping
  calculatePricing(PRODUCTS = []) {
    const cart = this.get();
    const subtotal = this.total(PRODUCTS);
    const appliedCoupon = cart.appliedCoupon;
    
    let discount = 0;
    let shipping = subtotal >= 800 ? 0 : SHIPPING_FEE; // ฟรีค่าส่งเมื่อซื้อครบ 800 บาท
    
    if (appliedCoupon) {
      switch (appliedCoupon.type) {
        case 'percentage':
          discount = (subtotal * appliedCoupon.value) / 100;
          if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
            discount = appliedCoupon.maxDiscount;
          }
          break;
        case 'fixed':
          discount = Math.min(appliedCoupon.value, subtotal);
          break;
        case 'shipping':
          if (subtotal >= appliedCoupon.minOrderAmount) {
            shipping = 0;
            discount = SHIPPING_FEE; // แสดงส่วนลดค่าส่ง
          }
          break;
      }
    }

    const total = Math.max(0, subtotal - discount + shipping);

    return {
      subtotal: subtotal,
      discount: discount,
      shipping: shipping,
      total: total,
      appliedCoupon: appliedCoupon
    };
  }
};
