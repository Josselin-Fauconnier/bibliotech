import { initNav } from '../utils/navBarre.js';
initNav();
if (!localStorage.getItem('username')) {
    window.location.href = '/html/login.html';
}
const form = document.getElementById('create-list-form');
const container = document.getElementById('lists-container');
const errorEl = document.getElementById('list-error');
if (!(form instanceof HTMLFormElement))
    throw new Error("le formulaire n'existe pas ");
if (!(container instanceof HTMLDivElement))
    throw new Error("le contenueur est introuvable ");
if (!(errorEl instanceof HTMLParagraphElement))
    throw new Error("l'erreur n'est pas identifiable ");
const submitBtn = form.querySelector('button[type="submit"]');
if (!submitBtn)
    throw new Error("il n'y a pas de bouton");
async function loadLists(container, errorEl) {
    container.innerHTML = '';
    errorEl.textContent = '';
    const res = await fetch('/api/lists', { credentials: 'include' });
    if (!res.ok) {
        errorEl.textContent = "il est imposible de charger des listes ";
        return;
    }
    const lists = await res.json();
    if (lists.length === 0) {
        container.innerHTML = "<p class='status'>Pour l'instant, vous n'avez pas de listes </p>";
        return;
    }
    for (const list of lists) {
        const card = document.createElement('div');
        card.className = 'list-card';
        card.innerHTML = `
      <div class="list-card__info">
        <h2 class="list-card__name">${list.name}</h2>
        ${list.description ? `<p class="list-card__desc">${list.description}</p>` : ''}
      </div>
      <button class="list-card__delete" data-id="${list.id}" aria-label="Supprimer la liste ${list.name}">
        Supprimer
      </button>
    `;
        container.appendChild(card);
    }
}
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';
    submitBtn.disabled = true;
    const nameInput = form.querySelector('#list-name');
    if (!nameInput)
        return;
    const name = nameInput.value.trim();
    const res = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) {
        const firstError = Object.values(data.errors ?? {})[0];
        errorEl.textContent = firstError?.[0] ?? data.message ?? "une erreur est survenue";
        submitBtn.disabled = false;
        return;
    }
    nameInput.value = '';
    submitBtn.disabled = false;
    await loadLists(container, errorEl);
});
container.addEventListener('click', async (e) => {
    const btn = e.target.closest('.list-card__delete');
    if (!btn)
        return;
    const id = btn.dataset.id;
    if (!id)
        return;
    const res = await fetch(`/api/lists/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (res.ok) {
        btn.closest('.list-card')?.remove();
    }
    else {
        errorEl.textContent = "il est imposible de suprimer la liste ";
    }
});
loadLists(container, errorEl);
