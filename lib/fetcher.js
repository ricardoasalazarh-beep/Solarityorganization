export async function fetcher(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Error de red');
  }
  return res.json();
}
