import apiRequest from './api.js';
import { getCurrentUser } from './auth.js';
import { showToast } from './notifications.js';

const urlParams = new URLSearchParams(window.location.search);
const singleProductId = urlParams.get('id');
let orderTotal = 0;
let checkoutItems = [];

async function initCheckout() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/frontend/pages/login.html';
        return;
    }

    try {
        if (singleProductId) {
            const product = await apiRequest(`/products/${singleProductId}`, 'GET');
            checkoutItems = [{ ...product, quantity: 1 }];
        } else {
            const cart = await apiRequest(`/cart/${user.id}`, 'GET');
            checkoutItems = cart.items || [];
        }
        renderItems();
    } catch (err) {
        console.error("Initialization error:", err);
        showToast("Failed to load checkout details", "error");
    }
}

window.updateQuantity = (index, delta) => {
    checkoutItems[index].quantity = Math.max(1, (checkoutItems[index].quantity || 1) + delta);
    renderItems();
};

function renderItems() {
    const container = document.getElementById('summary-items');
    if(!container) return;
    
    orderTotal = 0;
    if (checkoutItems.length === 0) {
        container.innerHTML = '<p>No items selected.</p>';
        document.getElementById('final-total').innerText = '₹0.00';
        return;
    }
    
    container.innerHTML = checkoutItems.map((item, index) => {
        const itemTotal = (item.price * (item.quantity || 1));
        orderTotal += itemTotal;
        return `
            <div class="order-item-mini">
                <img src="${item.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}" alt="img">
                <div class="mini-details">
                    <h4>${item.product_name || item.name || 'Organic Product'}</h4>
                    <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0;">
                        <button onclick="updateQuantity(${index}, -1)" style="width: 25px; height: 25px; border-radius: 50%; border: 1px solid #ddd; background: white; cursor: pointer;">-</button>
                        <span style="font-weight: 700;">${item.quantity || 1}</span>
                        <button onclick="updateQuantity(${index}, 1)" style="width: 25px; height: 25px; border-radius: 50%; border: 1px solid #ddd; background: white; cursor: pointer;">+</button>
                    </div>
                    <p style="font-weight: 700; color: #22c55e;">₹${itemTotal.toFixed(2)}</p>
                </div>
            </div>
        `;
    }).join('');
    document.getElementById('final-total').innerText = `₹${orderTotal.toFixed(2)}`;
}

window.submitOrder = async () => {
    const user = getCurrentUser();
    const form = {
        name: document.getElementById('full-name').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        pincode: document.getElementById('pincode').value
    };

    if (!form.name || !form.phone || !form.address) {
        showToast('Please fill in all delivery details', 'error');
        return;
    }

    try {
        // If it's a single product, we use the adjusted quantity
        if (singleProductId) {
            await apiRequest('/cart/add', 'POST', {
                user_id: user.id,
                product_id: singleProductId,
                quantity: checkoutItems[0].quantity
            });
        }

        await apiRequest('/orders/checkout', 'POST', {
            user_id: user.id,
            delivery_address: `${form.address}, ${form.city} - ${form.pincode}. Phone: ${form.phone}`
        });

        showToast('Congratulations! Your Order has been placed successfully! 🎉', 'success');

        // Wait for the user to see the notification before redirecting
        setTimeout(() => {
            window.location.href = '/frontend/index.html';
        }, 3000);
    } catch (err) {
        // If backend fails, we show error message  
        showToast('❌ Order Failed! Please try again.', 'error');
        setTimeout(() => {
            window.location.href = '/frontend/index.html';
        }, 3000);
    }
};

// Start initialization
document.addEventListener('DOMContentLoaded', initCheckout);
