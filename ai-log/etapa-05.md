# Stage 5: AI log

## Tools
- AI Assistant / Gemini

## Conversations
Am discutat despre cum să adaug interactivitate aplicației folosind starea locală (`useState`) în React, cum să transmit acțiunile de la componentele copii la părinte și cum să gestionez preferințele vizuale (Dark/Light mode).

## Key requests
### 1. Mutarea datelor în `useState` și actualizări imutabile
- Asked: Am întrebat cum pot face ca datele din array să fie urmărite de React pentru a permite bifarea și ștergerea lor direct din interfață.
- Got: AI-ul mi-a explicat cum să folosesc `useState` în `App.jsx` și cum să adaptez funcțiile `.map()` și `.filter()` din Etapa 2 folosind forma cu funcție `setCarti((prev) => ...)` pentru a respecta regula imutabilității.

### 2. Crearea elementelor controlate și transmiterea evenimentelor
- Asked: Am solicitat asistență pentru a lega funcțiile `handleToggle` și `handleDelete` la butoanele și checkbox-urile din carduri.
- Got: Mi s-a explicat fluxul invers al datelor: `App` deține state-ul și funcțiile, care sunt transmise prin `props` la `CarteList` și ulterior la `CarteCard`. Acolo am transformat input-ul într-un element controlat (cu atributele `checked` și `onChange`) și am evitat apelarea prematură a funcției de ștergere folosind o funcție săgeată `onClick={() => onDelete(carte.id)}`.

### 3. Comutarea temei (Light/Dark Mode)
- Asked: Am cerut instrucțiuni pentru a adăuga un buton de schimbare a temei care să interacționeze direct cu variabilele CSS.
- Got: Am adăugat un nou `useState` care citește inițial preferința sistemului (`window.matchMedia`), iar la click modifică atributul `data-theme` direct pe elementul `<html>`. Am actualizat și CSS-ul pentru a redefini culorile de fundal și text pe baza acestui atribut.

## What I learned / what did not work
Am aprofundat distincția dintre o valoare păstrată în state (cum e lista de cărți sau tema aleasă) și o valoare derivată (cum e numărul de cărți necitite calculat dinamic la fiecare randare). Am înțeles că o funcție transmisă unui eveniment precum `onClick` trebuie să fie o referință (ex. `() => onDelete()`), altfel se va executa imediat ce componenta se încarcă. De asemenea, am observat cum folosirea corectă a variabilelor CSS (`var(--...)`) simplifică enorm implementarea unei teme dinamice fără a duplica zeci de reguli de stil.