import { initNav, initFooter } from '../utils/navBarre.js';

initNav();
initFooter();

if (localStorage.getItem('role') !== 'admin') {
  window.location.href = '/html/books.html';
  throw new Error('cet acces vous est refusé ');
}

const usersBody       = document.getElementById('users-body');
const usersStatus     = document.getElementById('users-status');
const usersPagination = document.getElementById('users-pagination');

const commentsBody       = document.getElementById('comments-body');
const commentsStatus     = document.getElementById('comments-status');
const commentsPagination = document.getElementById('comments-pagination');

const bannedTempBody       = document.getElementById('banned-temp-body');
const bannedTempStatus     = document.getElementById('banned-temp-status');
const bannedTempPagination = document.getElementById('banned-temp-pagination');

const bannedPermBody       = document.getElementById('banned-perm-body');
const bannedPermStatus     = document.getElementById('banned-perm-status');
const bannedPermPagination = document.getElementById('banned-perm-pagination');

let usersPage    = 1;
let commentsPage = 1;
let bannedTempPage = 1;
let bannedPermPage = 1;

let pendingBanUserId = null;
const banModal    = document.getElementById('ban-modal');
const banReason   = document.getElementById('ban-reason');
const banDuration = document.getElementById('ban-duration');

let pendingUnbanUserId = null;
const unbanModal    = document.getElementById('unban-modal');
const unbanUsername = document.getElementById('unban-username');

function getFocusable(container) {
  return Array.from(container.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), [href]'
  ));
}

function openModal(modal, trigger) {
  modal._trigger = trigger;
  modal.classList.remove('hidden');
  getFocusable(modal)[0]?.focus();
  modal._trapFn = (e) => {
    if (e.key === 'Escape') { closeModal(modal); return; }
    if (e.key !== 'Tab') return;
    const els = getFocusable(modal);
    if (e.shiftKey && document.activeElement === els[0]) {
      e.preventDefault(); els[els.length - 1].focus();
    } else if (!e.shiftKey && document.activeElement === els[els.length - 1]) {
      e.preventDefault(); els[0].focus();
    }
  };
  modal.addEventListener('keydown', modal._trapFn);
}

function closeModal(modal) {
  modal.classList.add('hidden');
  modal.removeEventListener('keydown', modal._trapFn);
  modal._trigger?.focus();
}

document.getElementById('ban-cancel').addEventListener('click', () => {
  closeModal(banModal);
  pendingBanUserId = null;
});

document.getElementById('unban-cancel').addEventListener('click', () => {
  closeModal(unbanModal);
  pendingUnbanUserId = null;
});

document.getElementById('unban-confirm').addEventListener('click', async () => {
  const res = await fetch(`/api/admin/users/${pendingUnbanUserId}/ban`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (res.ok) {
    closeModal(unbanModal);
    loadBannedTemp();
    loadBannedPerm();
    loadUsers();
  } else {
    alert('Erreur lors du débannissement.');
  }
});

document.getElementById('ban-confirm').addEventListener('click', async () => {
  const res = await fetch(`/api/admin/users/${pendingBanUserId}/ban`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reason: banReason.value || null,
      duration_days: banDuration.value ? Number(banDuration.value) : null,
    }),
  });
  if (res.ok) {
    closeModal(banModal);
    loadUsers();
    loadBannedTemp();
    loadBannedPerm();
  }
});

