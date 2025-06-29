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
let itemsPerPage = getItems();

function getItems() {
  if (window.innerWidth <= 500) return 1;
  if (window.innerWidth <= 800) return 2;
  return 4;
}

function updateNavText() {
  if (navNext) navNext.textContent = `view next ${itemsPerPage} >>`;
  if (navPrev) navPrev.textContent = `<< ${itemsPerPage} txen`;
}

function showPage(idx) {
  const start = idx * itemsPerPage;
  products.forEach((p, i) => {
    p.style.display = i >= start && i < start + itemsPerPage ? '' : 'none';
  });
}

function refresh() {
  const newCount = getItems();
  if (newCount !== itemsPerPage) {
    itemsPerPage = newCount;
    page = 0;
  }
  updateNavText();
  showPage(page);
}

window.addEventListener('resize', refresh);
navNext?.addEventListener('click', () => {
  page = (page + 1) % Math.ceil(products.length / itemsPerPage);
  showPage(page);
});
navPrev?.addEventListener('click', () => {
  page = (page - 1 + Math.ceil(products.length / itemsPerPage)) % Math.ceil(products.length / itemsPerPage);
  showPage(page);
});

refresh();

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
    const imgEl = btn.querySelector('img');
    if (imgEl && btn.dataset.img) {
      imgEl.src = btn.dataset.img;
      imgEl.alt = btn.dataset.title || '';
    }
  });
});

// stack buttons inside services
const stackButtons = document.querySelectorAll('.stack-btn');
stackButtons.forEach(sb => {
  sb.addEventListener('click', e => {
    e.stopPropagation();
    cartCount++;
    if (cartCountSpan) cartCountSpan.textContent = cartCount;
    stackButtons.forEach(b => {
      b.innerHTML = `stack&gt; <span class="cart-count">${cartCount}</span> items in memory`;
    });
  });
});

// HERO WEBGL SHADER
const heroCanvas = document.getElementById('hero-canvas');
if (heroCanvas) {
  const gl = heroCanvas.getContext('webgl2');
  if (gl) {
    const vertexSrc = `#version 300 es
    in vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }`;

    const fragmentSrc = `#version 300 es
    precision highp float;
    uniform float time;
    uniform vec2 resolution;
    uniform vec2 move;
    out vec4 O;

    vec3 pal(float t) {
      return 0.5 + 0.5*cos(6.2831*(vec3(0.0,0.33,0.67)+t));
    }

    void main(){
      vec2 uv = (gl_FragCoord.xy - 0.5*resolution) / resolution.y;
      vec2 m = (move / resolution - 0.5) * 2.0;
      float d = length(uv - m);
      float a = atan(uv.y - m.y, uv.x - m.x);
      float w = sin(8.0*a + time);
      vec3 col = pal(d + w + time*0.1);
      O = vec4(col, 1.0);
    }`;

    function compile(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vs = compile(gl.VERTEX_SHADER, vertexSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const position = gl.getAttribLocation(program, 'position');
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'time');
    const resLoc = gl.getUniformLocation(program, 'resolution');
    const moveLoc = gl.getUniformLocation(program, 'move');

    function resize() {
      heroCanvas.width = heroCanvas.clientWidth;
      heroCanvas.height = heroCanvas.clientHeight;
      gl.viewport(0, 0, heroCanvas.width, heroCanvas.height);
      gl.uniform2f(resLoc, heroCanvas.width, heroCanvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    let mouse = [0, 0];
    heroCanvas.addEventListener('mousemove', e => {
      const rect = heroCanvas.getBoundingClientRect();
      mouse[0] = e.clientX - rect.left;
      mouse[1] = heroCanvas.height - (e.clientY - rect.top);
      gl.uniform2f(moveLoc, mouse[0], mouse[1]);
    });

    function render(t) {
      gl.uniform1f(timeLoc, t * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }
}

