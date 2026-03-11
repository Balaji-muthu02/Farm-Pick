import { login } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const credentials = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      };
      await login(credentials);
    });
  }
});
