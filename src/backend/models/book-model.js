const BASE_URL = 'https://openlibrary.org';

export async function searchBooks(q, page) {
  const response = await fetch(`${BASE_URL}/search.json?q=${q}&limit=20&page=${page}`);
  return response.json();
}

export async function getWork(id) {
  const response = await fetch(`${BASE_URL}/works/${id}.json`);
  return { ok: response.ok, status: response.status, data: response.ok ? await response.json() : null };
}

export async function getTrending() {
  const response = await fetch(`${BASE_URL}/trending/daily.json?limit=20`);
  return { ok: response.ok, status: response.status, data: response.ok ? await response.json() : null };
}

export async function getAuthor(key) {
  const response = await fetch(`${BASE_URL}/authors/${key}.json`);
  return { ok: response.ok, status: response.status, data: response.ok ? await response.json() : null };
}
