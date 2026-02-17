import apiRequest from './api.js';
import { showToast } from './notifications.js';

// Registration (Sign Up)
export async function register(userData) {
    try {
        const response = await apiRequest('/users/', 'POST', userData);
        showToast('Registration successful! Redirecting to login... ✨', 'success');

        // Wait for 2 seconds so user can see the toast
        setTimeout(() => {
            window.location.href = '/pages/login.html';
        }, 2000);

        return response;
    } catch (error) {
        showToast('Registration failed: ' + error.message, 'error');
    }
}

// Login
export async function login(credentials) {
    try {
        const user = await apiRequest('/users/login', 'POST', credentials);

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            showToast(`Welcome back, ${user.name.split(' ')[0]}! Logging you in... 🚀`, 'success');

            // Wait for 2 seconds so user can see the toast
            setTimeout(() => {
                // Role-based redirection
                if (user.role === 'admin' || user.role === 'Admin') {
                    window.location.href = '/pages/Admin.html';
                } else if (user.role === 'farmer' || user.role === 'Farmer') {
                    window.location.href = '/Farmer-Page/Farmer-dashboard.html';
                } else {
                    window.location.href = '/index.html';
                }
            }, 2000);

            return user;
        }
    } catch (error) {
        showToast('Login failed: ' + error.message, 'error');
    }
}

// Logout
export function logout() {
    localStorage.removeItem('user');
    window.location.href = '/pages/login.html';
}

// Check Auth State
export function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}
