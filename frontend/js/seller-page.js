import { submitSellerApplication } from './seller.js';
import { getCurrentUser } from './auth.js';
import apiRequest from './api.js';
import { showToast } from './notifications.js';

// Check application status on load
async function checkStatus() {
  const user = getCurrentUser();
  if (!user) return;

  try {
    const farmer = await apiRequest(`/farmers/user/${user.id}`, 'GET');
    if (farmer) {
      // Hide form and indicators
      const mainForm = document.getElementById('main-form-container');
      const indicators = document.querySelector('.step-indicators');
      const statusContainer = document.getElementById('status-container');
      
      if(mainForm) mainForm.style.display = 'none';
      if(indicators) indicators.style.display = 'none';
      if(statusContainer) statusContainer.style.display = 'block';

      if (farmer.is_approved) {
        const approvedScreen = document.getElementById('approved-screen');
        if(approvedScreen) approvedScreen.style.display = 'block';
      } else {
        const pendingScreen = document.getElementById('pending-screen');
        if(pendingScreen) pendingScreen.style.display = 'block';
      }
    }
  } catch (err) {
    // If 404, it means they haven't applied yet, so we stay on the form
    console.log("No existing application found.");
  }
}

// Step navigation logic
window.nextStep = (stepNum) => {
  // Hide all forms
  document.querySelectorAll('.step-form').forEach(f => f.classList.remove('active'));
  // Show target form
  const targetForm = document.getElementById(`form-step-${stepNum}`);
  if(targetForm) targetForm.classList.add('active');

  // Update indicators
  document.querySelectorAll('.step-indicator').forEach((ind, index) => {
    if (index < stepNum) ind.classList.add('active');
    else ind.classList.remove('active');
  });
};

// Submission logic
window.handleSubmit = async () => {
  const user = getCurrentUser();
  if (!user) {
    showToast('Please login first to apply as a seller.', 'error');
    window.location.href = '/frontend/pages/login.html';
    return;
  }

  const checkbox = document.getElementById('agree-terms');
  if (!checkbox || !checkbox.checked) {
    showToast('Please agree to the terms.', 'error');
    return;
  }

  const applicationData = {
    name: document.getElementById('farm-name')?.value,
    location: document.getElementById('farm-location')?.value,
    phone: document.getElementById('farm-phone')?.value,
    aadhar_number: document.getElementById('aadhar-num')?.value,
    // Using the user-provided URL instead of a hardcoded static image
    farm_image_url: document.getElementById('farm-photo-url')?.value || 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
    user_id: user.id
  };

  if (!applicationData.name || !applicationData.phone) {
    showToast('Please fill at least the basic details in Step 1.', 'error');
    window.nextStep(1);
    return;
  }

  await submitSellerApplication(applicationData);
};

// Initial check
document.addEventListener('DOMContentLoaded', checkStatus);
