function renderCartPage(){
  const cart = getCart();
  const wrap = document.getElementById('cart-items');
  const emptyEl = document.getElementById('cart-empty');
  const summaryEl = document.getElementById('cart-summary');

  if(cart.length === 0){
    wrap.innerHTML = '';
    summaryEl.style.display = 'none';
    emptyEl.style.display = 'block';
    return;
  }

  emptyEl.style.display = 'none';
  summaryEl.style.display = 'flex';

  wrap.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="thumb-sm ${item.category === 'spice' ? 'thumb spice' : 'thumb nuts'}">${item.icon}</div>
      <div>
        <div class="name">${item.name}</div>
        <div class="pkg">${item.pkgSize} × ${item.qty}</div>
      </div>
      <div class="unit-price">${formatToman(item.unitPrice)}</div>
      <div class="line-total">${formatToman(item.unitPrice * item.qty)}</div>
      <button class="remove" data-id="${item.productId}" data-pkg="${item.pkgSize}">حذف</button>
    </div>
  `).join('');

  document.getElementById('cart-total').textContent = formatToman(cartTotal(cart));

  wrap.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCart(btn.dataset.id, btn.dataset.pkg);
      renderCartPage();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();

  document.getElementById('checkout-btn').addEventListener('click', () => {
    const cart = getCart();
    if(cart.length === 0) return;
    pushEvent('begin_checkout', { value: cartTotal(cart), items_count: cartCount(cart) });
    alert('این یک نسخه نمایشی پورتفولیوست — درگاه پرداخت واقعی وصل نیست.\nرویداد begin_checkout به دیتالیر ارسال شد.');
  });

  const newsletterForm = document.getElementById('newsletter-form');
  if(newsletterForm){
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      pushEvent('newsletter_signup', { form_location: 'cart_page' });
      newsletterForm.reset();
      document.getElementById('newsletter-msg').classList.add('show');
      setTimeout(() => document.getElementById('newsletter-msg').classList.remove('show'), 2500);
    });
  }

  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      pushEvent('contact_form_submit', { form_location: 'cart_page' });
      contactForm.reset();
      document.getElementById('contact-msg').classList.add('show');
      setTimeout(() => document.getElementById('contact-msg').classList.remove('show'), 2500);
    });
  }
});
