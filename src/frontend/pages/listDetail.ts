import { initNav } from '../utils/navBarre.js';
import { getWorkDetails } from '../api/backend.js';

initNav();

const params = new URLSearchParams(window.location.search);
const listId = params.get('id');

if (!listId) {
  window.location.href = '/html/lists.html';
  throw new Error("Il est imposible d'identifier la liste ");
}

const listTitle  = document.getElementById('list-title')!;
const listStatus = document.getElementById('list-status')!;
const booksGrid  = document.getElementById('books-grid')!;


async function loadListName(): Promise<void> {
  const res = await fetch('/api/lists', { credentials: 'include' });
  if (!res.ok) return;
  const lists = await res.json();
  const list = lists.find((l: { id: number }) => String(l.id) === listId);
  if (list) listTitle.textContent = list.name;
}

async function loadListBooks(): Promise<void> {
  listStatus.textContent = 'Chargement...';

  const res = await fetch(`/api/lists/${listId}/books`, {
    credentials: 'include',
  });

  if (!res.ok) {
    listStatus.textContent = 'liste inchargeable ';
    return;
  }

  const books = await res.json();

  if (books.length === 0) {
    listStatus.textContent = "liste vide ";
    return;
  }

  listStatus.textContent = '';

  for (const book of books) {
    const card = await createBookCard(book.book_id);
    if (card) booksGrid.appendChild(card);
  }
}

async function createBookCard(bookId: string): Promise<HTMLElement | null> {
  try {
    const work = await getWorkDetails(bookId);

    const card = document.createElement('article');
    card.className = 'book-card';

    const link = document.createElement('a');
    link.href = `/html/detailBook.html?id=${bookId}`;
    link.className = 'book-card__link';

    if (work.covers && work.covers.length > 0) {
      const img = document.createElement('img');
      img.src = `https://covers.openlibrary.org/b/id/${work.covers[0]}-M.jpg`;
      img.alt = `Couverture de ${work.title}`;
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
    title.textContent = work.title;

    info.appendChild(title);
    link.appendChild(info);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'book-card__remove';
    removeBtn.textContent = 'Retirer';
    removeBtn.addEventListener('click', async () => {
      const res = await fetch(`/api/lists/${listId}/books/${bookId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) card.remove();
    });

    card.appendChild(link);
    card.appendChild(removeBtn);

    return card;
  } catch {
    return null;
  }
}
loadListName();
loadListBooks();