# Stage 4: AI log

## Tools
- AI Assistant / Gemini

## Conversations
Discuții despre cum se împarte interfața monolit din Etapa 3 în componente React separate, cum funcționează transmiterea datelor prin `props` și cum se randează o listă de elemente folosind metoda `.map()`.

## Key requests
### 1. Crearea componentelor și transmiterea datelor
- Asked: L-am întrebat pe asistent cum pot transforma structura JSX statică într-o componentă reutilizabilă pentru cardurile cărților și cum îi pot trimite datele din fișierul principal `App.jsx`.
- Got: AI-ul mi-a explicat conceptul de `props` și mi-a arătat un exemplu de destructurare a acestora direct în parametrii funcției. M-a ghidat să creez componenta `CarteCard` care primește un obiect `carte` și îl afișează.

### 2. Randarea listei și importanța atributului `key`
- Asked: Am întrebat cum pot parcurge array-ul de cărți pentru a afișa automat câte un card pentru fiecare element, fără să duplic codul.
- Got: Mi-a sugerat să folosesc metoda `.map()` în interiorul noii componente `CarteList`. De asemenea, mi-a explicat de ce React are nevoie de un atribut unic `key` pe fiecare element randat din listă (folosind `id`-ul din date) pentru a evita erorile din consola browserului și a optimiza randarea.

### 3. Randarea condiționată pentru clasele CSS
- Asked: I-am cerut sfaturi despre cum să aplic o clasă CSS diferită în funcție de starea cărții (citită / necitită) pentru a respecta culorile (turcuaz/roz) din Etapa 1.
- Got: Asistentul mi-a arătat cum să folosesc operatorul ternar direct în atributul `className` (ex: `carte.citita ? "carte-card done" : "carte-card"`) și cum să generez dinamic numele claselor pentru etichetele de format.

## What I learned / what did not work
Am înțeles că o componentă React este practic o funcție JavaScript care returnează bucăți de interfață (JSX). Inițial, a trebuit să mă obișnuiesc cu fluxul datelor, care circulă mereu de sus în jos, de la componenta părinte (`App`) către componentele copil (`CarteList` și `CarteCard`). Am învățat să verific mereu consola browserului (F12) pentru a mă asigura că listele mele sunt randate corect, cu atributele `key` prezente.