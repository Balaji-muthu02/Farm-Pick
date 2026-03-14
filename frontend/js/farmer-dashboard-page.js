import apiRequest from "./api.js";
import { getCurrentUser, logout } from "./auth.js";
import { showToast } from "./notifications.js";

window.logout = logout;
window.toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    if(sidebar) sidebar.classList.toggle('active');
};

async function loadDashboard() {
    const user = getCurrentUser();
    if (!user || user.role !== 'farmer' || !user.farmer_id) {
        showToast('Access denied. Only approved farmers can access this page.', 'error');
        window.location.href = '/frontend/pages/login.html';
        return;
    }

    // Update profile name
    const profileNameEl = document.querySelector('.profile-name');
    if(profileNameEl) profileNameEl.innerText = user.name;

    const farmerId = user.farmer_id;
    try {
        // 1. Load Stats
        const products = await apiRequest(`/products/farmer/${farmerId}`, 'GET');
        const statProductsEl = document.getElementById('stat-products');
        if(statProductsEl) statProductsEl.innerText = products.length;

        const orders = await apiRequest(`/orders/farmer/${farmerId}`, 'GET');
        const statOrdersEl = document.getElementById('stat-orders');
        if(statOrdersEl) statOrdersEl.innerText = orders.length;

        // Calculate pending orders
        const pendingOrders = orders.filter(o => {
            // Check status of individual items or the order as a whole
            return (o.items && o.items.some(i => i.status === 'pending')) || o.status === 'pending';
        });
        
        const statPendingEl = document.getElementById('stat-pending');
        if(statPendingEl) statPendingEl.innerText = pendingOrders.length;

        // Update Alert if there are pending orders
        const alertCount = document.getElementById('alert-pending-count');
        const alertText = document.getElementById('alert-pending-text');
        if (alertCount && alertText) {
            alertCount.innerText = pendingOrders.length;
            alertText.innerText = pendingOrders.length;

            // Hide alert if no pending orders
            const alertBox = document.getElementById('pending-orders-alert');
            if (pendingOrders.length === 0 && alertBox) {
                alertBox.style.display = 'none';
            } else if (alertBox) {
                alertBox.style.display = 'block';
            }
        }

        const earnings = orders.reduce((sum, o) => sum + parseFloat(o.farmer_total || 0), 0);
        const statEarningsEl = document.getElementById('stat-earnings');
        if(statEarningsEl) statEarningsEl.innerText = `₹${earnings.toFixed(2)}`;

        // Optional: Update % change based on this month (just for visual logic)
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const monthEarnings = orders.filter(o => new Date(o.order_date || Date.now()) >= startOfMonth)
            .reduce((sum, o) => sum + parseFloat(o.farmer_total || 0), 0);
        const percentage = earnings > 0 ? ((monthEarnings / earnings) * 100).toFixed(0) : 0;
        const trendEl = document.querySelector('#stat-earnings + .stat-change');
        if(trendEl) trendEl.innerText = `↑ ${percentage}% this month`;

        // 2. Load Recent Orders
        const ordersList = document.querySelector('.orders-list');
        const recentOrders = orders.slice(0, 5);

        if (ordersList) {
            if (recentOrders.length === 0) {
                ordersList.innerHTML = '<p style="padding: 20px;">No orders yet.</p>';
            } else {
                ordersList.innerHTML = recentOrders.map(o => {
                    const displayStatus = (o.items && o.items.length > 0) ? o.items[0].status : o.status;
                    return `
                    <div class="order-item">
                        <div class="order-header">
                            <span class="order-id">#ORD-${o.id}</span>
                            <span class="order-amount">₹${o.farmer_total}</span>
                        </div>
                        <div class="order-customer">User ID: ${o.user_id}</div>
                         <span class="order-status status-${displayStatus}">${displayStatus}</span>
                    </div>
                `}).join('');
            }
        }

    } catch (err) {
        console.error("Dashboard error:", err);
    }
}

document.addEventListener('DOMContentLoaded', loadDashboard);
