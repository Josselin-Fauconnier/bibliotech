import { startSessionTimer } from './apiFetch.js';

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
  const label = isDark ? 'Passer en mode clair' : 'Passer en mode sombre';
  btn.textContent = isDark ? '☀️' : '🌙';
  btn.title = label;
  btn.setAttribute('aria-label', label);
}

export function initFooter() {
  const footer = document.getElementById('main-footer');
  if (!footer) return;

  footer.innerHTML = `
    <p class="footer__text">
      BiblioTech — Données fournies par
      <a href="https://openlibrary.org" class="footer__link" target="_blank" rel="noopener" aria-label="Open Library (ouvre dans un nouvel onglet)">Open Library</a>
    </p>
    <p class="footer__text">Le site est un projet perso pour le passage du titre RNCP de développement web</p>
  `;
}

export function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  applyTheme(getTheme());

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const menuContent = !username
    ? `
      <a href="/html/login.html" class="nav__link">Se connecter</a>
      <button id="theme-toggle" class="nav__theme-toggle" title="Changer le thème"></button>
    `
    : `
      <span id="nav-username" class="nav__username"></span>
      <a href="/" class="nav__link">Rechercher</a>
      <a href="/html/lists.html" class="nav__link">Mes listes</a>
      <a href="/html/profile.html" class="nav__link">Mon profil</a>
      ${role === 'admin' ? `<a href="/html/admin.html" class="nav__link">Dashboard</a>` : ''}
      <button id="theme-toggle" class="nav__theme-toggle" title="Changer le thème"></button>
      <button id="logout-btn" class="nav__logout">Se déconnecter</button>
    `;

  nav.innerHTML = `
    <button id="nav-burger" class="nav__burger" aria-expanded="false" aria-controls="nav-menu" aria-label="Ouvrir le menu">☰</button>
    <div id="nav-menu" class="nav__menu">${menuContent}</div>
  `;

  if (username) {
    document.getElementById('nav-username').textContent = `Bonjour, ${username}`;
    startSessionTimer();

    document.getElementById('logout-btn')?.addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      window.location.href = '/html/login.html';
    });
  }

  updateToggleIcon(getTheme());
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

  const burger = document.getElementById('nav-burger');
  const menu = document.getElementById('nav-menu');
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  menu.querySelectorAll('a.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Ouvrir le menu');
    });
  });

  const currentPath = window.location.pathname;
  nav.querySelectorAll('a.nav__link').forEach(link => {
    if (new URL(link.href).pathname === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
}
