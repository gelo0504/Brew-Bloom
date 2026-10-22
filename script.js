// ==========================================
// BREW & BLOOM COFFEE CO.
// E-COMMERCE WEBSITE JAVASCRIPT
// ==========================================

// PRODUCT DATABASE
const products = [
  {
    id: 1,
    name: "Classic House Blend",
    category: "Coffee Beans",
    price: 420,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85",
    desc: "A balanced medium roast with chocolate notes and a smooth finish.",
    tag: "Bestseller"
  },
  {
    id: 2,
    name: "Caramel Latte",
    category: "Drinks",
    price: 185,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85",
    desc: "Espresso and steamed milk finished with buttery caramel.",
    tag: "Popular"
  },
  {
    id: 3,
    name: "Matcha Cloud",
    category: "Drinks",
    price: 195,
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=85",
    desc: "Earthy matcha, creamy milk, and a soft layer of foam.",
    tag: "New"
  },
  {
    id: 4,
    name: "Cold Brew Bottle",
    category: "Drinks",
    price: 160,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85",
    desc: "Slow-steeped for 18 hours for a naturally sweet, bold cup.",
    tag: "Chilled"
  },
  {
    id: 5,
    name: "House Espresso Beans",
    category: "Coffee Beans",
    price: 480,
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=85",
    desc: "Rich espresso blend with toasted hazelnut and cocoa notes.",
    tag: "Fresh Roast"
  },
  {
    id: 6,
    name: "Vanilla Oat Latte",
    category: "Drinks",
    price: 200,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=85",
    desc: "A velvety latte with oat milk and a touch of vanilla.",
    tag: "Plant-Based"
  },
  {
    id: 7,
    name: "Ceramic Brew Mug",
    category: "Merchandise",
    price: 350,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558f11e6d?auto=format&fit=crop&w=900&q=85",
    desc: "A ceramic mug for your everyday coffee ritual.",
    tag: "Gift Pick"
  },
  {
    id: 8,
    name: "Pour-over Starter Kit",
    category: "Merchandise",
    price: 890,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
    desc: "Everything you need to brew a thoughtful cup at home.",
    tag: "Starter Kit"
  }
];

// FORMAT PRICES IN PHILIPPINE PESOS
function peso(amount) {
  return "₱" + Number(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// LOAD CART FROM LOCAL STORAGE
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("bb-cart") || "[]");
  } catch (error) {
    return [];
  }
}

// SAVE CART
function saveCart(cart) {
  localStorage.setItem("bb-cart", JSON.stringify(cart));
  updateCartCount();
}

// UPDATE CART COUNT
function updateCartCount() {
  const count = getCart().reduce((total, item) => {
    return total + item.qty;
  }, 0);

  document.querySelectorAll(".cart-count").forEach(element => {
    element.textContent = count;
  });
}

// DISPLAY NOTIFICATION
function toast(message) {
  let element = document.querySelector("#toast");

  if (!element) {
    element = document.createElement("div");
    element.id = "toast";
    element.className = "toast";
    element.setAttribute("role", "status");
    document.body.appendChild(element);
  }

  element.textContent = message;
  element.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    element.classList.remove("show");
  }, 2400);
}

