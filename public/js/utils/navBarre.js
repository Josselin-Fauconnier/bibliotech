function getTheme() {
  return localStorage.getItem('theme') || 'auto';
}

function applyTheme(theme) {
  if (theme === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = current === 'dark' || (current === null && systemDark);
  const next = isDark ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
  updateToggleIcon(next);
}

function updateToggleIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'auto' && systemDark);
  btn.textContent = isDark ? '☀️' : '🌙';
  btn.title = isDark ? 'Passer en mode clair' : 'Passer en mode sombre';
}

export function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  applyTheme(getTheme());

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  if (!username) {
    nav.innerHTML = `
      <a href="/html/login.html" class="nav__link">Se connecter</a>
      <button id="theme-toggle" class="nav__theme-toggle" title="Changer le thème"></button>
    `;
  } else {
    nav.innerHTML = `
      <span id="nav-username" class="nav__username"></span>
      <a href="/" class="nav__link">Rechercher</a>
      <a href="/html/lists.html" class="nav__link">Mes listes</a>
      <a href="/html/profile.html" class="nav__link">Mon profil</a>
      ${role === 'admin' ? `<a href="/html/admin.html" class="nav__link">Dashboard</a>` : ''}
      <button id="theme-toggle" class="nav__theme-toggle" title="Changer le thème"></button>
      <button id="logout-btn" class="nav__logout">Se déconnecter</button>
    `;

    document.getElementById('nav-username').textContent = `Bonjour, ${username}`;

    document.getElementById('logout-btn')?.addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      window.location.href = '/html/login.html';
    });
  }

  updateToggleIcon(getTheme());
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
}
