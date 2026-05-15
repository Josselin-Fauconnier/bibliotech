const form = document.getElementById('register-form');
const errorEl = document.getElementById('auth-error');

if (!(form instanceof HTMLFormElement)) throw new Error('Formulaire introuvable');
if (!(errorEl instanceof HTMLParagraphElement)) throw new Error('Élément erreur introuvable');

const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
if (!submitButton) throw new Error('Bouton introuvable');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';
  submitButton.disabled = true;

  const username = (document.getElementById('username') as HTMLInputElement).value.trim();
  const email = (document.getElementById('email') as HTMLInputElement).value.trim();
  const password = (document.getElementById('password') as HTMLInputElement).value;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      const firstError = Object.values(data.errors ?? {})[0] as string[];
      errorEl.textContent = firstError?.[0] ?? data.message ?? 'Erreur lors de l\'inscription';
      return;
    }

    window.location.href = '/html/login.html';

  } catch {
    errorEl.textContent = 'Impossible de contacter le serveur';
  } finally {
    submitButton.disabled = false;
  }
});

export {};
