# Stage 6: AI log

## Tools
AI Assistant / Gemini



## Conversations
Am discutat despre trecerea de la datele hardcodate din aplicație la un backend de tip REST API folosind json-server, structurarea corectă a bazei de date și sincronizarea frontend-ului React cu rutele de rețea.

## Key requests
## 1. Configurarea serverului de API (json-server) și rezolvarea erorilor de sintaxă
Asked: Am întrebat cum pot configura pachetul json-server în fișierul package.json și cum să remediez eroarea de sintaxă EJSONPARSE apărută la adăugarea scriptului personalizat.
Got: AI-ul mi-a arătat structura JSON validă pentru secțiunea "scripts" ("api": "json-server --watch db.json --port 3001"), subliniind importanța plasării corecte a virgulelor și a evitării caracterelor invizibile care strică parsarea fișierului.

## 2. Crearea și popularea bazei de date (db.json)
Asked: Am solicitat ajutor pentru structurarea fișierului db.json cu o colecție masivă de 75 de volume împărțite pe genuri (Sport, Romantism, Clasice, Ficțiune, Dezvoltare).
Got: Mi s-a oferit formatul JSON complet, cu cheia principală "carti" și ID-uri definite ca string-uri între ghilimele (ex. "id": "1") pentru a asigura compatibilitatea strictă cu rutele REST și interogările asincrone.

## 3. Sincronizarea frontend-ului și înțelegerea rutei backend
Asked: Am cerut lămuriri privind motivul pentru care adresa de bază http://localhost:3001 returnează doar acolade goale {} și cum trebuie accesată corect resursa.
Got: Am înțeles că adresa corectă pentru a vizualiza datele furnizate de server este http://localhost:3001/carti și că pentru funcționarea completă a aplicației BiblioTech este necesară rularea simultană a două terminale (unul pentru backend pe portul 3001 și altul pentru interfața React pe portul 5173).

## What I learned / what did not work
Am înțeles diferența dintre rădăcina unui server REST API (care nu are rute definite direct și afișează acolade goale) și rutele specifice create pentru resurse (precum /carti). De asemenea, am învățat că json-server necesită o sintaxă JSON extrem de riguroasă (toate cheile și id-urile între ghilimele duble, fără virgule în plus la sfârșit de listă), altfel serverul refuză să citească datele. Am consolidat importanța arhitecturii de tip client-server și a rulării paralele a mediului de dezvoltare frontend și backend.