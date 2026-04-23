// ============================================================
// ABHISHEK SMART STORE — Main Application JS
// ============================================================

const BASE = 'http://127.0.0.1:5000';
const ICONS = { Laptop: '💻', Phone: '📱', Headphones: '🎧' };
const getIcon = n => ICONS[n] || '📦';

// ── STATE ──
const state = {
  user: JSON.parse(localStorage.getItem('ss_user') || 'null'),
  cart: JSON.parse(localStorage.getItem('ss_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('ss_wishlist') || '[]'),
  products: [],
  currentPage: 'home',
  searchQuery: '',
  sortBy: 'default',
  categoryFilter: 'all',
};

// ── PERSIST ──
function saveState() {
  localStorage.setItem('ss_cart', JSON.stringify(state.cart));
  localStorage.setItem('ss_wishlist', JSON.stringify(state.wishlist));
  if (state.user) localStorage.setItem('ss_user', JSON.stringify(state.user));
}

function ensureDemoUser() {
  const users = JSON.parse(localStorage.getItem('ss_users') || '[]');
  if (!users.find(u => u.email === 'demo@smartstore.com')) {
    users.push({ name: 'Demo User', email: 'demo@smartstore.com', password: 'demo123' });
    localStorage.setItem('ss_users', JSON.stringify(users));
  }
}

// ── API ──
async function api(path, opts = {}) {
  try {
    const res = await fetch(BASE + path, {
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    });
    return await res.json();
  } catch {
    return null;
  }
}

// ── ROUTER ──
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  state.currentPage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'store') renderStore();
  if (page === 'checkout') renderCheckout();
  if (page === 'profile') renderProfile();
  updateNav();
}

function updateNav() {
  const isAuth = !!state.user;
  document.querySelectorAll('[data-auth]').forEach(el => {
    el.style.display = el.dataset.auth === (isAuth ? 'yes' : 'no') ? '' : 'none';
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === state.currentPage);
  });
}

