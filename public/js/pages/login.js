import { initNav, initFooter } from '../utils/navBarre.js';

initNav();
initFooter();

const form = document.getElementById('login-form');
const errorEl = document.getElementById('auth-error');

if (!(form instanceof HTMLFormElement)) throw new Error('Formulaire introuvable');
if (!(errorEl instanceof HTMLParagraphElement)) throw new Error('Élément erreur introuvable');

const submitButton = form.querySelector('button[type="submit"]');
if (!submitButton) throw new Error('Bouton introuvable');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';
  submitButton.disabled = true;

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message ?? 'Erreur de connexion';
      return;
    }

    localStorage.setItem('role', data.role);
    localStorage.setItem('username', data.username);

    window.location.href = data.role === 'admin' ? '/html/admin.html' : '/html/books.html';

  } catch {
    errorEl.textContent = 'Impossible de contacter le serveur';
  } finally {
    submitButton.disabled = false;
  }
});
