import React from 'react';
import { Book } from '../types/book';
import { CoverImage } from './CoverImage';

interface Props {
  picks: Book[];
}

export const RecentPicks: React.FC<Props> = ({ picks }) => (
  <section className="recent-picks">
    <div className="section-label">LETZTE AUSWAHLEN</div>
    <div className="recent-picks__list">
      {picks.map((book) => (
        <div key={book.id} className="recent-picks__item">
          <CoverImage title={book.title} author={book.author} size="small" />
          <div className="recent-picks__meta">
            <div className="recent-picks__title">{book.title}</div>
            <div className="recent-picks__author">{book.author}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);
