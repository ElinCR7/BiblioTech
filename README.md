# BiblioTech
Sistem De Gestionare A Unei Biblioteci

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
- [ ] Stage 2: data logic in JavaScript

## Tabelul de verificare (Checklist)

| ID | Requirement | Where (permalink) | How to check |
|---|---|---|---|
| S1-R1 | README: description, fields, sample data, how to run | [README.MD](README.MD) | read |
| S1-R2 | AI usage section | [README.md](README.MD) | read |
| S1-R3 | AI log for stage 1 | [ai-log/etapa-01.md](ai-log/etapa-01.md) | read |
| S1-R4 | header, form (text + select), 3 cards with own data | [index.html#L10-L45](https://github.com/ElinCR7/Sistem-De-Gestionare-A-Unei-Biblioteci/blob/5461e9e4320c12de33cb6d338d8b8c7f3b070886/index.html#L10-L45]) | open the page |
| S1-R5 | finished card looks different | [style.css#L108-L111](https://github.com/ElinCR7/Sistem-De-Gestionare-A-Unei-Biblioteci/blob/5461e9e4320c12de33cb6d338d8b8c7f3b070886/style.css#L108-L111) | look at the card |
| S1-R6 | 2 columns on desktop, 1 under 700px | [style.css#L143-L145](https://github.com/ElinCR7/Sistem-De-Gestionare-A-Unei-Biblioteci/blob/5461e9e4320c12de33cb6d338d8b8c7f3b070886/style.css#L143-L145) | resize < 700px |
| S1-R7 | visible focus, readable dark theme | [style.css#L113-L116](https://github.com/ElinCR7/Sistem-De-Gestionare-A-Unei-Biblioteci/blob/5461e9e4320c12de33cb6d338d8b8c7f3b070886/style.css#L113-L116) | Tab; dark mode |
| S1-R8 | commit "Stage 1" pushed | [Commit GitHub](https://github.com/ElinCR7/Sistem-De-Gestionare-A-Unei-Biblioteci/commit/5461e9e4320c12de33cb6d338d8b8c7f3b070886) | commit history | 
