export function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const username = localStorage.getItem('username');

  if (!username) {
    nav.innerHTML = `
      <a href="/html/login.html" class="nav__link">Se connecter</a>
    `;
    return;
  }

  const role = localStorage.getItem('role');

  nav.innerHTML = `
    <span class="nav__username">Bonjour, ${username}</span>
    <a href="/html/books.html" class="nav__link">Rechercher</a>
    <a href="/html/lists.html" class="nav__link">Mes listes</a>
    <a href="/html/profile.html" class="nav__link">Mon profil</a>
    ${role === 'admin' ? `<a href="/html/admin.html" class="nav__link">Dashboard</a>` : ''}
    <button id="logout-btn" class="nav__logout">Se déconnecter</button>
  `;

  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.href = '/html/login.html';
  });
}
