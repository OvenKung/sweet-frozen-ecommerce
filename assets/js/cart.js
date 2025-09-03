import { Storage } from './storage.js';

const KEY = 'app.cart.v1';

function read(){ return Storage.get(KEY, {items:[]}); }
function write(data){ Storage.set(KEY, data); }
function ensure(){ const c = read(); if(!c.items) c.items=[]; return c; }

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
  clear(){ write({items:[]}); },
  subtotal(priceMap){
    // priceMap: (productId) => price
    return ensure().items.reduce((sum,i)=> sum + (priceMap(i.productId)*i.qty), 0);
  }
};
