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
// Newsletter
if (newsletterForm) {
  newsletterForm.onsubmit = (e) => {
    e.preventDefault();
    alert("Subscribed! (demo)");
    newsletterForm.reset();
  };
}

// Category + products 
let activeCategory = "all";

const renderCategories = (categories) => {
  if (!categoryRow) return;
  categoryRow.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "cat-btn active";
  allBtn.textContent = "All";
  allBtn.dataset.cat = "all";
  categoryRow.appendChild(allBtn);

  categories.forEach(cat => {
    let label = cat;
    if (cat === "men's clothing") label = "Men's Clothing";
    if (cat === "women's clothing") label = "Women's Clothing";
    if (cat === "jewelery") label = "Jewelery";
    if (cat === "electronics") label = "Electronics";

    const btn = document.createElement("button");
    btn.className = "cat-btn";
    btn.textContent = label;
    btn.dataset.cat = cat;
    categoryRow.appendChild(btn);
  });
};

const setActiveCategoryBtn = () => {
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  const current = document.querySelector(`.cat-btn[data-cat="${activeCategory}"]`);
  if (current) current.classList.add("active");
};

const productCardHTML = (p) => {
  let catLabel = p.category;
  if (p.category === "men's clothing") catLabel = "Men's Clothing";
  if (p.category === "women's clothing") catLabel = "Women's Clothing";
  if (p.category === "jewelery") catLabel = "Jewelery";
  if (p.category === "electronics") catLabel = "Electronics";

  return `
    <div class="pcard">
      <img class="pimg" src="${p.image}" alt="${p.title}">
      <div class="pbody">
        <div class="pmeta">
          <span class="badge">${catLabel}</span>
          <span class="rating">
            <i class="fa-solid fa-star" style="color:#f59e0b;"></i>
            ${Number(p.rating?.rate || 0).toFixed(1)}
            <span>(${p.rating?.count || 0})</span>
          </span>
        </div>

        <h3 class="ptitle">${truncate(p.title, 34)}</h3>
        <div class="price">${money(p.price)}</div>

        <div class="btn-row">
          <button class="btn2" data-details="${p.id}">
            <i class="fa-regular fa-eye"></i> Details
          </button>
          <button class="btn2 primary" data-add="${p.id}">
            <i class="fa-solid fa-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  `;
};

const renderProducts = (products, grid) => {
  if (!grid) return;
  if (!products.length) {
    grid.innerHTML = `<p style="color:#64748b;margin:0;">No products found.</p>`;
    return;
  }
  grid.innerHTML = products.map(productCardHTML).join("");
};

// Loaders
const loadCategories = async () => {
  if (!categoryRow) return; 
  try {
    show(catLoader);
    const categories = await getJSON(`${API}/products/categories`);
    renderCategories(categories);
  } catch {
    categoryRow.innerHTML = `<p style="color:#64748b;margin:0;">Failed to load categories.</p>`;
  } finally {
    hide(catLoader);
  }
};

const loadAllProducts = async () => {

  try {
    if (productGrid) show(productLoader);
    if (trendingGrid) show(trendingLoader);

    const products = await getJSON(`${API}/products`);
    allProducts = products;

    if (productGrid) renderProducts(products, productGrid);

    if (trendingGrid) {
      const sorted = [...products].sort((a,b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
      renderProducts(sorted.slice(0, 3), trendingGrid);
    }
  } catch {
    if (productGrid) productGrid.innerHTML = `<p style="color:#64748b;margin:0;">Failed to load products.</p>`;
    if (trendingGrid) trendingGrid.innerHTML = `<p style="color:#64748b;margin:0;">Failed to load trending.</p>`;
  } finally {
    if (productGrid) hide(productLoader);
    if (trendingGrid) hide(trendingLoader);
  }
};

const loadByCategory = async (cat) => {
  if (!productGrid) return; 
  activeCategory = cat;
  setActiveCategoryBtn();

  if (cat === "all") {
    renderProducts(allProducts, productGrid);
    return;
  }

  try {
    show(productLoader);
    const products = await getJSON(`${API}/products/category/${encodeURIComponent(cat)}`);
    renderProducts(products, productGrid);
  } catch {
    productGrid.innerHTML = `<p style="color:#64748b;margin:0;">Failed to load category products.</p>`;
  } finally {
    hide(productLoader);
  }
}; 

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
