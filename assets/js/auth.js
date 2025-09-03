import { Storage } from './storage.js';
import { isEmail, strongPassword } from './validation.js';

const USERS_KEY='app.users.v1';
const CURRENT_KEY='app.auth.current.v1';
const ORDERS_KEY='app.orders.v1';

let USERS_DATA = []; // Will store loaded JSON data

const encoder = new TextEncoder();
async function sha256(text){
  if(window.crypto?.subtle){
    const buf = await crypto.subtle.digest('SHA-256', encoder.encode(text));
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }else{
    // weak fallback (mock only)
    return btoa(text).split('').reverse().join('');
  }
}

// Load users from JSON with fallback to localStorage
export async function loadUsers() {
  try {
    const response = await fetch('./assets/data/users.json');
    if (response.ok) {
      USERS_DATA = await response.json();
      return USERS_DATA;
    }
  } catch (error) {
    console.warn('Could not load users.json, using localStorage fallback:', error);
    // Fallback to localStorage
  }
  
  // Fallback to localStorage with default demo users
  const defaultUsers = [
    {
      "id": "u-demo001",
      "email": "somchai@email.com", 
      "name": "สมชาย วิเศษ",
      "password": "demo123",
      "memberSince": "2024-01-15",
      "addresses": [],
      "paymentMethods": []
    },
    {
      "id": "u-demo002",
      "email": "malee@email.com",
      "name": "มาลี ใจดี", 
      "password": "demo123",
      "memberSince": "2024-02-20",
      "addresses": [],
      "paymentMethods": []
    },
    {
      "id": "u-demo003",
      "email": "wichai@email.com",
      "name": "วิชัย รักษ์ดี",
      "password": "demo123", 
      "memberSince": "2024-03-10",
      "addresses": [],
      "paymentMethods": []
    }
  ];
  
  USERS_DATA = Storage.get(USERS_KEY, defaultUsers);
  // Ensure default users are saved to localStorage
  if (Storage.get(USERS_KEY, []).length === 0) {
    Storage.set(USERS_KEY, defaultUsers);
  }
  return USERS_DATA;
}

function users(){ 
  return USERS_DATA.length > 0 ? USERS_DATA : Storage.get(USERS_KEY, []); 
}

function saveUsers(list){ 
  USERS_DATA = list;
  Storage.set(USERS_KEY, list); 
}

// Initialize users data on load
loadUsers();

export async function register({name, email, password}){
  if(!isEmail(email)) return {ok:false, message:'Invalid email'};
  if(!strongPassword(password)) return {ok:false, message:'Password must be at least 6 chars'};
  const list = users();
  if(list.some(u=>u.email===email)) return {ok:false, message:'Email already registered'};
  const hash = await sha256(password);
  const user = {
    id:'u-'+Math.random().toString(36).slice(2,9), 
    name, 
    email, 
    pass:hash, 
    addresses:[], 
    memberSince: new Date().toISOString().split('T')[0], // วันที่สมัครสมาชิก
    points: 0,
    level: 'Bronze',
    createdAt:Date.now()
  };
  list.push(user); saveUsers(list);
  Storage.set(CURRENT_KEY, {email});
  return {ok:true, user:{id:user.id, name, email}};
}

export async function login({email, password}){
  const list = users();
  const user = list.find(u=>u.email===email);
  if(!user) return {ok:false, message:'User not found'};
  const hash = await sha256(password);
  if(user.pass!==hash) return {ok:false, message:'Invalid credentials'};
  Storage.set(CURRENT_KEY, {email});
  return {ok:true, user:{id:user.id, name:user.name, email}};
}

export function logout(){ Storage.remove(CURRENT_KEY); }

export function currentUser(){
  const cur = Storage.get(CURRENT_KEY, null);
  if(!cur) return null;
  const u = users().find(u=>u.email===cur.email);
  if (!u) return null;
  
  // Return detailed user info excluding password
  const { pass, ...userInfo } = u;
  return userInfo;
}

export function requireLogin(redirectTo){
  const u = currentUser();
  if(!u){
    const r = encodeURIComponent(redirectTo || location.pathname);
    location.href = `./login.html?redirect=${r}`;
    return false;
  }
  return true;
}

export function addAddress(addr){
  const list = users();
  const cur = Storage.get(CURRENT_KEY, null); if(!cur) return {ok:false};
  const idx = list.findIndex(u=>u.email===cur.email); if(idx<0) return {ok:false};
  const a = { id:'addr-'+Math.random().toString(36).slice(2,8), ...addr };
  list[idx].addresses.push(a); saveUsers(list);
  return {ok:true, address:a};
}
export function removeAddress(id){
  const list = users();
  const cur = Storage.get(CURRENT_KEY, null); if(!cur) return {ok:false};
  const idx = list.findIndex(u=>u.email===cur.email); if(idx<0) return {ok:false};
  list[idx].addresses = list[idx].addresses.filter(a=>a.id!==id); saveUsers(list);
  return {ok:true};
}

export function listAddresses(){
  const u = currentUser(); return u? u.addresses : [];
}

// Orders
export function saveOrder(order){
  const list = Storage.get(ORDERS_KEY, []);
  list.push(order);
  Storage.set(ORDERS_KEY, list);
}
export function listOrders(email){
  const list = Storage.get(ORDERS_KEY, []);
  return list.filter(o=>o.email===email);
}

