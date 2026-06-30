import { useState, useEffect, useCallback } from 'react';
import { Book } from '../types/book';
import { defaultBooks } from '../data/defaultBooks';

const STORAGE_KEY = 'cosy-crime-books';

export const useBookPool = () => {
  const [books, setBooks] = useState<Book[]>([]);

  // Load books from localStorage or use defaults
  useEffect(() => {
    const savedBooks = localStorage.getItem(STORAGE_KEY);
    if (savedBooks) {
      try {
        const parsed = JSON.parse(savedBooks) as Book[];
        // Validate that it's an array of books
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBooks(parsed);
          return;
        }
      } catch {
        // If parsing fails, use defaults
      }
    }
    setBooks(defaultBooks);
  }, []);

  const saveBooks = useCallback((newBooks: Book[]) => {
    setBooks(newBooks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
  }, []);

  const resetBooks = useCallback(() => {
    setBooks(defaultBooks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBooks));
  }, []);

  const importFromText = useCallback((text: string): Book[] => {
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const importedBooks: Book[] = lines.map((line, index) => {
      const [title, author] = line.split(';').map((part) => part.trim());
      return {
        id: `imported-${Date.now()}-${index}`,
        title: title || 'Unbekanntes Buch',
        author: author || 'Unbekannt',
      };
    });

    return importedBooks;
  }, []);

  return {
    books,
    setBooks: saveBooks,
    resetBooks,
    importFromText,
  };
};
