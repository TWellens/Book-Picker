import { BookPicker } from './components/BookPicker';
import { BookPoolEditor } from './components/BookPoolEditor';
import { useBookPool } from './hooks/useBookPool';
import './App.css';

function App() {
  const { books, loading, configError, setBooks, resetBooks, importFromText } = useBookPool();

  if (configError) {
    return (
      <div className="app">
        <main className="app-container">
          <div className="config-error">
            <h2>⚠ Konfigurationsfehler</h2>
            <p>Die Supabase-Umgebungsvariablen fehlen.</p>
            <p>Bitte <code>VITE_SUPABASE_URL</code> und <code>VITE_SUPABASE_ANON_KEY</code> in den Vercel-Einstellungen setzen und neu deployen.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <main className="app-container">
        <header className="app-header">
          <h1>Cosy Crime Book Picker</h1>
          <p className="subtitle">Ziehe das nächste Buch für euren Buchclub.</p>
        </header>

        {loading ? (
          <div className="loading-state">
            <p>Buchpool wird geladen…</p>
          </div>
        ) : books.length > 0 ? (
          <>
            <BookPicker books={books} />
            <BookPoolEditor
              books={books}
              onSave={setBooks}
              onReset={resetBooks}
              onImport={importFromText}
            />
          </>
        ) : (
          <div className="empty-state">
            <p>Kein Buchpool vorhanden.</p>
            <button onClick={resetBooks} className="draw-button">
              Standardbücher laden
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
