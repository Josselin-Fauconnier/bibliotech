import { initNav, initFooter } from '../utils/navBarre.js';
import { apiFetch } from '../utils/apiFetch.js';

initNav();
initFooter();

if (!localStorage.getItem('username')) {
  window.location.href = '/html/login.html';
}

const form      = document.getElementById('create-list-form');
const container = document.getElementById('lists-container');
const errorEl   = document.getElementById('list-error');

if (!(form instanceof HTMLFormElement)) throw new Error("le formulaire n'existe pas ");
if (!(container instanceof HTMLUListElement)) throw new Error('le contenueur est introuvable ');
if (!(errorEl instanceof HTMLParagraphElement)) throw new Error("l'erreur n'est pas identifiable ");

const submitBtn = form.querySelector('button[type="submit"]');
if (!submitBtn) throw new Error("il n'y a pas de bouton");

async function loadLists() {
  container.innerHTML = '';
  errorEl.textContent = '';

  const res = await apiFetch('/api/lists');

  if (!res.ok) {
    errorEl.textContent = 'il est imposible de charger des listes ';
    return;
  }

  const lists = await res.json();

  if (lists.length === 0) {
    container.innerHTML = "<p class='status'>Pour l'instant, vous n'avez pas de listes </p>";
    return;
  }

  for (const list of lists) {
    const card = document.createElement('li');
    card.className = 'list-card';

    const link = document.createElement('a');
    link.className = 'list-card__link';
    link.href = `/html/listDetail.html?id=${list.id}`;

    const info = document.createElement('div');
    info.className = 'list-card__info';

    const name = document.createElement('h2');
    name.className = 'list-card__name';
    name.textContent = list.name;
    info.appendChild(name);

    if (list.description) {
      const desc = document.createElement('p');
      desc.className = 'list-card__desc';
      desc.textContent = list.description;
      info.appendChild(desc);
    }

    link.appendChild(info);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'list-card__delete';
    deleteBtn.dataset.id = String(list.id);
    deleteBtn.setAttribute('aria-label', `Supprimer la liste ${list.name}`);
    deleteBtn.textContent = 'Supprimer';

    card.appendChild(link);
    card.appendChild(deleteBtn);
    container.appendChild(card);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';
  submitBtn.disabled = true;

  const nameInput = form.querySelector('#list-name');
  if (!nameInput) return;

  const name = nameInput.value.trim();

  const res = await apiFetch('/api/lists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  const data = await res.json();

  if (!res.ok) {
    const firstError = Object.values(data.errors ?? {})[0];
    errorEl.textContent = firstError?.[0] ?? data.message ?? 'une erreur est survenue';
    submitBtn.disabled = false;
    return;
  }

  nameInput.value = '';
  submitBtn.disabled = false;
  await loadLists();
  container.querySelector('.list-card__link')?.focus();
});

container.addEventListener('click', async (e) => {
  const btn = e.target.closest('.list-card__delete');
  if (!btn) return;

  const id = btn.dataset.id;
  if (!id) return;

  const card = btn.closest('.list-card');
  const nextFocus = card?.nextElementSibling?.querySelector('.list-card__link, .list-card__delete')
    ?? card?.previousElementSibling?.querySelector('.list-card__link, .list-card__delete')
    ?? document.getElementById('list-name');

  const res = await apiFetch(`/api/lists/${id}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    card?.remove();
    nextFocus?.focus();
  } else {
    errorEl.textContent = 'il est imposible de suprimer la liste ';
  }
});

loadLists();
