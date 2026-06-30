import React, { useState } from 'react';
import { useBookCover } from '../hooks/useBookCover';

const SPINE_COLORS = ['#2e4a3e','#3a2e1e','#1e2e3a','#3a1e2e','#2e3a1e','#3a3a1e'];
function spineColor(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash * 31 + title.charCodeAt(i)) & 0xffffffff;
  return SPINE_COLORS[Math.abs(hash) % SPINE_COLORS.length];
}

interface Props {
  title: string;
  author: string;
  size?: 'large' | 'small';
}

export const CoverImage: React.FC<Props> = ({ title, author, size = 'large' }) => {
  const { cover, loading } = useBookCover(title, author);
  const [imgLoaded, setImgLoaded] = useState(false);

  const abbrLen = size === 'large' ? 3 : 2;
  const abbr = title.replace(/^(Der|Die|Das|Ein|Eine)\s/i, '').substring(0, abbrLen).toUpperCase();
  const bg = spineColor(title);

  return (
    <div className={`cover-wrap cover-wrap--${size}`} style={{ background: bg }}>
      {loading && <div className="cover-skeleton" />}

      {!loading && cover && (
        <img
          src={cover}
          alt={title}
          className={`cover-img${imgLoaded ? ' cover-img--loaded' : ''}`}
          onLoad={() => setImgLoaded(true)}
        />
      )}

      {!loading && !cover && (
        <div className="cover-fallback">
          <div className="cover-fallback__spine" />
          <div className="cover-fallback__abbr">{abbr}</div>
          <div className="cover-fallback__lines">
            <div /><div /><div />
          </div>
        </div>
      )}
    </div>
  );
};
