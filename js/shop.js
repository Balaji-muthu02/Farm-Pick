import apiRequest from './api.js';
import { updateCartBadge } from './main.js';
import { showToast } from './notifications.js';

// --- FETCH PRODUCTS FROM BACKEND ---
// This function talks to our API to get all the farm-fresh products.
export async function fetchProducts() {
    try {
        // We call our API's /products/ endpoint
        return await apiRequest('/products/', 'GET');
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// --- RENDER PRODUCTS TO THE PAGE ---
// This function takes a list of products and displays them as beautiful cards on the screen.
export function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '<p>No products available yet.</p>';
        return;
    }

    // Build the grid of product cards using HTML template
    container.innerHTML = products.map(product => `
        <div class="card">
            <a href="#" class="card-image-link">
                <!-- Product Image -->
                <img src="${product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'}" 
                     alt="${product.name}" 
                     onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'">
            </a>
            <div class="card-content">
                <!-- Product Name and Farmer Info -->
                <h3 class="product-name">${product.name}</h3>
                <p class="farmer-name">🌾 ${product.farmer_name || 'Verified Farmer'}</p>
                
                <div class="card-middle">
                    <!-- Stock status badge -->
                    <div class="stock-badge in-stock">${product.quantity > 0 ? 'In Stock' : 'Out of Stock'}</div>
                </div>

                <div class="card-bottom">
                    <!-- Price section -->
                    <div class="price-wrapper">
                        <span class="price">₹${product.price}</span>
                        <span class="price-unit">/kg</span>
                    </div>
                    <!-- Action buttons (Add to Cart and Buy Now) -->
                    <div class="action-btns">
                        <button class="add-cart-btn" onclick="addToCart(${product.id})" title="Add to Cart">🛒</button>
                        <button class="buy-now-btn" onclick="buyNow(${product.id})">Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// --- SEARCH FUNCTIONALITY ---
// This allows users to search for products by their name or farmer's name.
export function initSearch(allProducts, containerId) {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    // Check for search query in URL (e.g., Shop.html?search=tomato)
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('search');
    if (initialQuery) {
        searchInput.value = initialQuery;
        const filtered = allProducts.filter(p =>
            p.name.toLowerCase().includes(initialQuery.toLowerCase()) ||
            (p.farmer_name && p.farmer_name.toLowerCase().includes(initialQuery.toLowerCase()))
        );
        renderProducts(filtered, containerId);
    }

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        // Filter products that match the search query
        const filtered = allProducts.filter(p =>
            p.name.toLowerCase().includes(query) ||
            (p.farmer_name && p.farmer_name.toLowerCase().includes(query))
        );
        // Refresh the displayed cards
        renderProducts(filtered, containerId);
    });
}

// --- GLOBAL ADD TO CART FUNCTION ---
// Triggered when a user clicks the 🛒 button.
window.addToCart = async (productId) => {
    // First, check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showToast('Please login to add items to cart', 'error');
        window.location.href = '/pages/login.html';
        return;
    }

    try {
        // Send request to API to add item to user's cart
        await apiRequest('/cart/add', 'POST', {
            user_id: user.id,
            product_id: productId,
            quantity: 1
        });

        showToast('Product added to cart! 🛒', 'success');
        // REFRESH THE BADGE: This makes the count (1, 2, 3...) update immediately!
        updateCartBadge();
    } catch (err) {
        showToast('Failed to add to cart. Please try again.', 'error');
    }
};

// --- GLOBAL BUY NOW FUNCTION ---
// Redirects user straight to checkout for a quick purchase.
window.buyNow = (productId) => {
    window.location.href = `/pages/Checkout.html?id=${productId}`;
};
