// language switcher dropdown
const langContainer = document.querySelector('.lang-container');
const langSwitch = document.querySelector('.lang-switch');
if (langSwitch && langContainer) {
  langSwitch.addEventListener('click', (e) => {
    e.stopPropagation();
    langContainer.classList.toggle('open');
  });
  document.addEventListener('click', () => langContainer.classList.remove('open'));
}

// product filtering
const filterButtons = document.querySelectorAll('.filter-tags button');
let products = document.querySelectorAll('.product-grid .product');
const productGrid = document.querySelector('.product-grid');
if (productGrid) {
  const originals = Array.from(products);
  for (let i = 0; i < 8; i++) {
    const clone = originals[i % originals.length].cloneNode(true);
    clone.dataset.title = `${clone.dataset.cat} – item ${i + 1}`;
    productGrid.appendChild(clone);
  }
  products = document.querySelectorAll('.product-grid .product');
}
if (filterButtons.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      products.forEach(p => {
        if (!cat || p.dataset.cat === cat) {
          p.style.display = '';
        } else {
          p.style.display = 'none';
        }
      });
    });
  });
}

// modal logic
const modal = document.getElementById('product-modal');
const modalImage = modal?.querySelector('.modal-image');
const modalDesc = modal?.querySelector('.modal-description');
const modalPrice = modal?.querySelector('.modal-price');
const modalTitle = modal?.querySelector('.modal-title');
const cartCountSpan = modal?.querySelector('.cart-count');
let cartCount = 0;
const closeBtn = modal?.querySelector('.modal-close');
const buyBtn = modal?.querySelector('.buy-btn');
const listModal = document.getElementById('list-modal');
const listClose = listModal?.querySelector('.modal-close');
const productList = listModal?.querySelector('.product-list');
const viewAllBtn = document.getElementById('view-all');
products.forEach(p => {
  p.addEventListener('click', () => {
    const img = p.querySelector('img').getAttribute('src');
    const desc = p.dataset.desc || '';
    const price = p.dataset.price || '';
    const title = p.dataset.title || '';
    if (modalImage) modalImage.src = img;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalPrice) modalPrice.textContent = price;
    if (modalTitle) modalTitle.textContent = title;
    modal.classList.add('show');
  });
});
closeBtn?.addEventListener('click', () => modal.classList.remove('show'));
modal?.addEventListener('click', e => {
  if (e.target === modal) modal.classList.remove('show');
});
buyBtn?.addEventListener('click', () => {
  cartCount++;
  if (cartCountSpan) cartCountSpan.textContent = cartCount;
  modal.classList.remove('show');
});

viewAllBtn?.addEventListener('click', () => {
  if (productList) {
    productList.innerHTML = '';
    products.forEach(p => {
      const li = document.createElement('li');
      li.textContent = p.dataset.title || '';
      li.addEventListener('click', () => p.click());
      productList.appendChild(li);
    });
  }
  listModal?.classList.add('show');
});
listClose?.addEventListener('click', () => listModal?.classList.remove('show'));
listModal?.addEventListener('click', e => {
  if (e.target === listModal) listModal.classList.remove('show');
});

// pagination for products
const navNext = document.getElementById('next');
const navPrev = document.getElementById('prev');
let page = 0;
function showPage(idx) {
  const start = idx * 4;
  products.forEach((p, i) => {
    p.style.display = i >= start && i < start + 4 ? '' : 'none';
  });
}
navNext?.addEventListener('click', () => {
  page = (page + 1) % Math.ceil(products.length / 4);
  showPage(page);
});
navPrev?.addEventListener('click', () => {
  page = (page - 1 + Math.ceil(products.length / 4)) % Math.ceil(products.length / 4);
  showPage(page);
});
showPage(0);

// service section expansion
const serviceButtons = document.querySelectorAll('.service');
serviceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    serviceButtons.forEach(b => {
      if (b !== btn) b.classList.remove('open');
    });
    btn.classList.toggle('open');
    const text = btn.dataset.desc;
    const container = btn.querySelector('.service-text');
    if (container) container.textContent = text || '';
  });
});

