# Stage 3: AI log

## Tools
- AI Assistant / Gemini

## Conversations
Inițializarea proiectului React folosind Vite, mutarea fișierelor din etapele anterioare, configurarea componentelor de bază și rezolvarea erorilor de rulare ale serverului local.

## Key requests
### 1. Generarea proiectului Vite și curățarea fișierelor
- Asked: I-am cerut asistentului să mă ajute cu pașii pentru crearea proiectului React cu Vite, izolarea fișierelor vechi și structurarea corectă a noului folder `src`.
- Got: AI-ul m-a ghidat să rezolv o eroare de permisiuni (ExecutionPolicy) în PowerShell și mi-a explicat ce fișiere demonstrative trebuie șterse (`favicon.svg`, `index.css`). M-a ajutat să reconstruiesc rapid `main.jsx` și `App.jsx` pentru a muta datele din Etapa 2.

### 2. Depanarea paginii albe și readucerea stilurilor
- Asked: I-am semnalat că aplicația afișează o pagină albă, o eroare 404 în consolă, iar ulterior, după afișarea datelor, interfața își pierduse culorile turcuaz și roz.
- Got: AI-ul a identificat problema importurilor lipsă și a structurii greșite din `index.html`. Ulterior, mi-a furnizat codul JSX actualizat cu `className`-urile necesare și regulile CSS pentru a aplica din nou paleta mea de culori peste layout-ul temporar din Etapa 3.

## What I learned / what did not work
Am întâmpinat probleme la început deoarece browserul afișa o pagină albă din cauza unui import către un fișier șters și a unor dubluri în `index.html`. Am învățat să folosesc consola din browser (F12) pentru a depana erorile 404. De asemenea, am înțeles diferența dintre HTML și JSX (necesitatea folosirii `className`) și de ce CSS-ul din Etapa 1 nu se aplică automat dacă elementele nu mai au aceleași clase definite. Am reținut că serverul Vite (`npm run dev`) trebuie lăsat să ruleze în fundal pentru a vedea modificările.