import { useState, useCallback } from 'react';
import { Book } from './types/book';
import { useBookPool } from './hooks/useBookPool';
import { Header } from './components/Header';
import { CurrentBookCard } from './components/CurrentBookCard';
import { RecentPicks } from './components/RecentPicks';
import { BottomNav, Tab } from './components/BottomNav';
import { BookPoolEditor } from './components/BookPoolEditor';
import knifeImg from './assets/knife1.png';
import './App.css';

function App() {
  const { books, loading, configError, setBooks, resetBooks, importFromText } = useBookPool();
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [recentPicks, setRecentPicks] = useState<Book[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const pickBook = useCallback(() => {
    if (books.length === 0 || isAnimating) return;
    setIsAnimating(true);

    const pool = currentBook && books.length > 1
      ? books.filter((b) => b.id !== currentBook.id)
      : books;
    const picked = pool[Math.floor(Math.random() * pool.length)];

    setTimeout(() => {
      setCurrentBook(picked);
      setRecentPicks((prev) =>
        [picked, ...prev.filter((b) => b.id !== picked.id)].slice(0, 6)
      );
      setIsAnimating(false);
    }, 500);
  }, [books, currentBook, isAnimating]);

  if (configError) {
    return (
      <div className="app">
        <div className="config-error">
          <h2>⚠ Konfigurationsfehler</h2>
          <p>Die Supabase-Umgebungsvariablen fehlen.</p>
          <p>
            Bitte <code>VITE_SUPABASE_URL</code> und{' '}
            <code>VITE_SUPABASE_ANON_KEY</code> in den Vercel-Einstellungen
            setzen und neu deployen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-bg" aria-hidden="true">
        <div className="app-bg__shelf" />
        <div className="app-bg__light" />
        <div className="app-bg__vignette" />
      </div>

      <Header />

      <main className="app-main">
        <section className="hero">
          <h1 className="hero__title">
            <span className="hero__line1">COSY CRIME</span>
            <span className="hero__line2">BOOK PICKER</span>
          </h1>
          <p className="hero__sub">Ziehe dein nächstes Buch</p>

          <button
            className={`pick-btn${isAnimating ? ' pick-btn--pressing' : ''}`}
            onClick={pickBook}
            disabled={loading || books.length === 0 || isAnimating}
          >
            <img
              src={knifeImg}
              className={`pick-btn__knife${isAnimating ? ' pick-btn__knife--slash' : ''}`}
              alt=""
              aria-hidden="true"
            />
            <span>BUCH ZIEHEN</span>
          </button>

          {loading && <p className="status-text">Buchpool wird geladen…</p>}
          {!loading && books.length === 0 && (
            <button className="seed-btn" onClick={resetBooks}>
              Standardbücher laden
            </button>
          )}
        </section>

        {activeTab === 'home' && (
          <>
            <CurrentBookCard book={currentBook} isAnimating={isAnimating} />
            {recentPicks.length > 1 && <RecentPicks picks={recentPicks.slice(1)} />}
          </>
        )}

        {activeTab === 'list' && (
          <BookPoolEditor
            books={books}
            onSave={setBooks}
            onReset={resetBooks}
            onImport={importFromText}
          />
        )}

        {activeTab === 'settings' && (
          <div className="placeholder-panel">
            <div className="section-label">EINSTELLUNGEN</div>
            <p>Demnächst verfügbar.</p>
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
