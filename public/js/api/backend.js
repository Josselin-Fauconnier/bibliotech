export async function searchBooks(query) {
    const response = await fetch(`/api/books?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status}`);
    }
    return response.json();
}
export async function getWorkDetails(id) {
    const res = await fetch(`https://openlibrary.org/works/${id}.json`);
    if (!res.ok)
        throw new Error('Le livre est introuvable.');
    return res.json();
}
export async function getAuthorName(key) {
    const res = await fetch(`https://openlibrary.org${key}.json`);
    if (!res.ok)
        return "l'auteur n'est pas connue";
    const data = await res.json();
    return data.name ?? "l'auteur n'est pas connue";
}
