import { useEffect, useRef, useState } from "react"; // Importă hook-urile React pentru efecte, referințe și state
import CarteList from "../components/CarteList.jsx"; // Importă componenta raftului 3D de cărți
import CarteForm from "../components/CarteForm.jsx"; // Importă formularul de adăugare a unei cărți
import { fetchCarti, createCarte, deleteCarte, updateCarte } from "../api.js"; // Importă funcțiile care comunică cu API-ul
import "./CartiPage.module.css"; // Încarcă stilurile dedicate paginii CartiPage

function numarAleator() { // Generează un număr aleator în [0, 1) (evită avertismentul react-hooks/purity pentru Math.random)
  const arr = new Uint32Array(1); // Alocă un vector cu un întreg fără semn pe 32 de biți
  crypto.getRandomValues(arr); // Populează vectorul cu o valoare aleatorie criptografică
  return arr[0] / 4294967296; // Împarte la 2^32 pentru a obține o fracție între 0 și 1
} // Închide numarAleator

function temaInitiala() { // Determină tema vizuală la pornirea aplicației
  const salvata = localStorage.getItem("bibliotech_tema"); // Verifică dacă utilizatorul a salvat deja o temă
  if (salvata) { // Dacă există o temă salvată
    document.documentElement.dataset.theme = salvata; // Aplică atributul data-theme pe <html>
    return salvata; // Returnează tema salvată
  } // Închide if
  const temaSistem = window.matchMedia("(prefers-color-scheme: dark)").matches // Verifică tema sistemului de operare
    ? "dark" // Folosește dark dacă sistemul e pe dark mode
    : "light"; // Altfel folosește light
  document.documentElement.dataset.theme = temaSistem; // Aplică tema pe <html>
  return temaSistem; // Returnează tema detectată
} // Închide temaInitiala

const LINK_PLAYLIST_AUTOMAT = ""; // Link opțional pentru import automat de playlist YouTube la pornire

