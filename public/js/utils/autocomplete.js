import { searchBooks } from '../api/backend.js';

export function initAutocomplete({ field, input, list, onSelect, minLength = 1, delay = 300, maxResults = 5 }) {
  let debounceTimer = null;
  let requestId = 0;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = input.value.trim();

    if (query.length < minLength) {
      hide();
      return;
    }

    debounceTimer = setTimeout(() => fetchSuggestions(query), delay);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
  });

  field.addEventListener('focusout', (e) => {
    if (!field.contains(e.relatedTarget)) hide();
  });

  async function fetchSuggestions(query) {
    const reqId = ++requestId;
    try {
      const data = await searchBooks(query, 1);
      if (reqId !== requestId) return;
      render(data.docs.slice(0, maxResults));
    } catch {
      hide();
    }
  }

  function render(docs) {
    list.innerHTML = '';

    if (docs.length === 0) {
      hide();
      return;
    }

    for (const book of docs) {
      const author = book.author_name?.[0] ?? "L'auteur est inconnu";

      const item = document.createElement('li');
      item.role = 'option';
      item.textContent = `${book.title} — ${author}`;

      item.addEventListener('mousedown', (e) => e.preventDefault());
      item.addEventListener('click', () => {
        hide();
        onSelect(book);
      });

      list.appendChild(item);
    }

    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function hide() {
    list.hidden = true;
    list.innerHTML = '';
    input.setAttribute('aria-expanded', 'false');
  }

  return { hide };
}
