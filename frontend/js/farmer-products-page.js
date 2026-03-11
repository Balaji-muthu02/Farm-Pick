import apiRequest from "./api.js";
import { getCurrentUser, logout } from "./auth.js";
import { showToast } from "./notifications.js";

window.logout = logout;
window.toggleSidebar = () => {
  const sidebar = document.getElementById("sidebar");
  if(sidebar) sidebar.classList.toggle("active");
};

async function loadProducts() {
  const user = getCurrentUser();
  if (!user || !user.farmer_id) {
    window.location.href = '/frontend/pages/login.html';
    return;
  }

  try {
    const products = await apiRequest(`/products/farmer/${user.farmer_id}`, "GET");
    const grid = document.getElementById("p-grid");
    if(!grid) return;

    if (products.length === 0) {
      grid.innerHTML = "<p>No products added yet.</p>";
      return;
    }

    grid.innerHTML = products.map(p => `
                <div class="product-card">
                    <img
                      src="${p.image_url || 'https://via.placeholder.com/300'}"
                      alt="${p.name}"
                      class="product-image"
                      onerror="this.src='https://via.placeholder.com/300'"
                    />
                    <div class="product-content">
                      <div class="product-header">
                        <div>
                          <h3 class="product-title">${p.name}</h3>
                          <p class="product-category">Category ID: ${p.category_id}</p>
                        </div>
                        <span class="stock-badge ${p.quantity > 0 ? 'badge-in-stock' : 'badge-out-stock'}">
                            ${p.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <div class="product-details">
                        <div class="detail-row">
                          <span class="detail-label">Price:</span>
                          <span class="detail-value">₹${p.price}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">Quantity:</span>
                          <span class="detail-value">${p.quantity}</span>
                        </div>
                      </div>

                      <span class="certified-badge">Organic Certified</span>

                      <div class="product-actions">
                        <button class="action-btn" onclick="window.location.href = '/frontend/Farmer-Page/Add-product.html?id=${p.id}'">
                          <span><i class="fa-solid fa-pen"></i></span>
                          <span>Edit</span>
                        </button>
                        <button class="delete-btn" onclick="deleteProduct(${p.id})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                </div>
            `).join('');

    // Implement search
    const searchInput = document.getElementById('search-products');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
          const term = e.target.value.toLowerCase();
          const cards = document.querySelectorAll('.product-card');
          cards.forEach(card => {
            const titleEl = card.querySelector('.product-title');
            if(titleEl) {
                const title = titleEl.innerText.toLowerCase();
                card.style.display = title.includes(term) ? 'block' : 'none';
            }
          });
        });
    }

  } catch (err) {
    console.error("Error loading products:", err);
  }
}

window.deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await apiRequest(`/products/${id}`, 'DELETE');
      showToast('Product deleted successfully! 🗑️', 'success');
      loadProducts(); // Refresh
    } catch (err) {
      showToast('Failed to delete product', 'error');
    }
  }
};

document.addEventListener('DOMContentLoaded', loadProducts);
