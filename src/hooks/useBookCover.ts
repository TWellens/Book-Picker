import { useState, useEffect } from 'react';

// Module-level cache – persists for the whole session, no repeated API calls
const coverCache = new Map<string, string | null>();

async function fetchCover(title: string, author: string): Promise<string | null> {
  const query = encodeURIComponent(`intitle:${title} inauthor:${author}`);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1&fields=items(volumeInfo/imageLinks)`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const thumb: string | undefined = data?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
    if (!thumb) return null;

    return thumb
      .replace('http://', 'https://')   // always HTTPS
      .replace('&edge=curl', '')         // remove curl effect
      .replace('zoom=1', 'zoom=2');      // higher resolution
  } catch {
    console.warn(`[BookCover] Could not fetch cover for "${title}" by "${author}"`);
    return null;
  }
}

export function useBookCover(title: string, author: string) {
  const key = `${title}||${author}`;

  // Initialise from cache immediately to avoid unnecessary loading flash
  const [cover, setCover] = useState<string | null>(
    coverCache.has(key) ? (coverCache.get(key) ?? null) : null
  );
  const [loading, setLoading] = useState(!coverCache.has(key));

  useEffect(() => {
    if (coverCache.has(key)) {
      setCover(coverCache.get(key) ?? null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchCover(title, author).then((url) => {
      if (cancelled) return;
      coverCache.set(key, url);
      setCover(url);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [key, title, author]);

  return { cover, loading };
}
