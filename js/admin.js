import apiRequest from './api.js';
import { showToast } from './notifications.js';

// --- INITIALIZATION ---
// This runs as soon as the HTML page is finished loading
document.addEventListener('DOMContentLoaded', () => {
    initTabs();              // 1. Setup the sidebar navigation (tabs)
    loadDashboardStats();    // 2. Fetch and show total counts (Users, Farmers, Messages)
    loadApprovals();         // 3. Load farmers waiting for approval
    loadFarmers();           // 4. Load the full list of verified farmers
    loadUsers();             // 5. Load the full list of platform users
    loadMessages();          // 6. Load customer inquiry messages
});

// --- TAB NAVIGATION LOGIC ---
// This function handles switching between "Dashboard", "Approvals", "Users", etc.
function initTabs() {
    const navItems = document.querySelectorAll('.nav-item'); // All sidebar links
    const tabPanes = document.querySelectorAll('.tab-pane'); // All content sections
    const tabTitle = document.getElementById('tab-title');   // The main heading in top-bar

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // Stop page from jumping
            const tabId = item.getAttribute('data-tab'); // Get 'dashboard', 'approvals', etc.

            // 1. Remove 'active' class from all links and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // 2. Add 'active' class ONLY to the clicked link and target section
            item.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');

            // 3. Update the Page Title at the top
            tabTitle.innerText = item.querySelector('span').innerText;
        });
    });
}

// --- STATS LOADING ---
// Fetches data from the backend to fill the dashboard cards
async function loadDashboardStats() {
    try {
        // Fetch everything from backend simultaneously
        const users = await apiRequest('/users/', 'GET');
        const farmers = await apiRequest('/farmers/', 'GET');
        const messages = await apiRequest('/contact-messages/', 'GET');

        // Logic to filter out farmers who are NOT yet approved
        const pending = farmers.filter(f => !f.is_approved).length;

        // Display results in the UI cards
        document.getElementById('total-users').innerText = users.length;
        document.getElementById('total-farmers').innerText = farmers.filter(f => f.is_approved).length;
        document.getElementById('pending-approvals').innerText = pending;

        // --- SIDEBAR BADGES (Notification Numbers) ---
        // Approval Badge (Pending Requests)
        const badge = document.querySelector('.pending-count');
        badge.innerText = pending;
        badge.style.display = pending > 0 ? 'block' : 'none'; // Only show if number > 0

        // Message Badge (Total Inquiries)
        const msgBadge = document.querySelector('.msg-count');
        msgBadge.innerText = messages.length;
        msgBadge.style.display = messages.length > 0 ? 'block' : 'none';

    } catch (err) {
        console.error("Stats load error:", err);
    }
}

