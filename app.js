const API = "https://fakestoreapi.com";

let allProducts = [];
let cart = [];

const money = (n) => `$${Number(n).toFixed(2)}`;

const truncate = (text, max) => {
  if (!text) return "";
  return text.length <= max ? text : text.slice(0, max) + "...";
};

const getJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
};

const show = (el) => { if (el) el.style.display = "block"; };
const hide = (el) => { if (el) el.style.display = "none"; };


const saveCart = () => localStorage.setItem("swiftcart_cart", JSON.stringify(cart));
const loadCart = () => {
  const saved = localStorage.getItem("swiftcart_cart");
  cart = saved ? JSON.parse(saved) : [];
};

const yearEl = document.getElementById("year");

const navLinks = document.getElementById("navLinks");
const menuBtn = document.getElementById("menuBtn");

const catLoader = document.getElementById("catLoader");
const categoryRow = document.getElementById("categoryRow");

const productLoader = document.getElementById("productLoader");
const productGrid = document.getElementById("productGrid");

const trendingLoader = document.getElementById("trendingLoader");
const trendingGrid = document.getElementById("trendingGrid");

const productModal = document.getElementById("productModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalContent = document.getElementById("modalContent");

const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");

const cartDrawer = document.getElementById("cartDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const newsletterForm = document.getElementById("newsletterForm");

if (menuBtn && navLinks) {
  menuBtn.onclick = () => navLinks.classList.toggle("show");
  navLinks.onclick = (e) => {
    if (e.target.tagName === "A") navLinks.classList.remove("show");
  };
}


const openModal = () => productModal && productModal.classList.add("show");
const closeModalFn = () => productModal && productModal.classList.remove("show");

if (modalOverlay) modalOverlay.onclick = closeModalFn;
if (modalClose) modalClose.onclick = closeModalFn;

// Cart drawer 
const openCart = () => cartDrawer && cartDrawer.classList.add("show");
const closeCart = () => cartDrawer && cartDrawer.classList.remove("show");

if (cartBtn) cartBtn.onclick = () => { renderCart(); openCart(); };
if (drawerOverlay) drawerOverlay.onclick = closeCart;
if (closeCartBtn) closeCartBtn.onclick = closeCart;

//Cart logic
const updateCartCount = () => {
  if (!cartCount) return;
  let count = 0;
  cart.forEach(i => count += i.qty);
  cartCount.textContent = count;
};

const calcTotal = () => {
  if (!cartTotal) return;
  let total = 0;
  cart.forEach(i => total += i.price * i.qty);
  cartTotal.textContent = money(total);
};

const addToCart = (id) => {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;

  const exists = cart.find(x => x.id === id);
  if (exists) exists.qty += 1;
  else cart.push({ id: p.id, title: p.title, price: p.price, image: p.image, qty: 1 });

  saveCart();
  updateCartCount();
  renderCart();
};

const removeFromCart = (id) => {
  cart = cart.filter(x => x.id !== id);
  saveCart();
  updateCartCount();
  renderCart();
};

const renderCart = () => {
  if (!cartItems) return;

  cartItems.innerHTML = "";

  if (!cart.length) {
    cartItems.innerHTML = `<p style="color:#64748b;margin:0;">Your cart is empty.</p>`;
    calcTotal();
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div>
        <h4>${truncate(item.title, 45)}</h4>
        <small>${money(item.price)} × ${item.qty}</small>
      </div>
      <button class="btn2" data-remove="${item.id}" title="Remove">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    cartItems.appendChild(div);
  });

  calcTotal();
};

if (cartItems) {
  cartItems.onclick = (e) => {
    const btn = e.target.closest("[data-remove]");
    if (!btn) return;
    removeFromCart(Number(btn.dataset.remove));
  };
}

if (checkoutBtn) {
  checkoutBtn.onclick = () => {
    if (!cart.length) return alert("Cart is empty!");
    alert("Checkout complete (demo).");
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
    closeCart();
  };
}


// category 
if (categoryRow) {
  categoryRow.onclick = (e) => {
    const btn = e.target.closest(".cat-btn");
    if (!btn) return;
    loadByCategory(btn.dataset.cat);
  };
}

// Details 
const renderModal = (p) => {
  if (!modalContent) return;
  modalContent.innerHTML = `
    <img src="${p.image}" alt="${p.title}">
    <div>
      <h3>${p.title}</h3>
      <p>${p.description}</p>

      <p style="margin:10px 0 6px;"><strong>Price:</strong> ${money(p.price)}</p>
      <p style="margin:0 0 12px;">
        <strong>Rating:</strong>
        <i class="fa-solid fa-star" style="color:#f59e0b;"></i>
        ${Number(p.rating?.rate || 0).toFixed(1)}
      </p>

      <div class="btn-row">
        <button class="btn2" id="buyNowBtn">
          <i class="fa-solid fa-bolt"></i> Buy Now
        </button>
        <button class="btn2 primary" id="addFromModalBtn">
          <i class="fa-solid fa-cart-plus"></i> Add
        </button>
      </div>
    </div>
  `;

  document.getElementById("buyNowBtn").onclick = () => {
    addToCart(p.id);
    openCart();
  };

  document.getElementById("addFromModalBtn").onclick = () => {
    addToCart(p.id);
  };
};

const handleGridClick = async (e) => {
  const addBtn = e.target.closest("[data-add]");
  const detailsBtn = e.target.closest("[data-details]");

  if (addBtn) {
    addToCart(Number(addBtn.dataset.add));
    return;
  }

  if (detailsBtn) {
    const id = Number(detailsBtn.dataset.details);
    const p = await getJSON(`${API}/products/${id}`);
    renderModal(p);
    openModal();
  }
};

if (productGrid) productGrid.onclick = handleGridClick;
if (trendingGrid) trendingGrid.onclick = handleGridClick;

if (yearEl) yearEl.textContent = new Date().getFullYear();

const start = async () => {
  loadCart();
  updateCartCount();
  renderCart();

  await loadAllProducts();  
  await loadCategories();   
};

start();