function timeRemaining(bannedUntil) {
  if (!bannedUntil) return 'Permanent';
  const diff = new Date(bannedUntil) - new Date();
  if (diff <= 0) return 'Expiré';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}j ${hours}h`;
  return `${hours}h`;
}

function renderPagination(container, currentPage, totalPages, onPageChange) {
  container.innerHTML = '';

  if (totalPages <= 1) return;

  const prev = document.createElement('button');
  prev.className = 'pagination__btn';
  prev.textContent = '← Précédent';
  prev.disabled = currentPage === 1;
  prev.addEventListener('click', () => onPageChange(currentPage - 1));

  const info = document.createElement('span');
  info.className = 'pagination__info';
  info.textContent = `Page ${currentPage} / ${totalPages}`;

  const next = document.createElement('button');
  next.className = 'pagination__btn';
  next.textContent = 'Suivant ';
  next.disabled = currentPage === totalPages;
  next.addEventListener('click', () => onPageChange(currentPage + 1));

  container.appendChild(prev);
  container.appendChild(info);
  container.appendChild(next);
}

async function loadUsers() {
  usersStatus.textContent = 'Chargement...';
  usersBody.innerHTML = '';

  const res = await fetch(`/api/admin/users?page=${usersPage}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    usersStatus.textContent = 'Impossible de charger les utilisateurs.';
    return;
  }

  const { data, totalPages } = await res.json();
  usersStatus.textContent = '';

  for (const user of data) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.username}</td>
      <td>${user.role}</td>
      <td>${new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
    `;

    const banBtn = document.createElement('button');
    banBtn.className = 'admin-delete-btn';
    banBtn.textContent = 'Bannir';
    banBtn.setAttribute('aria-label', `Bannir ${user.username}`);
    banBtn.addEventListener('click', () => {
      pendingBanUserId = user.id;
      banReason.value = '';
      banDuration.value = '';
      openModal(banModal, banBtn);
    });

    const actionTd = document.createElement('td');
    actionTd.appendChild(banBtn);
    tr.appendChild(actionTd);

    usersBody.appendChild(tr);
  }

  renderPagination(usersPagination, usersPage, totalPages, (page) => {
    usersPage = page;
    loadUsers();
  });
}

async function loadComments() {
  commentsStatus.textContent = 'Chargement...';
  commentsBody.innerHTML = '';

  const res = await fetch(`/api/admin/comments?page=${commentsPage}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    commentsStatus.textContent = 'il est imposible de charger les commentaires';
    return;
  }

  const { data, totalPages } = await res.json();
  commentsStatus.textContent = '';

  for (const comment of data) {
    const tr = document.createElement('tr');

    const td = document.createElement('td');
    td.textContent = comment.content;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'admin-delete-btn';
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.setAttribute('aria-label', `Supprimer le commentaire de ${comment.username}`);
    deleteBtn.addEventListener('click', async () => {
      const res = await fetch(`/api/admin/comments/${comment.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) tr.remove();
    });

    const actionTd = document.createElement('td');
    actionTd.appendChild(deleteBtn);

    tr.innerHTML = `
      <td>${comment.username}</td>
      <td><a href="/html/detailBook.html?id=${comment.book_id}" class="admin-table__link">Voir le livre</a></td>
    `;
    tr.appendChild(td);
    tr.insertAdjacentHTML('beforeend', `<td>${new Date(comment.created_at).toLocaleDateString('fr-FR')}</td>`);
    tr.appendChild(actionTd);

    commentsBody.appendChild(tr);
  }

  renderPagination(commentsPagination, commentsPage, totalPages, (page) => {
    commentsPage = page;
    loadComments();
  });
}

async function loadBannedTemp() {
  bannedTempStatus.textContent = 'Chargement...';
  bannedTempBody.innerHTML = '';

  const res = await fetch(`/api/admin/banned-users?type=temp&page=${bannedTempPage}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    bannedTempStatus.textContent = 'Impossible de charger.';
    return;
  }

  const { data, totalPages } = await res.json();
  bannedTempStatus.textContent = '';

  if (data.length === 0) {
    bannedTempStatus.textContent = 'Aucun banni temporaire.';
    return;
  }

  for (const user of data) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.username}</td>
      <td>${user.ban_reason ?? '—'}</td>
      <td>${timeRemaining(user.banned_until)}</td>
    `;

    const unbanBtn = document.createElement('button');
    unbanBtn.className = 'admin-delete-btn';
    unbanBtn.textContent = 'Débannir';
    unbanBtn.setAttribute('aria-label', `Débannir ${user.username}`);
    unbanBtn.addEventListener('click', () => {
      pendingUnbanUserId = user.id;
      unbanUsername.textContent = user.username;
      openModal(unbanModal, unbanBtn);
    });

    const actionTd = document.createElement('td');
    actionTd.appendChild(unbanBtn);
    tr.appendChild(actionTd);

    bannedTempBody.appendChild(tr);
  }

  renderPagination(bannedTempPagination, bannedTempPage, totalPages, (page) => {
    bannedTempPage = page;
    loadBannedTemp();
  });
}

async function loadBannedPerm() {
  bannedPermStatus.textContent = 'Chargement...';
  bannedPermBody.innerHTML = '';

  const res = await fetch(`/api/admin/banned-users?type=permanent&page=${bannedPermPage}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    bannedPermStatus.textContent = 'Impossible de charger.';
    return;
  }

  const { data, totalPages } = await res.json();
  bannedPermStatus.textContent = '';

  if (data.length === 0) {
    bannedPermStatus.textContent = 'Aucun banni définitif.';
    return;
  }

  for (const user of data) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.username}</td>
      <td>${user.ban_reason ?? '—'}</td>
    `;

    const unbanBtn = document.createElement('button');
    unbanBtn.className = 'admin-delete-btn';
    unbanBtn.textContent = 'Débannir';
    unbanBtn.setAttribute('aria-label', `Débannir ${user.username}`);
    unbanBtn.addEventListener('click', () => {
      pendingUnbanUserId = user.id;
      unbanUsername.textContent = user.username;
      openModal(unbanModal, unbanBtn);
    });

    const actionTd = document.createElement('td');
    actionTd.appendChild(unbanBtn);
    tr.appendChild(actionTd);

    bannedPermBody.appendChild(tr);
  }

  renderPagination(bannedPermPagination, bannedPermPage, totalPages, (page) => {
    bannedPermPage = page;
    loadBannedPerm();
  });
}

loadUsers();
loadComments();
loadBannedTemp();
loadBannedPerm();