const PLAYLIST_INITIAL = [ // Lista predefinită de piese (5 ambientale interne + 10 YouTube)
  { id: "relax-1", nume: "Pian Cald de Lectură", artist: "Orchestra Sanctuarului", subtitlu: "Nocturnă Liniștitoare • Audio Intern", icon: "🎹", categorie: "relax" }, // Piesă internă 1
  { id: "relax-2", nume: "Lofi Study Chords", artist: "BiblioTech Beats", subtitlu: "Acorduri Calde de Seară • Audio Intern", icon: "☕", categorie: "relax" }, // Piesă internă 2
  { id: "relax-3", nume: "Harpă & Ambianță din Sanctuar", artist: "Ansamblul Celtic", subtitlu: "Armonii Acustice • Audio Intern", icon: "🌿", categorie: "relax" }, // Piesă internă 3
  { id: "relax-4", nume: "Meditație la Lumina Lumânării", artist: "Zen Arhivar", subtitlu: "Zen Pad Ambiental • Audio Intern", icon: "🕯️", categorie: "relax" }, // Piesă internă 4
  { id: "relax-5", nume: "Reverie Astrală", artist: "Observatorul Cosmic", subtitlu: "Dreamy Rhodes • Audio Intern", icon: "🌌", categorie: "relax" }, // Piesă internă 5
  { id: "bKDdT_nyP54", nume: "Smack That", artist: "Akon ft. Eminem", subtitlu: "YouTube Audio Stream", icon: "🔥", categorie: "youtube" }, // Piesă YouTube 1
  { id: "uelHwf8o7_U", nume: "Love The Way You Lie", artist: "Eminem ft. Rihanna", subtitlu: "YouTube Audio Stream", icon: "🎤", categorie: "youtube" }, // Piesă YouTube 2
  { id: "5qm8PH4xAss", nume: "In Da Club", artist: "50 Cent", subtitlu: "YouTube Audio Stream", icon: "🎧", categorie: "youtube" }, // Piesă YouTube 3
  { id: "YR5ApYxkU-U", nume: "Another Brick In The Wall", artist: "Pink Floyd", subtitlu: "YouTube Audio Stream", icon: "🎸", categorie: "youtube" }, // Piesă YouTube 4
  { id: "fJ9rUzIMcZQ", nume: "Bohemian Rhapsody", artist: "Queen", subtitlu: "YouTube Audio Stream", icon: "👑", categorie: "youtube" }, // Piesă YouTube 5
  { id: "4NRXx6U8ABQ", nume: "Blinding Lights", artist: "The Weeknd", subtitlu: "YouTube Audio Stream", icon: "✨", categorie: "youtube" }, // Piesă YouTube 6
  { id: "JGwWNGJdvx8", nume: "Shape of You", artist: "Ed Sheeran", subtitlu: "YouTube Audio Stream", icon: "🎶", categorie: "youtube" }, // Piesă YouTube 7
  { id: "kJQP7kiw5Fk", nume: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", subtitlu: "YouTube Audio Stream", icon: "🌴", categorie: "youtube" }, // Piesă YouTube 8
  { id: "RgKAFK5djSk", nume: "See You Again", artist: "Wiz Khalifa ft. Charlie Puth", subtitlu: "YouTube Audio Stream", icon: "🎹", categorie: "youtube" }, // Piesă YouTube 9
  { id: "60ItHLz5WEA", nume: "Faded", artist: "Alan Walker", subtitlu: "YouTube Audio Stream", icon: "💿", categorie: "youtube" }, // Piesă YouTube 10
]; // Închide PLAYLIST_INITIAL

function separaArtistSiTitlu(titluBrut, canalDefault = "YouTube") { // Curăță și separă artistul de titlul unei piese YouTube
  if (!titluBrut) return { nume: "Melodie YouTube", artist: canalDefault }; // Returnează valori implicite dacă lipsește titlul
  const curat = titluBrut // Pornește curățarea șirului
    .replace(/\(Official.*?\)/gi, "") // Elimină "(Official ...)"
    .replace(/\[Official.*?\]/gi, "") // Elimină "[Official ...]"
    .replace(/\(Lyrics.*?\)/gi, "") // Elimină "(Lyrics ...)"
    .replace(/\(Audio.*?\)/gi, "") // Elimină "(Audio ...)"
    .trim(); // Elimină spațiile de la capete

  if (curat.includes(" - ")) { // Dacă titlul conține separatorul " - "
    const [parteArtist, ...restTitlu] = curat.split(" - "); // Separă prima parte ca artist și restul ca titlu
    return { // Returnează obiectul formatat
      artist: parteArtist.trim() || canalDefault, // Artistul extras
      nume: restTitlu.join(" - ").trim() || curat, // Titlul piesei
    }; // Închide return
  } // Închide if
  return { // Dacă nu există " - ", folosește numele canalului ca artist
    nume: curat, // Titlul curățat
    artist: canalDefault.replace(" - Topic", "").trim(), // Elimină sufixul "- Topic"
  }; // Închide return
} // Închide separaArtistSiTitlu

function extragePieseDinHtmlPlaylist(html) { // Extrage lista de videoclipuri dintr-o pagină HTML de playlist YouTube
  const pieseGasite = []; // Acumulator pentru piesele găsite
  const idVazute = new Set(); // Set pentru a preveni duplicatele
  const matchJson = // Caută obiectul ytInitialData în codul HTML
    html.match(/var ytInitialData\s*=\s*(\{.*?\});<\/script>/s) || // Variantă standard
    html.match(/ytInitialData\s*=\s*(\{.*?\});/s); // Variantă alternativă

  if (matchJson && matchJson[1]) { // Dacă a găsit blocul JSON
    try { // Încearcă parsarea JSON-ului
      const data = JSON.parse(matchJson[1]); // Transformă textul în obiect JS
      function cautaRecursiv(obiect) { // Parcurge recursiv arborele JSON
        if (!obiect || typeof obiect !== "object") return; // Se oprește la valori primitive
        const renderer = obiect.playlistVideoRenderer || obiect.playlistPanelVideoRenderer; // Caută nodurile de piesă
        if (renderer && renderer.videoId && !idVazute.has(renderer.videoId)) { // Dacă piesa are ID nou
          idVazute.add(renderer.videoId); // Înregistrează ID-ul
          const titluBrut = // Extrage titlul piesei
            renderer.title?.runs?.[0]?.text || // Format runs
            renderer.title?.simpleText || // Format simpleText
            "Melodie YouTube"; // Fallback
          const canal = // Extrage numele canalului
            renderer.shortBylineText?.runs?.[0]?.text || // Format scurt
            renderer.longBylineText?.runs?.[0]?.text || // Format lung
            "YouTube"; // Fallback
          const { nume, artist } = separaArtistSiTitlu(titluBrut, canal); // Separă artistul și titlul
          pieseGasite.push({ // Adaugă piesa în rezultat
            id: renderer.videoId, // ID-ul YouTube
            nume, // Numele piesei
            artist, // Numele artistului
            subtitlu: "Importat din Playlist YouTube", // Etichetă descriptivă
            icon: "🎵", // Iconiță
            categorie: "youtube", // Categoria YouTube
            custom: true, // Marchează piesa ca importată (se poate șterge)
          }); // Închide push
        } // Închide if
        Object.values(obiect).forEach(cautaRecursiv); // Continuă recursiv pe toate proprietățile
      } // Închide cautaRecursiv
      cautaRecursiv(data); // Pornește căutarea
    } catch { // Prinde eventuale erori de JSON malformat
      // Ignoră erorile de parsare a HTML-ului extern
    } // Închide catch
  } // Închide if
  return pieseGasite; // Returnează lista extrasă
} // Închide extragePieseDinHtmlPlaylist

const MELODII_RELAX = { // Acordurile și tempo-ul pentru cele 5 piese sintetizate cu Web Audio API
  "relax-1": { tempo: 2200, wave: "sine", acorduri: [[261.63, 329.63, 392.0, 523.25], [220.0, 261.63, 329.63, 440.0], [174.61, 220.0, 261.63, 349.23], [196.0, 246.94, 293.66, 392.0]] }, // Pian cald
  "relax-2": { tempo: 1900, wave: "triangle", acorduri: [[293.66, 349.23, 440.0, 523.25], [196.0, 246.94, 329.63, 392.0], [261.63, 329.63, 392.0, 493.88], [220.0, 261.63, 329.63, 392.0]] }, // Lofi study
  "relax-3": { tempo: 1600, wave: "sine", acorduri: [[329.63, 392.0, 493.88, 659.25], [261.63, 329.63, 392.0, 523.25], [293.66, 369.99, 440.0, 587.33], [246.94, 329.63, 392.0, 493.88]] }, // Harpă
  "relax-4": { tempo: 2800, wave: "sine", acorduri: [[174.61, 261.63, 329.63, 440.0], [196.0, 293.66, 349.23, 440.0], [220.0, 329.63, 392.0, 523.25], [164.81, 246.94, 329.63, 392.0]] }, // Meditație
  "relax-5": { tempo: 2400, wave: "triangle", acorduri: [[261.63, 311.13, 392.0, 466.16], [207.65, 261.63, 311.13, 392.0], [233.08, 293.66, 349.23, 466.16], [196.0, 246.94, 293.66, 392.0]] }, // Reverie astrală
}; // Închide MELODII_RELAX

const CITATE_SANCTUAR = [ // Citatele care pot fi schimbate în bannerul Hero
  "„O cameră fără cărți este ca un corp fără suflet.” — Marcus Tullius Cicero", // Citat 1
  "„Talentul fără muncă grea nu înseamnă nimic. Dedicarea scrie istoria.” — Cristiano Ronaldo (CR7)", // Citat 2
  "„Cărțile sunt oglinzi: vezi în ele doar ceea ce ai deja înăuntrul tău.” — Carlos Ruiz Zafón", // Citat 3
  "„Nu există prieten mai loial decât o carte deschisă la lumina lumânării.” — Ernest Hemingway", // Citat 4
]; // Închide CITATE_SANCTUAR

const PAGINI_REZUMAT_CR7 = [ // Cele 3 deschideri (6 pagini) pentru ediția specială CR7
  { // Paginile 1–2
    stangaTitlu: "Capitolul I • Rădăcinile din Madeira", // Titlu pagina 1
    stangaSubtitlu: "Funchal, Portugalia — Drumul unui visător", // Subtitlu pagina 1
    stangaText: "Născut pe insula vulcanică Madeira, într-un cartier modest din Funchal, Cristiano Ronaldo dos Santos Aveiro a crescut cu mingea lipită de ghete pe străzile înguste din Santo António...", // Conținut pagina 1
    stangaCitat: "„Plângeam aproape în fiecare zi de dorul familiei, dar știam că fotbalul este destinul meu.”", // Citat pagina 1
    dreaptaTitlu: "Capitolul I • Scânteia de la Lisabona", // Titlu pagina 2
    dreaptaSubtitlu: "Seara care a convins întregul stadion", // Subtitlu pagina 2
    dreaptaText: "În august 2003, la inaugurarea stadionului José Alvalade împotriva lui Manchester United, puștiul de 18 ani a făcut șah-mat apărarea englezilor...", // Conținut pagina 2
    dreaptaStat: "⚡ 2003: Transferul la Manchester United.", // Casetă statistică pagina 2
  }, // Închide paginile 1–2
  { // Paginile 3–4
    stangaTitlu: "Capitolul II • Era Galactică (CR7)", // Titlu pagina 3
    stangaSubtitlu: "Old Trafford & Santiago Bernabéu", // Subtitlu pagina 3
    stangaText: "Sub îndrumarea lui Sir Alex Ferguson, Cristiano s-a transformat dintr-un dribler spectaculos într-o mașinărie completă de goluri...", // Conținut pagina 3
    stangaCitat: "„În mintea mea, nu sunt doar un jucător. Muncesc în fiecare zi ca să fiu cel mai bun din istorie.”", // Citat pagina 3
    dreaptaTitlu: "Capitolul II • Regele Ligii Campionilor", // Titlu pagina 4
    dreaptaSubtitlu: "450 de goluri în 438 de meciuri la Real Madrid", // Subtitlu pagina 4
    dreaptaText: "La Madrid, CR7 a rescris toate legile fizicii și ale statisticii...", // Conținut pagina 4
    dreaptaStat: "🏆 5 Baloane de Aur • 5 Trofee Champions League.", // Casetă statistică pagina 4
  }, // Închide paginile 3–4
  { // Paginile 5–6
    stangaTitlu: "Capitolul III • Gloria cu Portugalia", // Titlu pagina 5
    stangaSubtitlu: "EURO 2016 & Națiunea Lusitană", // Subtitlu pagina 5
    stangaText: "Dincolo de trofeele de club, coroana supremă a venit în 2016, când a condus Portugalia către primul trofeu major...", // Conținut pagina 5
    stangaCitat: "„Recordurile nu le urmăresc eu — recordurile mă urmăresc pe mine!”", // Citat pagina 5
    dreaptaTitlu: "Capitolul III • Moștenirea Nemuritoare", // Titlu pagina 6
    dreaptaSubtitlu: "Peste 900 de goluri oficiale", // Subtitlu pagina 6
    dreaptaText: "Acest volum surprinde esența filozofiei CR7: somn calculat la secundă, antrenamente suplimentare, refuzul plafonării...", // Conținut pagina 6
    dreaptaStat: "👑 Lecția cărții: Obsesia pentru perfecțiune învinge întotdeauna talentul leneș.", // Casetă statistică pagina 6
  }, // Închide paginile 5–6
]; // Închide PAGINI_REZUMAT_CR7

export default function CartiPage() { // Componenta paginii principale afișată pe ruta "/"
  const [carti, setCarti] = useState([]); // Lista cărților încărcate de la server
  const [loading, setLoading] = useState(true); // Indică dacă cererea inițială GET este în curs
  const [error, setError] = useState(null); // Reține mesajul de eroare dacă API-ul eșuează

  const [tema, setTema] = useState(temaInitiala); // Tema activă dintre cele 5 teme
  const [filtru, setFiltru] = useState("toate"); // Filtru de stare: toate / disponibile / imprumutate
  const [grupare, setGrupare] = useState("gen"); // Criteriu de grupare a rafturilor: gen / rating
  const [cautare, setCautare] = useState(""); // Textul de căutare din navbar
  const [indexCitat, setIndexCitat] = useState(0); // Indexul citatului afișat în Hero

  const [inBiblioteca, setInBiblioteca] = useState(true); // Pornește direct în bibliotecă (nu blochează testele)
  const [seDeschide, setSeDeschide] = useState(false); // Stare pentru animația ușilor 3D
  const [tranzitieRaft, setTranzitieRaft] = useState("idle"); // Stare animație rafturi: idle / out / in

  const [ambientActiv, setAmbientActiv] = useState(false); // Indică dacă muzica ambientală este pornită
  const audioCtxRef = useRef(null); // Referință persistentă la Web AudioContext
  const ambientIntervalRef = useRef(null); // Referință la setInterval-ul muzicii ambientale

  const [playlistPauza, setPlaylistPauza] = useState(() => { // Inițializează playlist-ul combinând piesele implicite cu cele din localStorage
    try { // Încearcă citirea din localStorage
      const salvate = JSON.parse(localStorage.getItem("bibliotech_playlist_custom") || "[]"); // Parsează piesele custom
      const idInitiale = new Set(PLAYLIST_INITIAL.map((p) => p.id)); // ID-urile pieselor implicite
      const doarNoi = salvate.filter((p) => !idInitiale.has(p.id)); // Păstrează doar piesele noi
      return [...PLAYLIST_INITIAL, ...doarNoi]; // Returnează lista combinată
    } catch { // În caz de JSON invalid în localStorage
      return PLAYLIST_INITIAL; // Revine la lista implicită
    } // Închide catch
  }); // Închide useState playlistPauza

  const [arataModalMuzica, setArataModalMuzica] = useState(false); // Controlează vizibilitatea modalului Gramofon
  const [cautareMuzica, setCautareMuzica] = useState(""); // Textul de filtrare în playlist
  const [linkImportPlaylist, setLinkImportPlaylist] = useState(""); // Linkul YouTube introdus de utilizator
  const [seImportaPlaylist, setSeImportaPlaylist] = useState(false); // Indică dacă importul YouTube rulează
  const [mesajImport, setMesajImport] = useState(""); // Mesajul de feedback după import
  const [selectId, setSelectId] = useState(PLAYLIST_INITIAL[0].id); // ID-ul piesei selectate în modal
  const [piesaActivaId, setPiesaActivaId] = useState(""); // ID-ul piesei care cântă în prezent
  const [ytEmbedUrl, setYtEmbedUrl] = useState(""); // URL-ul iframe-ului YouTube ascuns
  const [muzicaPauzaActiva, setMuzicaPauzaActiva] = useState(false); // Indică dacă muzica de pauză rulează
  const synthIntervalRef = useRef(null); // Referință la setInterval-ul sintetizatorului de pauză

  const [timerPornit, setTimerPornit] = useState(false); // Indică dacă clepsidra Pomodoro rulează
  const [secundeRamas, setSecundeRamas] = useState(25 * 60); // Secundele rămase din sesiunea de 25 min

  const [carteJurnal, setCarteJurnal] = useState(null); // Cartea deschisă în modalul Jurnal (sau null)
  const [jurnalRating, setJurnalRating] = useState(5); // Evaluarea editată în Jurnal
  const [jurnalPagina, setJurnalPagina] = useState(0); // Pagina curentă editată în Jurnal
  const [jurnalTotalPagini, setJurnalTotalPagini] = useState(320); // Total pagini editat în Jurnal
  const [jurnalCitat, setJurnalCitat] = useState(""); // Citatul editat în Jurnal
  const [jurnalNotite, setJurnalNotite] = useState(""); // Notițele editate în Jurnal

  const [arataCardShare, setArataCardShare] = useState(false); // Controlează modalul Card de Colecționar
  const [mesajCopiat, setMesajCopiat] = useState(false); // Indică confirmarea copierii în clipboard
  const [carteOracol, setCarteOracol] = useState(null); // Cartea aleasă de Oracol (sau null)

  const [carteRezumat, setCarteRezumat] = useState(null); // Cartea deschisă în modalul Rezumat 3D
  const [spreadIndex, setSpreadIndex] = useState(0); // Indexul deschiderii curente (0, 1 sau 2)
  const [sweepDir, setSweepDir] = useState(""); // Direcția animației de răsfoire (sweep-next / sweep-prev)

  useEffect(() => { // Efect de montare: încarcă lista de cărți de la serverul API
    let ignore = false; // Previne actualizarea state-ului dacă utilizatorul pleacă de pe pagină
    async function load() { // Funcție asincronă de încărcare
      try { // Încearcă cererea GET /carti
        const data = await fetchCarti(); // Primește tabloul de cărți
        if (!ignore) { // Verifică dacă pagina e încă montată
          const jurnaleSalvate = JSON.parse(localStorage.getItem("bibliotech_jurnale") || "{}"); // Citește jurnalele locale
          const cartiCuJurnal = data.map((c) => (jurnaleSalvate[c.id] ? { ...c, ...jurnaleSalvate[c.id] } : c)); // Îmbină datele
          setCarti(cartiCuJurnal); // Salvează cărțile în state
        } // Închide if
      } catch (err) { // Dacă serverul nu răspunde
        if (!ignore) setError(err.message); // Salvează mesajul de eroare
      } finally { // Indiferent de rezultat
        if (!ignore) setLoading(false); // Oprește indicatorul de încărcare
      } // Închide try-catch-finally
    } // Închide load
    load(); // Declanșează încărcarea
    return () => { // Curățare la demontare
      ignore = true; // Marchează efectul ca ignorat
    }; // Închide return
  }, []); // Rulează o singură dată la montare

  function salveazaPieseNoiInPlaylist(pieseNoi) { // Adaugă piese noi în playlist fără duplicate și salvează în localStorage
    if (!pieseNoi || pieseNoi.length === 0) return 0; // Iese dacă lista e goală
    let adaugateCount = 0; // Numără piesele adăugate
    setPlaylistPauza((prev) => { // Actualizează lista precedentă
      const idExistente = new Set(prev.map((p) => p.id)); // Colectează ID-urile existente
      const filtrate = pieseNoi.filter((p) => { // Păstrează doar piesele cu ID nou
        if (!p.id || idExistente.has(p.id)) return false; // Exclude duplicatele
        idExistente.add(p.id); // Adaugă ID-ul în set
        return true; // Păstrează piesa
      }); // Închide filter
      adaugateCount = filtrate.length; // Reține câte piese au intrat
      const nouaLista = [...prev, ...filtrate]; // Creează lista nouă
      const doarCustom = nouaLista.filter((p) => p.custom); // Filtrează piesele custom
      localStorage.setItem("bibliotech_playlist_custom", JSON.stringify(doarCustom)); // Persistă în browser
      return nouaLista; // Returnează lista actualizată
    }); // Închide setPlaylistPauza
    return adaugateCount; // Returnează numărul de piese adăugate
  } // Închide salveazaPieseNoiInPlaylist

  async function importaDeLaLinkYoutube(inputRaw, silent = false) { // Importă melodii dintr-un link YouTube sau playlist public
    if (!inputRaw) return; // Nu face nimic dacă inputul e gol
    if (!silent) { // Dacă nu e mod silențios, afișează statusul
      setSeImportaPlaylist(true); // Marchează începutul importului
      setMesajImport("⏳ Se scanează link-ul și se extrag melodiile..."); // Afișează mesaj de progres
    } // Închide if
    try { // Încearcă extragerea
      const pieseColectate = []; // Lista pieselor extrase
      const linkuri = inputRaw.split(/[\s,\n]+/).map((s) => s.trim()).filter(Boolean); // Împarte linkurile separate prin spațiu/virgulă
      for (const link of linkuri) { // Parcurge fiecare link
        let listId = ""; // ID playlist
        let videoId = ""; // ID video
        if (link.includes("list=")) listId = link.split("list=")[1]?.split("&")[0]; // Extrage list=
        if (link.includes("youtu.be/")) videoId = link.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0]; // Format scurt
        else if (link.includes("watch?v=")) videoId = link.split("watch?v=")[1]?.split("&")[0]; // Format lung
        else if (/^[a-zA-Z0-9_-]{11}$/.test(link)) videoId = link; // Doar ID de 11 caractere

        if (listId && !listId.startsWith("RD")) { // Dacă e un playlist public
          const targetUrl = `https://www.youtube.com/playlist?list=${listId}`; // Construiește URL-ul playlist-ului
          const proxyUrls = [ // Proxy-uri CORS publice pentru a citi HTML-ul
            `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`, // Proxy 1
            `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`, // Proxy 2
          ]; // Închide proxyUrls
          for (const proxy of proxyUrls) { // Încearcă fiecare proxy pe rând
            try { // Încearcă fetch
              const res = await fetch(proxy); // Cere HTML-ul
              if (res.ok) { // Dacă a răspuns cu 200 OK
                const html = await res.text(); // Citește textul HTML
                const extrase = extragePieseDinHtmlPlaylist(html); // Extrage piesele din ytInitialData
                if (extrase.length > 0) { // Dacă a găsit piese
                  pieseColectate.push(...extrase); // Le adaugă în listă
                  break; // Oprește bucla de proxy-uri
                } // Închide if
              } // Închide if res.ok
            } catch { // Dacă proxy-ul nu răspunde
              // Încearcă următorul proxy disponibil
            } // Închide catch
          } // Închide for proxy
        } // Închide if listId

        if (videoId && pieseColectate.length === 0) { // Dacă e un singur videoclip
          try { // Cere titlul și autorul prin noembed
            const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`); // Request metadate
            const info = await res.json(); // Parsează JSON
            const { nume, artist } = separaArtistSiTitlu( // Separă artistul de titlu
              info.title || `Melodie YouTube (${videoId})`, // Titlu brut
              info.author_name || "YouTube" // Canal implicit
            ); // Închide separaArtistSiTitlu
            pieseColectate.push({ // Adaugă piesa
              id: videoId, // ID video
              nume, // Titlu
              artist, // Artist
              subtitlu: "Importat automat de pe YouTube", // Subtitlu
              icon: "🎵", // Iconiță
              categorie: "youtube", // Categorie
              custom: true, // Marcaj custom
            }); // Închide push
          } catch { // Dacă noembed eșuează
            pieseColectate.push({ // Adaugă piesă cu titlu generic
              id: videoId, // ID video
              nume: `Melodie YouTube (${videoId})`, // Titlu generic
              artist: "Colecția Personală", // Artist generic
              subtitlu: "YouTube Audio Stream", // Subtitlu
              icon: "🎵", // Iconiță
              categorie: "youtube", // Categorie
              custom: true, // Marcaj custom
            }); // Închide push
          } // Închide catch
        } // Închide if videoId
      } // Închide for linkuri
      if (pieseColectate.length > 0) { // Dacă au fost colectate piese
        salveazaPieseNoiInPlaylist(pieseColectate); // Salvează în state și localStorage
        setSelectId(pieseColectate[0].id); // Selectează prima piesă importată
        if (!silent) { // Afișează confirmarea
          setMesajImport(`✨ S-au importat ${pieseColectate.length} piese în playlist!`); // Mesaj succes
          setLinkImportPlaylist(""); // Golește câmpul
        } // Închide if
      } else if (!silent) { // Dacă nu s-a găsit nimic
        setMesajImport("⚠️ Nu am putut citi lista (verifică să fie un Playlist YouTube Public sau un link de melodie)."); // Mesaj avertisment
      } // Închide else if
    } catch { // La eroare neașteptată
      if (!silent) setMesajImport("⚠️ Eroare la importarea link-ului."); // Mesaj eroare
    } finally { // La finalul operației
      if (!silent) { // Resetează indicatorul și ascunde mesajul
        setSeImportaPlaylist(false); // Oprește starea de import
        setTimeout(() => setMesajImport(""), 5000); // Șterge mesajul după 5 secunde
      } // Închide if
    } // Închide try-catch-finally
  } // Închide importaDeLaLinkYoutube

  useEffect(() => { // Importă automat un playlist la pornire dacă LINK_PLAYLIST_AUTOMAT nu e gol
    const linkCurat = LINK_PLAYLIST_AUTOMAT.trim(); // Curăță spațiile
    if (!linkCurat) return; // Iese imediat dacă nu e configurat niciun link
    let anulat = false; // Flag de anulare la demontare
    async function ruleazaImport() { // Funcție asincronă internă
      if (anulat) return; // Oprește dacă efectul a fost curățat
      await importaDeLaLinkYoutube(linkCurat, true); // Rulează importul silențios
    } // Închide ruleazaImport
    void ruleazaImport(); // Lansează importul
    return () => { // Funcție de curățare
      anulat = true; // Anulează la demontare
    }; // Închide return
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Rulează o singură dată la montare

  useEffect(() => { // Actualizează variabilele CSS --mouse-x și --mouse-y pentru lumina de lumânare care urmărește cursorul
    function handleMouseMove(e) { // Handler pentru mișcarea mouse-ului
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`); // Poziția X
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`); // Poziția Y
    } // Închide handleMouseMove
    window.addEventListener("mousemove", handleMouseMove); // Înregistrează ascultătorul global
    return () => window.removeEventListener("mousemove", handleMouseMove); // Îl elimină la demontare
  }, []); // Rulează o singură dată

  useEffect(() => { // Gestionează cronometrul Pomodoro (scade câte 1 secundă)
    if (!timerPornit) return; // Nu pornește intervalul când timer-ul e oprit
    const interval = setInterval(() => { // Rulează din secundă în secundă
      setSecundeRamas((prev) => { // Calculează noua valoare pe baza celei anterioare
        if (prev <= 1) { // Când s-a terminat sesiunea
          setTimerPornit(false); // Oprește timer-ul
          alert("⏳ Sesiunea de lectură s-a încheiat! Felicitări."); // Anunță utilizatorul
          return 25 * 60; // Resetează la 25 de minute
        } // Închide if
        return prev - 1; // Scade o secundă
      }); // Închide setSecundeRamas
    }, 1000); // Interval de 1000ms
    return () => clearInterval(interval); // Curăță intervalul la oprire sau demontare
  }, [timerPornit]); // Rerulează când se schimbă timerPornit

  useEffect(() => { // Curăță intervalele audio la părăsirea paginii
    return () => { // Funcție de curățare la demontare
      if (ambientIntervalRef.current) clearInterval(ambientIntervalRef.current); // Oprește muzica ambientală
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current); // Oprește sintetizatorul de pauză
    }; // Închide return
  }, []); // Rulează o singură dată

  function formateazaTimp(sec) { // Transformă secundele în formatul MM:SS
    const m = Math.floor(sec / 60); // Calculează minutele
    const s = sec % 60; // Calculează secundele rămase
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`; // Formatează cu 2 cifre
  } // Închide formateazaTimp

  function handleStergePiesaCustom(idDeSters, e) { // Elimină o piesă importată din playlist
    e.stopPropagation(); // Împiedică propagarea click-ului către cardul piesei
    setPlaylistPauza((prev) => { // Actualizează state-ul playlist-ului
      const actualizat = prev.filter((p) => p.id !== idDeSters); // Scoate piesa după ID
      const doarCustom = actualizat.filter((p) => p.custom); // Păstrează doar piesele custom
      localStorage.setItem("bibliotech_playlist_custom", JSON.stringify(doarCustom)); // Salvează în localStorage
      return actualizat; // Returnează lista nouă
    }); // Închide setPlaylistPauza
  } // Închide handleStergePiesaCustom

  function initAudioContext() { // Creează sau reia Web AudioContext la interacțiunea utilizatorului
    if (!audioCtxRef.current) { // Dacă nu a fost creat încă
      const AudioCtx = window.AudioContext || window.webkitAudioContext; // Suport cross-browser
      audioCtxRef.current = new AudioCtx(); // Instanțiază contextul audio
    } // Închide if
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume(); // Reia contextul dacă browserul l-a suspendat
    return audioCtxRef.current; // Returnează contextul activ
  } // Închide initAudioContext

  function cantaAcordCald(frecvente, tipUnda = "sine", durata = 2.1, volum = 0.045) { // Sintetizează un acord cald din frecvențele date
    const ctx = initAudioContext(); // Obține contextul audio
    const now = ctx.currentTime; // Timpul curent al motorului audio
    frecvente.forEach((freq, idx) => { // Creează câte un oscilator pentru fiecare notă din acord
      const osc = ctx.createOscillator(); // Generator de undă
      const filter = ctx.createBiquadFilter(); // Filtru pentru a atenua înaltele aspre
      const gain = ctx.createGain(); // Controlul volumului (fade in / fade out)
      osc.type = tipUnda; // Tipul undei (sine / triangle)
      const startNota = now + idx * 0.18; // Decalaj ușor de arpegiu între note
      osc.frequency.setValueAtTime(freq, startNota); // Setează frecvența în Hz
      filter.type = "lowpass"; // Filtru trece-jos
      filter.frequency.setValueAtTime(900, startNota); // Frecvență de tăiere caldă
      gain.gain.setValueAtTime(0.0001, startNota); // Pornește fără pocnet
      gain.gain.linearRampToValueAtTime(volum, startNota + 0.25); // Crește lin la volumul țintă
      gain.gain.exponentialRampToValueAtTime(0.0001, startNota + durata); // Se stinge lin
      osc.connect(filter); // Oscilator -> Filtru
      filter.connect(gain); // Filtru -> Gain
      gain.connect(ctx.destination); // Gain -> Difuzoare
      osc.start(startNota); // Pornește nota
      osc.stop(startNota + durata + 0.05); // Oprește nota după stingere
    }); // Închide forEach
  } // Închide cantaAcordCald

  function toggleAmbient() { // Pornește sau oprește muzica ambientală din bara de sus
    initAudioContext(); // Inițializează audio
    if (!ambientActiv) { // Dacă este oprită, o pornește
      const progresieAmbient = [ // Progresie de 4 acorduri liniștitoare
        [220.0, 261.63, 329.63, 392.0], // Am7
        [174.61, 220.0, 261.63, 349.23], // Fmaj7
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [196.0, 246.94, 293.66, 392.0], // G
      ]; // Închide progresia
      let pas = 0; // Indexul acordului curent
      cantaAcordCald(progresieAmbient[0], "sine", 2.6, 0.035); // Redă imediat primul acord
      ambientIntervalRef.current = setInterval(() => { // Redă următorul acord la fiecare 2.6 secunde
        pas = (pas + 1) % progresieAmbient.length; // Avansează ciclic
        cantaAcordCald(progresieAmbient[pas], "sine", 2.6, 0.035); // Redă acordul
      }, 2600); // Interval 2600ms
      setAmbientActiv(true); // Marchează ca activă
    } else { // Dacă era pornită, o oprește
      if (ambientIntervalRef.current) { // Curăță intervalul
        clearInterval(ambientIntervalRef.current); // Oprește bucla
        ambientIntervalRef.current = null; // Resetează referința
      } // Închide if
      setAmbientActiv(false); // Marchează ca oprită
    } // Închide else
  } // Închide toggleAmbient

  function pornestePiesaSelectata(idPiesa) { // Redă fie o piesă internă (Web Audio), fie un stream YouTube (iframe ascuns)
    initAudioContext(); // Inițializează audio
    if (synthIntervalRef.current) { // Oprește eventuala piesă internă anterioară
      clearInterval(synthIntervalRef.current); // Curăță intervalul
      synthIntervalRef.current = null; // Resetează referința
    } // Închide if
    setYtEmbedUrl(""); // Oprește eventualul embed YouTube anterior

    if (MELODII_RELAX[idPiesa]) { // Dacă e una dintre cele 5 piese interne
      const config = MELODII_RELAX[idPiesa]; // Preia configurația acordurilor
      let indexAcord = 0; // Index acord curent
      cantaAcordCald(config.acorduri[0], config.wave, config.tempo / 1000, 0.06); // Primul acord
      synthIntervalRef.current = setInterval(() => { // Buclă pe acordurile piesei
        indexAcord = (indexAcord + 1) % config.acorduri.length; // Avansează ciclic
        cantaAcordCald(config.acorduri[indexAcord], config.wave, config.tempo / 1000, 0.06); // Redă acordul
      }, config.tempo); // Folosește tempo-ul piesei
      setMuzicaPauzaActiva(true); // Marchează ca activă
      setPiesaActivaId(idPiesa); // Salvează ID-ul activ
    } else { // Altfel este o piesă YouTube
      let videoId = idPiesa.trim(); // Curăță ID-ul
      if (videoId.includes("youtu.be/")) videoId = videoId.split("youtu.be/")[1]?.split("?")[0]; // Extrage ID scurt
      else if (videoId.includes("watch?v=")) videoId = videoId.split("watch?v=")[1]?.split("&")[0]; // Extrage ID standard
      setYtEmbedUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`); // Pornește redarea în iframe
      setMuzicaPauzaActiva(true); // Marchează ca activă
      setPiesaActivaId(idPiesa); // Salvează ID-ul activ
    } // Închide else
  } // Închide pornestePiesaSelectata

  function handlePornesteMuzica(e) { // Handler la submit-ul formularului din modalul Gramofon
    e.preventDefault(); // Previne reîncărcarea paginii
    pornestePiesaSelectata(selectId); // Pornește piesa aleasă
    setArataModalMuzica(false); // Închide modalul
  } // Închide handlePornesteMuzica

  function handleOpresteMuzicaPauza() { // Oprește complet muzica de pauză
    if (synthIntervalRef.current) { // Curăță intervalul sintetizatorului
      clearInterval(synthIntervalRef.current); // Oprește bucla
      synthIntervalRef.current = null; // Resetează referința
    } // Închide if
    setYtEmbedUrl(""); // Elimină iframe-ul YouTube
    setMuzicaPauzaActiva(false); // Marchează ca oprită
    setPiesaActivaId(""); // Resetează ID-ul activ
    setArataModalMuzica(false); // Închide modalul
  } // Închide handleOpresteMuzicaPauza

  function redaFosnetCarte() { // Generează un sunet scurt de foșnet de pagină la hover pe carte
    try { // Încearcă generarea sunetului
      const ctx = initAudioContext(); // Obține contextul audio
      const bufferSize = Math.floor(ctx.sampleRate * 0.11); // Durată de 0.11 secunde
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate); // Buffer audio mono
      const data = buffer.getChannelData(0); // Vectorul de eșantioane
      for (let i = 0; i < bufferSize; i++) { // Generează zgomot alb modelat cu anvelopă sinusoidală
        const env = Math.sin((i / bufferSize) * Math.PI); // Anvelopă lină la capete
        data[i] = (numarAleator() * 2 - 1) * env * 0.85; // Eșantion aleatoriu atenuat
      } // Închide for
      const noise = ctx.createBufferSource(); // Sursă de redare pentru buffer
      noise.buffer = buffer; // Atașează buffer-ul
      const filter = ctx.createBiquadFilter(); // Filtru bandpass pentru timbru de hârtie
      filter.type = "bandpass"; // Tip bandpass
      filter.frequency.value = 1250; // Frecvență centrală 1250 Hz
      const gain = ctx.createGain(); // Volum discret
      gain.gain.value = 0.045; // Nivel redus
      noise.connect(filter); // Sursă -> Filtru
      filter.connect(gain); // Filtru -> Gain
      gain.connect(ctx.destination); // Gain -> Difuzoare
      noise.start(); // Redă sunetul
    } catch { // Dacă browserul blochează audio înainte de un click
      // Ignoră eroarea audio la hover
    } // Închide catch
  } // Închide redaFosnetCarte

  function redaSunetMagie() { // Redă un efect sonor scurt la adăugare, salvare jurnal sau oracol
    try { // Încearcă redarea
      const ctx = initAudioContext(); // Obține contextul audio
      const now = ctx.currentTime; // Timpul curent
      const osc = ctx.createOscillator(); // Oscilator
      const gain = ctx.createGain(); // Control volum
      osc.type = "sine"; // Undă curată
      osc.frequency.setValueAtTime(528, now); // Frecvență de start
      osc.frequency.exponentialRampToValueAtTime(792, now + 0.35); // Glissando ascendent
      gain.gain.setValueAtTime(0.05, now); // Volum inițial
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45); // Stingere lină
      osc.connect(gain); // Oscilator -> Gain
      gain.connect(ctx.destination); // Gain -> Difuzoare
      osc.start(now); // Pornește
      osc.stop(now + 0.45); // Oprește
    } catch { // Dacă audio nu e disponibil
      // Ignoră eroarea audio la efectul sonor
    } // Închide catch
  } // Închide redaSunetMagie

  function handleIntra() { // Deschide ușile 3D ale portalului (dacă sunt afișate)
    setSeDeschide(true); // Pornește animația de deschidere
    setTimeout(() => setInBiblioteca(true), 1800); // Intră în bibliotecă după 1.8s
  } // Închide handleIntra

  function handleSchimbaTema(nouaTema) { // Schimbă tema vizuală și o salvează în localStorage
    setTema(nouaTema); // Actualizează state-ul
    document.documentElement.dataset.theme = nouaTema; // Aplică tema pe <html>
    localStorage.setItem("bibliotech_tema", nouaTema); // Salvează pentru refresh
  } // Închide handleSchimbaTema

  function schimbaFiltruCuTranzitie(noulFiltru) { // Schimbă filtrul activ (tab-uri) cu animație 3D de raft
    if (noulFiltru === filtru || tranzitieRaft !== "idle") return; // Evită suprapunerea animațiilor
    setTranzitieRaft("out"); // Pornește animația de ieșire
    setTimeout(() => { // După terminarea ieșirii
      setFiltru(noulFiltru); // Aplică noul filtru
      setTranzitieRaft("in"); // Pornește animația de intrare
      setTimeout(() => setTranzitieRaft("idle"), 550); // Revine la starea normală
    }, 360); // Durata ieșirii
  } // Închide schimbaFiltruCuTranzitie

  function schimbaGrupareCuTranzitie(nouaGrupare) { // Schimbă gruparea (gen / stele) cu animație 3D
    if (nouaGrupare === grupare || tranzitieRaft !== "idle") return; // Evită suprapunerea
    setTranzitieRaft("out"); // Animație ieșire
    setTimeout(() => { // După ieșire
      setGrupare(nouaGrupare); // Aplică noua grupare
      setTranzitieRaft("in"); // Animație intrare
      setTimeout(() => setTranzitieRaft("idle"), 550); // Revine la idle
    }, 360); // Durata ieșirii
  } // Închide schimbaGrupareCuTranzitie

  async function handleAdd(carteNoua) { // Trimite POST /carti și adaugă cartea returnată în state
    const creat = await createCarte(carteNoua); // Cerere POST către json-server
    setCarti((prev) => [...prev, creat]); // Adaugă imutabil cartea creată
    redaSunetMagie(); // Redă sunet de confirmare
  } // Închide handleAdd

  async function handleToggle(id) { // Trimite PATCH /carti/:id pentru a comuta statusul citita
    const carte = carti.find((c) => c.id === id); // Caută cartea după ID
    if (!carte) return; // Iese dacă nu a fost găsită
    try { // Încearcă actualizarea pe server
      const actualizat = await updateCarte(id, { citita: !carte.citita }); // Cerere PATCH
      setCarti((prev) => prev.map((c) => (c.id === id ? actualizat : c))); // Înlocuiește cartea în listă
    } catch (err) { // Dacă apare eroare
      setError(err.message); // Afișează eroarea
    } // Închide try-catch
  } // Închide handleToggle

  async function handleDelete(id) { // Trimite DELETE /carti/:id și elimină cartea din state
    try { // Încearcă ștergerea pe server
      await deleteCarte(id); // Cerere DELETE
      setCarti((prev) => prev.filter((c) => c.id !== id)); // Elimină cartea din listă
      if (carteJurnal && carteJurnal.id === id) setCarteJurnal(null); // Închide jurnalul dacă era deschis pe această carte
      if (carteOracol && carteOracol.id === id) setCarteOracol(null); // Închide oracolul dacă era pe această carte
      if (carteRezumat && carteRezumat.id === id) setCarteRezumat(null); // Închide rezumatul dacă era pe această carte
    } catch (err) { // Dacă apare eroare
      setError(err.message); // Afișează eroarea
    } // Închide try-catch
  } // Închide handleDelete

  function handleInvocaOracol() { // Alege aleatoriu o carte (preferând cărțile disponibile)
    if (carti.length === 0) return; // Nu face nimic dacă biblioteca e goală
    const necitite = carti.filter((c) => !c.citita); // Selectează cărțile necitite
    const bazin = necitite.length > 0 ? necitite : carti; // Dacă toate sunt citite, alege din toată lista
    const aleasa = bazin[Math.floor(numarAleator() * bazin.length)]; // Extrage un element aleatoriu
    setCarteOracol(aleasa); // Deschide modalul Oracol
    redaSunetMagie(); // Redă sunetul magic
  } // Închide handleInvocaOracol

  function handleDeschideJurnal(carte) { // Încarcă datele unei cărți în modalul Jurnal
    setCarteJurnal(carte); // Setează cartea activă
    setJurnalRating(Number(carte.rating) || 5); // Încarcă nota
    setJurnalPagina(Number(carte.paginaCurenta) || 0); // Încarcă pagina curentă
    setJurnalTotalPagini(Number(carte.totalPagini) || 320); // Încarcă totalul de pagini
    setJurnalCitat(carte.citat || ""); // Încarcă citatul salvat
    setJurnalNotite(carte.notite || ""); // Încarcă notițele salvate
  } // Închide handleDeschideJurnal

  function handleDeschideRezumat(carte) { // Deschide modalul de rezumat 3D la prima deschidere
    setCarteRezumat(carte); // Setează cartea activă
    setSpreadIndex(0); // Începe de la paginile 1–2
    setSweepDir(""); // Resetează direcția de răsfoire
    redaFosnetCarte(); // Sunet de deschidere
  } // Închide handleDeschideRezumat

  function handleSchimbaPaginaRezumat(directie, targetExplicit = null) { // Răsfoiește paginile rezumatului cu animație
    if (sweepDir !== "") return; // Așteaptă terminarea animației curente
    if (directie === "next" && spreadIndex < 2) { // Pagina următoare
      const urmatorul = targetExplicit !== null ? targetExplicit : spreadIndex + 1; // Calculează indexul țintă
      redaFosnetCarte(); // Sunet foșnet
      setSweepDir("sweep-next"); // Pornește animația înainte
      setTimeout(() => setSpreadIndex(urmatorul), 340); // Schimbă textul la mijlocul animației
      setTimeout(() => setSweepDir(""), 760); // Oprește animația
    } else if (directie === "prev" && spreadIndex > 0) { // Pagina anterioară
      const anteriorul = targetExplicit !== null ? targetExplicit : spreadIndex - 1; // Calculează indexul țintă
      redaFosnetCarte(); // Sunet foșnet
      setSweepDir("sweep-prev"); // Pornește animația înapoi
      setTimeout(() => setSpreadIndex(anteriorul), 340); // Schimbă textul la mijlocul animației
      setTimeout(() => setSweepDir(""), 760); // Oprește animația
    } // Închide else if
  } // Închide handleSchimbaPaginaRezumat

  const carteCr7Id = (() => { // Găsește ID-ul cărții CR7/Ronaldo (sau prima carte din listă)
    const gasita = carti.find( // Caută în lista de cărți
      (c) => // Verifică titlul
        c.titluAutor && // Dacă există titlu
        (c.titluAutor.toLowerCase().includes("cr7") || // Conține "cr7"
          c.titluAutor.toLowerCase().includes("ronaldo")) // Sau "ronaldo"
    ); // Închide find
    return gasita ? gasita.id : carti[0]?.id; // Returnează ID-ul găsit sau prima carte
  })(); // Rulează IIFE

  const esteCarteaCr7 = carteRezumat && String(carteRezumat.id) === String(carteCr7Id); // Verifică dacă rezumatul deschis e ediția CR7

  function obtineContinutSpread(carte, indexSpread) { // Returnează conținutul perechii de pagini curente
    if (esteCarteaCr7) return PAGINI_REZUMAT_CR7[indexSpread]; // Pentru CR7 folosește povestea dedicată
    const [titluCurat, autorCurat] = // Separă titlul de autor dacă există cratimă
      carte?.titluAutor && carte.titluAutor.includes("-")
        ? carte.titluAutor.split("-").map((s) => s.trim())
        : [carte?.titluAutor || "Manuscris", "Autor Clasic"];

    const paginiGenerice = [ // Generează 3 deschideri din datele cărții
      { // Deschiderea 1
        stangaTitlu: `Fila I • ${titluCurat}`,
        stangaSubtitlu: `Autor: ${autorCurat} • Colecția ${carte?.gen || "Literatură"}`,
        stangaText: "Acest volum face parte din arhiva Sanctuarului BiblioTech. Paginile sale păstrează parfumul cernelii vechi, însă rezumatul detaliat nu a fost încă transcris de cronicari.",
        stangaCitat: carte?.citat || "„Doar ediția specială CR7 are în prezent cronica integrală transcrisă în sanctuar.”",
        dreaptaTitlu: "Fila II • Fișa Tehnică a Ediției",
        dreaptaSubtitlu: `Format: ${carte?.format || "Broșată"} • Evaluare: ${"★".repeat(Number(carte?.rating) || 5)}`,
        dreaptaText: carte?.notite || "Poți răsfoi mai departe filele acestui manuscris direct de la colțul îndoit al paginii pentru a inspecta pergamentul.",
        dreaptaStat: `📜 Status în arhivă: ${carte?.citita ? "Volum parcurs / Împrumutat" : "Disponibil la raft"}`,
      }, // Închide deschiderea 1
      { // Deschiderea 2
        stangaTitlu: "Fila III • Pergament în Așteptare",
        stangaSubtitlu: "Secțiunea Cronicarilor",
        stangaText: "Fiecare volum din bibliotecă poate fi răsfoit filă cu filă. Pentru acest manuscris, filele de mijloc sunt păstrate albe pentru viitoarele traduceri și adnotări.",
        stangaCitat: "„Răsfoiește mai departe pentru a ajunge la sigiliul final al cărții.”",
        dreaptaTitlu: "Fila IV • Însemnări de Arhivă",
        dreaptaSubtitlu: "Sanctuarul Literar BiblioTech",
        dreaptaText: "Dacă dorești să citești povestea completă pe 6 pagini despre ambiție, recorduri și trofee, deschide volumul special dedicat lui Cristiano Ronaldo (CR7).",
        dreaptaStat: "🕯️ Sfat: Apasă pe colțul îndoit al paginii pentru a schimba foaia.",
      }, // Închide deschiderea 2
      { // Deschiderea 3
        stangaTitlu: "Fila V • Epilogul Manuscrisului",
        stangaSubtitlu: "Ultima deschidere a volumului",
        stangaText: "Ai ajuns la ultimele pagini ale acestui volum. Păstrează cartea pe raftul tău preferat sau marcheaz-o ca parcursă după finalizarea lecturii.",
        stangaCitat: "„O carte citită este o călătorie care rămâne pentru totdeauna în memorie.”",
        dreaptaTitlu: "Fila VI • Sigiliul Bibliotecii",
        dreaptaSubtitlu: "Arhivă Oficială Verificată",
        dreaptaText: "Manuscris înregistrat în catalogul digital BiblioTech. Toate drepturile de lectură și adnotare aparțin cititorului.",
        dreaptaStat: "⚜️ Sfârșitul Manuscrisului • Folosește colțul din stânga-jos pentru întoarcere.",
      }, // Închide deschiderea 3
    ]; // Închide paginiGenerice
    return paginiGenerice[indexSpread]; // Returnează paginile cerute
  } // Închide obtineContinutSpread

  function handleSalveazaJurnal(e) { // Salvează progresul și notițele din Jurnal în state și localStorage
    e.preventDefault(); // Previne reîncărcarea paginii
    if (!carteJurnal) return; // Siguranță dacă nu e selectată nicio carte
    const dateActualizate = { // Pregătește obiectul actualizat
      rating: Number(jurnalRating), // Nota numerică
      paginaCurenta: Math.min(Number(jurnalPagina), Number(jurnalTotalPagini)), // Nu depășește totalul
      totalPagini: Math.max(1, Number(jurnalTotalPagini)), // Minim 1 pagină
      citat: jurnalCitat, // Citatul
      notite: jurnalNotite, // Notițele
    }; // Închide dateActualizate
    setCarti((prev) => prev.map((c) => (c.id === carteJurnal.id ? { ...c, ...dateActualizate } : c))); // Actualizează cardul
    const jurnaleSalvate = JSON.parse(localStorage.getItem("bibliotech_jurnale") || "{}"); // Citește dicționarul de jurnale
    jurnaleSalvate[carteJurnal.id] = dateActualizate; // Actualizează intrarea pentru cartea curentă
    localStorage.setItem("bibliotech_jurnale", JSON.stringify(jurnaleSalvate)); // Persistă în localStorage
    redaSunetMagie(); // Efect sonor
    setCarteJurnal(null); // Închide modalul
  } // Închide handleSalveazaJurnal

  const cartiAfisate = carti.filter((carte) => { // Filtrează cărțile după tab-ul activ și căutarea text
    const potrivireFiltru = filtru === "toate" ? true : filtru === "disponibile" ? !carte.citita : carte.citita; // Verifică tab-ul
    const termen = cautare.trim().toLowerCase(); // Normalizează termenul de căutare
    const potrivireCautare = !termen || (carte.titluAutor && carte.titluAutor.toLowerCase().includes(termen)) || (carte.gen && carte.gen.toLowerCase().includes(termen)); // Caută în titlu și gen
    return potrivireFiltru && potrivireCautare; // Păstrează doar potrivirile complete
  }); // Închide filter

  const termenMuzica = cautareMuzica.trim().toLowerCase(); // Normalizează căutarea din gramofon
  const pieseFiltrate = playlistPauza.filter( // Filtrează piesele după nume, artist sau subtitlu
    (p) =>
      !termenMuzica ||
      p.nume.toLowerCase().includes(termenMuzica) ||
      (p.artist && p.artist.toLowerCase().includes(termenMuzica)) ||
      (p.subtitlu && p.subtitlu.toLowerCase().includes(termenMuzica))
  ); // Închide filter
  const pieseRelaxFiltrate = pieseFiltrate.filter((p) => p.categorie === "relax"); // Doar piesele interne
  const pieseYoutubeFiltrate = pieseFiltrate.filter((p) => p.categorie === "youtube"); // Doar piesele YouTube

  const categoriiUnice = // Calculează lista rafturilor unice (după gen alfabetic sau stele descrescător)
    grupare === "gen"
      ? [...new Set(cartiAfisate.map((c) => c.gen))].sort()
      : [...new Set(cartiAfisate.map((c) => c.rating))].sort((a, b) => b - a);

  const imprumutateCount = carti.filter((c) => c.citita).length; // Total cărți citite/împrumutate
  const disponibileCount = carti.length - imprumutateCount; // Total cărți disponibile
  const procentLectura = jurnalTotalPagini > 0 ? Math.min(100, Math.round((jurnalPagina / jurnalTotalPagini) * 100)) : 0; // Procent Jurnal
  const rangCititor = // Determină rangul în funcție de numărul de cărți parcurse
    imprumutateCount >= 8
      ? "🔮 Marele Mag Arhivar"
      : imprumutateCount >= 4
      ? "⚜️ Maestru Cronicar"
      : imprumutateCount >= 1
      ? "🕯️ Păzitor al Pergamentelor"
      : "📜 Inițiat al Sanctuarului";
  const procentRangHeader = carti.length > 0 ? Math.round((imprumutateCount / carti.length) * 100) : 0; // Procent general colecție
  const mediaStele = // Calculează media stelelor din toată colecția
    carti.length > 0
      ? (carti.reduce((acc, c) => acc + (Number(c.rating) || 5), 0) / carti.length).toFixed(1)
      : "5.0";
  const topCarti = [...carti].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)).slice(0, 3); // Top 3 cărți după rating

  function handleCopiazaRezumat() { // Copiază statisticile colecției în clipboard
    const textShare = `🕯️ SANCTUARUL BIBLIOTECH 🕯️\nRang: ${rangCititor}\n📚 Volume în arhivă: ${carti.length} (${imprumutateCount} parcurse)\n⭐ Evaluare medie: ${mediaStele}/5\n🏆 Top Manuscrise:\n${topCarti
      .map((c) => `• ${c.titluAutor} (${"★".repeat(Number(c.rating) || 5)})`)
      .join("\n")}\n🔗 Explorează colecția: ${window.location.href}`;
    navigator.clipboard.writeText(textShare); // Scrie textul în clipboard
    setMesajCopiat(true); // Afișează confirmarea
    setTimeout(() => setMesajCopiat(false), 3000); // Resetează după 3 secunde
  } // Închide handleCopiazaRezumat

  const spreadCurent = carteRezumat ? obtineContinutSpread(carteRezumat, spreadIndex) : null; // Paginile curente din modalul Rezumat

  return ( // Randează interfața paginii CartiPage
    <>
      {/* Player YouTube ascuns folosit pentru redarea pieselor YouTube */}
      {ytEmbedUrl && (
        <div style={{ display: "none" }}>
          <iframe title="Muzică Pauză YT" src={ytEmbedUrl} allow="autoplay; encrypted-media"></iframe>
        </div>
      )}

      {/* Portalul cu ușile 3D (afișat doar dacă inBiblioteca este false) */}
      {!inBiblioteca && (
        <div className={`landing-portal ${seDeschide ? "opening" : ""}`}>
          <div className="portal-inner-light" aria-hidden="true"></div>
          <div className="door door-left" aria-hidden="true">
            <div className="door-panel-top"></div>
            <div className="door-panel-bottom"></div>
            <div className="door-handle"></div>
          </div>
          <div className="door door-right" aria-hidden="true">
            <div className="door-panel-top"></div>
            <div className="door-panel-bottom"></div>
            <div className="door-handle"></div>
          </div>
          <div className="portal-center-content">
            <div className="portal-candle" aria-hidden="true">
              <span className="flacara-3d"></span>
              <span className="fitil-3d"></span>
              <span className="ceara-3d"></span>
            </div>
            <h1 className="portal-title">BiblioTech</h1>
            <p className="portal-subtitle">Sanctuarul Cărților și al Poveștilor</p>
            <button className="enter-library-btn" onClick={handleIntra} disabled={seDeschide}>
              <span className="btn-key-icon">🗝️</span> Intră în Bibliotecă
            </button>
          </div>
        </div>
      )}

      {/* Containerul principal al bibliotecii */}
      <div className={`main-app-wrapper ${seDeschide ? "app-entering" : ""} ${inBiblioteca ? "app-entered" : ""}`}>
        {/* Bara de utilități a sanctuarului (căutare, Pomodoro, audio, teme) */}
        <nav className="top-navbar">
          <div className="navbar-inner">
            {/* Zona brand cu lumânarea 3D */}
            <div className="navbar-brand">
              <div className="lumanare-realista navbar-candle" aria-hidden="true">
                <span className="aura-lumanare"></span>
                <span className="flacara-3d"></span>
                <span className="fitil-3d"></span>
                <span className="picatura-ceara"></span>
                <span className="ceara-3d"></span>
                <span className="suport-auriu"></span>
              </div>
              <div>
                <span className="brand-name">BiblioTech</span>
                <span className="brand-tag">Arhivă Digitală</span>
              </div>
            </div>

            {/* Bara de căutare live */}
            <div className="navbar-search">
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                placeholder="Caută după titlu, autor sau colecție..."
                value={cautare}
                onChange={(e) => setCautare(e.target.value)}
                aria-label="Caută cărți"
              />
              {cautare && (
                <button className="clear-search-btn" onClick={() => setCautare("")} title="Șterge căutarea">
                  ✕
                </button>
              )}
            </div>

            {/* Butoanele utilitare și selectorul celor 5 teme */}
            <div className="navbar-actions">
              <button
                type="button"
                className={`timer-pomodoro-btn ${timerPornit ? "running" : ""}`}
                onClick={() => setTimerPornit(!timerPornit)}
                title="Pornește clepsidra (25 min)"
              >
                ⏳ {formateazaTimp(secundeRamas)}
              </button>
              <button
                type="button"
                className={`ambient-toggle-btn ${ambientActiv ? "active" : ""}`}
                onClick={toggleAmbient}
                title="Pornește sau oprește muzica ambientală"
              >
                {ambientActiv ? "🎵 Ambiental: ON" : "🔇 Ambiental: OFF"}
              </button>
              <button
                type="button"
                className={`ambient-toggle-btn ${muzicaPauzaActiva ? "active" : ""}`}
                onClick={() => setArataModalMuzica(true)}
                title="Alege muzica de pauză"
              >
                {muzicaPauzaActiva ? "🎧 Muzică: ON" : "🎵 Muzică de pauză"}
              </button>
              <button type="button" className="share-shelf-btn" onClick={() => setArataCardShare(true)}>
                🏆 Cardul Meu
              </button>
              <div className="realm-selector-wrapper">
                <select
                  className="realm-select"
                  value={tema}
                  onChange={(e) => handleSchimbaTema(e.target.value)}
                  aria-label="Alege Tărâmul Vizual"
                >
                  <option value="dark">🕯️ Mahon Clasic</option>
                  <option value="light">☀️ Pergament Luminos</option>
                  <option value="astral">🌌 Observator Astral</option>
                  <option value="botanic">🌿 Sera Botanică</option>
                  <option value="gotic">🍷 Castelul Gotic</option>
                </select>
              </div>
            </div>
          </div>
        </nav>

        {/* Zona principală centrală */}
        <main className="site-main-container">
          {/* Bannerul Hero cu citate, rang și bară de progres */}
          <header className="app-header">
            <div className="header-bg-image" aria-hidden="true"></div>
            <div className="header-warm-overlay" aria-hidden="true"></div>
            <span className="hero-corner corner-tl" aria-hidden="true">❖</span>
            <span className="hero-corner corner-tr" aria-hidden="true">❖</span>
            <span className="hero-corner corner-bl" aria-hidden="true">❖</span>
            <span className="hero-corner corner-br" aria-hidden="true">❖</span>
            <div className="header-candles-group" aria-hidden="true">
              <div className="candle-3d candle-tall">
                <span className="flame"></span>
                <span className="wick"></span>
                <span className="wax"></span>
              </div>
              <div className="candle-3d candle-medium">
                <span className="flame"></span>
                <span className="wick"></span>
                <span className="wax"></span>
              </div>
              <div className="candle-3d candle-short">
                <span className="flame"></span>
                <span className="wick"></span>
                <span className="wax"></span>
              </div>
            </div>

            <div className="header-content">
              <span className="hero-eyebrow">✦ SALA DE LECTURĂ & COLECȚII ✦</span>
              <h1>Sanctuarul Literar BiblioTech</h1>
              <p>Explorează volumele în ediție 3D, răsfoiește rezumatele pe ecran și păstrează-ți manuscrisele în arhivă</p>

              {/* Citatul zilei cu buton de schimbare */}
              <div className="hero-quote-ribbon">
                <span className="hero-quote-text">{CITATE_SANCTUAR[indexCitat]}</span>
                <button
                  type="button"
                  className="hero-quote-next-btn"
                  onClick={() => setIndexCitat((prev) => (prev + 1) % CITATE_SANCTUAR.length)}
                  title="Schimbă citatul"
                >
                  ↻ Alt citat
                </button>
              </div>

              {/* Bara de rang, progres și acces rapid la ediția CR7 */}
              <div className="hero-royal-bar">
                <div className="hero-rank-chip">
                  <span className="hero-rank-label">Rangul tău:</span>
                  <strong>{rangCititor}</strong>
                </div>
                <div className="hero-xp-box">
                  <div className="hero-xp-labels">
                    <span>Progres Colecție</span>
                    <span>{imprumutateCount}/{carti.length} parcurse ({procentRangHeader}%)</span>
                  </div>
                  <div className="hero-xp-track">
                    <div className="hero-xp-fill" style={{ width: `${procentRangHeader}%` }}></div>
                  </div>
                </div>
                {carti.length > 0 && (
                  <button
                    type="button"
                    className="hero-cr7-spotlight-btn"
                    onClick={() => {
                      const carteCr7 = carti.find((c) => String(c.id) === String(carteCr7Id)) || carti[0];
                      handleDeschideRezumat(carteCr7);
                    }}
                  >
                    ⚽ Citește Ediția CR7
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Formularul de adăugare a unei cărți noi (cu chenar .panel) */}
          <div className="formWrap">
            <CarteForm onAdd={handleAdd} />
          </div>

          {/* Panoul principal cu filtre și rafturile 3D */}
          <section className="panel">
            {/* Bara de tab-uri, Oracol și comutator de grupare */}
            <div className="catalog-control-bar">
              <div className="library-nav-tabs" role="tablist">
                <button
                  className={`lib-tab tab-all ${filtru === "toate" ? "active" : ""}`}
                  onClick={() => schimbaFiltruCuTranzitie("toate")}
                >
                  <span className="tab-icon">🏛️</span>
                  <span className="tab-label">Marea Sală</span>
                  <span className="tab-count">{carti.length}</span>
                </button>
                <button
                  className={`lib-tab tab-available ${filtru === "disponibile" ? "active" : ""}`}
                  onClick={() => schimbaFiltruCuTranzitie("disponibile")}
                >
                  <span className="tab-icon">🕯️</span>
                  <span className="tab-label">Disponibile</span>
                  <span className="tab-count">{disponibileCount}</span>
                </button>
                <button
                  className={`lib-tab tab-borrowed ${filtru === "imprumutate" ? "active" : ""}`}
                  onClick={() => schimbaFiltruCuTranzitie("imprumutate")}
                >
                  <span className="tab-icon">🔮</span>
                  <span className="tab-label">Împrumutate</span>
                  <span className="tab-count">{imprumutateCount}</span>
                </button>
                <button type="button" className="oracle-trigger-btn" onClick={handleInvocaOracol}>
                  ✨ Ce citesc azi?
                </button>
              </div>

              <div className="grupare-magic-switch">
                <span className="grupare-label">Ordonează rafturile:</span>
                <div className="magic-pill-box">
                  <button
                    className={grupare === "gen" ? "pill-option active" : "pill-option"}
                    onClick={() => schimbaGrupareCuTranzitie("gen")}
                  >
                    📜 După Gen
                  </button>
                  <button
                    className={grupare === "rating" ? "pill-option active" : "pill-option"}
                    onClick={() => schimbaGrupareCuTranzitie("rating")}
                  >
                    ⭐ După Stele
                  </button>
                </div>
              </div>
            </div>

            {/* Stările de încărcare și eroare API */}
            {loading && (
              <p className="info" data-testid="loading">
                Se încarcă biblioteca... Se aprind lumânările.
              </p>
            )}
            {error && (
              <p className="error" data-testid="error">
                Nu am putut încărca datele: {error}. Rulează <code>npm run api</code>.
              </p>
            )}

            {/* Rafturile grupate pe gen sau stele */}
            {!loading && !error && (
              <div className="sala-rafturi-viewport">
                <div className={`portal-flash-wave ${tranzitieRaft !== "idle" ? "active" : ""}`} aria-hidden="true"></div>
                <div className={`grupuri-genuri wing-transition-${tranzitieRaft}`}>
                  {categoriiUnice.map((categorie) => {
                    const cartiDinCategorie = cartiAfisate.filter((c) =>
                      grupare === "gen" ? c.gen === categorie : c.rating === categorie
                    );
                    return (
                      <div key={categorie} className="gen-sectiune">
                        <div className="raft-eticheta-wrapper">
                          <h3 className="gen-titlu">
                            {grupare === "rating" ? `${categorie} Stele ${"★".repeat(categorie)}` : categorie}
                          </h3>
                          <span className="raft-vol-count">
                            {cartiDinCategorie.length} {cartiDinCategorie.length === 1 ? "volum" : "volume"} pe raft
                          </span>
                        </div>
                        <CarteList
                          carti={cartiDinCategorie}
                          onToggle={handleToggle}
                          onDelete={handleDelete}
                          onOpenJurnal={handleDeschideJurnal}
                          onOpenRezumat={handleDeschideRezumat}
                          onHoverBook={redaFosnetCarte}
                        />
                      </div>
                    );
                  })}

                  {cartiAfisate.length === 0 && (
                    <div className="empty-state-box">
                      <span className="empty-icon">🕯️</span>
                      <p className="empty" data-testid="empty">
                        Nu am găsit niciun manuscris în această aripă a bibliotecii.
                      </p>
                      {cautare && (
                        <button className="reset-filter-btn" onClick={() => setCautare("")}>
                          Resetează căutarea
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Modalul Rezumat 3D pe 2 pagini */}
      {carteRezumat && spreadCurent && (
        <div className="jurnal-modal-overlay" onClick={() => setCarteRezumat(null)}>
          <div className="rezumat-3d-book-wrapper" onClick={(e) => e.stopPropagation()}>
            <button className="jurnal-close-btn" onClick={() => setCarteRezumat(null)} title="Închide Cartea">
              ✕
            </button>
            <div className="rezumat-top-banner">
              <span className="rezumat-badge-mode">
                {esteCarteaCr7
                  ? "⚽ EDIȚIE SPECIALĂ ILUSTRATĂ • CRISTIANO RONALDO (CR7)"
                  : `📖 LECTURĂ MANUSCRIS • ${carteRezumat.titluAutor}`}
              </span>
            </div>

            <div className={`rezumat-book-stage ${sweepDir}`}>
              <div
                className={`rezumat-page rezumat-page-left ${spreadIndex > 0 && !sweepDir ? "can-turn-prev" : ""}`}
                onClick={() => handleSchimbaPaginaRezumat("prev")}
              >
                <div className="rezumat-page-inner">
                  <span className="rezumat-page-header">
                    {esteCarteaCr7 ? "CR7: OBSESIA PERFECȚIUNII" : carteRezumat.titluAutor}
                  </span>
                  <h3 className="rezumat-chapter-title">{spreadCurent.stangaTitlu}</h3>
                  <span className="rezumat-chapter-sub">{spreadCurent.stangaSubtitlu}</span>
                  <div className="jurnal-divider">
                    <span>{esteCarteaCr7 ? "⚽" : "۞"}</span>
                  </div>
                  <p className="rezumat-body-text">{spreadCurent.stangaText}</p>
                  <blockquote className="rezumat-quote-callout">{spreadCurent.stangaCitat}</blockquote>
                  <span className="rezumat-page-number">— Pagina {spreadIndex * 2 + 1} —</span>
                </div>

                {spreadIndex > 0 && !sweepDir && (
                  <>
                    <button
                      type="button"
                      className="peel-side-pill pill-left"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSchimbaPaginaRezumat("prev");
                      }}
                    >
                      ⬅ Pagina {spreadIndex * 2 - 1}
                    </button>
                    <button
                      type="button"
                      className="corner-peel-widget corner-peel-left"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSchimbaPaginaRezumat("prev");
                      }}
                      title="Pagina anterioară"
                    >
                      <span className="peel-under-page"></span>
                      <span className="peel-folded-flap"></span>
                    </button>
                  </>
                )}
              </div>

              <div
                className={`rezumat-page rezumat-page-right ${spreadIndex < 2 && !sweepDir ? "can-turn-next" : ""}`}
                onClick={() => handleSchimbaPaginaRezumat("next")}
              >
                <div className="rezumat-page-inner">
                  <span className="rezumat-page-header">SANCTUARUL BIBLIOTECH • ARHIVA 3D</span>
                  <h3 className="rezumat-chapter-title">{spreadCurent.dreaptaTitlu}</h3>
                  <span className="rezumat-chapter-sub">{spreadCurent.dreaptaSubtitlu}</span>
                  <div className="jurnal-divider">
                    <span>{esteCarteaCr7 ? "👑" : "⚜"}</span>
                  </div>
                  <p className="rezumat-body-text">{spreadCurent.dreaptaText}</p>
                  <div className="rezumat-highlight-box">{spreadCurent.dreaptaStat}</div>
                  <span className="rezumat-page-number">— Pagina {spreadIndex * 2 + 2} —</span>
                </div>

                {spreadIndex < 2 && !sweepDir && (
                  <>
                    <button
                      type="button"
                      className="peel-side-pill pill-right"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSchimbaPaginaRezumat("next");
                      }}
                    >
                      Pagina {spreadIndex * 2 + 3} ➔
                    </button>
                    <button
                      type="button"
                      className="corner-peel-widget corner-peel-right"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSchimbaPaginaRezumat("next");
                      }}
                      title="Răsfoiește pagina"
                    >
                      <span className="peel-under-page"></span>
                      <span className="peel-folded-flap"></span>
                    </button>
                  </>
                )}
              </div>

              <div className="rezumat-center-spine" aria-hidden="true"></div>
              {sweepDir !== "" && (
                <div className={`rezumat-magic-sweep ${sweepDir}`} aria-hidden="true">
                  <div className="sweep-breeze-core">
                    <span className="sweep-sparkle s1">✦</span>
                    <span className="sweep-sparkle s2">✧</span>
                    <span className="sweep-sparkle s3">✦</span>
                  </div>
                </div>
              )}
            </div>

            <div className="rezumat-controls-bar">
              <div className="rezumat-dots">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`rezumat-dot ${spreadIndex === idx ? "active" : ""}`}
                    onClick={() => {
                      if (idx > spreadIndex) handleSchimbaPaginaRezumat("next", idx);
                      if (idx < spreadIndex) handleSchimbaPaginaRezumat("prev", idx);
                    }}
                  >
                    Pag. {idx * 2 + 1}–{idx * 2 + 2}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modalul Gramofonului (muzică de pauză + import YouTube) */}
      {arataModalMuzica && (
        <div className="jurnal-modal-overlay" onClick={() => setArataModalMuzica(false)}>
          <div className="oracle-modal-box music-modal-royal" onClick={(e) => e.stopPropagation()}>
            <button className="jurnal-close-btn" onClick={() => setArataModalMuzica(false)} title="Închide">
              ✕
            </button>
            <span className="story-header-ornament" style={{ display: "block", textAlign: "center" }}>
              ✦ GRAMOFONUL SANCTUARULUI ✦
            </span>
            <h2 className="oracle-title" style={{ textAlign: "center", marginBottom: "12px" }}>
              Alege Muzica de Pauză ({playlistPauza.length} piese)
            </h2>

            <div className="music-import-box">
              <label className="music-import-label">📥 Lipește un link de Playlist YouTube pentru import automat:</label>
              <div className="music-import-row">
                <input
                  type="text"
                  className="music-import-input"
                  placeholder="https://www.youtube.com/playlist?list=PL..."
                  value={linkImportPlaylist}
                  onChange={(e) => setLinkImportPlaylist(e.target.value)}
                />
                <button
                  type="button"
                  className="music-import-btn"
                  disabled={seImportaPlaylist || !linkImportPlaylist.trim()}
                  onClick={() => importaDeLaLinkYoutube(linkImportPlaylist.trim(), false)}
                >
                  {seImportaPlaylist ? "⏳ Se extrag..." : "+ Importă Automat"}
                </button>
              </div>
              {mesajImport && <span className="music-import-status">{mesajImport}</span>}
            </div>

            <div className="music-search-box">
              <span className="music-search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                className="music-search-input"
                placeholder="Caută în playlist după melodie sau artist..."
                value={cautareMuzica}
                onChange={(e) => setCautareMuzica(e.target.value)}
              />
              {cautareMuzica && (
                <button type="button" className="music-search-clear" onClick={() => setCautareMuzica("")} title="Șterge căutarea">
                  ✕
                </button>
              )}
            </div>

            <form onSubmit={handlePornesteMuzica}>
              <div className="music-playlist-scroll">
                {pieseRelaxFiltrate.length > 0 && (
                  <>
                    <div className="music-category-header">🌿 Ambianțele Sanctuarului ({pieseRelaxFiltrate.length})</div>
                    {pieseRelaxFiltrate.map((piesa) => {
                      const esteSelectata = selectId === piesa.id;
                      const cantaAcum = muzicaPauzaActiva && piesaActivaId === piesa.id;
                      return (
                        <div
                          key={piesa.id}
                          className={`music-track-card ${esteSelectata ? "selected" : ""} ${cantaAcum ? "playing" : ""}`}
                          onClick={() => setSelectId(piesa.id)}
                          onDoubleClick={() => {
                            setSelectId(piesa.id);
                            pornestePiesaSelectata(piesa.id);
                          }}
                        >
                          <span className="track-icon-circle">{piesa.icon}</span>
                          <div className="track-info-col">
                            <span className="track-title-text">{piesa.nume}</span>
                            <span className="track-sub-text">🎤 {piesa.artist} • {piesa.subtitlu}</span>
                          </div>
                          <div className="track-status-col">
                            {cantaAcum ? (
                              <span className="track-playing-badge">
                                <span className="eq-bar b1"></span>
                                <span className="eq-bar b2"></span>
                                <span className="eq-bar b3"></span>
                                În redare
                              </span>
                            ) : esteSelectata ? (
                              <span className="track-selected-pill">Selectată ✓</span>
                            ) : (
                              <span className="track-play-hint">Alege</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {pieseYoutubeFiltrate.length > 0 && (
                  <>
                    <div className="music-category-header" style={{ marginTop: pieseRelaxFiltrate.length > 0 ? "12px" : "0" }}>
                      🎵 Colecția YouTube ({pieseYoutubeFiltrate.length})
                    </div>
                    {pieseYoutubeFiltrate.map((piesa) => {
                      const esteSelectata = selectId === piesa.id;
                      const cantaAcum = muzicaPauzaActiva && piesaActivaId === piesa.id;
                      return (
                        <div
                          key={piesa.id}
                          className={`music-track-card ${esteSelectata ? "selected" : ""} ${cantaAcum ? "playing" : ""}`}
                          onClick={() => setSelectId(piesa.id)}
                          onDoubleClick={() => {
                            setSelectId(piesa.id);
                            pornestePiesaSelectata(piesa.id);
                          }}
                        >
                          <span className="track-icon-circle yt-icon">{piesa.icon}</span>
                          <div className="track-info-col">
                            <span className="track-title-text">{piesa.nume}</span>
                            <span className="track-sub-text">🎤 {piesa.artist} • {piesa.subtitlu}</span>
                          </div>
                          <div className="track-status-col">
                            {cantaAcum ? (
                              <span className="track-playing-badge">
                                <span className="eq-bar b1"></span>
                                <span className="eq-bar b2"></span>
                                <span className="eq-bar b3"></span>
                                În redare
                              </span>
                            ) : esteSelectata ? (
                              <span className="track-selected-pill">Selectată ✓</span>
                            ) : (
                              <span className="track-play-hint">Alege</span>
                            )}
                            {piesa.custom && (
                              <button
                                type="button"
                                className="track-delete-btn"
                                title="Elimină piesa din playlist"
                                onClick={(e) => handleStergePiesaCustom(piesa.id, e)}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {pieseFiltrate.length === 0 && (
                  <div className="music-empty-search">
                    Nu am găsit nicio melodie sau artist pentru „{cautareMuzica}”.
                  </div>
                )}
              </div>

              <div className="oracle-actions" style={{ marginTop: "16px" }}>
                <button
                  type="button"
                  className="jurnal-btn-cancel"
                  style={{ color: "#fde68a", borderColor: "#fde047" }}
                  onClick={handleOpresteMuzicaPauza}
                >
                  ⏹ Oprește Muzica
                </button>
                <button type="submit" className="jurnal-btn-save">
                  ▶ Redă Piesa Selectată
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modalul Jurnalului de lectură */}
      {carteJurnal && (
        <div className="jurnal-modal-overlay" onClick={() => setCarteJurnal(null)}>
          <div className="jurnal-open-book" onClick={(e) => e.stopPropagation()}>
            <button className="jurnal-close-btn" onClick={() => setCarteJurnal(null)} title="Închide Jurnalul">
              ✕
            </button>
            <form className="jurnal-pages-grid" onSubmit={handleSalveazaJurnal}>
              <div className="jurnal-page jurnal-page-left">
                <div className="jurnal-page-border">
                  <span className="jurnal-eyebrow">⚜ FIȘĂ DE ARHIVĂ & PROGRES ⚜</span>
                  <h2 className="jurnal-book-title">{carteJurnal.titluAutor}</h2>
                  <div className="jurnal-badges-row">
                    <span className="jurnal-tag">📚 Colecția: {carteJurnal.gen || "Literatură"}</span>
                    <span className="jurnal-tag">📖 Format: {carteJurnal.format || "Broșată"}</span>
                  </div>
                  <div className="jurnal-divider">
                    <span>۞</span>
                  </div>

                  <div className="jurnal-section-box">
                    <label className="jurnal-label">Evaluarea ta ({jurnalRating}/5 stele):</label>
                    <div className="jurnal-interactive-stars">
                      {[1, 2, 3, 4, 5].map((stea) => (
                        <button
                          type="button"
                          key={stea}
                          className={`jurnal-star-btn ${stea <= jurnalRating ? "active" : ""}`}
                          onClick={() => setJurnalRating(stea)}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="jurnal-section-box">
                    <label className="jurnal-label">Progresul lecturii ({procentLectura}% parcurs):</label>
                    <div className="jurnal-pages-inputs">
                      <div className="jurnal-input-group">
                        <span>Pagina curentă:</span>
                        <input
                          type="number"
                          min="0"
                          max={jurnalTotalPagini}
                          value={jurnalPagina}
                          onChange={(e) => setJurnalPagina(e.target.value)}
                        />
                      </div>
                      <span className="jurnal-slash">/</span>
                      <div className="jurnal-input-group">
                        <span>Total pagini:</span>
                        <input
                          type="number"
                          min="1"
                          value={jurnalTotalPagini}
                          onChange={(e) => setJurnalTotalPagini(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="jurnal-progress-track">
                      <div className="jurnal-progress-fill" style={{ width: `${procentLectura}%` }}></div>
                    </div>
                  </div>

                  <div className="jurnal-section-box">
                    <label className="jurnal-label">❝ Citat memorabil din volum:</label>
                    <textarea
                      className="jurnal-textarea jurnal-quote-box"
                      rows="2"
                      placeholder="Scrie aici un pasaj..."
                      value={jurnalCitat}
                      onChange={(e) => setJurnalCitat(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="jurnal-page jurnal-page-right">
                <div className="jurnal-page-border">
                  <span className="jurnal-eyebrow">✒️ ÎNSEMNĂRILE CITITORULUI</span>
                  <label className="jurnal-label" style={{ marginTop: "8px" }}>
                    Impresii, idei și rezumatul manuscrisului:
                  </label>
                  <textarea
                    className="jurnal-textarea jurnal-notes-lined"
                    rows="8"
                    placeholder="Așterne aici gândurile tale..."
                    value={jurnalNotite}
                    onChange={(e) => setJurnalNotite(e.target.value)}
                  />
                  <div className="jurnal-modal-actions">
                    <button type="button" className="jurnal-btn-cancel" onClick={() => setCarteJurnal(null)}>
                      Închide fără salvare
                    </button>
                    <button type="submit" className="jurnal-btn-save">
                      📜 Salvează cu Sigiliu
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modalul Cardului de Colecționar */}
      {arataCardShare && (
        <div className="jurnal-modal-overlay" onClick={() => setArataCardShare(false)}>
          <div className="collector-card-modal" onClick={(e) => e.stopPropagation()}>
            <button className="jurnal-close-btn" onClick={() => setArataCardShare(false)} title="Închide Cardul">
              ✕
            </button>
            <div className="collector-story-frame">
              <div className="story-header-ornament">✦ SANCTUARUL BIBLIOTECH ✦</div>
              <h2 className="story-main-title">Certificat de Arhivar</h2>
              <div className="story-rank-badge">{rangCititor}</div>
              <div className="story-stats-grid">
                <div className="story-stat-box">
                  <span className="story-stat-num">{carti.length}</span>
                  <span className="story-stat-label">Volume în Raft</span>
                </div>
                <div className="story-stat-box">
                  <span className="story-stat-num">{imprumutateCount}</span>
                  <span className="story-stat-label">Volume Parcurse</span>
                </div>
                <div className="story-stat-box">
                  <span className="story-stat-num">{mediaStele} ★</span>
                  <span className="story-stat-label">Media Colecției</span>
                </div>
              </div>
              <div className="story-top-books">
                <span className="story-top-label">👑 Manuscrise de Onoare din Raftul Meu:</span>
                {topCarti.map((c, idx) => (
                  <div key={c.id} className="story-book-row">
                    <span className="story-book-rank">#{idx + 1}</span>
                    <span className="story-book-name">{c.titluAutor}</span>
                    <span className="story-book-stars">{"★".repeat(Number(c.rating) || 5)}</span>
                  </div>
                ))}
              </div>
              <div className="story-footer-seal">
                <span className="seal-wax-circle">📜</span>
                <span className="seal-signature">Arhivă Oficială Verificată • BiblioTech</span>
              </div>
            </div>
            <div className="collector-card-actions">
              <button type="button" className="jurnal-btn-save" onClick={handleCopiazaRezumat}>
                {mesajCopiat ? "✨ Copiat în Clipboard!" : "📋 Copiază Rezumatul & Link-ul Raftului"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modalul Oracolului Literar */}
      {carteOracol && (
        <div className="jurnal-modal-overlay" onClick={() => setCarteOracol(null)}>
          <div className="oracle-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="jurnal-close-btn" onClick={() => setCarteOracol(null)} title="Închide Oracolul">
              ✕
            </button>
            <div className="oracle-spotlight"></div>
            <span className="story-header-ornament">✦ PROFEȚIA ORACOLULUI LITERAR ✦</span>
            <h2 className="oracle-title">Manuscrisul Ales Pentru Tine</h2>
            <div className="oracle-book-showcase">
              <span className="oracle-book-genre">
                {carteOracol.gen || "Literatură"} • {carteOracol.format || "Broșată"}
              </span>
              <h3 className="oracle-book-name">{carteOracol.titluAutor}</h3>
              <div className="oracle-stars">{"★".repeat(Number(carteOracol.rating) || 5)}</div>
            </div>
            <p className="oracle-prophecy-text">
              „Soarta a ales acest volum dintre rafturile sanctuarului. Deschide-i paginile astăzi și lasă povestea să prindă viață.”
            </p>
            <div className="oracle-actions">
              <button
                type="button"
                className="jurnal-btn-cancel"
                style={{ color: "#fde68a", borderColor: "#fde047" }}
                onClick={handleInvocaOracol}
              >
                🎲 Alege Alt Volum
              </button>
              <button
                type="button"
                className="jurnal-btn-save"
                onClick={() => {
                  const aleasa = carteOracol;
                  setCarteOracol(null);
                  handleDeschideRezumat(aleasa);
                }}
              >
                📖 Citește Rezumatul Cărții
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  ); // Închide return
} // Închide CartiPage