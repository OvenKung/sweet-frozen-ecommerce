export function luhnCheck(num){
  const s = String(num).replace(/\D/g,'');
  let sum=0, dbl=false;
  for(let i=s.length-1;i>=0;i--){
    let d = parseInt(s[i],10);
    if(dbl){ d*=2; if(d>9) d-=9; }
    sum += d; dbl=!dbl;
  }
  return (sum%10)===0 && s.length>=12;
}
export async function processPayment({amount, cardNumber, name, exp, cvv}){
  // Mock payment gateway
  await new Promise(r=>setTimeout(r, 600));
  if(!luhnCheck(cardNumber)) return {ok:false, message:"Invalid card number"};
  return {ok:true, txnId: 'TXN-'+Math.random().toString(36).slice(2,10).toUpperCase()};
}
