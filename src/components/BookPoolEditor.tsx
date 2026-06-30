import React, { useState } from 'react';
import { Book } from '../types/book';

interface BookPoolEditorProps {
  books: Book[];
  onSave: (books: Book[]) => void;
  onReset: () => void;
  onImport: (text: string) => Book[];
}

export const BookPoolEditor: React.FC<BookPoolEditorProps> = ({
  books,
  onSave,
  onReset,
  onImport,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [importText, setImportText] = useState('');
  const [importedBooks, setImportedBooks] = useState<Book[]>([]);

  const handleImport = () => {
    if (importText.trim().length === 0) return;
    const imported = onImport(importText);
    setImportedBooks(imported);
  };

  const handleSaveImported = () => {
    if (importedBooks.length > 0) {
      onSave(importedBooks);
      setImportText('');
      setImportedBooks([]);
    }
  };

  const handleReset = () => {
    if (confirm('Wirklich zum Standard-Buchpool zurücksetzen?')) {
      onReset();
      setImportText('');
      setImportedBooks([]);
    }
  };

  const handleRemoveBook = (id: string) => {
    const updated = books.filter((b) => b.id !== id);
    onSave(updated);
  };

  const handleAddManual = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;

    if (title.trim()) {
      const newBook: Book = {
        id: `manual-${Date.now()}`,
        title,
        author: author || 'Unbekannt',
      };
      onSave([...books, newBook]);
      e.currentTarget.reset();
    }
  };

  return (
    <div className="book-pool-editor">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="editor-toggle-button"
        aria-expanded={isOpen}
      >
        {isOpen ? '▼ Buchpool ausblenden' : '▶ Buchpool verwalten'}
      </button>

      {isOpen && (
        <div className="editor-content">
          <h3>Buchpool-Editor</h3>

          {/* Current books */}
          <div className="current-books">
            <h4>Aktueller Pool ({books.length} Bücher)</h4>
            <div className="books-list">
              {books.map((book) => (
                <div key={book.id} className="book-item">
                  <div>
                    <strong>{book.title}</strong>
                    <br />
                    <small>{book.author}</small>
                  </div>
                  <button
                    onClick={() => handleRemoveBook(book.id)}
                    className="remove-button"
                    title="Buch entfernen"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Import section */}
          <div className="import-section">
            <h4>Bücher importieren</h4>
            <p className="import-help">
              Eine Zeile pro Buch: <code>Titel; Autor</code>
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`Der Tote im Teehaus; Clara Winter\nMord mit Sahne; Edgar Vanille`}
              rows={6}
              className="import-textarea"
            />
            <button onClick={handleImport} className="action-button">
              Importieren prüfen
            </button>

            {importedBooks.length > 0 && (
              <div className="preview-books">
                <h5>Vorschau ({importedBooks.length} Bücher):</h5>
                <ul>
                  {importedBooks.map((book, idx) => (
                    <li key={idx}>
                      {book.title} – {book.author}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleSaveImported}
                  className="action-button action-button--save"
                >
                  Diese Bücher speichern
                </button>
              </div>
            )}
          </div>

          {/* Add manual book */}
          <div className="add-manual-section">
            <h4>Buch manuell hinzufügen</h4>
            <form onSubmit={handleAddManual}>
              <input
                type="text"
                name="title"
                placeholder="Buchtitel"
                required
                className="input-field"
              />
              <input
                type="text"
                name="author"
                placeholder="Autor (optional)"
                className="input-field"
              />
              <button type="submit" className="action-button">
                Hinzufügen
              </button>
            </form>
          </div>

          {/* Reset button */}
          <div className="reset-section">
            <button
              onClick={handleReset}
              className="action-button action-button--reset"
            >
              Zurücksetzen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
