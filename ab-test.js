/*
  تست A/B روی دکمه «افزودن به سبد خرید» در صفحه محصول.

  نسخه A (کنترل): متن «افزودن به سبد خرید» - رنگ قرمز سماقی
  نسخه B (آزمایش): متن «🛒 اضافه کن به سبد» - رنگ مشکی، برای بررسی تاثیر لحن غیررسمی‌تر و آیکون بر نرخ تبدیل

  تخصیص کاربر به یک نسخه، در localStorage ذخیره می‌شود تا در بازدیدهای بعدی ثابت بماند
  (مثل یک تست A/B واقعی که هر کاربر در طول آزمایش در یک گروه می‌ماند).
  رویداد ab_test_assigned به دیتالیر پوش می‌شود تا در GA4/GTM بشود بر اساس ابعاد سفارشی
  (experiment_id, variant) نرخ تبدیل هر نسخه را با هم مقایسه کرد.
*/
const AB_KEY = 'ka_ab_addtocart';
const AB_EXPERIMENT_ID = 'add_to_cart_button_v1';

function getAbVariant(){
  let variant = localStorage.getItem(AB_KEY);
  if(!variant){
    variant = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem(AB_KEY, variant);
  }
  return variant;
}

function applyAbVariant(buttonEl){
  const variant = getAbVariant();
  if(variant === 'B'){
    buttonEl.textContent = '🛒 اضافه کن به سبد';
    buttonEl.classList.add('variant-b');
  } else {
    buttonEl.textContent = 'افزودن به سبد خرید';
  }
  pushEvent('ab_test_assigned', {
    experiment_id: AB_EXPERIMENT_ID,
    variant: variant
  });
  return variant;
}
