import apiRequest from './api.js';
import { getCurrentUser, logout } from './auth.js';
import { showToast } from './notifications.js';

window.logout = logout;
window.toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    if(sidebar) sidebar.classList.toggle('active');
};

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
const formTitle = document.querySelector('.top-header h1');
const formSubtitle = document.querySelector('.top-header p');
const submitBtn = document.querySelector('button[type="submit"]');

if (productId) {
    if(formTitle) formTitle.innerText = 'Edit Product';
    if(formSubtitle) formSubtitle.innerText = 'Update your product details';
    if(submitBtn) submitBtn.innerText = 'Update Product';
}

async function loadCategories(selectedId) {
    try {
        const categories = await apiRequest('/categories/', 'GET');
        const select = document.getElementById('p-category');
        if(!select) return;
        
        select.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = cat.name;
            if (selectedId && cat.id == selectedId) opt.selected = true;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error("Failed to load categories:", err);
    }
}

async function loadProductDetails() {
    if (!productId) {
        loadCategories();
        return;
    }

    try {
        const product = await apiRequest(`/products/${productId}`, 'GET');

        // Populate fields
        const pName = document.getElementById('p-name');
        const pDesc = document.getElementById('p-desc');
        const pPrice = document.getElementById('p-price');
        const pQty = document.getElementById('p-qty');
        const pImage = document.getElementById('p-image');

        if(pName) pName.value = product.name;
        if(pDesc) pDesc.value = product.description || '';
        if(pPrice) pPrice.value = product.price;
        if(pQty) pQty.value = product.quantity;
        if(pImage) {
            pImage.value = product.image_url || '';
            updatePreview(product.image_url);
        }

        // Load categories and select the current one
        loadCategories(product.category_id);

    } catch (error) {
        console.error('Error loading product:', error);
        showToast('Failed to load product details.', 'error');
    }
}



// --- IMAGE PREVIEW LOGIC ---
function updatePreview(url) {
    const previewContainer = document.getElementById('image-preview-container');
    const previewImg = document.getElementById('image-preview');
    if(!previewContainer || !previewImg) return;

    if (url && url.startsWith('http')) {
        previewImg.src = url;
        previewContainer.style.display = 'block';
    } else {
        previewContainer.style.display = 'none';
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('p-image');
    if(imageInput) {
        imageInput.addEventListener('input', (e) => updatePreview(e.target.value));
    }

    const form = document.querySelector('form');
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // --- PREVENT DOUBLE CLICKS ---
            if(!submitBtn) return;
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = '🔄 Saving...';

            const user = getCurrentUser();
            if (!user || user.role !== 'farmer') {
                showToast('Only farmers can perform this action', 'error');
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
                return;
            }

            const productData = {
                farmer_id: user.farmer_id,
                category_id: parseInt(document.getElementById('p-category').value),
                name: document.getElementById('p-name').value,
                price: parseFloat(document.getElementById('p-price').value),
                quantity: parseInt(document.getElementById('p-qty').value),
                description: document.getElementById('p-desc').value,
                image_url: document.getElementById('p-image').value || null,
                is_active: true
            };

            try {
                if (productId) {
                    await apiRequest(`/products/${productId}`, 'PUT', productData);
                    showToast('Product updated successfully! ✨', 'success');
                } else {
                    await apiRequest('/products/', 'POST', productData);
                    showToast('Product added successfully! 🌽', 'success');
                }

                setTimeout(() => {
                    window.location.href = '/frontend/Farmer-Page/Farmer-product-page.html';
                }, 2000);
            } catch (err) {
                showToast('Error saving product: ' + err.message, 'error');
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }

    loadProductDetails();
});
