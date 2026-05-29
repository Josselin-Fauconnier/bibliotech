import { initNav } from '../utils/navBarre.js';
import { getWorkDetails, getAuthorName } from '../api/backend.js';
initNav();
const param = new URLSearchParams(window.location.search);
const bookId = param.get('id');
if (!bookId) {
    window.location.href = '/html/books.html';
    throw new Error("Aucun livre avec cet identifiant n'a été trouvé ");
}
const titleEl = document.getElementById('book-title');
const authorEl = document.getElementById('book-author');
const yearEl = document.getElementById('book-year');
const descEl = document.getElementById('book-description');
const coverImg = document.getElementById('book-cover');
const noCoverEl = document.getElementById('book-no-cover');
const statusEl = document.getElementById('book-status');
const addSection = document.getElementById('add-to-list-section');
const listSelect = document.getElementById('list-select');
const addForm = document.getElementById('add-to-list-form');
const addMsg = document.getElementById('add-to-list-msg');
const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment-input');
const commentError = document.getElementById('comment-error');
const commentsList = document.getElementById('comments-list');
const commentsStatus = document.getElementById('comments-status');
async function loadBook() {
    statusEl.textContent = 'Chargement...';
    try {
        const work = await getWorkDetails(bookId);
        titleEl.textContent = work.title;
        if (work.authors && work.authors.length > 0) {
            const name = await getAuthorName(work.authors[0].author.key);
            authorEl.textContent = name;
        }
        if (work.first_publish_date) {
            yearEl.textContent = work.first_publish_date;
        }
        if (work.description) {
            const text = typeof work.description === 'string'
                ? work.description
                : work.description.value;
            descEl.textContent = text;
        }
        if (work.covers && work.covers.length > 0) {
            coverImg.src = `https://covers.openlibrary.org/b/id/${work.covers[0]}-L.jpg`;
            coverImg.alt = `Couverture de ${work.title}`;
            coverImg.hidden = false;
        }
        else {
            noCoverEl.hidden = false;
        }
        statusEl.textContent = '';
    }
    catch {
        statusEl.textContent = "il est imposible de charcher ce livre ";
    }
}
async function loadComments() {
    commentsStatus.textContent = 'Chargement...';
    commentsList.innerHTML = '';
    const res = await fetch(`/api/comments/${bookId}`);
    if (!res.ok) {
        commentsStatus.textContent = 'Impossible de charger les commentaires.';
        return;
    }
    const comments = await res.json();
    if (comments.length === 0) {
        commentsStatus.textContent = 'Aucun commentaire pour ce livre.';
        return;
    }
    commentsStatus.textContent = '';
    for (const comment of comments) {
        const li = document.createElement('li');
        li.className = 'comment-item';
        const author = document.createElement('span');
        author.className = 'comment-item__author';
        author.textContent = comment.username;
        const content = document.createElement('p');
        content.className = 'comment-item__content';
        content.textContent = comment.content;
        const date = document.createElement('time');
        date.className = 'comment-item__date';
        date.textContent = new Date(comment.created_at).toLocaleDateString('fr-FR');
        li.appendChild(author);
        li.appendChild(content);
        li.appendChild(date);
        const currentUser = localStorage.getItem('username');
        if (currentUser && currentUser === comment.username) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn comment-item__delete';
            deleteBtn.textContent = 'Supprimer';
            deleteBtn.addEventListener('click', async () => {
                const res = await fetch(`/api/comments/${comment.id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (res.ok)
                    li.remove();
            });
            const editBtn = document.createElement('button');
            editBtn.className = 'btn comment-item__edit';
            editBtn.textContent = 'Éditer';
            editBtn.addEventListener('click', () => {
                const textarea = document.createElement('textarea');
                textarea.className = 'comment-form__input';
                textarea.value = comment.content;
                const saveBtn = document.createElement('button');
                saveBtn.className = 'btn comment-item__save';
                saveBtn.textContent = 'Enregistrer';
                saveBtn.addEventListener('click', async () => {
                    const res = await fetch(`/api/comments/${comment.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ content: textarea.value.trim() }),
                    });
                    if (res.ok) {
                        comment.content = textarea.value.trim();
                        content.textContent = textarea.value.trim();
                        textarea.remove();
                        saveBtn.remove();
                    }
                });
                li.appendChild(textarea);
                li.appendChild(saveBtn);
            });
            const actions = document.createElement('div');
            actions.className = 'comment-item__actions';
            actions.appendChild(deleteBtn);
            actions.appendChild(editBtn);
            li.appendChild(actions);
        }
        commentsList.appendChild(li);
    }
}
async function loadLists() {
    const res = await fetch('/api/lists', { credentials: 'include' });
    if (!res.ok)
        return;
    const lists = await res.json();
    if (lists.length === 0) {
        addMsg.textContent = "Vous n'avez pas encore de liste.";
        addSection.hidden = false;
        return;
    }
    for (const list of lists) {
        const option = document.createElement('option');
        option.value = String(list.id);
        option.textContent = list.name;
        listSelect.appendChild(option);
    }
    addSection.hidden = false;
}
addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const listId = listSelect.value;
    const res = await fetch(`/api/lists/${listId}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookId }),
    });
    addMsg.textContent = res.ok
        ? 'Livre ajouté à la liste !'
        : "Impossible d'ajouter le livre.";
});
commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    commentError.textContent = '';
    const content = commentInput.value.trim();
    const res = await fetch(`/api/comments/${bookId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
    });
    const data = await res.json();
    if (!res.ok) {
        const firstError = Object.values(data.errors ?? {})[0];
        commentError.textContent = firstError?.[0] ?? data.message ?? 'Erreur';
        return;
    }
    commentInput.value = '';
    await loadComments();
});
loadBook();
loadComments();
if (localStorage.getItem('username')) {
    commentForm.hidden = false;
    loadLists();
}
