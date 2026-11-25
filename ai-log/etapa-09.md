# Stage 9: AI log

## Tools
AI Assistant / Gemini

## Conversations
Am discutat despre înlocuirea `json-server` cu un backend propriu scris în Node.js și Express 5 în folderul `backend/`, organizarea rutelor REST pentru `/carti`, validarea datelor pe server cu listă albă de câmpuri, configurarea CORS și tratarea centralizată a erorilor, adaptarea `frontend/src/api.js` pentru a afișa mesajele `{ error: "..." }` de la server, eliminarea completă a `json-server` și rezolvarea erorilor apărute la configurarea proiectului și testarea cu `curl`.

## Key requests

## 1. Crearea proiectului `backend/` și a structurii Express
Asked: Am cerut pașii și codul pentru mutarea API-ului din `json-server` într-un server propriu Node.js + Express 5 în folderul `backend/` (lângă `frontend/`), adaptat pe tema BiblioTech (`/carti`).
Got: Am creat `backend/package.json` (cu `"type": "module"` și scripturile `start` și `dev` cu `node --watch`), `.gitignore`, `.env.example`, `src/app.js` (cu middleware-urile `cors`, `express.json`, ruta `/health`, `/carti`, 404 și tratarea centralizată a erorilor) și `src/server.js` (separat de `app.js`, pe portul `3001`).

## 2. Rutele REST `/carti`, validarea pe server și migrarea datelor
Asked: Am cerut implementarea celor 5 rute REST (`GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id`), validarea pe server sincronizată cu formularul și `tw.json`, precum și păstrarea tuturor celor 65 de cărți din vechiul `db.json`.
Got: Am creat `backend/src/validation.js` (cu `FORMATE`, `GENURI`, `valideazaCarte` cu modul `partial: true` pentru `PATCH`, listă albă de câmpuri și `parseId`) și `backend/src/routes/carti.js` cu funcția helper `gasesteIndex` și toate cele 65 de cărți în memorie (cu `id`-uri numerice și `nextId = 74`).

## 3. Conectarea frontendului și eliminarea `json-server`
Asked: Am cerut actualizarea frontendului pentru a comunica cu noul backend și curățarea completă a dependențelor vechi `json-server`.
Got: Am modificat funcția `request` din `frontend/src/api.js` ca să citească `body.error` din răspunsurile non-2xx, am șters `frontend/db.json`, am eliminat scriptul `"api"` și dependența `"json-server"` din `frontend/package.json` și am rulat `npm install` în `frontend/` pentru actualizarea `package-lock.json`.

## 4. Rezolvarea erorilor de structură, `package.json`, import și `curl`
Asked: Am raportat erorile apărute pe parcurs: `backend/` creat inițial în `frontend/`, `Missing script: "dev"`, `Cannot use import statement outside a module`, `ERR_MODULE_NOT_FOUND` pentru `validation.js` și erorile de codare/linie la testarea `POST` cu `curl` în Git Bash.
Got: Am mutat `backend/` în rădăcina proiectului, am reparat blocul `"scripts"` și am șters cheia duplicată `"type": "commonjs"` din `backend/package.json`, am redenumit `validations.js` în `validation.js` și am rulat comenzile `curl` pe o singură linie (folosind secvențe Unicode `\u0219`, `\u0103` pentru diacritice în terminalul Windows), obținând codurile `200`, `201`, `400`, `404` și `204`.

## What I learned / what did not work
Am înțeles cum funcționează un server Express 5 (ordinea middleware-urilor, separarea `app.js` de `server.js`, ruta de 404 și middleware-ul de erori cu 4 parametri), de ce browserul blochează cererile între porturi diferite (`5173` → `3001`) și cum se rezolvă exclusiv pe server prin CORS. Am văzut de ce validarea pe server este obligatorie (pentru că API-ul poate fi apelat direct cu `curl`, ocolind formularul React) și am învățat să verific rutele independent de interfață înainte de a testa în browser.