// ── TOAST ──
function toast(msg, type = '') {
  const container = document.getElementById('toast-container');
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type] || '•'}</span>${msg}`;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(10px)'; el.style.transition = '0.3s'; setTimeout(() => el.remove(), 300); }, 3000);
}

function go(page) {
  navigate(page);
}

function goHome() {
  navigate('store');
}

function renderProds() {
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  if (searchInput) state.searchQuery = searchInput.value;
  if (sortSelect) state.sortBy = sortSelect.value;
  renderProductGrid();
}

function setCat(button) {
  document.querySelectorAll('.cat-tab').forEach(tab => tab.classList.remove('active'));
  button.classList.add('active');
  state.categoryFilter = button.dataset.cat || 'all';
  renderProductGrid();
}

function selPay(button) {
  document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
  button.classList.add('selected');
}

function profTab(tab, el) {
  document.querySelectorAll('.pn-item').forEach(item => item.classList.remove('on'));
  if (el) el.classList.add('on');
  ['orders', 'settings', 'wishlist', 'addresses'].forEach(name => {
    const section = document.getElementById('pt-' + name);
    if (section) section.style.display = name === tab ? 'block' : 'none';
  });
}

function demoLogin() {
  ensureDemoUser();
  const email = document.getElementById('login-email');
  const password = document.getElementById('login-password');
  if (email && password) {
    email.value = 'demo@smartstore.com';
    password.value = 'demo123';
    document.getElementById('login-form')?.requestSubmit();
  }
}

function doSignupStep2() {
  document.getElementById('signup-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

function doFpStep1() {
  document.getElementById('fp-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

function doFpStep2() {
  document.getElementById('fp-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

function doFpStep3() {
  document.getElementById('fp-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

function resendOtp() {
  toast('OTP resent! Please check your email.', 'info');
}

function checkStrength(input) {
  const value = input.value || '';
  const segs = [document.getElementById('sg1'), document.getElementById('sg2'), document.getElementById('sg3')];
  let score = 0;
  if (value.length >= 6) score++;
  if (value.length >= 10) score++;
  if (/[A-Z]/.test(value) && /\d/.test(value)) score++;
  segs.forEach((seg, index) => {
    if (!seg) return;
    seg.className = 'seg';
    if (index < score) seg.classList.add(score === 1 ? 'weak' : score === 2 ? 'medium' : 'strong');
  });
}

function toggleEye(button) {
  const input = button.previousElementSibling;
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
  button.textContent = input.type === 'password' ? '👁' : '🙈';
}

// ── AUTH ──
function initAuth() {
  // Login
  document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = e.target.querySelector('button[type="submit"]') || e.target.querySelector('button');
    if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }
    await new Promise(r => setTimeout(r, 900)); // simulate
    const users = JSON.parse(localStorage.getItem('ss_users') || '[]');
    let user = users.find(u => u.email === email && u.password === password);
    if (!user && email === 'demo@smartstore.com' && password === 'demo123') {
      user = { name: 'Demo User', email, password };
      if (!users.find(u => u.email === email)) {
        users.push(user);
        localStorage.setItem('ss_users', JSON.stringify(users));
      }
    }
    if (user) {
      state.user = { name: user.name, email: user.email };
      saveState();
      toast('Welcome back, ' + user.name + '!', 'success');
      navigate('store');
    } else {
      setError('login-email-error', 'Invalid email or password');
      if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; }
    }
  });

  // Signup
  let signupStep = 1;
  document.getElementById('signup-form').addEventListener('submit', async e => {
    e.preventDefault();
    if (signupStep === 1) {
      const name = document.getElementById('su-name').value;
      const email = document.getElementById('su-email').value;
      const password = document.getElementById('su-password').value;
      if (!name || !email || !password) { toast('Please fill all fields', 'error'); return; }
      if (password.length < 6) { setError('su-pass-error', 'Password must be at least 6 characters'); return; }
      const users = JSON.parse(localStorage.getItem('ss_users') || '[]');
      if (users.find(u => u.email === email)) { setError('su-email-error', 'Email already registered'); return; }
      document.getElementById('su-step1').classList.add('hidden');
      document.getElementById('su-step2').classList.remove('hidden');
      document.getElementById('su-otp-email').textContent = email;
      signupStep = 2;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem('ss_otp', otp);
      sessionStorage.setItem('ss_pending', JSON.stringify({ name, email, password }));
      toast('OTP sent! (demo: ' + otp + ')', 'info');
      return;
    }
    if (signupStep === 2) {
      const inputs = document.querySelectorAll('.otp-input');
      const entered = [...inputs].map(i => i.value).join('');
      const real = sessionStorage.getItem('ss_otp');
      if (entered !== real) { toast('Invalid OTP. Try again.', 'error'); return; }
      const pending = JSON.parse(sessionStorage.getItem('ss_pending') || '{}');
      const users = JSON.parse(localStorage.getItem('ss_users') || '[]');
      users.push(pending);
      localStorage.setItem('ss_users', JSON.stringify(users));
      state.user = { name: pending.name, email: pending.email };
      saveState();
      sessionStorage.removeItem('ss_otp'); sessionStorage.removeItem('ss_pending');
      toast('Account created! Welcome, ' + pending.name + '!', 'success');
      navigate('store');
    }
  });

  // Forgot password
  let fpStep = 1;
  document.getElementById('fp-form').addEventListener('submit', async e => {
    e.preventDefault();
    if (fpStep === 1) {
      const email = document.getElementById('fp-email').value;
      const users = JSON.parse(localStorage.getItem('ss_users') || '[]');
      if (!users.find(u => u.email === email)) { setError('fp-email-error', 'No account found with this email'); return; }
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem('ss_fp_otp', otp);
      sessionStorage.setItem('ss_fp_email', email);
      document.getElementById('fp-step1').classList.add('hidden');
      document.getElementById('fp-step2').classList.remove('hidden');
      document.getElementById('fp-otp-email').textContent = email;
      fpStep = 2;
      toast('Reset OTP sent! (demo: ' + otp + ')', 'info');
      return;
    }
    if (fpStep === 2) {
      const inputs = document.querySelectorAll('.fp-otp-input');
      const entered = [...inputs].map(i => i.value).join('');
      const real = sessionStorage.getItem('ss_fp_otp');
      if (entered !== real) { toast('Invalid OTP.', 'error'); return; }
      document.getElementById('fp-step2').classList.add('hidden');
      document.getElementById('fp-step3').classList.remove('hidden');
      fpStep = 3;
      return;
    }
    if (fpStep === 3) {
      const pass = document.getElementById('fp-new-pass').value;
      const confirm = document.getElementById('fp-confirm-pass').value;
      if (pass.length < 6) { setError('fp-pass-error', 'Password must be at least 6 characters'); return; }
      if (pass !== confirm) { setError('fp-pass-error', 'Passwords do not match'); return; }
      const email = sessionStorage.getItem('ss_fp_email');
      const users = JSON.parse(localStorage.getItem('ss_users') || '[]');
      const idx = users.findIndex(u => u.email === email);
      if (idx > -1) { users[idx].password = pass; localStorage.setItem('ss_users', JSON.stringify(users)); }
      sessionStorage.removeItem('ss_fp_otp'); sessionStorage.removeItem('ss_fp_email');
      toast('Password reset! Please log in.', 'success');
      navigate('login');
      fpStep = 1;
    }
  });

  // OTP input navigation
  function setupOtpNav(selector) {
    document.querySelectorAll(selector).forEach((inp, i, all) => {
      inp.addEventListener('input', () => {
        if (inp.value.length >= 1 && i < all.length - 1) all[i + 1].focus();
      });
      inp.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !inp.value && i > 0) all[i - 1].focus();
      });
    });
  }
  setupOtpNav('.otp-input');
  setupOtpNav('.fp-otp-input');

  // Password strength
  document.getElementById('su-password').addEventListener('input', function () {
    const v = this.value;
    const segs = document.querySelectorAll('.strength-seg');
    let score = 0;
    if (v.length >= 6) score++;
    if (v.length >= 10) score++;
    if (/[A-Z]/.test(v) && /[0-9]/.test(v)) score++;
    segs.forEach((s, i) => {
      s.className = 'strength-seg';
      if (i < score) s.classList.add(score === 1 ? 'weak' : score === 2 ? 'medium' : 'strong');
    });
  });

  // Toggle password visibility
  document.querySelectorAll('.input-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const inp = btn.previousElementSibling;
      inp.type = inp.type === 'password' ? 'text' : 'password';
      btn.textContent = inp.type === 'password' ? '👁' : '🙈';
    });
  });
}

function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'block'; setTimeout(() => el.style.display = 'none', 4000); }
}

// ── CART ──
function cartCount() {
  return state.cart.reduce((s, i) => s + i.qty, 0);
}
function cartTotal() {
  return state.cart.reduce((s, i) => {
    const p = state.products.find(pr => pr.name === i.product);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
}
function updateCartBadge() {
  const c = cartCount();
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.textContent = c;
    b.style.display = c > 0 ? 'flex' : 'none';
  });
}
function addToCart(name, qty = 1) {
  const existing = state.cart.find(i => i.product === name);
  const product = state.products.find(p => p.name === name);
  if (!product || product.stock <= 0) { toast('Out of stock', 'error'); return; }
  if (existing) {
    if (existing.qty + qty > product.stock) { toast('Not enough stock', 'error'); return; }
    existing.qty += qty;
  } else {
    state.cart.push({ product: name, qty });
  }
  // sync with backend
  api('/add', { method: 'POST', body: JSON.stringify({ product: name, qty }) });
  saveState();
  updateCartBadge();
  renderCartDrawer();
  toast(name + ' added to cart!', 'success');
}
function removeFromCart(name) {
  state.cart = state.cart.filter(i => i.product !== name);
  saveState(); updateCartBadge(); renderCartDrawer();
}
function updateCartQty(name, delta) {
  const item = state.cart.find(i => i.product === name);
  const product = state.products.find(p => p.name === name);
  if (!item) return;
  item.qty = Math.max(1, Math.min(product ? product.stock : 99, item.qty + delta));
  saveState(); renderCartDrawer();
}

function renderCartDrawer() {
  const items = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  if (!state.cart.length) {
    items.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty</p><p style="margin-top:8px;font-size:12px">Browse products to get started</p></div>`;
    footer.innerHTML = `<button class="btn btn-primary btn-full" onclick="closeCart();navigate('store')">Shop Now →</button>`;
    return;
  }
  items.innerHTML = state.cart.map(item => {
    const p = state.products.find(pr => pr.name === item.product) || {};
    const sub = (p.price || 0) * item.qty;
    return `
      <div class="cart-item">
        <div class="cart-item-icon">${getIcon(item.product)}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.product}</div>
          <div class="cart-item-price">₹${formatPrice(sub)}</div>
          <div class="cart-item-controls">
            <div class="qty-control">
              <button class="qty-btn" onclick="updateCartQty('${item.product}',-1)">−</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="updateCartQty('${item.product}',1)">+</button>
            </div>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.product}')">✕</button>
      </div>`;
  }).join('');

  const total = cartTotal();
  const delivery = total > 0 ? (total > 50000 ? 0 : 99) : 0;
  footer.innerHTML = `
    <div class="cart-summary">
      <div class="cart-row"><span>Subtotal</span><span>₹${formatPrice(total)}</span></div>
      <div class="cart-row"><span>Delivery</span><span>${delivery === 0 ? '<span style="color:var(--green)">Free</span>' : '₹' + delivery}</span></div>
      <div class="cart-row total"><span>Total</span><span>₹${formatPrice(total + delivery)}</span></div>
    </div>
    <button class="btn btn-primary btn-full" onclick="closeCart(); if(!state.user){navigate('login')}else{navigate('checkout')}">
      Checkout →
    </button>
    <button class="btn btn-ghost btn-full mt-8" onclick="closeCart()">Continue Shopping</button>
  `;
}

