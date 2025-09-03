// Import ice cream data from JSON
// Fallback products for immediate use
let PRODUCTS = [
  {id:"ic-001", name:"วานิลลาคลาสสิก", price:45, image:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=400&fit=crop", description:"ไอศกรีมวานิลลาแท้ รสชาติหอมหวานเข้มข้น", category:"Classic", stock:150, ingredients:["นม","ครีม","วานิลลา","น้ำตาล"], allergens:["นม"], calories:180},
  {id:"ic-002", name:"ช็อกโกแลตดาร์ก", price:55, image:"https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop", description:"ไอศกรีมช็อกโกแลตเข้มข้น รสชาติมันเข้มขม", category:"Chocolate", stock:120, ingredients:["นม","ครีม","โกโก้","น้ำตาล","ช็อกโกแลต"], allergens:["นม"], calories:220},
  {id:"ic-003", name:"สตรอเบอร์รี่เฟรช", price:50, image:"https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600&h=400&fit=crop", description:"ไอศกรีมสตรอเบอร์รี่สดใหม่ รสชาติหวานซ่า", category:"Fruity", stock:100, ingredients:["นม","ครีม","สตรอเบอร์รี่","น้ำตาล"], allergens:["นม"], calories:160},
  {id:"ic-004", name:"มิ้นท์ช็อกชิป", price:60, image:"https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=600&h=400&fit=crop", description:"ไอศกรีมมิ้นท์หอมเย็น ผสมช็อกโกแลตชิป", category:"Special", stock:80, ingredients:["นม","ครีม","มิ้นท์","ช็อกโกแลตชิป","น้ำตาล"], allergens:["นม"], calories:200},
  {id:"ic-005", name:"คุกกี้แอนด์ครีม", price:65, image:"https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&h=400&fit=crop", description:"ไอศกรีมวานิลลาผสมชิ้นคุกกี้อร่อย", category:"Special", stock:90, ingredients:["นม","ครีม","วานิลลา","คุกกี้","น้ำตาล"], allergens:["นม","ข้าวสาลี"], calories:240},
  {id:"ic-006", name:"มะม่วงโซเบท", price:55, image:"https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&h=400&fit=crop", description:"โซเบทมะม่วงสดใหม่ รสชาติเป็นธรรมชาติ", category:"Sorbet", stock:70, ingredients:["มะม่วง","น้ำตาล","น้ำ"], allergens:[], calories:120},
  {id:"ic-007", name:"โยเกิร์ตบลูเบอร์รี่", price:48, image:"https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=600&h=400&fit=crop", description:"ไอศกรีมโยเกิร์ตเปรี้ยวหวาน ผสมบลูเบอร์รี่", category:"Yogurt", stock:85, ingredients:["โยเกิร์ต","นม","บลูเบอร์รี่","น้ำตาล"], allergens:["นม"], calories:140},
  {id:"ic-008", name:"กรีนทีมัทฉะ", price:58, image:"https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&h=400&fit=crop", description:"ไอศกรีมชาเขียวมัทฉะแท้ รสชาติเข้มข้น", category:"Asian", stock:75, ingredients:["นม","ครีม","ผงมัทฉะ","น้ำตาล"], allergens:["นม"], calories:170}
];

// Load products data
async function loadIceCreamProducts() {
  try {
    const response = await fetch('./assets/data/ice-creams.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Validate data structure
    if (!Array.isArray(data)) {
      throw new Error('Products data is not an array');
    }
    
    PRODUCTS = data;
  } catch (error) {
    console.error('❌ Failed to load products:', error);
    // Fallback to existing array
  }
}

// Initialize products on page load
loadIceCreamProducts();

export { PRODUCTS, loadIceCreamProducts };

export function getProduct(id){ 
  return PRODUCTS.find(p => p.id === id) || null; 
}
