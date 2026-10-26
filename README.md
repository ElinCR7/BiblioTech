# Sistem De Gestionare A Unei Biblioteci

## Data model
| Field | Type | Notes |
|---|---|---|
| Titlu și autor | text | required, max 100 chars |
| Status lectură | boolean | toggled from the list, default false (În așteptare / Finalizată) |
| Tip ediție | fixed values | Cartonată, Broșată, Digitală |
| Gen literar | relation | Ficțiune, Dezvoltare personală, Tehnic, Istorie |
| Cititor | relation | the owner of the item (from week 11) |

Sample data used across all stages:
1. Fizica tristeții, în așteptare, broșată
2. Atomic Habits, finalizată, digitală
3. Stăpânul Inelelor, în așteptare, cartonată

## AI usage
| Tool | Used for |
|---|---|
| AI Agent | Generarea mockup-ului HTML și CSS. Ajustarea schemei de culori la turcuaz și roz. |

Details per stage: see the `ai-log/` folder.

## How to run
Open `index.html` in a browser. No build step, no server.

## Status
- [x] Stage 1: static mockup
- [x] Stage 2: data logic in JavaScript
- [x] Stage 3: Vite and React project
- [x] Stage 4: components rendered from data
- [x] Stage 5: local state and events
- [ ] Stage 6: loading data from a mock API



## Tabelul de verificare (Checklist)