// CREATE PRODUCT CARD
function productCard(product) {
  return `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}"
             alt="${product.name}"
             loading="lazy">
        <span class="tag">${product.tag}</span>
      </div>

      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>

        <div class="price-row">
          <span class="price">${peso(product.price)}</span>

          <div>
            <button class="icon-btn small"
                    onclick="showProduct(${product.id})">
              View
            </button>

            <button class="add-btn"
                    onclick="addToCart(${product.id})">
              + Add
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

// DISPLAY FEATURED PRODUCTS ON HOME PAGE
function renderFeatured() {
  const container = document.querySelector("#featured-products");

  if (!container) return;

  container.innerHTML = products
    .slice(0, 3)
    .map(productCard)
    .join("");
}

// SEARCH AND FILTER PRODUCTS
function renderShop() {
  const container = document.querySelector("#shop-products");

  if (!container) return;

  const search = (
    document.querySelector("#search-products")?.value || ""
  ).toLowerCase();

  const category =
    document.querySelector("#category-filter")?.value || "All";

  const filtered = products.filter(product => {
    const matchesSearch = (
      product.name + " " +
      product.desc + " " +
      product.category
    ).toLowerCase().includes(search);

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="emoji">☕</div>
        <h3>No products found</h3>
        <p>Try another search or category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(productCard).join("");
}

// ADD PRODUCT TO CART
function addToCart(id) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({
      id: id,
      qty: 1
    });
  }

  saveCart(cart);
  toast("Added to your cart!");

  renderCartIfNeeded();
  renderCheckout();
}

// PRODUCT DETAILS POPUP
function showProduct(id) {
  const product = products.find(item => item.id === id);
  const modal = document.querySelector("#product-modal");

  if (!product || !modal) {
    if (product) toast(product.name + " — " + peso(product.price));
    return;
  }

  modal.querySelector(".modal-content").innerHTML = `
    <img src="${product.image}" alt="${product.name}">

    <div>
      <span class="eyebrow">${product.category}</span>
      <h2>${product.name}</h2>
      <p>${product.desc}</p>
      <h3>${peso(product.price)}</h3>

      <button onclick="addToCart(${product.id}); closeModal()">
        Add to cart
      </button>
    </div>
  `;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

// CLOSE PRODUCT POPUP
function closeModal() {
  const modal = document.querySelector("#product-modal");

  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

// CHANGE PRODUCT QUANTITY
function changeQty(id, amount) {
  let cart = getCart();
  const item = cart.find(product => product.id === id);

  if (item) {
    item.qty += amount;
  }

  // Remove products whose quantity reaches zero
  cart = cart.filter(product => product.qty > 0);

  saveCart(cart);
  renderCartIfNeeded();
  renderCheckout();
}

// REMOVE ITEM FROM CART
function removeItem(id) {
  const cart = getCart().filter(item => item.id !== id);

  saveCart(cart);
  renderCartIfNeeded();
  renderCheckout();

  toast("Item removed.");
}

// DISPLAY SHOPPING CART
function renderCartIfNeeded() {
  const container = document.querySelector("#cart-items");

  if (!container) return;

  const cart = getCart();
  const summary = document.querySelector("#cart-summary");

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="emoji">🛍️</div>
        <h3>Your cart is waiting</h3>
        <p>Add a little joy to your day.</p>
        <a class="btn" href="shop.html">Browse the shop</a>
      </div>
    `;

    if (summary) summary.style.display = "none";
    return;
  }

  if (summary) summary.style.display = "block";

  container.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Subtotal</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        ${cart.map(item => {
          const product = products.find(p => p.id === item.id);

          if (!product) return "";

          return `
            <tr>
              <td data-label="Product">
                <div class="cart-product">
                  <img src="${product.image}" alt="${product.name}">
                  <strong>${product.name}</strong>
                </div>
              </td>

              <td data-label="Price">${peso(product.price)}</td>

              <td data-label="Quantity">
                <div class="qty-controls">
                  <button class="icon-btn"
                          onclick="changeQty(${product.id}, -1)">−</button>

                  <span>${item.qty}</span>

                  <button class="icon-btn"
                          onclick="changeQty(${product.id}, 1)">+</button>
                </div>
              </td>

              <td data-label="Subtotal">
                ${peso(product.price * item.qty)}
              </td>

              <td>
                <button class="remove-btn"
                        onclick="removeItem(${product.id})">
                  Remove
                </button>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;

  const subtotal = cart.reduce((total, item) => {
    const product = products.find(p => p.id === item.id);

    return total + (product ? product.price * item.qty : 0);
  }, 0);

  const shipping = subtotal >= 1000 ? 0 : 80;

  document.querySelector("#subtotal").textContent = peso(subtotal);

  document.querySelector("#shipping").textContent =
    shipping === 0 ? "FREE" : peso(shipping);

  document.querySelector("#grand-total").textContent =
    peso(subtotal + shipping);
}

// DISPLAY CHECKOUT SUMMARY
function renderCheckout() {
  const container = document.querySelector("#checkout-summary");

  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <p>Your cart is empty.</p>
      <a class="btn" href="shop.html">Shop products</a>
    `;
    return;
  }

  const subtotal = cart.reduce((total, item) => {
    const product = products.find(p => p.id === item.id);

    return total + (product ? product.price * item.qty : 0);
  }, 0);

  const shipping = subtotal >= 1000 ? 0 : 80;
  const total = subtotal + shipping;

  container.innerHTML = `
    ${cart.map(item => {
      const product = products.find(p => p.id === item.id);

      if (!product) return "";

      return `
        <div class="summary-line">
          <span>${product.name} × ${item.qty}</span>
          <strong>${peso(product.price * item.qty)}</strong>
        </div>
      `;
    }).join("")}

    <div class="summary-line">
      <span>Subtotal</span>
      <strong>${peso(subtotal)}</strong>
    </div>

    <div class="summary-line">
      <span>Shipping</span>
      <strong>${shipping === 0 ? "FREE" : peso(shipping)}</strong>
    </div>

    <div class="summary-line total">
      <span>Total</span>
      <strong>${peso(total)}</strong>
    </div>
  `;
}

// LIGHT AND DARK MODE
function initTheme() {
  const savedTheme = localStorage.getItem("bb-theme");

  if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
  }

  document.querySelectorAll(".theme-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const current =
        document.documentElement.dataset.theme || "light";

      const next = current === "dark" ? "light" : "dark";

      document.documentElement.dataset.theme = next;
      localStorage.setItem("bb-theme", next);

      toast(next === "dark" ? "Dark mode on" : "Light mode on");
    });
  });
}

