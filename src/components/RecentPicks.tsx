import React from 'react';
import { Book } from '../types/book';

interface Props {
  picks: Book[];
}

const SPINE_COLORS = ['#2e4a3e','#3a2e1e','#1e2e3a','#3a1e2e','#2e3a1e','#3a3a1e'];
function spineColor(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash * 31 + title.charCodeAt(i)) & 0xffffffff;
  return SPINE_COLORS[Math.abs(hash) % SPINE_COLORS.length];
}

export const RecentPicks: React.FC<Props> = ({ picks }) => (
  <section className="recent-picks">
    <div className="section-label">LETZTE AUSWAHLEN</div>
    <div className="recent-picks__list">
      {picks.map((book) => (
        <div key={book.id} className="recent-picks__item">
          <div className="recent-picks__spine" style={{ background: spineColor(book.title) }}>
            <div className="recent-picks__spine-bar" />
            <span className="recent-picks__abbr">
              {book.title.replace(/^(Der|Die|Das|Ein|Eine)\s/i, '').substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="recent-picks__meta">
            <div className="recent-picks__title">{book.title}</div>
            <div className="recent-picks__author">{book.author}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);
