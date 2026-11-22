# Stage 8: AI log

## Tools
AI Assistant / Gemini

## Conversations
Am discutat despre configurarea rutării client-side cu React Router (paginile Biblioteca, Detaliu `/carti/:id`, Despre și 404), separarea stilurilor în CSS Modules păstrând în `index.css` doar variabilele celor 5 teme și clasele comune, integrarea completă a designului 3D și a funcțiilor din Etapa 7 în noua structură pe pagini și rezolvarea erorilor de build și ESLint (`npm run lint` și `npm run build`).

## Key requests

## 1. Configurarea React Router, Layout-ului comun și a paginilor noi
Asked: Am cerut structurarea aplicației pe mai multe pagini fără reîncărcare, cu antet comun, pagină de detaliu `/carti/:id`, pagină `/despre` și pagină 404, plus atributele `data-testid` necesare verificării automate.
Got: Am învelit aplicația în `<BrowserRouter>` (`main.jsx`), am definit rutele în `App.jsx` și am creat componentele `Layout.jsx` (cu `<NavLink>`, `<Outlet />`, `data-testid="nav"` și selector de teme), `CarteDetaliuPage.jsx` (care citește `id`-ul cu `useParams()`, cere `GET /carti/:id` și tratează stările `loading` și eroare 404), `DesprePage.jsx` și `NotFoundPage.jsx` (`data-testid="not-found"`). În `CarteCard.jsx` am adăugat `<Link data-testid="item-link" to="/carti/:id">`.

## 2. Migrarea designului 3D în CSS Modules
Asked: Am vrut să păstrez tot designul 3D din Etapa 7 (rafturi late din lemn cu etichete de categorie, cărți 3D care se deschid, cele 5 teme vizuale, modalele Jurnal, Oracol, Rezumat 3D și Gramofon) fără să pierd puncte la cerința de CSS Modules.
Got: Am lăsat în `index.css` doar variabilele celor 5 teme, fundalul ambiental și clasele comune (`.panel`, `.btn`, `.btn-danger`, `.badge`, `.error`, `.info`), iar stilurile specifice fiecărei componente și pagini au fost mutate în `.module.css` (`Layout.module.css`, `CarteForm.module.css`, `CarteList.module.css`, `CarteCard.module.css`, `CarteDetaliuPage.module.css`, `CartiPage.module.css`). Am restaurat și chenarul formularului de adăugare (`CarteForm.jsx` + `CarteForm.module.css`).

## 3. Rezolvarea erorilor de import și de sintaxă JSX
Asked: Am raportat eroarea `500 (Internal Server Error)` în Vite, erorile `[UNRESOLVED_IMPORT]` la `npm run build`, erorile de sintaxă JSX (`Unexpected token`, `')' expected`) și apariția comentariilor `/* ... */` ca text vizibil în interfață.
Got: Am corectat căile relative de import din `src/pages/CartiPage.jsx` (folosind `../` în loc de `./` și înlocuind `./App.css` cu `./CartiPage.module.css`) și am curățat toate comentariile din interiorul JSX, lăsând exclusiv comentarii valide `{/* ... */}` pentru a elimina atât erorile de compilare, cât și textele afișate greșit pe ecran.

## 4. Curățarea erorilor și avertismentelor ESLint
Asked: Am rulat `npm run lint` și am cerut rezolvarea erorilor raportate în `CartiPage.jsx` (`rules-of-hooks`, `set-state-in-effect`, `react-hooks/purity`, `no-empty`, `exhaustive-deps`).
Got: Am mutat apelurile de `useState` exclusiv în corpul componentei, am rescris cronometrul Pomodoro și efectul de import playlist astfel încât să nu apeleze `setState` sincron în corpul `useEffect`, am înlocuit `Math.random()` cu o funcție helper bazată pe `crypto.getRandomValues` pentru regula `react-hooks/purity` și am completat blocurile `catch` goale, obținând un build și un lint curate.

## What I learned / what did not work
Am înțeles cum funcționează rutarea client-side în React Router (`BrowserRouter`, `Outlet`, `NavLink`, `useParams`) și de ce pagina de detaliu trebuie să își ceară singură datele de la server după `:id` ca să funcționeze și după `Refresh`. Am văzut în practică faptul că în JSX comentariile `//` sau `/* ... */` fără acolade `{/* ... */}` provoacă fie erori de compilare, fie apar direct ca text pe pagină, iar noile reguli ESLint pentru React (precum `react-hooks/purity` și `set-state-in-effect`) cer o separare strictă între logica pură de randare și efectele asincrone.