// INITIALIZE WEBSITE FEATURES
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initTheme();

  renderFeatured();
  renderShop();
  renderCartIfNeeded();
  renderCheckout();

  // MOBILE NAVIGATION
  const menu = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");

  if (menu && links) {
    menu.addEventListener("click", () => {
      links.classList.toggle("open");

      menu.setAttribute(
        "aria-expanded",
        links.classList.contains("open")
      );
    });
  }

  // PRODUCT SEARCH AND FILTER
  document.querySelector("#search-products")
    ?.addEventListener("input", renderShop);

  document.querySelector("#category-filter")
    ?.addEventListener("change", renderShop);

  // CLOSE PRODUCT POPUP
  document.querySelectorAll("[data-close-modal]").forEach(element => {
    element.addEventListener("click", event => {
      if (
        event.target === element ||
        event.target.closest(".modal-close")
      ) {
        closeModal();
      }
    });
  });

  // CONTACT FORM VALIDATION
  document.querySelector("#contact-form")
    ?.addEventListener("submit", event => {
      event.preventDefault();

      const form = event.currentTarget;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      document.querySelector("#contact-success")
        ?.classList.add("show");

      form.reset();

      toast("Thank you for contacting us!");
    });

  // CHECKOUT VALIDATION
  document.querySelector("#checkout-form")
    ?.addEventListener("submit", event => {
      event.preventDefault();

      const form = event.currentTarget;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (getCart().length === 0) {
        toast("Your cart is empty.");
        return;
      }

      const success = document.querySelector("#order-success");

      success.classList.add("show");

      success.innerHTML = `
        <strong>Thank you! Your demo order has been placed.</strong>
        <p>This is a front-end school project. No payment was processed.</p>
      `;

      saveCart([]);
      renderCartIfNeeded();
      renderCheckout();

      form.reset();
    });

  // FAQ ACCORDION
  document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
      button.parentElement.classList.toggle("open");
    });
  });
});