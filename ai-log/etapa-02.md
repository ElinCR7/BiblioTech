# Stage 2: AI log

## Tools
- AI Assistant / Gemini

## Conversations
Crearea logicii aplicației în JavaScript (array de obiecte) și scrierea funcțiilor de prelucrare a datelor respectând principiul imutabilității, conform ghidului de laborator.

## Key requests
### 1. Implementarea funcțiilor de bază și a imutabilității
- Asked: I-am cerut asistentului să mă ajute să creez fișierul `carti.js` pentru aplicația mea de bibliotecă. I-am specificat că am nevoie de un array de obiecte și de funcțiile pentru adăugare, căutare, ștergere și listare, dar care să respecte regula de a nu modifica datele inițiale.
- Got: AI-ul a generat codul necesar și mi-a arătat cum să folosesc corect metodele specifice array-urilor. A creat testele pentru consolă, incluzând și validarea la adăugare (respingerea unui titlu gol sau a unui format invalid).

## What I learned / what did not work
Am înțeles diferența dintre modificarea pe loc a unui array (folosind `push()`, care aici este interzis) și crearea unuia nou folosind operatorul spread (`...lista, nou`), lucru care va fi esențial pentru funcționarea corectă a React-ului în etapele următoare. De asemenea, am învățat cum se folosesc metodele `.map()` (pentru modificări/listări), `.filter()` (pentru ștergere/căutare) și `.reduce()` (pentru a calcula cel mai mare ID).