// این فایل برای تمرین Google Tag Manager / GA4 طراحی شده.
// window.dataLayer همون جایی‌ست که GTM رویدادها رو از اونجا می‌خونه.
window.dataLayer = window.dataLayer || [];

let cartCount = 0;
const cartPill = document.querySelector('.cart-count');

document.addEventListener('click', function (e) {
  const btn = e.target.closest('[data-gtm-event]');
  if (!btn) return;

  const eventName = btn.getAttribute('data-gtm-event');
  const itemName = btn.getAttribute('data-item') || '';
  const itemPrice = btn.getAttribute('data-price') || '';

  // نمونه‌ی push کردن رویداد سفارشی به dataLayer برای GTM
  window.dataLayer.push({
    event: eventName,            // مثلا: add_to_cart
    item_name: itemName,
    item_price: itemPrice
  });

  if (eventName === 'add_to_cart') {
    cartCount++;
    if (cartPill) cartPill.textContent = cartCount;
    btn.textContent = 'اضافه شد ✓';
    setTimeout(() => { btn.textContent = 'افزودن به سبد'; }, 1200);
  }

  console.log('dataLayer push:', window.dataLayer[window.dataLayer.length - 1]);
});

// فیلتر دسته‌بندی محصولات (products.html)
const chips = document.querySelectorAll('.chip');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const cat = chip.getAttribute('data-cat');
    document.querySelectorAll('.card').forEach(card => {
      const show = cat === 'all' || card.getAttribute('data-cat') === cat;
      card.style.display = show ? '' : 'none';
    });
    window.dataLayer.push({ event: 'filter_products', category: cat });
  });
});

// فرم تماس (contact.html) — به‌جای ارسال واقعی، به صفحه تشکر می‌ره
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    window.dataLayer.push({ event: 'contact_form_submit' });
    window.location.href = 'thankyou.html';
  });
}

// فرم خبرنامه (فوتر همه صفحات)
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    window.dataLayer.push({ event: 'newsletter_signup' });
    alert('عضویت شما ثبت شد (این فقط یک دمو است)');
    newsletterForm.reset();
  });
}
