import { getTrendingBooks } from '../api/backend.js';
import { initNav, initFooter } from '../utils/navBarre.js';
import { createBookCard } from '../utils/bookCard.js';

initNav();
initFooter();

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

function setStatus(message, isError) {
  statusEl.textContent = message;
  statusEl.classList.toggle('status--error', isError);
}