| ID | Requirement | Where (permalink) | How to check |
|---|---|---|---|
| S1-R1 | README: description, fields, sample data, how to run | [README.md](https://github.com/ElinCR7/BiblioTech/blob/main/README.md) | read |
| S1-R2 | AI usage section | [README.md](https://github.com/ElinCR7/BiblioTech/blob/main/README.md) | read |
| S1-R3 | AI log for stage 1 | [ai-log/etapa-01.md](https://github.com/ElinCR7/BiblioTech/blob/main/ai-log/etapa-01.md) | read |
| S1-R4 | header, form (text + select), 3 cards with own data | [index.html#L10-L45](https://github.com/ElinCR7/BiblioTech/blob/8be7a3bd3abfa58105d54ad2b6642345717b8468/index.html#L10-L45) | open the page |
| S1-R5 | finished card looks different | [style.css#L108-L111](https://github.com/ElinCR7/BiblioTech/blob/8be7a3bd3abfa58105d54ad2b6642345717b8468/style.css#L108-L111) | look at the card |
| S1-R6 | 2 columns on desktop, 1 under 700px | [style.css#L143-L145](https://github.com/ElinCR7/BiblioTech/blob/8be7a3bd3abfa58105d54ad2b6642345717b8468/style.css#L143-L145) | resize < 700px |
| S1-R7 | visible focus, readable dark theme | [style.css#L113-L116](https://github.com/ElinCR7/BiblioTech/blob/8be7a3bd3abfa58105d54ad2b6642345717b8468/style.css#L113-L116) | Tab; dark mode |
| S1-R8 | commit "Stage 1" pushed | [Commit GitHub](https://github.com/ElinCR7/BiblioTech/commit/8be7a3bd3abfa58105d54ad2b6642345717b8468) | commit history |

## Stage 2: data logic
Plain JavaScript, no DOM. `carti.js` holds the array and the functions that read and change it. Results are printed in the browser console (F12).

| ID | Requirement | Where (permalink) | How to check |
|---|---|---|---|
| S2-R1 | JS file linked, logs on page load | [index.html#L61](https://github.com/ElinCR7/BiblioTech/blob/main/index.html) | open page, F12 |
| S2-R2 | 3+ items with id, name, state, tag | [carti.js#L2-L6](https://github.com/ElinCR7/BiblioTech/blob/main/carti.js#L2-L6) | read |
| S2-R3 | list, count, search, add, toggle, delete | [carti.js#L64-L78](https://github.com/ElinCR7/BiblioTech/blob/main/carti.js#L64-L78) | console output |
| S2-R4 | add rejects empty name and invalid tag | [carti.js#L81-L82](https://github.com/ElinCR7/BiblioTech/blob/main/carti.js#L81-L82) | last 2 console lines |
| S2-R5 | original array unchanged after add | [carti.js#L71](https://github.com/ElinCR7/BiblioTech/blob/main/carti.js#L71) | console line |
| S2-R6 | README Stage 2 section + AI log | [README.md](https://github.com/ElinCR7/BiblioTech/blob/main/README.md), [ai-log/etapa-02.md](https://github.com/ElinCR7/BiblioTech/blob/main/ai-log/etapa-02.md) | read |
| S2-R7 | commit "Stage 2" pushed | [Commit GitHub](https://github.com/ElinCR7/BiblioTech/commits/main) | commit history |


## Stage 3: Vite and React project
The application was migrated to a React environment using Vite:
The static files from previous stages were moved to a mockup folder.
The data array is temporarily rendered as raw JSON.
Stage 1 styles are preserved and applied through App.css.


| ID | Requirement | Where (permalink) | How to check |
|---|---|---|---|
| S3-R1 | npm run dev starts without errors | [frontend/package.json](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/package.json) | npm install, npm run dev |
| S3-R2 | app name and counter computed from data | [frontend/src/App.jsx#L10-L17](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/src/App.jsx#L10-L17) | edit data, save |
| S3-R3 | data from README, not from the example | [frontend/src/App.jsx#L3-L7](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/src/App.jsx#L3-L7) | compare with README |
| S3-R4 | stage 1 styles reused | [frontend/src/App.css](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/src/App.css) | look at the page |
| S3-R5 | node_modules ignored, build passes | [frontend/.gitignore](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/.gitignore) | npm run build |
| S3-R6 | README Stage 3 section + AI log | [README.md](https://github.com/ElinCR7/BiblioTech/blob/main/README.md), [ai-log/etapa-03.md](https://github.com/ElinCR7/BiblioTech/blob/main/ai-log/etapa-03.md) | read |
| S3-R7 | commit “Stage 3” pushed | [Commit Github](https://github.com/ElinCR7/BiblioTech/commits/main) | commit history |

## Stage 4: components
The list is rendered from the data, through two components:
CarteList receives the whole array and renders one card per item
CarteCard receives a single item through props and displays it

### Tabelul de verificare al Etapei 4

| ID | Requirement | Where (permalink) | How to check |
|---|---|---|---|
| S4-R1 | 2+ components in src/components/ | [frontend/src/components/](https://github.com/ElinCR7/BiblioTech/tree/main/frontend/src/components/) | open folder |
| S4-R2 | card receives data through props | [frontend/src/components/CarteCard.jsx#L11-L15](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/src/components/CarteCard.jsx#L11-L15) | read |
| S4-R3 | map + key={id}, no console warnings | [frontend/src/components/CarteList.jsx#L12-L14](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/src/components/CarteList.jsx#L12-L14) | F12, Console |
| S4-R4 | message for empty list | [frontend/src/components/CarteList.jsx#L4-L6](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/src/components/CarteList.jsx#L4-L6) | set array to [] |
| S4-R5 | state changes the card look | [frontend/src/components/CarteCard.jsx#L15](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/src/components/CarteCard.jsx#L15) | toggle a done flag |
| S4-R6 | README Stage 4 section + AI log | [README.md](https://github.com/ElinCR7/BiblioTech/blob/main/README.md), [ai-log/etapa-04.md](https://github.com/ElinCR7/BiblioTech/blob/main/ai-log/etapa-04.md) | read |
| S4-R7 | commit "Stage 4" pushed | [Commit GitHub](https://github.com/ElinCR7/BiblioTech/commits/main) | commit history |

## Stage 5: local state and events
The list lives in React state. Checking and deleting work from the page,
and the counters in the header follow automatically. A button in the
header switches between light and dark mode. Changes are lost on refresh,
which is what stage 6 and stage 10 fix.

### Tabelul de verificare al Etapei 5

| ID | Requirement | Where (permalink) | How to check |
|---|---|---|---|
| S5-R1 | list kept in useState, in App | [App.jsx#L18](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/src/App.jsx#L18) | read |
| S5-R2 | toggling changes state and card look | [App.jsx#L22-L26](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/src/App.jsx#L22-L26), [CarteCard.jsx#L13-L18](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/src/components/CarteCard.jsx#L13-L18) | click a checkbox |
| S5-R3 | delete removes the item | [App.jsx#L29-L31](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/src/App.jsx#L29-L31), [CarteCard.jsx#L29-L33](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/src/components/CarteCard.jsx#L29-L33) | click Delete |
| S5-R4 | header counter derived, not in state | [App.jsx#L41](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/src/App.jsx#L41) | toggle, watch header |
| S5-R5 | immutable updates (no push, splice, assignment) | [App.jsx#L22-L31](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/src/App.jsx#L22-L31) | read |
| S5-R6 | light/dark toggle: state + data-theme on html | [App.jsx#L19](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/src/App.jsx#L19), [App.css#L16-L31](https://github.com/ElinCR7/BiblioTech/blob/main/frontend/src/App.css#L16-L31) | click the button, both system themes |
| S5-R7 | no console warnings; README + AI log | [README.md](https://github.com/ElinCR7/BiblioTech/blob/main/README.md), [ai-log/etapa-05.md](https://github.com/ElinCR7/BiblioTech/blob/main/ai-log/etapa-05.md) | F12, Console |
| S5-R8 | commit "Stage 5" pushed | [Commit GitHub](https://github.com/ElinCR7/BiblioTech/commits/main) | commit history |