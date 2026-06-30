import React from 'react';
import { Book } from '../types/book';

interface Props {
  book: Book | null;
  isAnimating: boolean;
}

const SPINE_COLORS = ['#2e4a3e','#3a2e1e','#1e2e3a','#3a1e2e','#2e3a1e','#3a3a1e'];

function spineColor(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash * 31 + title.charCodeAt(i)) & 0xffffffff;
  return SPINE_COLORS[Math.abs(hash) % SPINE_COLORS.length];
}

export const CurrentBookCard: React.FC<Props> = ({ book, isAnimating }) => (
  <section className="current-book">
    <div className="section-label">AKTUELLES BUCH</div>

    {book ? (
      <div className={`current-book__card${isAnimating ? ' current-book__card--animating' : ''}`}>
        <div className="current-book__cover" style={{ background: spineColor(book.title) }}>
          <div className="current-book__cover-spine" />
          <div className="current-book__cover-abbr">
            {book.title.replace(/^(Der|Die|Das|Ein|Eine)\s/i, '').substring(0, 3).toUpperCase()}
          </div>
          <div className="current-book__cover-lines">
            <div /><div /><div />
          </div>
        </div>
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
