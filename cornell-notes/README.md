# Cornell Notes App 📓

A personal note-taking web app using the Cornell method.
Built with plain HTML, CSS, and JavaScript — no frameworks, no build tools.

## How to run

1. Open the `cornell-notes` folder in VS Code
2. Install the **Live Server** extension (by Ritwick Dey) if you haven't
3. Right-click `index.html` → **Open with Live Server**

That's it. Your notes are saved in the browser's localStorage — they persist
across sessions automatically.

## Project structure

```
cornell-notes/
├── index.html       ← Page structure (HTML)
├── css/
│   └── style.css    ← All styles (CSS)
├── js/
│   └── app.js       ← All logic (JavaScript)
└── README.md        ← This file
```

## What you'll learn by reading this code

### HTML (index.html)
- Semantic elements: `<header>`, `<section>`, `<label>`
- `id` and `data-*` attributes
- CSS Grid for the Cornell layout
- How `<textarea>` works

### CSS (style.css)
- CSS custom properties (variables) for theming
- `grid-template-columns` and `grid-template-rows`
- Dark mode with `@media (prefers-color-scheme: dark)`
- Responsive design with `@media (max-width: 640px)`
- Transitions for hover effects

### JavaScript (app.js)
- `localStorage` — saving data in the browser
- DOM manipulation — `getElementById`, `innerHTML`, `addEventListener`
- Array methods — `filter()`, `map()`, `find()`, `sort()`
- `crypto.randomUUID()` — generating unique IDs
- `Intl.DateTimeFormat` — formatting dates
- XSS prevention with `escapeHtml()`

## Ideas to extend this project

- [ ] Export a note to PDF (use `window.print()` with a print stylesheet)
- [ ] Markdown rendering in the notes panel
- [ ] Keyboard shortcut: Ctrl+S to save
- [ ] Colour-code notes by module
- [ ] Import/export notes as JSON
