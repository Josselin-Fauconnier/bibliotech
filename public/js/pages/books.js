import { searchBooks, getTrendingBooks } from '../api/backend.js';
import { initNav } from '../utils/navBarre.js';

initNav();

const searchForm      = document.querySelector('#search-form');
const searchInput     = document.querySelector('#search-input');
const booksGrid       = document.querySelector('#books-grid');
const statusEl        = document.querySelector('#status-message');
const booksPagination = document.querySelector('#books-pagination');

let currentQuery = '';
let currentPage  = 1;

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    currentPage = 1;
    loadBooks(query);
  }
});

async function loadTrending() {
  setStatus('Chargement des livres du moment...', false);

  try {
    const data = await getTrendingBooks();

    if (data.docs.length === 0) {
      setStatus('', false);
      return;
    }

    setStatus('Livres du moment', false);
    renderBooks(data.docs);
  } catch {
    setStatus('', false);
  }
}

const params = new URLSearchParams(window.location.search);
const preQuery = params.get('q');
if (preQuery) {
  searchInput.value = preQuery;
  loadBooks(preQuery, 1);
} else {
  loadTrending();
}

async function loadBooks(query, page = 1) {
  currentQuery = query;
  currentPage  = page;

  setStatus('Chargement..', false);
  booksGrid.innerHTML = '';
  booksPagination.innerHTML = '';

  try {
    const data = await searchBooks(query, page);
    const docs = data.docs;

    if (docs.length === 0) {
      setStatus('Aucun résultat  a été trouvé ', false);
      return;
    }

    const totalPages = Math.ceil(data.numFound / 20);
    setStatus(`${data.numFound} résultats trouvés — page ${page} / ${totalPages}`, false);
    renderBooks(docs);
    renderPagination(page, totalPages);
  } catch {
    setStatus('Il y a eu une erreur ', true);
  }
}

function renderPagination(page, totalPages) {
  if (totalPages <= 1) return;

  const prev = document.createElement('button');
  prev.className = 'pagination__btn';
  prev.textContent = '← Précédent';
  prev.disabled = page === 1;
  prev.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadBooks(currentQuery, currentPage - 1);
  });

  const info = document.createElement('span');
  info.className = 'pagination__info';
  info.textContent = `Page ${page} / ${totalPages}`;

  const next = document.createElement('button');
  next.className = 'pagination__btn';
  next.textContent = 'Suivant →';
  next.disabled = page === totalPages;
  next.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadBooks(currentQuery, currentPage + 1);
  });

  booksPagination.appendChild(prev);
  booksPagination.appendChild(info);
  booksPagination.appendChild(next);
}

function renderBooks(docs) {
  for (const book of docs) {
    booksGrid.appendChild(createBookCard(book));
  }
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
