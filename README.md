# 🔪 Cosy Crime Book Picker 📚

Eine kleine, statische Web-App für einen Cosy-Crime-Buchclub. Wähle zufällig das nächste Buch für euren Buchclub mit einer unterhaltsamen Pixel-Art-Animation!

## Features

- 🎲 Zufällige Buchauswahl aus einem verwaltbaren Pool
- 🔪 Animierte Messer-/Brieföffner-Animation mit GSAP
- 💥 Pixel-Art-Splash-Effekte und Blutpartikel
- 📱 Vollständig responsive und Mobile-freundlich
- ♿ Barrierefreiheit mit ARIA-Labels
- 💾 Buchpool-Speicherung in localStorage
- ✏️ Eingebauter Editor für den Buchpool
- 🖥️ Kein Backend erforderlich – statische Web-App
- 🚀 Readiness für Vercel-Deployment

## Installation

### Voraussetzungen

- Node.js (v16 oder höher)
- npm oder yarn

### Setup

```bash
# Repository klonen oder Projekt-Verzeichnis öffnen
cd cosy-crime-book-picker

# Dependencies installieren
npm install

# Development-Server starten
npm run dev
```

Die App öffnet sich automatisch unter `http://localhost:5173`.

## Scripts

- **`npm run dev`**: Startet den Development-Server mit Hot Module Replacement
- **`npm run build`**: Erstellt einen optimierten Produktions-Build im `dist/`-Verzeichnis
- **`npm run preview`**: Zeigt den Produktions-Build lokal an
- **`npm run lint`**: Führt TypeScript-Typprüfungen durch

## Verwendung

### Buch ziehen

1. Klicke auf den Button **"Buch ziehen"**
2. Ein zufälliges Buch wird aus dem Pool ausgewählt
3. Eine Animation zeigt ein Messer, das in das aufgeschlagene Buch fährt
4. Der Buchtitel und Autor erscheinen mit einem Splash-Effekt
5. Das gezogene Buch wird unter dem Bild angezeigt

### Buchpool bearbeiten

1. Klicke auf **"▶ Editor anzeigen"** am Ende der Seite
2. Folgende Optionen stehen zur Verfügung:

   - **Aktueller Buchpool**: Liste aller Bücher mit Möglichkeit, einzelne zu löschen
   - **Bücher importieren**: Importiere eine Liste von Büchern im Format:
     ```
     Der Tote im Teehaus; Clara Winter
     Mord mit Sahne; Edgar Vanille
     ```
     Wenn kein Autor angegeben wird, wird "Unbekannt" verwendet.
   - **Buch manuell hinzufügen**: Einzelne Bücher können mit Titel und Autor eingegeben werden
   - **Zurücksetzen**: Setzt den Buchpool auf die Standard-Bücher zurück

### Datenformat

Jedes Buch besteht aus:

```typescript
{
  id: string;
  title: string;
  author: string;
}
```

Der Buchpool wird in `localStorage` unter dem Key `cosy-crime-books` gespeichert.

## Technologie

- **Vite**: Moderner Build-Tool für schnelle Entwicklung
- **React**: UI-Framework
- **TypeScript**: Statische Typisierung
- **GSAP**: Animation Library für komplexe Animationssequenzen
- **CSS**: Modernes CSS mit clamp() für responsive Design
- **SVG**: Für Knife- und Splash-Effekte

## Pixelated Design

Die App nutzt:
- `image-rendering: pixelated` für 8-Bit-Look
- CSS Courier New Monospace für Text
- Einfache SVG-Formen statt Bilddateien
- Keine externen Asset-Dateien erforderlich

## Deployment auf Vercel

### Schritt 1: GitHub Repository erstellen

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/cosy-crime-book-picker.git
git branch -M main
git push -u origin main
```

### Schritt 2: Mit Vercel verbinden

1. Gehe auf [vercel.com](https://vercel.com)
2. Melde dich an oder erstelle ein Konto
3. Klicke "New Project"
4. Verbinde dein GitHub Repository
5. Vercel erkennt Vite automatisch
6. Bestätige folgende Einstellungen:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Schritt 3: Deploy

Klicke "Deploy". Nach kurzer Zeit ist die App live!

Jeder Push zu `main` erstellt automatisch einen neuen Deploy.

## Barrierefreiheit

- Alle Buttons haben klare, aussagekräftige Labels
- ARIA-Live-Regions für dynamische Inhalte
- Keyboard-Navigation vollständig unterstützt
- Ausreichender Farbkontrast
- Keine Abhängigkeit von reiner visueller Rückmeldung

## Projektstruktur

```
src/
  main.tsx              # Einstiegspunkt
  App.tsx               # Hauptkomponente
  App.css               # Globale Styles
  types/
    book.ts             # TypeScript-Typen
  data/
    defaultBooks.ts     # Standard-Buchpool
  hooks/
    useBookPool.ts      # Hook für Buchpool-Verwaltung
  components/
    BookPicker.tsx      # Hauptkomponente für Buchauswahl
    BookScene.tsx       # Szene mit Animationen
    BookPoolEditor.tsx  # Editor für Buchpool-Verwaltung
```

## Lizenz

MIT

## Autor

Erstellt mit ❤️ für Cosy Crime Buchclubs
