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
