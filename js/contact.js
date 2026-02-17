import apiRequest from './api.js';
import { getCurrentUser } from './auth.js';
import { showToast } from './notifications.js';

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form-action');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Button Loading State
        const submitBtn = document.getElementById('contact-submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const user = getCurrentUser();

        const messageData = {
            user_id: user ? user.id : null,
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            category: document.getElementById('contact-category').value,
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value
        };

        try {
            await apiRequest('/contact-messages/', 'POST', messageData);

            // Show Success Success
            showToast("✅ Mass News! Your message has been sent successfully. Our team will get back to you within 24 hours.", 'success');
            contactForm.reset();
        } catch (err) {
            showToast("❌ Oops! Something went wrong. Please try again later.", 'error');
            console.error(err);
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
});
