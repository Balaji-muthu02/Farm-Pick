import apiRequest from './api.js';
import { getCurrentUser } from './auth.js';
import { showToast } from './notifications.js';

export async function submitSellerApplication(applicationData) {
    try {
        const response = await apiRequest('/farmers/', 'POST', applicationData);
        showToast('Application submitted successfully! ✅\n\nPlease wait for Admin approval. You will be notified soon.', 'success');

        // Wait for 3 seconds so user can read the message
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 3000);

        return response;
    } catch (error) {
        showToast('Failed to submit application: ' + error.message, 'error');
    }
}
