// language switcher
const languages = ['EN', 'RU', 'DE'];
const langSwitch = document.querySelector('.lang-switch');
let langIndex = 0;
if (langSwitch) {
  langSwitch.addEventListener('click', () => {
    langIndex = (langIndex + 1) % languages.length;
    langSwitch.textContent = `< ${languages[langIndex]} >`;
  });
}

// product filtering
const filterButtons = document.querySelectorAll('.filter-tags button');
const products = document.querySelectorAll('.product-grid .product');
if (filterButtons.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
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
const closeBtn = modal?.querySelector('.modal-close');
const buyBtn = modal?.querySelector('.buy-btn');
products.forEach(p => {
  p.addEventListener('click', () => {
    const img = p.querySelector('img').getAttribute('src');
    const desc = p.dataset.desc || '';
    const price = p.dataset.price || '';
    if (modalImage) modalImage.src = img;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalPrice) modalPrice.textContent = price;
    modal.classList.add('show');
  });
});
closeBtn?.addEventListener('click', () => modal.classList.remove('show'));
modal?.addEventListener('click', e => {
  if (e.target === modal) modal.classList.remove('show');
});
buyBtn?.addEventListener('click', () => {
  modal.classList.remove('show');
});

