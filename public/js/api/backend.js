export async function searchBooks(query) {
    const response = await fetch(`/api/books?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status}`);
    }
    return response.json();
}
