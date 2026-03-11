import apiRequest from "./api.js";
import { getCurrentUser, logout } from "./auth.js";
import { showToast } from "./notifications.js";

window.logout = logout;
window.toggleSidebar = () => {
  const sidebar = document.getElementById("sidebar");
  if(sidebar) sidebar.classList.toggle("active");
};

async function loadOrders() {
  const user = getCurrentUser();
  const userRole = (user && user.role) ? user.role.toLowerCase() : '';
  if (!user || userRole !== 'farmer') {
    window.location.href = '/frontend/pages/login.html';
    return;
  }

  try {
    const orders = await apiRequest(`/orders/farmer/${user.farmer_id}`, 'GET');
    const grid = document.getElementById('orders-grid');
    if(!grid) return;

    if (orders.length === 0) {
      grid.innerHTML = '<p>No orders received yet.</p>';
      return;
    }

    grid.innerHTML = orders.map(order => {
      const itemStatus = order.items && order.items.length > 0 ? order.items[0].status : order.status;

      return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">#ORD-${order.id}</div>
                        <div class="order-date">${new Date(order.order_date || Date.now()).toLocaleString()}</div>
                    </div>
                    <span class="status-badge status-${itemStatus}">${itemStatus}</span>
                </div>

                <div class="order-details">
                    <div class="detail-row">
                        <span class="detail-icon"><i class="fa-solid fa-user"></i></span>
                        <span><strong>${order.customer_name}</strong></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-icon"><i class="fa-solid fa-envelope"></i></span>
                        <span>${order.customer_email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-icon"><i class="fa-solid fa-location-dot"></i></span>
                        <span>${order.delivery_address || 'Home Delivery'}</span>
                    </div>
                </div>

                <div class="products-section">
                    <h4 style="margin: 10px 0; font-size: 14px; color: #666;">Products Ordered:</h4>
                    ${order.items && order.items.length > 0 ? order.items.map(item => `
                        <div class="product-item" style="background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-weight: 600; color: #2d3748;">${item.product_name}</div>
                                <div style="font-size: 13px; color: #718096;">Qty: ${item.quantity} × ₹${item.price} | <span style="color: #4a5568;">Status: ${item.status}</span></div>
                            </div>
                            <div style="font-weight: 700; color: #38a169;">₹${item.subtotal}</div>
                        </div>
                    `).join('') : '<p style="color: #999;">No product details available</p>'}
                </div>

                <div class="order-total">Your Earnings: ₹${order.farmer_total.toFixed(2)}</div>

                <div class="status-update">
                    <label class="status-update-label">Update Status for Your Products</label>
                    <select class="status-select" id="status-${order.id}">
                        <option value="pending" ${itemStatus === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="shipped" ${itemStatus === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${itemStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${itemStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                    <button class="update-btn" onclick="updateStatus(${order.id})">Update Status</button>
                </div>
            </div>
        `}).join('');

  } catch (err) {
    console.error(err);
  }
}

window.updateStatus = async (orderId) => {
  const user = getCurrentUser();
  const statusEl = document.getElementById(`status-${orderId}`);
  if(!statusEl) return;
  
  const newStatus = statusEl.value;
  try {
    await apiRequest(`/orders/farmer/${user.farmer_id}/order/${orderId}/status`, 'PATCH', { status: newStatus });
    showToast('Product status updated!', 'success');
    loadOrders(); // Refresh
  } catch (err) {
    showToast('Failed to update status', 'error');
  }
};

document.addEventListener('DOMContentLoaded', loadOrders);
