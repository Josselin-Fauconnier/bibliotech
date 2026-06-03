import { getTrendingBooks } from '../api/backend.js';
import { initNav } from '../utils/navBarre.js';

initNav();

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const booksGrid   = document.querySelector('#books-grid');
const statusEl    = document.querySelector('#status-message');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = searchInput.value.trim();
  if (q) window.location.href = `/html/books.html?q=${encodeURIComponent(q)}`;
});

async function loadTrending() {
  setStatus('Chargement des livres du moment...', false);
  try {
    const data = await getTrendingBooks();
    if (data.docs.length === 0) { setStatus('', false); return; }
    setStatus('', false);
    renderBooks(data.docs);
  } catch {
    setStatus('Impossible de charger les livres du moment.', true);
  }
}

loadTrending();

function renderBooks(docs) {
  for (const book of docs) booksGrid.appendChild(createBookCard(book));
}

function createBookCard(book) {
  const author = book.author_name?.[0] ?? "L'auteur est inconnu";
  const year   = book.first_publish_year ?? null;
  const workId = book.key.replace('/works/', '');

  const card = document.createElement('article');
  card.className = 'book-card';

  const link = document.createElement('a');
  link.href = `/html/detailBook.html?id=${workId}`;
  link.className = 'book-card__link';

  if (book.cover_i) {
    const img = document.createElement('img');
    img.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    img.alt = `Couverture de ${book.title}`;
    img.className = 'book-card__cover';
    img.loading = 'lazy';
    link.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'book-card__no-cover';
    placeholder.textContent = 'Pas de couverture';
    link.appendChild(placeholder);
  }

  const info = document.createElement('div');
  info.className = 'book-card__info';

  const title = document.createElement('h2');
  title.className = 'book-card__title';
  title.textContent = book.title;

  const authorEl = document.createElement('p');
  authorEl.className = 'book-card__author';
  authorEl.textContent = author;

  info.appendChild(title);
  info.appendChild(authorEl);

  if (year) {
    const yearEl = document.createElement('p');
    yearEl.className = 'book-card__year';
    yearEl.textContent = String(year);
    info.appendChild(yearEl);
  }

  link.appendChild(info);
  card.appendChild(link);
  return card;
}

function setStatus(message, isError) {
  statusEl.textContent = message;
  statusEl.classList.toggle('status--error', isError);
}
