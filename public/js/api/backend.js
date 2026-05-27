export async function searchBooks(query) {
    const response = await fetch(`/api/books?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status}`);
    }
    return response.json();
}
export async function getWorkDetails(id) {
    const res = await fetch(`/api/books/work/${id}`);
    if (!res.ok)
        throw new Error('Le livre est introuvable.');
    return res.json();
}
export async function getAuthorName(key) {
    const id = key.replace('/authors/', '');
    const res = await fetch(`/api/books/author/${id}`);
    if (!res.ok)
        return 'Auteur introuvable';
    const data = await res.json();
    return data.name ?? 'Nom non renseigné';
}
