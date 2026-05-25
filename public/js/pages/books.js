import { searchBooks } from '../api/backend.js';
import { initNav } from '../utils/navBarre.js';
initNav();
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const booksGrid = document.querySelector('#books-grid');
const statusEl = document.querySelector('#status-message');
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        loadBooks(query);
    }
});
async function loadBooks(query) {
    setStatus('Chargement..', false);
    booksGrid.innerHTML = "";
    try {
        const data = await searchBooks(query);
        const docs = data.docs;
        if (docs.length === 0) {
            setStatus("Aucun résultat  a été trouvé ", false);
            return;
        }
        setStatus(`${docs.length} résultats affichés sur ${data.numFound} trouvés`, false);
        renderBooks(docs);
    }
    catch {
        setStatus("Il y a eu une erreur ", true);
    }
}
function renderBooks(docs) {
    for (const book of docs) {
        booksGrid.appendChild(createBookCard(book));
    }
}
function createBookCard(book) {
    const author = book.author_name?.[0] ?? "L'auteur est inconnu";
    const year = book.first_publish_year ?? null;
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
    }
    else {
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
