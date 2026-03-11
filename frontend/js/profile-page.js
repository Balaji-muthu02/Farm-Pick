import { getCurrentUser, logout } from './auth.js';
import apiRequest from './api.js';
import { showToast } from './notifications.js';

let isEditMode = false;

async function initProfile() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/frontend/pages/login.html';
        return;
    }

    // Update UI with basic user info
    const userNameEl = document.getElementById('user-name');
    const displayNameEl = document.getElementById('display-name');
    const userEmailHeaderEl = document.getElementById('user-email-header');
    const displayEmailEl = document.getElementById('display-email');
    const userRoleBadgeEl = document.getElementById('user-role-badge');
    const displayRoleEl = document.getElementById('display-role');
    const userAvatarEl = document.getElementById('user-avatar');
    const editNameEl = document.getElementById('edit-name');
    const editEmailEl = document.getElementById('edit-email');

    if(userNameEl) userNameEl.innerText = user.name;
    if(displayNameEl) displayNameEl.innerText = user.name;
    if(userEmailHeaderEl) userEmailHeaderEl.innerText = user.email;
    if(displayEmailEl) displayEmailEl.innerText = user.email;
    if(userRoleBadgeEl) userRoleBadgeEl.innerText = user.role;
    if(displayRoleEl) displayRoleEl.innerText = user.role;
    if(userAvatarEl) userAvatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=22c55e&color=fff&size=200&bold=true`;

    // Prepare edit fields
    if(editNameEl) editNameEl.value = user.name;
    if(editEmailEl) editEmailEl.value = user.email;

    try {
        // Fetch dynamic stats
        const cart = await apiRequest(`/cart/${user.id}`, 'GET');
        if (cart && cart.items) {
            const cartCountEl = document.getElementById('cart-count');
            if(cartCountEl) cartCountEl.innerText = cart.items.length;
        }

        const orders = await apiRequest(`/orders/user/${user.id}`, 'GET');
        if (orders) {
            const orderCountEl = document.getElementById('order-count');
            if(orderCountEl) orderCountEl.innerText = Array.isArray(orders) ? orders.length : 0;
        }
    } catch (err) {
        console.error("Failed to load profile stats:", err);
    }
}

window.toggleEditMode = () => {
    isEditMode = !isEditMode;
    const viewMode = document.getElementById('view-mode');
    const editMode = document.getElementById('edit-mode');
    const profileActions = document.getElementById('profile-actions');
    const editActions = document.getElementById('edit-actions');

    if(viewMode) viewMode.style.display = isEditMode ? 'none' : 'flex';
    if(editMode) editMode.style.display = isEditMode ? 'flex' : 'none';
    if(profileActions) profileActions.style.display = isEditMode ? 'none' : 'flex';
    if(editActions) editActions.style.display = isEditMode ? 'flex' : 'none';
}

window.saveProfile = async () => {
    const user = getCurrentUser();
    const newName = document.getElementById('edit-name').value.trim();
    const newEmail = document.getElementById('edit-email').value.trim();

    if (!newName || !newEmail) {
        showToast('Name and Email cannot be empty!', 'error');
        return;
    }

    try {
        const updatedUser = await apiRequest(`/users/${user.id}`, 'PUT', {
            name: newName,
            email: newEmail
        });

        if (updatedUser) {
            // Update local storage
            const fullUserData = { ...user, name: updatedUser.name, email: updatedUser.email };
            localStorage.setItem('user', JSON.stringify(fullUserData));

            showToast('Profile updated successfully! ✨', 'success');

            // Refresh UI
            initProfile();
            window.toggleEditMode();

            // Sync with other parts of the app (like Navbar)
            if (window.updateNavbar) window.updateNavbar();
        }
    } catch (err) {
        showToast('Failed to update profile: ' + err.message, 'error');
    }
}

window.handleLogout = () => {
    logout();
}

// Initial load
document.addEventListener('DOMContentLoaded', initProfile);