// Forgot/Reset (mock via code shown on UI)
const RESET_KEY='app.reset.v1';
export function createResetCode(email){
  const list = users(); const u = list.find(x=>x.email===email);
  if(!u) return {ok:false, message:'Email not found'};
  const code = Math.floor(100000+Math.random()*900000).toString();
  const all = Storage.get(RESET_KEY, {}); all[email] = {code, expires: Date.now()+10*60*1000};
  Storage.set(RESET_KEY, all);
  return {ok:true, code};
}
export async function resetPassword(email, code, newPass){
  const all = Storage.get(RESET_KEY, {});
  const rec = all[email];
  if(!rec || rec.expires < Date.now()) return {ok:false, message:'Code expired'};
  if(rec.code !== code) return {ok:false, message:'Invalid code'};
  if(!strongPassword(newPass)) return {ok:false, message:'Password too short'};
  const list = users();
  const idx = list.findIndex(u=>u.email===email);
  if(idx<0) return {ok:false, message:'User not found'};
  list[idx].pass = await sha256(newPass);
  saveUsers(list);
  delete all[email]; Storage.set(RESET_KEY, all);
  return {ok:true};
}

// Demo login function for easy testing
export async function demoLogin(userEmail = 'somchai@email.com') {
  await loadUsers();
  
  const userList = users();
  const user = userList.find(u => u.email === userEmail);
  
  if (!user) return null;
  
  Storage.set(CURRENT_KEY, {email: userEmail});
  return currentUser();
}

// ฟังก์ชันจัดการที่อยู่
export function addUserAddress(addressData) {
  const user = currentUser();
  if (!user) return {ok: false, message: 'ไม่พบข้อมูลผู้ใช้'};
  
  const list = users();
  const userIndex = list.findIndex(u => u.email === user.email);
  if (userIndex === -1) return {ok: false, message: 'ไม่พบข้อมูลผู้ใช้ในระบบ'};
  
  // สร้าง ID ใหม่สำหรับที่อยู่
  const newAddress = {
    id: 'addr-' + Math.random().toString(36).slice(2, 9),
    ...addressData,
    createdAt: new Date().toISOString()
  };
  
  // ถ้าเป็นที่อยู่แรก หรือถูกตั้งเป็น default ให้เซ็ต isDefault
  if (!list[userIndex].addresses || list[userIndex].addresses.length === 0) {
    newAddress.isDefault = true;
  } else if (addressData.isDefault) {
    // ยกเลิก default เก่า
    list[userIndex].addresses.forEach(addr => addr.isDefault = false);
    newAddress.isDefault = true;
  }
  
  if (!list[userIndex].addresses) list[userIndex].addresses = [];
  list[userIndex].addresses.push(newAddress);
  
  saveUsers(list);
  Storage.set(CURRENT_KEY, {email: user.email}); // อัปเดต current user
  
  return {ok: true, address: newAddress};
}

export function updateUserAddress(addressId, addressData) {
  const user = currentUser();
  if (!user) return {ok: false, message: 'ไม่พบข้อมูลผู้ใช้'};
  
  const list = users();
  const userIndex = list.findIndex(u => u.email === user.email);
  if (userIndex === -1) return {ok: false, message: 'ไม่พบข้อมูลผู้ใช้ในระบบ'};
  
  const addressIndex = list[userIndex].addresses.findIndex(addr => addr.id === addressId);
  if (addressIndex === -1) return {ok: false, message: 'ไม่พบที่อยู่ที่ต้องการแก้ไข'};
  
  // ถ้าถูกตั้งเป็น default ให้ยกเลิก default เก่า
  if (addressData.isDefault) {
    list[userIndex].addresses.forEach(addr => addr.isDefault = false);
  }
  
  // อัปเดตข้อมูลที่อยู่
  list[userIndex].addresses[addressIndex] = {
    ...list[userIndex].addresses[addressIndex],
    ...addressData,
    updatedAt: new Date().toISOString()
  };
  
  saveUsers(list);
  Storage.set(CURRENT_KEY, {email: user.email});
  
  return {ok: true, address: list[userIndex].addresses[addressIndex]};
}

export function deleteUserAddress(addressId) {
  const user = currentUser();
  if (!user) return {ok: false, message: 'ไม่พบข้อมูลผู้ใช้'};
  
  const list = users();
  const userIndex = list.findIndex(u => u.email === user.email);
  if (userIndex === -1) return {ok: false, message: 'ไม่พบข้อมูลผู้ใช้ในระบบ'};
  
  const addressIndex = list[userIndex].addresses.findIndex(addr => addr.id === addressId);
  if (addressIndex === -1) return {ok: false, message: 'ไม่พบที่อยู่ที่ต้องการลบ'};
  
  // ถ้าลบที่อยู่ default และยังมีที่อยู่อื่น ให้ตั้งที่อยู่แรกเป็น default
  const wasDefault = list[userIndex].addresses[addressIndex].isDefault;
  list[userIndex].addresses.splice(addressIndex, 1);
  
  if (wasDefault && list[userIndex].addresses.length > 0) {
    list[userIndex].addresses[0].isDefault = true;
  }
  
  saveUsers(list);
  Storage.set(CURRENT_KEY, {email: user.email});
  
  return {ok: true};
}
