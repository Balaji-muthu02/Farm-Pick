import { fetchCart, renderCart } from './cart.js';
import { getCurrentUser } from './auth.js';

async function loadCart() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/frontend/pages/login.html';
    return;
  }
  try {
    const cart = await fetchCart(user.id);
    renderCart(cart, 'cart-content');
  } catch (err) {
    console.error(err);
  }
}

// Initial load
document.addEventListener('DOMContentLoaded', loadCart);
