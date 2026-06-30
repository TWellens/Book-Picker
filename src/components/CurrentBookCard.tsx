import React from 'react';
import { Book } from '../types/book';
import { CoverImage } from './CoverImage';

interface Props {
  book: Book | null;
  isAnimating: boolean;
}

export const CurrentBookCard: React.FC<Props> = ({ book, isAnimating }) => (
  <section className="current-book">
    <div className="section-label">AKTUELLES BUCH</div>

    {book ? (
      <div className={`current-book__card${isAnimating ? ' current-book__card--animating' : ''}`}>
        <CoverImage title={book.title} author={book.author} size="large" />
        <div className="current-book__info">
          <span className="current-book__badge">COSY CRIME</span>
          <h2 className="current-book__title">{book.title}</h2>
          <p className="current-book__author">— {book.author}</p>
        </div>
      </div>
    ) : (
      <div className="current-book__empty">
        <div className="current-book__empty-icon">?</div>
        <p>Noch kein Buch gezogen.</p>
        <p className="current-book__empty-hint">Klicke auf „BUCH ZIEHEN" um zu starten.</p>
      </div>
    )}
  </section>
);
