export interface BookDoc {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
}

interface SearchResponse {
  docs: BookDoc[];
  numFound: number;
}

export async function searchBooks(query: string): Promise<SearchResponse> {
  const response = await fetch(`/api/books?q=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error(`Erreur serveur : ${response.status}`);
  }

  return response.json();
}


export interface WorkDetail {
  title: string;
  description?: string | {value: string} ;
  covers?: number[];
  authors?: {author: { key: string}} [];
  first_publish_date?: string;
}

export async function getWorkDetails(id: string) : Promise<WorkDetail> {
  const res = await fetch(`/api/books/work/${id}`);
  if (!res.ok) throw new Error('Le livre est introuvable.');
  return res.json();
}

export async function getAuthorName(key: string): Promise<string> {
  const id = key.replace('/authors/', '');
  const res = await fetch(`/api/books/author/${id}`);
  if (!res.ok) return 'Auteur introuvable';
  const data = await res.json();
  return data.name ?? 'Nom non renseigné';
}
