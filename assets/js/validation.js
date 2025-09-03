export const isEmail = (v)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const strongPassword = (v)=> v.length>=6;
export const required = (v)=> String(v||'').trim().length>0;
