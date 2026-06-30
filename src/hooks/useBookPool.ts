import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Book } from '../types/book';
import { defaultBooks } from '../data/defaultBooks';

export const useBookPool = () => {
  const [books, setLocalBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    const { data, error } = await supabase
      .from('books')
      .select('id, title, author')
      .order('created_at', { ascending: true });
    if (!error && data) {
      setLocalBooks(data as Book[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBooks();

    const channel = supabase
      .channel('books-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'books' },
        () => { fetchBooks(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchBooks]);

  const setBooks = useCallback(async (newBooks: Book[]) => {
    setLocalBooks(newBooks);
    await supabase.from('books').delete().not('id', 'is', null);
    if (newBooks.length > 0) {
      const { data } = await supabase
        .from('books')
        .insert(newBooks.map(b => ({ title: b.title, author: b.author })))
        .select('id, title, author');
      if (data) setLocalBooks(data as Book[]);
    }
  }, []);

  const resetBooks = useCallback(async () => {
    setLocalBooks(defaultBooks);
    await supabase.from('books').delete().not('id', 'is', null);
    const { data } = await supabase
      .from('books')
      .insert(defaultBooks.map(b => ({ title: b.title, author: b.author })))
      .select('id, title, author');
    if (data) setLocalBooks(data as Book[]);
  }, []);

  const importFromText = useCallback((text: string): Book[] => {
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return lines.map((line, index) => {
      const [title, author] = line.split(';').map((part) => part.trim());
      return {
        id: `preview-${Date.now()}-${index}`,
        title: title || 'Unbekanntes Buch',
        author: author || 'Unbekannt',
      };
    });
  }, []);

  return {
    books,
    loading,
    setBooks,
    resetBooks,
    importFromText,
  };
};
