import { getCurrentUser, logout } from './auth.js';
import apiRequest from './api.js';
import { showToast } from './notifications.js';

// --- USER SESSION SYNC ---
// This function checks the backend for the latest user role (e.g., if Admin approved Seller request)
async function syncUserSession() {
    const user = getCurrentUser();
    if (!user) return;

    try {
        const updatedUser = await apiRequest(`/users/${user.id}`, 'GET');
        if (updatedUser && updatedUser.role !== user.role) {
            console.log("Role updated! Updating localStorage and UI...");
            localStorage.setItem('user', JSON.stringify(updatedUser));

            if (updatedUser.role === 'farmer') {
                showToast("🎉 Mass News! Admin approved your Farmer account. Welcome to the community!", 'success');
            }
            window.location.reload(); // Refresh to update everything
        }
    } catch (err) {
        console.error("Session sync failed:", err);
    }
}

// Global execution
syncUserSession();

// --- NAVBAR UPDATE LOGIC ---
// This function updates the navbar based on whether the user is logged in or not.
export async function updateNavbar() {
    const user = getCurrentUser();
    // Get the container where navbar icons (user icon, cart icon) are located
    const navIcons = document.getElementById('nav-icons-container') || document.querySelector('.nav-icons');

    if (navIcons) {
        // --- SEARCH ICON ---
        const searchIcon = navIcons.querySelector('.search-icon');
        if (searchIcon) searchIcon.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';

        // --- USER AUTH BUTTON ---
        const authBtn = navIcons.querySelector('.user-btn');
        if (user) {
            // If user is logged in, show their name and link to profile
            authBtn.innerHTML = `
                <a href="/pages/User-profile.html" title="View Profile" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 5px;">
                    <span style="font-weight: 600; font-size: 14px; color: #1f2937;">
                        <i class="fa-solid fa-circle-user" style="color: #22c55e;"></i> ${user.name.split(' ')[0]}
                    </span>
                </a>`;

            // Add "My Orders" link to the nav menu if it's not already there
            if (!document.querySelector('a[href="/pages/My-orders.html"]')) {
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) {
                    const ordersLink = document.createElement('li');
                    ordersLink.innerHTML = `<a href="/pages/My-orders.html">My Orders</a>`;
                    navLinks.appendChild(ordersLink);
                }
            }

            // Add "Farmer Dashboard" link ONLY if the logged-in user is a farmer
            if (user.role === 'farmer' && !document.querySelector('a[href="/Farmer-Page/Farmer-dashboard.html"]')) {
                const farmerLink = document.createElement('li');
                farmerLink.innerHTML = `<a href="/Farmer-Page/Farmer-dashboard.html">Farmer Dashboard</a>`;
                document.querySelector('.nav-links')?.appendChild(farmerLink);

                // Hide "Become a Seller" link for farmers
                const becomeSellerLink = document.getElementById('become-seller-link');
                if (becomeSellerLink) {
                    becomeSellerLink.style.display = 'none';
                }
            }

            // --- LOGOUT BUTTON ---
            // If logged in, create a logout button with an exit icon
            if (!navIcons.querySelector('.logout-btn')) {
                const logoutBtn = document.createElement('button');
                logoutBtn.className = 'icon-btn logout-btn';
                logoutBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
                logoutBtn.title = 'Logout';
                logoutBtn.onclick = logout;
                navIcons.appendChild(logoutBtn);
            }
        } else {
            // If NOT logged in, show a simple user icon that links to the login page
            authBtn.innerHTML = '<a href="/pages/login.html" title="Login"><i class="fa-solid fa-user"></i></a>';
        }

        // --- CART ICON & BADGE ---
        const cartBtn = navIcons.querySelector('.cart-btn a');
        if (cartBtn) {
            // Set the shopping cart icon
            cartBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i><span class="cart-badge">0</span>`;
            // Fetch the actual number of items in the cart
            updateCartBadge();
        }
    }
}

// --- CART BADGE COUNTER ---
// This function fetches the items in the cart and updates the count (1, 2, 3...) shown on the cart icon.
export async function updateCartBadge() {
    const user = getCurrentUser();
    if (!user) return; // If no user is logged in, no need to update

    try {
        // Get cart data from the server
        const cart = await apiRequest(`/cart/${user.id}`, 'GET');
        const badge = document.querySelector('.cart-badge');
        if (badge && cart && cart.items) {
            // Update the badge text with the number of items
            badge.innerText = cart.items.length;
            // Hide badge if cart is empty
            badge.style.display = cart.items.length > 0 ? 'block' : 'none';
        }
    } catch (err) {
        console.error("Badge update error:", err);
    }
}

// --- SEARCH GLOBAL LOGIC ---
function initGlobalSearch() {
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = input.value.trim();
                if (query) {
                    window.location.href = `/pages/Shop.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    });
}

// Start everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    initGlobalSearch();
});
