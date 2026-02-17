import apiRequest from './api.js';
import { showToast } from './notifications.js';

export async function fetchCart(userId) {
    try {
        const cart = await apiRequest(`/cart/${userId}`, 'GET');
        return cart;
    } catch (error) {
        console.error('Error fetching cart:', error);
        return { items: [] };
    }
}

export function renderCart(cart, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!cart || !cart.items || cart.items.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <img src="https://cdn-icons-png.flaticon.com/128/8170/8170675.png" alt="Empty">
                <h2 style="color: #6b7280;">Your cart is empty</h2>
                <p style="margin-bottom: 30px; color: #9ca3af;">Looks like you haven't added anything yet.</p>
                <a href="/pages/Shop.html" class="checkout-btn" style="text-decoration: none;">Shop Now</a>
            </div>
        `;
        return;
    }

    let total = 0;
    const itemsHtml = cart.items.map(item => {
        total += (item.price * item.quantity);
        const productImage = item.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';
        return `
            <div class="cart-item">
                <img src="${productImage}" alt="${item.product_name || 'Product'}" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'">
                <div class="item-info">
                    <h3 class="item-name">${item.product_name || 'Organic Product'}</h3>
                    <p class="item-price">₹${item.price} per unit</p>
                    <div class="item-qty">
                        <span>Quantity: <b>${item.quantity}</b></span>
                    </div>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: 800; font-size: 18px;">₹${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <h1 class="cart-title">Your Cart</h1>
        <div class="items-list">
            ${itemsHtml}
        </div>
        <div class="cart-summary">
            <h2 class="total-price">Total: ₹${total.toFixed(2)}</h2>
            <button class="checkout-btn" onclick="goToCheckout()">Proceed to Checkout</button>
        </div>
    `;
}

window.removeFromCart = async (itemId) => {
    try {
        await apiRequest(`/cart/remove/${itemId}`, 'DELETE');
        const user = JSON.parse(localStorage.getItem('user'));
        const cart = await fetchCart(user.id);
        renderCart(cart, 'cart-content');
    } catch (error) {
        showToast('Failed to remove item', 'error');
    }
};

window.goToCheckout = () => {
    window.location.href = '/pages/Checkout.html';
};
