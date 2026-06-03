import { initNav } from '../utils/navBarre.js';

initNav();

if (!localStorage.getItem('username')) {
  window.location.href = '/html/login.html';
}

const profileStatus   = document.getElementById('profile-status');
const profileUsername = document.getElementById('profile-username');
const profileEmail    = document.getElementById('profile-email');
const profileDate     = document.getElementById('profile-date');

const passwordForm = document.getElementById('password-form');
const currentPwd   = document.getElementById('current-password');
const newPwd       = document.getElementById('new-password');
const passwordMsg  = document.getElementById('password-msg');

const deleteBtn = document.getElementById('delete-account-btn');
const deleteMsg = document.getElementById('delete-msg');

const commentsList       = document.getElementById('comments-list');
const commentsStatus     = document.getElementById('comments-status');
const commentsPagination = document.getElementById('comments-pagination');

let currentPage = 1;

async function loadProfile() {
  profileStatus.textContent = 'Chargement...';

  const res = await fetch(`/api/users/me?page=${currentPage}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    profileStatus.textContent = 'Impossible de charger le profil.';
    return;
  }

  const { user, comments } = await res.json();

  profileStatus.textContent = '';
  profileUsername.textContent = user.username;
  profileEmail.textContent = user.email;
  profileDate.textContent = new Date(user.created_at).toLocaleDateString('fr-FR');

  renderComments(comments.data);
  renderPagination(comments.page, comments.totalPages);
}

function renderComments(comments) {
  commentsList.innerHTML = '';

  if (comments.length === 0) {
    commentsStatus.textContent = 'Aucun commentaire pour le moment.';
    return;
  }

  commentsStatus.textContent = '';

  for (const comment of comments) {
    const li = document.createElement('li');
    li.className = 'comment-item';

    const content = document.createElement('p');
    content.className = 'comment-item__content';
    content.textContent = comment.content;

    const meta = document.createElement('div');
    meta.className = 'comment-item__meta';

    const date = document.createElement('span');
    date.className = 'comment-item__date';
    date.textContent = new Date(comment.created_at).toLocaleDateString('fr-FR');

    const link = document.createElement('a');
    link.className = 'comment-item__link';
    link.href = `/html/detailBook.html?id=${comment.book_id}`;
    link.textContent = 'Voir le livre →';

    meta.appendChild(date);
    meta.appendChild(link);

    li.appendChild(content);
    li.appendChild(meta);
    commentsList.appendChild(li);
  }
}

function renderPagination(page, totalPages) {
  commentsPagination.innerHTML = '';
  if (totalPages <= 1) return;

  const prev = document.createElement('button');
  prev.className = 'pagination__btn';
  prev.textContent = '← Précédent';
  prev.disabled = page === 1;
  prev.addEventListener('click', () => { currentPage--; loadProfile(); });

  const info = document.createElement('span');
  info.className = 'pagination__info';
  info.textContent = `Page ${page} / ${totalPages}`;

  const next = document.createElement('button');
  next.className = 'pagination__btn';
  next.textContent = 'Suivant →';
  next.disabled = page === totalPages;
  next.addEventListener('click', () => { currentPage++; loadProfile(); });

  commentsPagination.appendChild(prev);
  commentsPagination.appendChild(info);
  commentsPagination.appendChild(next);
}

passwordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  passwordMsg.textContent = '';

  const res = await fetch('/api/users/me/password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      currentPassword: currentPwd.value,
      newPassword: newPwd.value,
    }),
  });

  const data = await res.json();
  passwordMsg.textContent = data.message;
  passwordMsg.style.color = res.ok ? 'var(--color-text-muted)' : 'var(--color-error)';

  if (res.ok) {
    passwordForm.reset();
  }
});

deleteBtn.addEventListener('click', async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return;

  const res = await fetch('/api/users/me', {
    method: 'DELETE',
    credentials: 'include',
  });

  if (res.ok) {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.href = '/html/login.html';
  } else {
    const data = await res.json();
    deleteMsg.textContent = data.message;
  }
});

loadProfile();
