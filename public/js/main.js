const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const menuGrid = document.querySelector("#menu-grid");
const categoryFilter = document.querySelector("#category-filter");

function formatPrice(price) {
  return `₱${Number(price).toLocaleString("en-PH")}`;
}

function createMenuCard(item) {
  return `
    <article class="menu-card">
      <div class="menu-card-image">
        <img src="/${item.image}" alt="${item.name}" loading="lazy">
        <span class="menu-tag">${item.tag}</span>
      </div>

      <div class="menu-card-content">
        <p class="card-category">${item.category}</p>

        <div class="menu-card-title">
          <h3>${item.name}</h3>
          <span class="price">${formatPrice(item.price)}</span>
        </div>

        <p>${item.description}</p>
      </div>
    </article>
  `;
}

async function loadMenu(category = "All") {
  if (!menuGrid) return;

  menuGrid.innerHTML =
    '<p class="loading-message">Getting the good stuff ready...</p>';

  const url =
    category === "All"
      ? "/api/menu"
      : `/api/menu?category=${encodeURIComponent(category)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Could not load menu data.");
    }

    const items = await response.json();

    if (!Array.isArray(items) || items.length === 0) {
      menuGrid.innerHTML =
        '<p class="loading-message">No menu items found in this category.</p>';
      return;
    }

    menuGrid.innerHTML = items.map(createMenuCard).join("");
  } catch (error) {
    menuGrid.innerHTML =
      '<p class="loading-message">Sorry, the menu could not load. Please refresh the page.</p>';

    console.error(error);
  }
}

if (menuGrid) {
  loadMenu();

  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      loadMenu(categoryFilter.value);
    });
  }
}

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = document.querySelector("#contact-name");
    const status = document.querySelector("#form-status");

    if (!nameInput || !status) return;

    const name = nameInput.value.trim();

    status.textContent =
      `Thank you, ${name}! Your message has been submitted.`;

    contactForm.reset();
  });
}