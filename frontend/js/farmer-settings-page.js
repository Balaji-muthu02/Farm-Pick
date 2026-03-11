import apiRequest from "./api.js";
import { getCurrentUser, logout } from "./auth.js";
import { showToast } from "./notifications.js";

// Global Logout function sidebar-kku
window.logout = logout;

let currentFarmerId = null;

// Current Farmer data load panra function
async function loadFarmerProfile() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/frontend/pages/login.html';
        return;
    }

    // User Info (Name, Email) - LocalStorage-la irundhu current-ah fill panroam
    const fName = document.getElementById('farmer-name');
    const fEmail = document.getElementById('farmer-email');
    if(fName) fName.value = user.name || '';
    if(fEmail) fEmail.value = user.email || '';

    try {
        // Farmer specifics - Backend API-la irundhu fetch panroam
        const farmerData = await apiRequest(`/farmers/user/${user.id}`, 'GET');
        if (farmerData) {
            currentFarmerId = farmerData.id;
            // Farm details fill panroam
            const farmName = document.getElementById('farm-name');
            const farmLoc = document.getElementById('farm-location');
            const farmPhone = document.getElementById('farm-phone');
            if(farmName) farmName.value = farmerData.name || '';
            if(farmLoc) farmLoc.value = farmerData.location || '';
            if(farmPhone) farmPhone.value = farmerData.phone || '';
        }
    } catch (err) {
        console.log("No extra farmer details found or failed to fetch.");
    }
}

// Sidebar responsive-kaga toggle function
window.toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    if(sidebar) sidebar.classList.toggle('active');
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settings-form');
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = getCurrentUser();
            const saveBtn = document.getElementById('save-btn');

            // Button-ai disable panni loading indicator mathiri vaippoam
            if(saveBtn) {
                saveBtn.disabled = true;
                saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
            }

            const name = document.getElementById('farmer-name')?.value.trim();
            const email = document.getElementById('farmer-email')?.value.trim();
            const farmName = document.getElementById('farm-name')?.value.trim();
            const farmLocation = document.getElementById('farm-location')?.value.trim();
            const farmPhone = document.getElementById('farm-phone')?.value.trim();

            try {
                // 1. User table-la Name & Email update panroam
                await apiRequest(`/users/${user.id}`, 'PUT', { name, email });

                // 2. Farmer table-la Farm details update panroam (if farmer data exists)
                if (currentFarmerId) {
                    await apiRequest(`/farmers/${currentFarmerId}`, 'PUT', {
                        name: farmName,
                        location: farmLocation,
                        phone: farmPhone
                    });
                }

                // 3. LocalStorage-laiyum sync panna profile refresh aagumna update aagum
                const updatedUser = { ...user, name, email };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                showToast('Profile updated successfully! ☀️', 'success');
            } catch (err) {
                console.error("Update failed:", err);
                showToast('Error saving settings. Please try again.', 'error');
            } finally {
                // Button reset panroam
                if(saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save All Changes';
                }
            }
        });
    }

    // Initial loading
    loadFarmerProfile();
});
