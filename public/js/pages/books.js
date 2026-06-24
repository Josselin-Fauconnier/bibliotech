import { searchBooks, getTrendingBooks } from '../api/backend.js';
import { initNav, initFooter } from '../utils/navBarre.js';
import { renderPagination } from '../utils/pagination.js';
import { createBookCard } from '../utils/bookCard.js';

initNav();
initFooter();

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
    renderPagination(booksPagination, {
      currentPage: page,
      totalPages,
      onPageChange: (newPage) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        loadBooks(currentQuery, newPage);
      },
    });
  } catch {
    setStatus('Il y a eu une erreur ', true);
  }
}

function renderBooks(docs) {
  for (const book of docs) {
    booksGrid.appendChild(createBookCard(book));
  }
}

function setStatus(message, isError) {
  statusEl.textContent = message;
  statusEl.classList.toggle('status--error', isError);
}
