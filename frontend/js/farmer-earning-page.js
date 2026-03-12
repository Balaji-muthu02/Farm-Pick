import apiRequest from "./api.js";
import { getCurrentUser, logout } from "./auth.js";

window.logout = logout;
window.toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    if(sidebar) sidebar.classList.toggle("active");
};

async function loadEarnings() {
  const user = getCurrentUser();
  if (!user || user.role !== 'farmer') {
    window.location.href = '/frontend/pages/login.html';
    return;
  }

  try {
    const orders = await apiRequest(`/orders/farmer/${user.farmer_id}`, 'GET');

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Start of current week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Start of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let todayEarnings = 0;
    let weekEarnings = 0;
    let monthEarnings = 0;
    let totalEarnings = 0;

    orders.forEach(o => {
      const amount = parseFloat(o.farmer_total || 0);
      const orderDate = new Date(o.order_date || Date.now());

      // For Total
      totalEarnings += amount;

      // For Today
      if (orderDate.toISOString().split('T')[0] === todayStr) {
        todayEarnings += amount;
      }

      // For This Week
      if (orderDate >= startOfWeek) {
        weekEarnings += amount;
      }

      // For This Month
      if (orderDate >= startOfMonth) {
        monthEarnings += amount;
      }
    });

    // Update UI
    const totalEl = document.getElementById('total-earnings');
    const todayEl = document.getElementById('today-earnings');
    const weekEl = document.getElementById('week-earnings');
    const monthEl = document.getElementById('month-earnings');
    const walletEl = document.getElementById('wallet-balance');
    const orderCountEl = document.getElementById('total-orders-count');
    const avgEl = document.getElementById('avg-order-value');

    if(totalEl) totalEl.innerText = `₹${totalEarnings.toFixed(2)}`;
    if(todayEl) todayEl.innerText = `₹${todayEarnings.toFixed(2)}`;
    if(weekEl) weekEl.innerText = `₹${weekEarnings.toFixed(2)}`;
    if(monthEl) monthEl.innerText = `₹${monthEarnings.toFixed(2)}`;

    // Wallet (Total - 10% commission)
    const wallet = totalEarnings * 0.9;
    if(walletEl) walletEl.innerText = `₹${wallet.toFixed(2)}`;

    const orderCount = orders.length;
    if(orderCountEl) orderCountEl.innerHTML = `${orderCount} <span class="trend-icon"><i class="fa-solid fa-arrow-trend-up"></i></span>`;

    const avg = orderCount > 0 ? (totalEarnings / orderCount) : 0;
    if(avgEl) avgEl.innerHTML = `₹${avg.toFixed(0)} <span class="trend-icon"><i class="fa-solid fa-arrow-trend-up"></i></span>`;

  } catch (err) {
    console.error("Error loading earnings:", err);
  }
}

document.addEventListener('DOMContentLoaded', loadEarnings);
