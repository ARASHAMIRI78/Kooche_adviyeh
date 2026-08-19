function getParam(name){
  return new URLSearchParams(window.location.search).get(name);
}

document.addEventListener('DOMContentLoaded', () => {
  const id = getParam('id');
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

  document.getElementById('crumb-name').textContent = product.name;
  document.getElementById('pdp-image').textContent = product.icon;
  document.getElementById('pdp-image').className = 'image ' + (product.category === 'spice'
    ? 'thumb spice' : 'thumb nuts');
  document.getElementById('pdp-cat').textContent = product.catLabel;
  document.getElementById('pdp-title').textContent = product.name;
  document.getElementById('pdp-desc').textContent = product.longDesc;
  document.title = product.name + ' | کوچه ادویه';

  // بسته‌بندی‌ها
  const pkgWrap = document.getElementById('pkg-options');
  pkgWrap.innerHTML = product.packages.map((pk, i) => `
    <div class="pkg-option">
      <label>
        <span style="display:flex;align-items:center;gap:10px">
          <input type="radio" name="pkg" value="${i}" ${i === 0 ? 'checked' : ''}>
          <span class="size">${pk.size}</span>
        </span>
        <span class="price">${formatToman(pk.price)}</span>
      </label>
    </div>
  `).join('');

  const qtyInput = document.getElementById('qty-input');
  document.getElementById('qty-minus').addEventListener('click', () => {
    qtyInput.value = Math.max(1, parseInt(qtyInput.value || '1') - 1);
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    qtyInput.value = parseInt(qtyInput.value || '1') + 1;
  });

  const addBtn = document.getElementById('add-btn');
  const variant = applyAbVariant(addBtn);

  addBtn.addEventListener('click', () => {
    const pkgIndex = parseInt(document.querySelector('input[name="pkg"]:checked').value);
    const pkg = product.packages[pkgIndex];
    const qty = Math.max(1, parseInt(qtyInput.value || '1'));

    addToCart({
      productId: product.id,
      name: product.name,
      category: product.category,
      icon: product.icon,
      pkgSize: pkg.size,
      unitPrice: pkg.price,
      qty: qty
    });

    pushEvent('add_to_cart', {
      item_id: product.id,
      item_name: product.name,
      item_category: product.catLabel,
      package_size: pkg.size,
      quantity: qty,
      value: pkg.price * qty,
      ab_variant: variant
    });

    const msg = document.getElementById('confirm-msg');
    msg.textContent = `${qty} × ${product.name} (${pkg.size}) به سبد اضافه شد.`;
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 2500);
  });

  // محصولات مرتبط: همان دسته، بجز خود محصول
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  document.getElementById('related-grid').innerHTML = related.map(p => `
    <div class="card">
      <div class="thumb ${p.category === 'spice' ? 'spice' : 'nuts'}">${p.icon}</div>
      <div class="body">
        <span class="cat">${p.catLabel}</span>
        <h3>${p.name}</h3>
        <p class="price">از ${formatToman(Math.min(...p.packages.map(pk => pk.price)))}</p>
        <a class="view-btn" href="product.html?id=${p.id}">مشاهده محصول</a>
      </div>
    </div>
  `).join('');
});
