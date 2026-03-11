import apiRequest from './api.js';
import { getCurrentUser } from './auth.js';

async function loadOrders() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/frontend/pages/login.html';
        return;
    }

    try {
        const orders = await apiRequest(`/orders/user/${user.id}`, 'GET');
        renderOrders(orders);
    } catch (err) {
        console.error(err);
        const container = document.getElementById('orders-container');
        if(container) container.innerHTML = '<p>Failed to load orders.</p>';
    }
}

function renderOrders(orders) {
    const container = document.getElementById('orders-container');
    if(!container) return;

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <img src="https://cdn-icons-png.flaticon.com/128/10433/10433100.png" alt="No Orders">
                <h2 style="color: #6b7280;">No orders found</h2>
                <p style="margin-top: 10px; color: #9ca3af;">Start shopping to see your orders here!</p>
                <a href="/frontend/pages/Shop.html" class="btn btn-one" style="display: inline-block; margin-top: 20px; text-decoration: none;">Go to Shop</a>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.reverse().map(order => {
        const date = new Date(order.order_date).toLocaleDateString();
        const total = parseFloat(order.total_amount).toFixed(2);
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <span class="order-id">Order #${order.id}</span>
                        <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">
                            ${date}
                        </div>
                    </div>
                    <span class="order-status status-${(order.status || 'pending').toLowerCase()}">${order.status || 'pending'}</span>
                </div>
                
                <div class="items-list">
                    <h4 style="font-size: 13px; color: #9ca3af; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Products</h4>
                    ${order.items.map(item => `
                        <div class="item-row">
                            <div class="item-info">
                                <span class="item-name">${item.product_name || 'Product'}</span>
                                <span class="item-qty">x${item.quantity}</span>
                                <span class="status-tag status-${(item.status || 'pending').toLowerCase()}" style="margin-left: 8px;">${item.status || 'pending'}</span>
                            </div>
                            <span class="item-price">₹${parseFloat(item.price).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="order-details" style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #f0f0f0;">
                    <div class="address-box">
                        <h4>Delivery Address</h4>
                        <p>${order.delivery_address || 'N/A'}</p>
                    </div>
                    <div class="price-box">
                        <span class="total-label">Total Amount</span>
                        <span class="total-amount">₹${total}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Initial load
document.addEventListener('DOMContentLoaded', loadOrders);