// --- LOAD SELLER REQUESTS ---
// Populates the "Pending Approvals" table
export async function loadApprovals() {
    const tbody = document.querySelector('#approvals-table tbody');
    tbody.innerHTML = '<tr><td colspan="5">Checking for requests...</td></tr>';

    try {
        const farmers = await apiRequest('/farmers/', 'GET');
        // We only want farmers where is_approved is false
        const pending = farmers.filter(f => !f.is_approved);

        tbody.innerHTML = '';
        if (pending.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No pending requests found. ✅</td></tr>';
            return;
        }

        // Loop through each request and create a table row with Farm Photo
        pending.forEach(farmer => {
            const tr = document.createElement('tr');
            // User upload panna photo-va admin-ku kaatuvom
            const photoHtml = farmer.farm_image_url
                ? `<img src="${farmer.farm_image_url}" style="width:50px; height:40px; border-radius:4px; object-fit:cover; cursor:pointer;" onclick="window.open('${farmer.farm_image_url}')" title="Click to view full image">`
                : '<span style="color:#ccc;">No Photo</span>';

            tr.innerHTML = `
                <td>${photoHtml}</td>
                <td style="font-weight:700;">${farmer.name}</td>
                <td>${farmer.location}</td>
                <td>${farmer.phone}</td>
                <td><code style="background:#eee;padding:2px 6px;border-radius:4px;">${farmer.aadhar_number || 'N/A'}</code></td>
                <td>
                    <button class="btn-approve" onclick="approveFarmer(${farmer.id})">
                        <i class="fa-solid fa-check"></i> Approve
                    </button>
                    <!-- Reject Button: Farmer request-ai delete panniduvom -->
                    <button class="btn-reject" onclick="rejectFarmer(${farmer.id})">
                        <i class="fa-solid fa-xmark"></i> Reject
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" style="color:red;">API Error: Failed to load requests.</td></tr>';
    }
}

// --- LOAD VERIFIED FARMERS ---
async function loadFarmers() {
    const tbody = document.querySelector('#farmers-table tbody');
    try {
        const farmers = await apiRequest('/farmers/', 'GET');
        tbody.innerHTML = '';
        farmers.forEach(farmer => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:700;">${farmer.name}</td>
                <td>${farmer.location}</td>
                <td>${farmer.phone}</td>
                <td>
                    <span class="status-badge ${farmer.is_approved ? 'status-active' : 'status-pending'}">
                        ${farmer.is_approved ? 'Approved' : 'Pending'}
                    </span>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) { }
}

// --- LOAD ALL USERS ---
async function loadUsers() {
    const tbody = document.querySelector('#users-table tbody');
    try {
        const users = await apiRequest('/users/', 'GET');
        tbody.innerHTML = '';
        users.forEach(user => {
            const date = new Date(user.created_at).toLocaleDateString();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:700;">${user.name}</td>
                <td>${user.email}</td>
                <td><span style="text-transform:capitalize; color:${user.role === 'admin' ? '#ef4444' : '#1f2937'}">${user.role}</span></td>
                <td>${date}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) { }
}

// --- APPROVE FARMER ACTION ---
// This runs when Admin clicks the "Approve" button
window.approveFarmer = async (farmerId) => {
    if (!confirm("Confirm approval for this farmer? They will gain selling access.")) return;

    try {
        // Send a PATCH request to the backend to update the status
        await apiRequest(`/farmers/${farmerId}/approve`, 'PATCH');
        showToast("Success! Farmer is now verified. 🌾", 'success');

        // Refresh all data on the dashboard automatically
        loadApprovals();
        loadDashboardStats();
        loadFarmers();
        loadUsers(); // Refresh users list because their role changed too
    } catch (err) {
        showToast("Approval failed: " + err.message, 'error');
    }
};

// --- REJECT FARMER ACTION ---
// This runs when Admin clicks the "Reject" button. Request-ai permanent-ah delete pannidum.
window.rejectFarmer = async (farmerId) => {
    if (!confirm("Are you sure you want to REJECT and DELETE this application? This cannot be undone.")) return;

    try {
        // Backend-la farmer record-ai delete panna DELETE request anupuvom
        await apiRequest(`/farmers/${farmerId}`, 'DELETE');
        showToast("Application Rejected & Deleted ❌", 'error');

        // Refresh all data
        loadApprovals();
        loadDashboardStats();
    } catch (err) {
        showToast("Rejection failed: " + err.message, 'error');
    }
};

// --- LOAD CUSTOMER MESSAGES ---
// Populates the "Inquiries" table with data from Contact form
async function loadMessages() {
    const tbody = document.querySelector('#messages-table tbody');
    try {
        const messages = await apiRequest('/contact-messages/', 'GET');
        tbody.innerHTML = '';
        if (messages.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No customer inquiries yet.</td></tr>';
            return;
        }

        messages.forEach(msg => {
            const date = new Date(msg.created_at).toLocaleDateString();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:700;">${msg.name}</td>
                <td><a href="mailto:${msg.email}" style="color:#22c55e;text-decoration:none;">${msg.email}</a></td>
                <td><span class="status-badge" style="background:#f3f4f6;color:#4b5563;">${msg.category || 'General'}</span></td>
                <td style="font-weight:600;">${msg.subject || 'No Subject'}</td>
                <!-- Message truncation-a remove panniten so full message-um admin-ku theriyum -->
                <td style="max-width:300px; line-height:1.4; color:#374151;">${msg.message}</td>
                <td style="color:#6b7280; font-size:13px;">${date}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Messages load error:", err);
    }
}