function openCart() {
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-drawer').classList.add('open');
  renderCartDrawer();
}
function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-drawer').classList.remove('open');
}

// ── STORE ──
async function loadProducts() {
  const data = await api('/products');
  if (data) {
    state.products = data;
    // merge local cart stocks
  }
  renderProductGrid();
}

function getFilteredProducts() {
  let list = [...state.products];
  if (state.categoryFilter !== 'all') {
    const map = { electronics: ['Laptop','Phone','Headphones'], audio: ['Headphones'], mobile: ['Phone'], computers: ['Laptop'] };
    const names = map[state.categoryFilter] || [];
    list = list.filter(p => names.includes(p.name));
  }
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.specs.toLowerCase().includes(q));
  }
  if (state.sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (state.sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (state.sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function renderProductGrid() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  const products = getFilteredProducts();
  if (!products.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text3)">
      <div style="font-size:40px;margin-bottom:12px">🔍</div>
      <p>No products found</p></div>`;
    return;
  }
  grid.innerHTML = products.map((p, i) => {
    const isWished = state.wishlist.includes(p.name);
    const cartItem = state.cart.find(c => c.product === p.name);
    const badges = { Laptop: 'sale', Headphones: 'new' };
    const badgeText = { sale: 'Sale', new: 'New' };
    const badge = badges[p.name];
    return `
      <div class="product-card anim-fade-up" style="animation-delay:${i * 0.06}s">
        <div class="product-img-wrap">
          <span>${getIcon(p.name)}</span>
          ${badge ? `<span class="product-badge ${badge}">${badgeText[badge]}</span>` : ''}
          <div class="product-wishlist ${isWished ? 'active' : ''}" onclick="toggleWishlist('${p.name}')">
            ${isWished ? '❤️' : '🤍'}
          </div>
        </div>
        <div class="product-body">
          <div class="product-name">${p.name}</div>
          <div class="product-specs">${p.specs} · 🚚 ${p.delivery}</div>
          <div class="product-bottom">
            <div>
              <div class="product-price">₹${formatPrice(p.price)}</div>
              <div class="product-stock ${p.stock <= 3 && p.stock > 0 ? 'low' : p.stock === 0 ? 'out' : ''}">
                ${p.stock === 0 ? 'Out of stock' : p.stock <= 3 ? `Only ${p.stock} left!` : `✓ In stock (${p.stock})`}
              </div>
            </div>
            ${p.stock > 0
              ? (cartItem
                  ? `<div class="qty-control">
                      <button class="qty-btn" onclick="updateCartQty('${p.name}',-1);renderProductGrid()">−</button>
                      <span class="qty-num">${cartItem.qty}</span>
                      <button class="qty-btn" onclick="updateCartQty('${p.name}',1);renderProductGrid()">+</button>
                    </div>`
                  : `<button class="product-add-btn" onclick="addToCart('${p.name}');renderProductGrid()">+</button>`
                )
              : `<button class="product-add-btn" disabled>✕</button>`}
          </div>
        </div>
      </div>`;
  }).join('');
}

function renderStore() {
  loadProducts();
  renderCartDrawer();
  updateCartBadge();
}

function toggleWishlist(name) {
  if (state.wishlist.includes(name)) {
    state.wishlist = state.wishlist.filter(n => n !== name);
    toast('Removed from wishlist', 'info');
  } else {
    state.wishlist.push(name);
    toast('Added to wishlist ❤️', 'success');
  }
  saveState();
  renderProductGrid();
}

// ── CHECKOUT ──
function renderCheckout() {
  if (!state.user) { navigate('login'); return; }
  if (!state.cart.length) { navigate('store'); toast('Your cart is empty', 'info'); return; }
  const items = document.getElementById('checkout-items');
  const total = cartTotal();
  const delivery = total > 50000 ? 0 : 99;
  items.innerHTML = state.cart.map(item => {
    const p = state.products.find(pr => pr.name === item.product) || {};
    return `
      <div class="cart-item" style="margin-bottom:10px">
        <div class="cart-item-icon">${getIcon(item.product)}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.product}</div>
          <div class="cart-item-price">₹${formatPrice((p.price || 0) * item.qty)} × ${item.qty}</div>
        </div>
      </div>`;
  }).join('');
  document.getElementById('checkout-subtotal').textContent = '₹' + formatPrice(total);
  document.getElementById('checkout-delivery').textContent = delivery === 0 ? 'Free' : '₹' + delivery;
  document.getElementById('checkout-total').textContent = '₹' + formatPrice(total + delivery);
  document.getElementById('checkout-name').value = state.user.name || '';
  document.getElementById('checkout-email').value = state.user.email || '';
}

async function placeOrder() {
  const btn = document.getElementById('place-order-btn');
  btn.disabled = true; btn.textContent = 'Placing Order…';
  const result = await api('/checkout');
  await new Promise(r => setTimeout(r, 800));

  // save to order history
  const orders = JSON.parse(localStorage.getItem('ss_orders') || '[]');
  orders.unshift({
    id: '#SS' + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    items: [...state.cart],
    total: cartTotal() + (cartTotal() > 50000 ? 0 : 99),
    status: 'processing'
  });
  localStorage.setItem('ss_orders', JSON.stringify(orders));

  state.cart = [];
  saveState(); updateCartBadge();
  document.getElementById('checkout-success').classList.remove('hidden');
  document.getElementById('checkout-form-wrap').classList.add('hidden');
  toast('Order placed successfully!', 'success');
}

// ── PROFILE ──
function renderProfile() {
  if (!state.user) { navigate('login'); return; }
  document.getElementById('profile-avatar-text').textContent = state.user.name[0].toUpperCase();
  document.getElementById('profile-display-name').textContent = state.user.name;
  document.getElementById('profile-display-email').textContent = state.user.email;
  document.getElementById('pf-name').value = state.user.name;
  document.getElementById('pf-email').value = state.user.email;

  const orders = JSON.parse(localStorage.getItem('ss_orders') || '[]');
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  document.getElementById('profile-orders-count').textContent = orders.length;
  document.getElementById('profile-spent').textContent = '₹' + formatPrice(totalSpent);
  document.getElementById('profile-wishlist-count').textContent = state.wishlist.length;

  const orderList = document.getElementById('profile-order-list');
  orderList.innerHTML = orders.length ? orders.map(o => `
    <div class="order-card">
      <div class="order-card-top">
        <div>
          <div class="order-id">${o.id}</div>
          <div style="font-size:12px;color:var(--text3);margin-top:2px">${o.date}</div>
        </div>
        <span class="order-status ${o.status}">${o.status}</span>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div style="font-size:13px;color:var(--text2)">${o.items.map(i => i.product + ' ×' + i.qty).join(', ')}</div>
        <div style="font-size:14px;font-weight:600;color:var(--gold)">₹${formatPrice(o.total)}</div>
      </div>
    </div>
  `).join('') : `<div style="text-align:center;padding:32px;color:var(--text3);font-size:13px">No orders yet</div>`;
}

function saveProfile() {
  const name = document.getElementById('pf-name').value;
  const email = document.getElementById('pf-email').value;
  if (!name || !email) { toast('Please fill all fields', 'error'); return; }
  state.user = { ...state.user, name, email };
  saveState();
  renderProfile();
  toast('Profile updated!', 'success');
}

function logout() {
  state.user = null;
  state.cart = [];
  localStorage.removeItem('ss_user');
  localStorage.removeItem('ss_cart');
  updateCartBadge();
  toast('Logged out successfully', 'info');
  navigate('login');
}

// ── FORMAT ──
function formatPrice(n) {
  return Number(n).toLocaleString('en-IN');
}

// ── INIT ──
function init() {
  ensureDemoUser();
  // Auto-navigate
  if (state.user) {
    navigate('store');
  } else {
    navigate('login');
  }
  updateNav();
  initAuth();

  // Cart drawer
  document.getElementById('cart-overlay').addEventListener('click', closeCart);

  // Search
  const searchInp = document.getElementById('search-input');
  if (searchInp) searchInp.addEventListener('input', e => { state.searchQuery = e.target.value; renderProductGrid(); });

  // Sort
  const sortSel = document.getElementById('sort-select');
  if (sortSel) sortSel.addEventListener('change', e => { state.sortBy = e.target.value; renderProductGrid(); });

  // Category tabs
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.categoryFilter = tab.dataset.cat;
      renderProductGrid();
    });
  });

  // Payment method selection
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  updateCartBadge();
}

document.addEventListener('DOMContentLoaded', init);
