function minPrice(p){
  return Math.min(...p.packages.map(pk => pk.price));
}

function renderGrid(list){
  const grid = document.getElementById('product-grid');
  grid.innerHTML = list.map(p => `
    <div class="card">
      <div class="thumb ${p.category === 'spice' ? 'spice' : 'nuts'}">${p.icon}</div>
      <div class="body">
        <span class="cat">${p.catLabel}</span>
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <p class="price">از ${formatToman(minPrice(p))} <small>/ ${p.packages[0].size}</small></p>
        <a class="view-btn" href="product.html?id=${p.id}">مشاهده محصول</a>
      </div>
    </div>
  `).join('');
}

function filterProducts(category){
  const list = category === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
  renderGrid(list);
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === category);
  });
  pushEvent('filter_products', { filter_category: category });
}

document.addEventListener('DOMContentLoaded', () => {
  renderGrid(PRODUCTS);
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => filterProducts(btn.dataset.cat));
  });
});
