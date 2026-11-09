import { useEffect, useState } from "react"; // Importăm hook-urile React pentru efecte secundare și stări (memorie)
import "./App.css"; // Importăm fișierul CSS cu toate stilurile și animațiile 3D
import CarteList from "./components/CarteList.jsx"; // Importăm componenta care afișează lista de cărți pe un raft
import { fetchCarti } from "./api.js"; // Importăm funcția care preia cărțile de la serverul backend

function temaInitiala() { // Funcție care stabilește tema la deschiderea aplicației
  const temaSistem = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; // Verifică dacă sistemul de operare e pe Dark Mode
  document.documentElement.dataset.theme = temaSistem; // Setează atributul data-theme="dark" sau "light" pe tagul <html>
  return temaSistem; // Returnează tema găsită
} // Închidem funcția temaInitiala

export default function App() { // Definim componenta principală App
  const [carti, setCarti] = useState([]); // Starea care păstrează lista tuturor cărților din bibliotecă
  const [loading, setLoading] = useState(true); // Starea care indică dacă datele încă se încarcă de la server
  const [error, setError] = useState(null); // Starea care păstrează mesajul de eroare dacă serverul nu răspunde
  
  const [tema, setTema] = useState(temaInitiala); // Starea pentru tema curentă (dark sau light)
  const [filtru, setFiltru] = useState("toate"); // Starea pentru tab-ul activ ("toate", "disponibile" sau "imprumutate")
  const [grupare, setGrupare] = useState("gen"); // Starea pentru gruparea rafturilor ("gen" sau "rating")
  const [cautare, setCautare] = useState(""); // Starea care reține textul scris în bara de căutare

  const [inBiblioteca, setInBiblioteca] = useState(false); // Starea care reține dacă utilizatorul a trecut de ușile 3D
  const [seDeschide, setSeDeschide] = useState(false); // Starea care pornește animația de deschidere a ușilor 3D

  const [tranzitieRaft, setTranzitieRaft] = useState("idle"); // Starea care controlează animația 3D la schimbarea tab-urilor ("idle", "out", "in")

  useEffect(() => { // Hook care rulează o singură dată la pornirea aplicației pentru a descărca cărțile
    let ignore = false; // Variabilă de protecție în caz că utilizatorul închide pagina înainte de răspuns

    async function load() { // Funcție asincronă care comunică cu serverul
      try { // Încercăm să luăm datele
        const data = await fetchCarti(); // Așteptăm lista de cărți de la API
        if (!ignore) setCarti(data); // Salvăm cărțile în starea aplicației
      } catch (err) { // Dacă apare o eroare de rețea
        if (!ignore) setError(err.message); // Salvăm mesajul erorii pentru a-l afișa pe ecran
      } finally { // Se execută la final indiferent dacă a reușit sau a dat eroare
        if (!ignore) setLoading(false); // Oprim mesajul de încărcare
      } // Închidem blocul finally
    } // Închidem funcția load
    load(); // Apelăm funcția de încărcare

    return () => { ignore = true; }; // Funcție de curățare la demontarea componentei
  }, []); // Array-ul gol [] garantează că efectul rulează doar la primul render

  useEffect(() => { // Hook care urmărește mișcarea mouse-ului pentru efectul de lumânare
    function handleMouseMove(e) { // Funcție apelată automat la fiecare mișcare a cursorului
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`); // Actualizează variabila CSS --mouse-x cu poziția orizontală a mouse-ului
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`); // Actualizează variabila CSS --mouse-y cu poziția verticală a mouse-ului
    } // Închidem funcția handleMouseMove

    window.addEventListener("mousemove", handleMouseMove); // Atașăm ascultătorul de mișcare a mouse-ului pe întreaga fereastră
    return () => window.removeEventListener("mousemove", handleMouseMove); // Dezabonăm ascultătorul când se închide aplicația
  }, []); // Rulează o singură dată la montare

  function handleIntra() { // Funcție apelată când apeși pe butonul "Intră în Bibliotecă"
    setSeDeschide(true); // Pornește animația de rotire a ușilor 3D
    setTimeout(() => { // Setează o întârziere de 1.8 secunde
      setInBiblioteca(true); // După ce ușile s-au deschis, elimină portalul de pe ecran
    }, 1800); // 1800 milisecunde = 1.8 secunde
  } // Închidem funcția handleIntra

  function schimbaFiltruCuTranzitie(noulFiltru) { // Funcție care schimbă tab-ul activ cu o animație 3D între săli
    if (noulFiltru === filtru || tranzitieRaft !== "idle") return; // Nu face nimic dacă ești deja pe acel tab sau dacă o animație e în curs
    setTranzitieRaft("out"); // Pornește animația de îndepărtare a rafturilor vechi
    setTimeout(() => { // Așteaptă 360ms să se îndepărteze rafturile
      setFiltru(noulFiltru); // Schimbă filtrul propriu-zis
      setTranzitieRaft("in"); // Pornește animația de apropiere a noilor rafturi
      setTimeout(() => { // Așteaptă 550ms să se termine apropierea
        setTranzitieRaft("idle"); // Readuce starea animației pe repaus ("idle")
      }, 550); // 550 milisecunde
    }, 360); // 360 milisecunde
  } // Închidem funcția schimbaFiltruCuTranzitie

  function schimbaGrupareCuTranzitie(nouaGrupare) { // Funcție care schimbă ordonarea (Gen / Stele) cu aceeași animație 3D
    if (nouaGrupare === grupare || tranzitieRaft !== "idle") return; // Ignoră clickul dacă opțiunea e deja selectată
    setTranzitieRaft("out"); // Trimite rafturile actuale în spate
    setTimeout(() => { // Așteaptă 360ms
      setGrupare(nouaGrupare); // Actualizează gruparea (după gen sau după rating)
      setTranzitieRaft("in"); // Aduce noile rafturi în față
      setTimeout(() => { // Așteaptă 550ms
        setTranzitieRaft("idle"); // Oprește clasa de tranziție
      }, 550); // 550 milisecunde
    }, 360); // 360 milisecunde
  } // Închidem funcția schimbaGrupareCuTranzitie

  function handleToggle(id) { // Funcție care bifează sau debifează o carte ca fiind împrumutată
    setCarti((prev) => // Luăm lista anterioară de cărți
      prev.map((c) => (c.id === id ? { ...c, citita: !c.citita } : c)) // Inversăm proprietatea "citita" doar pentru cartea cu ID-ul apăsat
    ); // Închidem actualizarea stării
  } // Închidem funcția handleToggle

  function handleDelete(id) { // Funcție care elimină o carte de pe raft
    setCarti((prev) => prev.filter((c) => c.id !== id)); // Păstrează în listă toate cărțile mai puțin cea cu ID-ul șters
  } // Închidem funcția handleDelete

  function handleTema() { // Funcție care comută între tema întunecată și cea luminoasă
    const noua = tema === "dark" ? "light" : "dark"; // Dacă e dark o face light, și invers
    setTema(noua); // Salvează noua temă în starea React
    document.documentElement.dataset.theme = noua; // Actualizează atributul pe <html> pentru ca CSS-ul să schimbe culorile
  } // Închidem funcția handleTema

  const cartiAfisate = carti.filter((carte) => { // Filtrăm cărțile care trebuie afișate pe rafturi în acest moment
    const potrivireFiltru = // Verificăm dacă trece de tab-ul selectat
      filtru === "toate" ? true : filtru === "disponibile" ? !carte.citita : carte.citita; // Logica pentru toate / disponibile / împrumutate

    const termen = cautare.trim().toLowerCase(); // Luăm textul din bara de căutare și îl facem cu litere mici
    const potrivireCautare = // Verificăm dacă textul căutat se găsește în datele cărții
      !termen || // Dacă bara de căutare e goală, cartea trece automat
      (carte.titluAutor && carte.titluAutor.toLowerCase().includes(termen)) || // Verifică dacă titlul/autorul conține textul căutat
      (carte.gen && carte.gen.toLowerCase().includes(termen)); // Verifică dacă genul cărții conține textul căutat

    return potrivireFiltru && potrivireCautare; // Păstrează cartea doar dacă respectă și tab-ul și căutarea
  }); // Închidem filtrarea cărților

  const categoriiUnice = grupare === "gen" // Construim lista de rafturi (fie pe genuri, fie pe număr de stele)
    ? [...new Set(cartiAfisate.map((c) => c.gen))].sort() // Extrage genurile fără duplicate și le sortează alfabetic
    : [...new Set(cartiAfisate.map((c) => c.rating))].sort((a, b) => b - a); // Extrage notele fără duplicate și le sortează descrescător (5 -> 1)

  const imprumutateCount = carti.filter((c) => c.citita).length; // Numără câte cărți sunt împrumutate în total
  const disponibileCount = carti.length - imprumutateCount; // Calculează câte cărți sunt disponibile prin scădere

  return ( // Returnăm structura vizuală a întregii aplicații
    <> {/* Fragment React care grupează toate elementele fără a crea un div suplimentar */}
      <div className="ambient-library-bg" aria-hidden="true"></div> {/* Fundalul fix cu fotografia bibliotecii */}
      <div className="ambient-candle-glows" aria-hidden="true"></div> {/* Halourile ambientale de lumină caldă din colțuri */}
      <div className="cosmic-stars" aria-hidden="true"></div> {/* Particulele de praf auriu care plutesc în sus */}
      <div className="bottom-warm-vignette" aria-hidden="true"></div> {/* Lumina caldă de la baza ferestrei la scroll */}
      <div className="mouse-candle-light" aria-hidden="true"></div> {/* Lumina de lumânare care urmărește cursorul mouse-ului */}

      {!inBiblioteca && ( /* Afișează portalul cu uși doar până când utilizatorul intră în bibliotecă */
        <div className={`landing-portal ${seDeschide ? "opening" : ""}`}> {/* Containerul portalului de intrare */}
          <div className="portal-inner-light" aria-hidden="true"></div> {/* Raza de lumină care apare când ușile se deschid */}

          <div className="door door-left" aria-hidden="true"> {/* Ușa masivă din stânga */}
            <div className="door-panel-top"></div> {/* Panoul sculptat de sus al ușii stângi */}
            <div className="door-panel-bottom"></div> {/* Panoul sculptat de jos al ușii stângi */}
            <div className="door-handle"></div> {/* Mânerul auriu al ușii stângi */}
          </div> {/* Închidem ușa stângă */}

          <div className="door door-right" aria-hidden="true"> {/* Ușa masivă din dreapta */}
            <div className="door-panel-top"></div> {/* Panoul sculptat de sus al ușii drepte */}
            <div className="door-panel-bottom"></div> {/* Panoul sculptat de jos al ușii drepte */}
            <div className="door-handle"></div> {/* Mânerul auriu al ușii drepte */}
          </div> {/* Închidem ușa dreaptă */}

          <div className="portal-center-content"> {/* Chenarul central de bun venit de pe uși */}
            <div className="portal-candle" aria-hidden="true"> {/* Lumânarea animată de pe chenarul de intrare */}
              <span className="flacara-3d"></span> {/* Flacăra lumânării */}
              <span className="fitil-3d"></span> {/* Fitilul lumânării */}
              <span className="ceara-3d"></span> {/* Corpul de ceară al lumânării */}
            </div> {/* Închidem lumânarea portalului */}
            
            <h1 className="portal-title">BiblioTech</h1> {/* Titlul mare de pe ecranul de start */}
            <p className="portal-subtitle">Sanctuarul Cărților și al Poveștilor</p> {/* Subtitlul de pe ecranul de start */}
            
            <button className="enter-library-btn" onClick={handleIntra} disabled={seDeschide}> {/* Butonul care deschide ușile */}
              <span className="btn-key-icon">🗝️</span> Intră în Bibliotecă {/* Iconița cheie și textul butonului */}
            </button> {/* Închidem butonul */}
          </div> {/* Închidem chenarul central */}
        </div> /* Închidem portalul de start */
      )} {/* Închidem condiția de afișare a portalului */}

      <div className={`main-app-wrapper ${seDeschide ? "app-entering" : ""} ${inBiblioteca ? "app-entered" : ""}`}> {/* Învelișul site-ului principal */}
        
        <nav className="top-navbar"> {/* Bara de navigație de sus (rămâne fixată la scroll) */}
          <div className="navbar-inner"> {/* Containerul care aliniază elementele din navbar */}
            <div className="navbar-brand"> {/* Zona din stânga cu lumânarea și numele site-ului */}
              <div className="lumanare-realista navbar-candle" aria-hidden="true"> {/* Lumânarea 3D din meniu */}
                <span className="aura-lumanare"></span> {/* Haloul luminos din jurul flăcării */}
                <span className="flacara-3d"></span> {/* Flacăra care pâlpâie */}
                <span className="fitil-3d"></span> {/* Fitilul negru */}
                <span className="picatura-ceara"></span> {/* Picătura de ceară prelinsă */}
                <span className="ceara-3d"></span> {/* Corpul lumânării */}
                <span className="suport-auriu"></span> {/* Baza aurie a sfeșnicului */}
              </div> {/* Închidem lumânarea din navbar */}
              <div> {/* Grupăm numele și subtitlul logo-ului */}
                <span className="brand-name">BiblioTech</span> {/* Numele aplicației */}
                <span className="brand-tag">Arhivă Digitală</span> {/* Eticheta mică de sub nume */}
              </div> {/* Închidem textul logo-ului */}
            </div> {/* Închidem zona brandului */}

            <div className="navbar-search"> {/* Zona centrală cu bara de căutare */}
              <span className="search-icon" aria-hidden="true">🔍</span> {/* Iconița lupă */}
              <input /* Câmpul de text pentru căutare */
                type="text" /* Tipul text */
                placeholder="Caută după titlu, autor sau colecție..." /* Textul ajutător când câmpul e gol */
                value={cautare} /* Leagă valoarea câmpului de starea "cautare" */
                onChange={(e) => setCautare(e.target.value)} /* Actualizează starea la fiecare tastă apăsată */
                aria-label="Caută cărți" /* Etichetă de accesibilitate */
              /> {/* Închidem inputul de căutare */}
              {cautare && ( /* Afișează butonul X doar dacă utilizatorul a scris ceva */
                <button className="clear-search-btn" onClick={() => setCautare("")} title="Șterge căutarea"> {/* Buton care golește căutarea */}
                  ✕ {/* Simbolul X */}
                </button> /* Închidem butonul X */
              )} {/* Închidem condiția */}
            </div> {/* Închidem bara de căutare */}

            <div className="navbar-actions"> {/* Zona din dreapta cu statistici și butonul de temă */}
              <div className="nav-stats-pills"> {/* Grupul pastilelor cu numărătoarea cărților */}
                <span className="stat-pill"> {/* Pastila pentru numărul total de cărți */}
                  📚 Total: <strong>{carti.length}</strong> {/* Afișează totalul cărților */}
                </span> {/* Închidem prima pastilă */}
                <span className="stat-pill stat-pill-pink"> {/* Pastila roz pentru cărțile împrumutate/citite */}
                  🔮 Citite: <strong>{imprumutateCount}</strong> {/* Afișează numărul celor citite */}
                </span> {/* Închidem a doua pastilă */}
              </div> {/* Închidem grupul statisticilor */}

              <button className="theme-toggle" onClick={handleTema} aria-pressed={tema === "dark"}> {/* Butonul care schimbă tema */}
                {tema === "dark" ? "☀️ Luminos" : "🌙 Întunecat"} {/* Textul butonului în funcție de tema activă */}
              </button> {/* Închidem butonul de temă */}
            </div> {/* Închidem acțiunile din navbar */}
          </div> {/* Închidem interiorul navbar-ului */}
        </nav> {/* Închidem bara de navigație */}

        <main className="site-main-container"> {/* Containerul principal al conținutului paginii */}
          <header className="app-header"> {/* Bannerul Hero cu imaginea bibliotecii și lumânări */}
            <div className="header-bg-image" aria-hidden="true"></div> {/* Fotografia din spatele bannerului care se mișcă lent */}
            <div className="header-warm-overlay" aria-hidden="true"></div> {/* Filtrul cald de lumină peste banner */}
            
            <div className="header-candles-group" aria-hidden="true"> {/* Grupul celor 3 lumânări din colțul bannerului */}
              <div className="candle-3d candle-tall"> {/* Lumânarea înaltă */}
                <span className="flame"></span> {/* Flacăra */}
                <span className="wick"></span> {/* Fitilul */}
                <span className="wax"></span> {/* Ceara */}
              </div> {/* Închidem lumânarea înaltă */}
              <div className="candle-3d candle-medium"> {/* Lumânarea medie */}
                <span className="flame"></span> {/* Flacăra */}
                <span className="wick"></span> {/* Fitilul */}
                <span className="wax"></span> {/* Ceara */}
              </div> {/* Închidem lumânarea medie */}
              <div className="candle-3d candle-short"> {/* Lumânarea scundă */}
                <span className="flame"></span> {/* Flacăra */}
                <span className="wick"></span> {/* Fitilul */}
                <span className="wax"></span> {/* Ceara */}
              </div> {/* Închidem lumânarea scundă */}
            </div> {/* Închidem grupul lumânărilor */}

            <div className="header-content"> {/* Textul centrat de pe bannerul Hero */}
              <span className="hero-eyebrow">✦ SALA DE LECTURĂ & COLECȚII ✦</span> {/* Inscripția aurie de deasupra titlului */}
              <h1>Sanctuarul Literar BiblioTech</h1> {/* Titlul principal al paginii */}
              <p>Explorează volumele în ediție 3D, răsfoiește manuscrisele și gestionează-ți propria bibliotecă</p> {/* Descrierea sub titlu */}
            </div> {/* Închidem textul bannerului */}
          </header> {/* Închidem bannerul Hero */}

          <section className="panel"> {/* Panoul central din sticlă caldă care conține filtrele și rafturile */}
            
            <div className="catalog-control-bar"> {/* Bara cu tab-urile de filtrare și comutatorul de ordonare */}
              <div className="library-nav-tabs" role="tablist"> {/* Grupul celor 3 tab-uri (Marea Sală / Disponibile / Împrumutate) */}
                <button /* Butonul pentru afișarea tuturor cărților */
                  className={`lib-tab tab-all ${filtru === "toate" ? "active" : ""}`} /* Adaugă clasa "active" dacă e selectat */
                  onClick={() => schimbaFiltruCuTranzitie("toate")} /* La click, schimbă pe "toate" cu animație 3D */
                >
                  <span className="tab-icon">🏛️</span> {/* Iconița tab-ului */}
                  <span className="tab-label">Marea Sală</span> {/* Numele tab-ului */}
                  <span className="tab-count">{carti.length}</span> {/* Numărul total de cărți */}
                </button> {/* Închidem primul tab */}

                <button /* Butonul pentru afișarea cărților disponibile */
                  className={`lib-tab tab-available ${filtru === "disponibile" ? "active" : ""}`} /* Clasa activă pentru disponibile */
                  onClick={() => schimbaFiltruCuTranzitie("disponibile")} /* Schimbă filtrul pe "disponibile" */
                >
                  <span className="tab-icon">🕯️</span> {/* Iconița lumânare */}
                  <span className="tab-label">Disponibile</span> {/* Textul tab-ului */}
                  <span className="tab-count">{disponibileCount}</span> {/* Numărul cărților disponibile */}
                </button> {/* Închidem al doilea tab */}

                <button /* Butonul pentru afișarea cărților împrumutate */
                  className={`lib-tab tab-borrowed ${filtru === "imprumutate" ? "active" : ""}`} /* Clasa activă pentru împrumutate */
                  onClick={() => schimbaFiltruCuTranzitie("imprumutate")} /* Schimbă filtrul pe "imprumutate" */
                >
                  <span className="tab-icon">🔮</span> {/* Iconița glob de cristal */}
                  <span className="tab-label">Împrumutate</span> {/* Textul tab-ului */}
                  <span className="tab-count">{imprumutateCount}</span> {/* Numărul cărților împrumutate */}
                </button> {/* Închidem al treilea tab */}
              </div> {/* Închidem grupul tab-urilor */}

              <div className="grupare-magic-switch"> {/* Zona din dreapta pentru ordonarea rafturilor */}
                <span className="grupare-label">Ordonează rafturile:</span> {/* Eticheta text */}
                <div className="magic-pill-box"> {/* Cutia rotunjită a comutatorului */}
                  <button /* Butonul pentru ordonare după Gen */
                    className={grupare === "gen" ? "pill-option active" : "pill-option"} /* Marchează activ dacă e pe "gen" */
                    onClick={() => schimbaGrupareCuTranzitie("gen")} /* Schimbă gruparea pe "gen" */
                  >
                    📜 După Gen {/* Textul butonului */}
                  </button> {/* Închidem butonul După Gen */}
                  <button /* Butonul pentru ordonare după Stele */
                    className={grupare === "rating" ? "pill-option active" : "pill-option"} /* Marchează activ dacă e pe "rating" */
                    onClick={() => schimbaGrupareCuTranzitie("rating")} /* Schimbă gruparea pe "rating" */
                  >
                    ⭐ După Stele {/* Textul butonului */}
                  </button> {/* Închidem butonul După Stele */}
                </div> {/* Închidem cutia comutatorului */}
              </div> {/* Închidem zona de ordonare */}
            </div> {/* Închidem bara de control */}
            
            {loading && <p className="info">Se aprind lumânările și se încarcă rafturile...</p>} {/* Mesaj afișat cât timp se încarcă datele */}
            
            {error && ( /* Mesaj afișat dacă apare o eroare la conectarea cu serverul */
              <p className="error"> {/* Paragraful stilizat pentru eroare */}
                Eroare de conexiune la server: {error}. Asigură-te că ai pornit <code>json-server</code> pe portul 3001! {/* Textul erorii */}
              </p> /* Închidem paragraful erorii */
            )} {/* Închidem condiția de eroare */}

            {!loading && !error && ( /* Dacă datele s-au încărcat fără erori, afișăm rafturile */
              <div className="sala-rafturi-viewport"> {/* Fereastra cu perspectivă 3D pentru sala rafturilor */}
                <div className={`portal-flash-wave ${tranzitieRaft !== "idle" ? "active" : ""}`} aria-hidden="true"></div> {/* Valul luminos la schimbarea sălii */}

                <div className={`grupuri-genuri wing-transition-${tranzitieRaft}`}> {/* Containerul care execută animația 3D de zoom in/out */}
                  {categoriiUnice.map((categorie) => { /* Parcurgem fiecare categorie pentru a crea câte un raft */
                    const cartiDinCategorie = cartiAfisate.filter((c) => /* Selectăm doar cărțile care aparțin acestui raft */
                      grupare === "gen" ? c.gen === categorie : c.rating === categorie /* Comparăm după gen sau după rating */
                    ); /* Închidem filtrarea pe raft */
                    return ( /* Returnăm structura unui raft complet */
                      <div key={categorie} className="gen-sectiune"> {/* Secțiunea unui raft individual */}
                        <div className="raft-eticheta-wrapper"> {/* Bara de deasupra raftului cu plăcuța de titlu și numărul de volume */}
                          <h3 className="gen-titlu"> {/* Plăcuța cu numele categoriei și lumânarea */}
                            {grupare === "rating" /* Dacă ordonăm după stele */
                              ? `${categorie} Stele ${'★'.repeat(categorie)}` /* Afișăm ex: "5 Stele ★★★★★" */
                              : categorie /* Altfel afișăm numele genului (ex: "Fantezie") */
                            }
                          </h3> {/* Închidem titlul raftului */}
                          <span className="raft-vol-count"> {/* Insigna din dreapta cu numărul de cărți de pe acel raft */}
                            {cartiDinCategorie.length} {cartiDinCategorie.length === 1 ? "volum" : "volume"} pe raft {/* Acordul singular/plural */}
                          </span> {/* Închidem insigna cu numărul de volume */}
                        </div> {/* Închidem bara etichetei */}
                        
                        <CarteList /* Componenta care desenează raftul de lemn și cărțile de pe el */
                          carti={cartiDinCategorie} /* Trimitem lista cărților de pe acest raft */
                          onToggle={handleToggle} /* Trimitem funcția de bifare */
                          onDelete={handleDelete} /* Trimitem funcția de ștergere */
                        /> {/* Închidem componenta CarteList */}
                      </div> /* Închidem secțiunea raftului */
                    ); /* Închidem return-ul din map */
                  })} {/* Închidem parcurgerea categoriilor */}
                  
                  {cartiAfisate.length === 0 && ( /* Dacă nu există nicio carte care să corespundă căutării/filtrului */
                    <div className="empty-state-box"> {/* Cutia care anunță că nu s-au găsit cărți */}
                      <span className="empty-icon">🕯️</span> {/* Iconița lumânare */}
                      <p className="empty">Nu am găsit niciun manuscris în această aripă a bibliotecii.</p> {/* Mesajul informativ */}
                      {cautare && ( /* Dacă utilizatorul avea ceva scris în bara de căutare */
                        <button className="reset-filter-btn" onClick={() => setCautare("")}> {/* Buton pentru ștergerea rapidă a căutării */}
                          Resetează căutarea {/* Textul butonului */}
                        </button> /* Închidem butonul */
                      )} {/* Închidem condiția */}
                    </div> /* Închidem cutia stării goale */
                  )} {/* Închidem verificarea listei goale */}
                </div> {/* Închidem grupul genurilor */}
              </div> /* Închidem viewport-ul 3D */
            )} {/* Închidem afișarea rafturilor */}
          </section> {/* Închidem panoul central */}
        </main> {/* Închidem containerul main */}

        <footer className="site-footer"> {/* Subsolul paginii (Footer) */}
          <div className="footer-inner"> {/* Containerul care aliniază elementele din subsol */}
            <div className="footer-brand"> {/* Partea stângă a subsolului */}
              <span>🕯️ <strong>BiblioTech</strong> — Sistem Digital de Gestiune și Lectură</span> {/* Textul de copyright/brand */}
            </div> {/* Închidem partea stângă */}
            <div className="footer-stats"> {/* Partea dreaptă a subsolului cu rezumatul arhivei */}
              <span>Arhivă activă: {carti.length} volume</span> {/* Totalul volumelor */}
              <span>•</span> {/* Punct separator */}
              <span>Disponibile la raft: {disponibileCount}</span> {/* Totalul celor disponibile */}
              <span>•</span> {/* Punct separator */}
              <span>Împrumutate: {imprumutateCount}</span> {/* Totalul celor împrumutate */}
            </div> {/* Închidem statisticile din subsol */}
          </div> {/* Închidem interiorul subsolului */}
        </footer> {/* Închidem subsolul paginii */}
      </div> {/* Închidem wrapperul aplicației */}
    </> // Închidem fragmentul React
  ); // Închidem return-ul componentei App
} // Închidem funcția App