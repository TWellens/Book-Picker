import { useState, useEffect } from 'react';

// Module-level cache – persists for the whole session, no repeated API calls
const coverCache = new Map<string, string | null>();

async function fetchCover(title: string, author: string): Promise<string | null> {
  // Open Library – free, no API key, no quota limits
  // Try title+author first, then title only as fallback
  const queries = [`${title} ${author}`, title];

  for (const q of queries) {
    const url =
      `https://openlibrary.org/search.json` +
      `?q=${encodeURIComponent(q)}&limit=1&fields=cover_i`;

    try {
      const res = await fetch(url);
      if (!res.ok) continue;

      const data = await res.json();
      const coverId: number | undefined = data?.docs?.[0]?.cover_i;

      if (coverId) {
        // -M = medium (180px wide), -L = large
        return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
      }
    } catch (e) {
      console.warn(`[BookCover] Error fetching cover for "${q}":`, e);
    }
  }

  return null;
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
