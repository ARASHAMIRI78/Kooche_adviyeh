// توابع مشترک: سبد خرید در localStorage و ارسال رویداد به دیتالیر
window.dataLayer = window.dataLayer || [];
function pushEvent(eventName, data){
  window.dataLayer.push(Object.assign({ event: eventName }, data || {}));
}

const CART_KEY = 'ka_cart';

function getCart(){
  try{
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }catch(e){ return []; }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(item){
  // item: { productId, name, category, icon, pkgSize, unitPrice, qty }
  const cart = getCart();
  const existing = cart.find(c => c.productId === item.productId && c.pkgSize === item.pkgSize);
  if(existing){
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

function removeFromCart(productId, pkgSize){
  let cart = getCart();
  const removed = cart.find(c => c.productId === productId && c.pkgSize === pkgSize);
  cart = cart.filter(c => !(c.productId === productId && c.pkgSize === pkgSize));
  saveCart(cart);
  if(removed){
    pushEvent('remove_from_cart', {
      item_id: removed.productId,
      item_name: removed.name,
      package_size: removed.pkgSize,
      value: removed.unitPrice * removed.qty
    });
  }
}

function cartTotal(cart){
  return cart.reduce((sum, c) => sum + c.unitPrice * c.qty, 0);
}

function cartCount(cart){
  return cart.reduce((sum, c) => sum + c.qty, 0);
}

function updateCartCount(){
  const el = document.getElementById('cart-count');
  if(el) el.textContent = cartCount(getCart());
}

document.addEventListener('DOMContentLoaded', updateCartCount);
