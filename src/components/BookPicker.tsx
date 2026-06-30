import React, { useState, useRef, useCallback } from 'react';
import { Book } from '../types/book';
import BookScene, { BookSceneHandle } from './BookScene';

type PickerStatus = 'idle' | 'animating' | 'done';

interface BookPickerProps {
  books: Book[];
}

export const BookPicker: React.FC<BookPickerProps> = ({ books }) => {
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [status, setStatus] = useState<PickerStatus>('idle');
  const [lastPickedId, setLastPickedId] = useState<string | null>(null);
  const bookSceneRef = useRef<BookSceneHandle>(null);

  const pickRandomBook = useCallback(() => {
    if (books.length === 0 || isAnimating) return;

    let selectedBook: Book;

    // If there's only one book, always pick it
    // If there are multiple books, try to avoid picking the same one twice in a row
    if (books.length === 1) {
      selectedBook = books[0];
    } else {
      const availableBooks = books.filter((b) => b.id !== lastPickedId);
      selectedBook =
        availableBooks[Math.floor(Math.random() * availableBooks.length)];
    }

    setCurrentBook(selectedBook);
    setLastPickedId(selectedBook.id);
    setIsAnimating(true);
    setStatus('animating');

    // Trigger animation
    setTimeout(() => {
      bookSceneRef.current?.playAnimation();
    }, 50);
  }, [books, isAnimating, lastPickedId]);

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    setStatus('done');
  };

  const renderStatus = () => {
    if (status === 'animating') {
      return (
        <span className="picker-status picker-status--animating">
          Das Schicksal blättert…
        </span>
      );
    }
    if (status === 'done' && currentBook) {
      return (
        <span className="picker-status picker-status--done">
          Gezogen: <strong>{currentBook.title}</strong> – {currentBook.author}
        </span>
      );
    }
    return (
      <span className="picker-status">
        Bereit für die nächste Ziehung.
      </span>
    );
  };

  return (
    <div className="book-picker">
      <BookScene
        ref={bookSceneRef}
        book={currentBook}
        onAnimationComplete={handleAnimationComplete}
      />

      <button
        onClick={pickRandomBook}
        disabled={isAnimating}
        className="draw-button"
        aria-label={
          currentBook
            ? `Nächstes Buch ziehen. Zuletzt gezogen: ${currentBook.title}`
            : 'Buch ziehen'
        }
      >
        Buch ziehen
      </button>

      <div role="status" aria-live="polite" aria-atomic="true">
        {renderStatus()}
      </div>
    </div>
  );
};
