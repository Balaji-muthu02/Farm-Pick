import { fetchProducts, renderProducts, initSearch } from './shop.js';

async function loadShop() {
  try {
    const products = await fetchProducts();
    // Render all products found
    renderProducts(products, 'shop-product-container');
    initSearch(products, 'shop-product-container');
  } catch (err) {
    console.error("Shop load error:", err);
  }
}

document.addEventListener('DOMContentLoaded', loadShop);
