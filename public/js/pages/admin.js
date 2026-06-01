import { initNav } from '../utils/navBarre.js';

initNav();

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

let usersPage    = 1;
let commentsPage = 1;

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

loadUsers();
loadComments();
