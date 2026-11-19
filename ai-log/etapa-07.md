# Stage 7: AI log

## Tools
AI Assistant / Gemini

## Conversations
Am discutat despre implementarea formularului controlat cu validare locală, mutarea tuturor operațiilor CRUD (adăugare, bifare, ștergere) pe server printr-o funcție comună de request, pregătirea aplicației pentru verificarea automată (fișierul `tw.json` și atributele `data-testid`) și integrarea vizuală a formularului în tema de mahon, turcoaz și roz a aplicației BiblioTech.

## Key requests

## 1. Extinderea API-ului și fluxul server-first (POST, PATCH, DELETE)
Asked: Am cerut analiza aplicației față de cerințele Etapei 7 și adaptarea fișierului `api.js` și a funcțiilor din `App.jsx` astfel încât adăugarea, bifarea și ștergerea să persiste în `db.json` după reîncărcarea paginii.
Got: AI-ul a structurat o funcție comună `request` în `frontend/src/api.js` (care adaugă header-ul JSON, verifică `res.ok` și tratează răspunsul `204 No Content`) și a exportat `fetchCarti`, `createCarte`, `updateCarte` și `deleteCarte`. În `App.jsx`, funcțiile `handleAdd`, `handleToggle` și `handleDelete` au fost rescrise asincron, actualizând state-ul abia după confirmarea serverului.

## 2. Crearea formularului controlat (CarteForm.jsx) și validarea locală
Asked: Am solicitat crearea componentei `CarteForm.jsx` cu câmpuri controlate, validare fără `alert()` și protecție la trimitere dublă, integrată direct în pagină.
Got: Mi s-a oferit componenta `CarteForm.jsx` cu `value` și `onChange` pe fiecare câmp, atributul `noValidate`, validare pentru titlu obligatoriu și lungime maximă de 100 de caractere, dezactivarea butonului în timpul trimiterii (`disabled={trimite}`) și golirea câmpurilor doar la salvare reușită.

## 3. Pregătirea pentru verificarea automată (tw.json și data-testid)
Asked: Am trimis codul meu din `CarteCard.jsx` și `CarteList.jsx` și am cerut adăugarea reperelor necesare pentru testele automate, fără a strica designul 3D al cărților.
Got: Am creat fișierul `tw.json` în rădăcina repository-ului (mapând resursa `carti`, câmpurile `titluAutor`, `citita` și obiectul `sample`) și am adăugat atributele `data-testid` (`form`, `form-title`, `form-submit`, `form-error`, `item`, `item-title`, `item-toggle`, `item-delete`, `empty`, `loading`, `error`) și `data-id={carte.id}` în componentele proiectului.

## 4. Rezolvarea erorilor și stilizarea formularului
Asked: Am raportat eroarea de compilare `Identifier 'fetchCarti' has already been declared` din `App.jsx` și am cerut stilizarea formularului pe tema de mahon cu accente distincte de turcoaz și roz (fără chenare albe sau gradienți tip curcubeu), plus scoaterea chenarului exterior `.panel`.
Got: Am eliminat importul duplicat din `App.jsx` consolidând toate funcțiile din `./api.js` pe o singură linie, am eliminat wrapper-ul `<section className="panel">` din jurul formularului și am aplicat stiluri curate în `App.css` cu fundal mahon, contur turcoaz, bandă/buton roz și lumânări decorative.

## What I learned / what did not work
Am înțeles importanța fluxului **întâi serverul, apoi state-ul**: ID-ul elementului nou trebuie să vină din răspunsul serverului (`json-server`), nu generat local în frontend, iar formularul trebuie golit doar după un `await` reușit pentru a nu pierde datele utilizatorului dacă serverul este oprit. De asemenea, am văzut că eroarea `Identifier ... has already been declared` apare la importuri duplicate și că lipsa unui singur atribut `data-testid` sau o nepotrivire în `tw.json` poate face verificarea automată să eșueze.