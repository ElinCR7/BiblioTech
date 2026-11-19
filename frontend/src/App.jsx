import { useEffect, useRef, useState } from "react";
import "./App.css";
import CarteList from "./components/CarteList.jsx";
import CarteForm from "./components/CarteForm.jsx";
import { fetchCarti, createCarte, deleteCarte, updateCarte } from "./api.js";

function temaInitiala() {
  const salvata = localStorage.getItem("bibliotech_tema");
  if (salvata) {
    document.documentElement.dataset.theme = salvata;
    return salvata;
  }
  const temaSistem = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  document.documentElement.dataset.theme = temaSistem;
  return temaSistem;
}

const LINK_PLAYLIST_AUTOMAT = "";

const PLAYLIST_INITIAL = [
  { id: "relax-1", nume: "Pian Cald de Lectură", artist: "Orchestra Sanctuarului", subtitlu: "Nocturnă Liniștitoare • Audio Intern", icon: "🎹", categorie: "relax" },
  { id: "relax-2", nume: "Lofi Study Chords", artist: "BiblioTech Beats", subtitlu: "Acorduri Calde de Seară • Audio Intern", icon: "☕", categorie: "relax" },
  { id: "relax-3", nume: "Harpă & Ambianță din Sanctuar", artist: "Ansamblul Celtic", subtitlu: "Armonii Acustice • Audio Intern", icon: "🌿", categorie: "relax" },
  { id: "relax-4", nume: "Meditație la Lumina Lumânării", artist: "Zen Arhivar", subtitlu: "Zen Pad Ambiental • Audio Intern", icon: "🕯️", categorie: "relax" },
  { id: "relax-5", nume: "Reverie Astrală", artist: "Observatorul Cosmic", subtitlu: "Dreamy Rhodes • Audio Intern", icon: "🌌", categorie: "relax" },

  { id: "bKDdT_nyP54", nume: "Smack That", artist: "Akon ft. Eminem", subtitlu: "YouTube Audio Stream", icon: "🔥", categorie: "youtube" },
  { id: "uelHwf8o7_U", nume: "Love The Way You Lie", artist: "Eminem ft. Rihanna", subtitlu: "YouTube Audio Stream", icon: "🎤", categorie: "youtube" },
  { id: "5qm8PH4xAss", nume: "In Da Club", artist: "50 Cent", subtitlu: "YouTube Audio Stream", icon: "🎧", categorie: "youtube" },
  { id: "YR5ApYxkU-U", nume: "Another Brick In The Wall", artist: "Pink Floyd", subtitlu: "YouTube Audio Stream", icon: "🎸", categorie: "youtube" },
  { id: "fJ9rUzIMcZQ", nume: "Bohemian Rhapsody", artist: "Queen", subtitlu: "YouTube Audio Stream", icon: "👑", categorie: "youtube" },
  { id: "4NRXx6U8ABQ", nume: "Blinding Lights", artist: "The Weeknd", subtitlu: "YouTube Audio Stream", icon: "✨", categorie: "youtube" },
  { id: "JGwWNGJdvx8", nume: "Shape of You", artist: "Ed Sheeran", subtitlu: "YouTube Audio Stream", icon: "🎶", categorie: "youtube" },
  { id: "kJQP7kiw5Fk", nume: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", subtitlu: "YouTube Audio Stream", icon: "🌴", categorie: "youtube" },
  { id: "RgKAFK5djSk", nume: "See You Again", artist: "Wiz Khalifa ft. Charlie Puth", subtitlu: "YouTube Audio Stream", icon: "🎹", categorie: "youtube" },
  { id: "60ItHLz5WEA", nume: "Faded", artist: "Alan Walker", subtitlu: "YouTube Audio Stream", icon: "💿", categorie: "youtube" },
];

function separaArtistSiTitlu(titluBrut, canalDefault = "YouTube") {
  if (!titluBrut) return { nume: "Melodie YouTube", artist: canalDefault };
  const curat = titluBrut
    .replace(/\(Official.*?\)/gi, "")
    .replace(/\[Official.*?\]/gi, "")
    .replace(/\(Lyrics.*?\)/gi, "")
    .replace(/\(Audio.*?\)/gi, "")
    .trim();

  if (curat.includes(" - ")) {
    const [parteArtist, ...restTitlu] = curat.split(" - ");
    return {
      artist: parteArtist.trim() || canalDefault,
      nume: restTitlu.join(" - ").trim() || curat,
    };
  }
  return {
    nume: curat,
    artist: canalDefault.replace(" - Topic", "").trim(),
  };
}

function extragePieseDinHtmlPlaylist(html) {
  const pieseGasite = [];
  const idVazute = new Set();
  const matchJson =
    html.match(/var ytInitialData\s*=\s*(\{.*?\});<\/script>/s) ||
    html.match(/ytInitialData\s*=\s*(\{.*?\});/s);

  if (matchJson && matchJson[1]) {
    try {
      const data = JSON.parse(matchJson[1]);
      function cautaRecursiv(obiect) {
        if (!obiect || typeof obiect !== "object") return;
        const renderer =
          obiect.playlistVideoRenderer || obiect.playlistPanelVideoRenderer;
        if (renderer && renderer.videoId && !idVazute.has(renderer.videoId)) {
          idVazute.add(renderer.videoId);
          const titluBrut =
            renderer.title?.runs?.[0]?.text ||
            renderer.title?.simpleText ||
            "Melodie YouTube";
          const canal =
            renderer.shortBylineText?.runs?.[0]?.text ||
            renderer.longBylineText?.runs?.[0]?.text ||
            "YouTube";
          const { nume, artist } = separaArtistSiTitlu(titluBrut, canal);
          pieseGasite.push({
            id: renderer.videoId,
            nume,
            artist,
            subtitlu: "Importat din Playlist YouTube",
            icon: "🎵",
            categorie: "youtube",
            custom: true,
          });
        }
        Object.values(obiect).forEach(cautaRecursiv);
      }
      cautaRecursiv(data);
    } catch {
      // Ignoră erorile
    }
  }
  return pieseGasite;
}

const MELODII_RELAX = {
  "relax-1": { tempo: 2200, wave: "sine", acorduri: [[261.63, 329.63, 392.0, 523.25], [220.0, 261.63, 329.63, 440.0], [174.61, 220.0, 261.63, 349.23], [196.0, 246.94, 293.66, 392.0]] },
  "relax-2": { tempo: 1900, wave: "triangle", acorduri: [[293.66, 349.23, 440.0, 523.25], [196.0, 246.94, 329.63, 392.0], [261.63, 329.63, 392.0, 493.88], [220.0, 261.63, 329.63, 392.0]] },
  "relax-3": { tempo: 1600, wave: "sine", acorduri: [[329.63, 392.0, 493.88, 659.25], [261.63, 329.63, 392.0, 523.25], [293.66, 369.99, 440.0, 587.33], [246.94, 329.63, 392.0, 493.88]] },
  "relax-4": { tempo: 2800, wave: "sine", acorduri: [[174.61, 261.63, 329.63, 440.0], [196.0, 293.66, 349.23, 440.0], [220.0, 329.63, 392.0, 523.25], [164.81, 246.94, 329.63, 392.0]] },
  "relax-5": { tempo: 2400, wave: "triangle", acorduri: [[261.63, 311.13, 392.0, 466.16], [207.65, 261.63, 311.13, 392.0], [233.08, 293.66, 349.23, 466.16], [196.0, 246.94, 293.66, 392.0]] },
};

const CITATE_SANCTUAR = [
  "„O cameră fără cărți este ca un corp fără suflet.” — Marcus Tullius Cicero",
  "„Talentul fără muncă grea nu înseamnă nimic. Dedicarea scrie istoria.” — Cristiano Ronaldo (CR7)",
  "„Cărțile sunt oglinzi: vezi în ele doar ceea ce ai deja înăuntrul tău.” — Carlos Ruiz Zafón",
  "„Nu există prieten mai loial decât o carte deschisă la lumina lumânării.” — Ernest Hemingway",
];

const PAGINI_REZUMAT_CR7 = [
  {
    stangaTitlu: "Capitolul I • Rădăcinile din Madeira",
    stangaSubtitlu: "Funchal, Portugalia — Drumul unui visător",
    stangaText: "Născut pe insula vulcanică Madeira, într-un cartier modest din Funchal, Cristiano Ronaldo dos Santos Aveiro a crescut cu mingea lipită de ghete pe străzile înguste din Santo António...",
    stangaCitat: "„Plângeam aproape în fiecare zi de dorul familiei, dar știam că fotbalul este destinul meu.”",
    dreaptaTitlu: "Capitolul I • Scânteia de la Lisabona",
    dreaptaSubtitlu: "Seara care a convins întregul stadion",
    dreaptaText: "În august 2003, la inaugurarea stadionului José Alvalade împotriva lui Manchester United, puștiul de 18 ani a făcut șah-mat apărarea englezilor...",
    dreaptaStat: "⚡ 2003: Transferul la Manchester United.",
  },
  {
    stangaTitlu: "Capitolul II • Era Galactică (CR7)",
    stangaSubtitlu: "Old Trafford & Santiago Bernabéu",
    stangaText: "Sub îndrumarea lui Sir Alex Ferguson, Cristiano s-a transformat dintr-un dribler spectaculos într-o mașinărie completă de goluri...",
    stangaCitat: "„În mintea mea, nu sunt doar un jucător. Muncesc în fiecare zi ca să fiu cel mai bun din istorie.”",
    dreaptaTitlu: "Capitolul II • Regele Ligii Campionilor",
    dreaptaSubtitlu: "450 de goluri în 438 de meciuri la Real Madrid",
    dreaptaText: "La Madrid, CR7 a rescris toate legile fizicii și ale statisticii...",
    dreaptaStat: "🏆 5 Baloane de Aur • 5 Trofee Champions League.",
  },
  {
    stangaTitlu: "Capitolul III • Gloria cu Portugalia",
    stangaSubtitlu: "EURO 2016 & Națiunea Lusitană",
    stangaText: "Dincolo de trofeele de club, coroana supremă a venit în 2016, când a condus Portugalia către primul trofeu major...",
    stangaCitat: "„Recordurile nu le urmăresc eu — recordurile mă urmăresc pe mine!”",
    dreaptaTitlu: "Capitolul III • Moștenirea Nemuritoare",
    dreaptaSubtitlu: "Peste 900 de goluri oficiale",
    dreaptaText: "Acest volum surprinde esența filozofiei CR7: somn calculat la secundă, antrenamente suplimentare, refuzul plafonării...",
    dreaptaStat: "👑 Lecția cărții: Obsesia pentru perfecțiune învinge întotdeauna talentul leneș.",
  },
];

export default function App() {
  const [carti, setCarti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tema, setTema] = useState(temaInitiala);
  const [filtru, setFiltru] = useState("toate");
  const [grupare, setGrupare] = useState("gen");
  const [cautare, setCautare] = useState("");
  const [indexCitat, setIndexCitat] = useState(0);

  const [inBiblioteca, setInBiblioteca] = useState(false);
  const [seDeschide, setSeDeschide] = useState(false);
  const [tranzitieRaft, setTranzitieRaft] = useState("idle");

  const [ambientActiv, setAmbientActiv] = useState(false);
  const audioCtxRef = useRef(null);
  const ambientIntervalRef = useRef(null);

  const [playlistPauza, setPlaylistPauza] = useState(() => {
    try {
      const salvate = JSON.parse(
        localStorage.getItem("bibliotech_playlist_custom") || "[]"
      );
      const idInitiale = new Set(PLAYLIST_INITIAL.map((p) => p.id));
      const doarNoi = salvate.filter((p) => !idInitiale.has(p.id));
      return [...PLAYLIST_INITIAL, ...doarNoi];
    } catch {
      return PLAYLIST_INITIAL;
    }
  });

  const [arataModalMuzica, setArataModalMuzica] = useState(false);
  const [cautareMuzica, setCautareMuzica] = useState("");
  const [linkImportPlaylist, setLinkImportPlaylist] = useState("");
  const [seImportaPlaylist, setSeImportaPlaylist] = useState(false);
  const [mesajImport, setMesajImport] = useState("");
  const [selectId, setSelectId] = useState(PLAYLIST_INITIAL[0].id);
  const [piesaActivaId, setPiesaActivaId] = useState("");
  const [ytEmbedUrl, setYtEmbedUrl] = useState("");
  const [muzicaPauzaActiva, setMuzicaPauzaActiva] = useState(false);
  const synthIntervalRef = useRef(null);

  const [timerPornit, setTimerPornit] = useState(false);
  const [secundeRamas, setSecundeRamas] = useState(25 * 60);

  const [carteJurnal, setCarteJurnal] = useState(null);
  const [jurnalRating, setJurnalRating] = useState(5);
  const [jurnalPagina, setJurnalPagina] = useState(0);
  const [jurnalTotalPagini, setJurnalTotalPagini] = useState(320);
  const [jurnalCitat, setJurnalCitat] = useState("");
  const [jurnalNotite, setJurnalNotite] = useState("");

  const [arataCardShare, setArataCardShare] = useState(false);
  const [mesajCopiat, setMesajCopiat] = useState(false);
  const [carteOracol, setCarteOracol] = useState(null);

  const [carteRezumat, setCarteRezumat] = useState(null);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [sweepDir, setSweepDir] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const data = await fetchCarti();
        if (!ignore) {
          const jurnaleSalvate = JSON.parse(
            localStorage.getItem("bibliotech_jurnale") || "{}"
          );
          const cartiCuJurnal = data.map((c) => {
            if (jurnaleSalvate[c.id]) {
              return { ...c, ...jurnaleSalvate[c.id] };
            }
            return c;
          });
          setCarti(cartiCuJurnal);
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    if (LINK_PLAYLIST_AUTOMAT.trim()) {
      importaDeLaLinkYoutube(LINK_PLAYLIST_AUTOMAT.trim(), true);
    }
  }, []);

  useEffect(() => {
    function handleMouseMove(e) {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let interval = null;
    if (timerPornit && secundeRamas > 0) {
      interval = setInterval(() => setSecundeRamas((prev) => prev - 1), 1000);
    } else if (secundeRamas === 0) {
      setTimerPornit(false);
      alert("⏳ Sesiunea de lectură s-a încheiat! Felicitări.");
      setSecundeRamas(25 * 60);
    }
    return () => clearInterval(interval);
  }, [timerPornit, secundeRamas]);

  useEffect(() => {
    return () => {
      if (ambientIntervalRef.current) clearInterval(ambientIntervalRef.current);
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    };
  }, []);

  function formateazaTimp(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  function salveazaPieseNoiInPlaylist(pieseNoi) {
    if (!pieseNoi || pieseNoi.length === 0) return 0;
    let adaugateCount = 0;
    setPlaylistPauza((prev) => {
      const idExistente = new Set(prev.map((p) => p.id));
      const filtrate = pieseNoi.filter((p) => {
        if (!p.id || idExistente.has(p.id)) return false;
        idExistente.add(p.id);
        return true;
      });
      adaugateCount = filtrate.length;
      const nouaLista = [...prev, ...filtrate];
      const doarCustom = nouaLista.filter((p) => p.custom);
      localStorage.setItem("bibliotech_playlist_custom", JSON.stringify(doarCustom));
      return nouaLista;
    });
    return adaugateCount;
  }

  async function importaDeLaLinkYoutube(inputRaw, silent = false) {
    if (!inputRaw) return;
    if (!silent) {
      setSeImportaPlaylist(true);
      setMesajImport("⏳ Se scanează link-ul și se extrag melodiile...");
    }
    try {
      const pieseColectate = [];
      const linkuri = inputRaw.split(/[\s,\n]+/).map((s) => s.trim()).filter(Boolean);
      for (const link of linkuri) {
        let listId = "";
        let videoId = "";
        if (link.includes("list=")) {
          listId = link.split("list=")[1]?.split("&")[0];
        }
        if (link.includes("youtu.be/")) {
          videoId = link.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0];
        } else if (link.includes("watch?v=")) {
          videoId = link.split("watch?v=")[1]?.split("&")[0];
        } else if (/^[a-zA-Z0-9_-]{11}$/.test(link)) {
          videoId = link;
        }

        if (listId && !listId.startsWith("RD")) {
          const targetUrl = `https://www.youtube.com/playlist?list=${listId}`;
          const proxyUrls = [
            `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
            `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
          ];
          for (const proxy of proxyUrls) {
            try {
              const res = await fetch(proxy);
              if (res.ok) {
                const html = await res.text();
                const extrase = extragePieseDinHtmlPlaylist(html);
                if (extrase.length > 0) { pieseColectate.push(...extrase); break; }
              }
            } catch { }
          }
        }

        if (videoId && pieseColectate.length === 0) {
          try {
            const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
            const info = await res.json();
            const { nume, artist } = separaArtistSiTitlu(info.title || `Melodie YouTube (${videoId})`, info.author_name || "YouTube");
            pieseColectate.push({ id: videoId, nume, artist, subtitlu: "Importat automat de pe YouTube", icon: "🎵", categorie: "youtube", custom: true });
          } catch {
            pieseColectate.push({ id: videoId, nume: `Melodie YouTube (${videoId})`, artist: "Colecția Personală", subtitlu: "YouTube Audio Stream", icon: "🎵", categorie: "youtube", custom: true });
          }
        }
      }
      if (pieseColectate.length > 0) {
        salveazaPieseNoiInPlaylist(pieseColectate);
        setSelectId(pieseColectate[0].id);
        if (!silent) {
          setMesajImport(`✨ S-au importat ${pieseColectate.length} piese în playlist!`);
          setLinkImportPlaylist("");
        }
      } else if (!silent) {
        setMesajImport("⚠️ Nu am putut citi lista (verifică să fie un Playlist YouTube Public sau un link de melodie).");
      }
    } catch {
      if (!silent) setMesajImport("⚠️ Eroare la importarea link-ului.");
    } finally {
      if (!silent) {
        setSeImportaPlaylist(false);
        setTimeout(() => setMesajImport(""), 5000);
      }
    }
  }

  function handleStergePiesaCustom(idDeSters, e) {
    e.stopPropagation();
    setPlaylistPauza((prev) => {
      const actualizat = prev.filter((p) => p.id !== idDeSters);
      const doarCustom = actualizat.filter((p) => p.custom);
      localStorage.setItem("bibliotech_playlist_custom", JSON.stringify(doarCustom));
      return actualizat;
    });
  }

  function initAudioContext() {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  }

  function cantaAcordCald(frecvente, tipUnda = "sine", durata = 2.1, volum = 0.045) {
    const ctx = initAudioContext();
    const now = ctx.currentTime;
    frecvente.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = tipUnda;
      const startNota = now + idx * 0.18;
      osc.frequency.setValueAtTime(freq, startNota);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(900, startNota);
      gain.gain.setValueAtTime(0.0001, startNota);
      gain.gain.linearRampToValueAtTime(volum, startNota + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, startNota + durata);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startNota);
      osc.stop(startNota + durata + 0.05);
    });
  }

  function toggleAmbient() {
    initAudioContext();
    if (!ambientActiv) {
      const progresieAmbient = [
        [220.0, 261.63, 329.63, 392.0],
        [174.61, 220.0, 261.63, 349.23],
        [261.63, 329.63, 392.0, 493.88],
        [196.0, 246.94, 293.66, 392.0],
      ];
      let pas = 0;
      cantaAcordCald(progresieAmbient[0], "sine", 2.6, 0.035);
      ambientIntervalRef.current = setInterval(() => {
        pas = (pas + 1) % progresieAmbient.length;
        cantaAcordCald(progresieAmbient[pas], "sine", 2.6, 0.035);
      }, 2600);
      setAmbientActiv(true);
    } else {
      if (ambientIntervalRef.current) {
        clearInterval(ambientIntervalRef.current);
        ambientIntervalRef.current = null;
      }
      setAmbientActiv(false);
    }
  }

  function pornestePiesaSelectata(idPiesa) {
    initAudioContext();
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    setYtEmbedUrl("");

    if (MELODII_RELAX[idPiesa]) {
      const config = MELODII_RELAX[idPiesa];
      let indexAcord = 0;
      cantaAcordCald(config.acorduri[0], config.wave, config.tempo / 1000, 0.06);
      synthIntervalRef.current = setInterval(() => {
        indexAcord = (indexAcord + 1) % config.acorduri.length;
        cantaAcordCald(config.acorduri[indexAcord], config.wave, config.tempo / 1000, 0.06);
      }, config.tempo);
      setMuzicaPauzaActiva(true);
      setPiesaActivaId(idPiesa);
    } else {
      let videoId = idPiesa.trim();
      if (videoId.includes("youtu.be/")) videoId = videoId.split("youtu.be/")[1]?.split("?")[0];
      else if (videoId.includes("watch?v=")) videoId = videoId.split("watch?v=")[1]?.split("&")[0];
      setYtEmbedUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
      setMuzicaPauzaActiva(true);
      setPiesaActivaId(idPiesa);
    }
  }

  function handlePornesteMuzica(e) {
    e.preventDefault();
    pornestePiesaSelectata(selectId);
    setArataModalMuzica(false);
  }

  function handleOpresteMuzicaPauza() {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    setYtEmbedUrl("");
    setMuzicaPauzaActiva(false);
    setPiesaActivaId("");
    setArataModalMuzica(false);
  }

  function redaFosnetCarte() {
    try {
      const ctx = initAudioContext();
      const bufferSize = Math.floor(ctx.sampleRate * 0.11);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const env = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env * 0.85;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1250;
      const gain = ctx.createGain();
      gain.gain.value = 0.045;
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch {}
  }

  function redaSunetMagie() {
    try {
      const ctx = initAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(528, now);
      osc.frequency.exponentialRampToValueAtTime(792, now + 0.35);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch {}
  }

  function handleIntra() {
    setSeDeschide(true);
    setTimeout(() => setInBiblioteca(true), 1800);
  }

  function handleSchimbaTema(nouaTema) {
    setTema(nouaTema);
    document.documentElement.dataset.theme = nouaTema;
    localStorage.setItem("bibliotech_tema", nouaTema);
  }

  function schimbaFiltruCuTranzitie(noulFiltru) {
    if (noulFiltru === filtru || tranzitieRaft !== "idle") return;
    setTranzitieRaft("out");
    setTimeout(() => {
      setFiltru(noulFiltru);
      setTranzitieRaft("in");
      setTimeout(() => setTranzitieRaft("idle"), 550);
    }, 360);
  }

  function schimbaGrupareCuTranzitie(nouaGrupare) {
    if (nouaGrupare === grupare || tranzitieRaft !== "idle") return;
    setTranzitieRaft("out");
    setTimeout(() => {
      setGrupare(nouaGrupare);
      setTranzitieRaft("in");
      setTimeout(() => setTranzitieRaft("idle"), 550);
    }, 360);
  }

  // =======================================================================
  // Funcțiile API pt Etapa 7: Așteptăm Serverul înainte să updatăm state-ul
  // =======================================================================
  async function handleAdd(carteNoua) {
    const creat = await createCarte(carteNoua);
    setCarti((prev) => [...prev, creat]);
    redaSunetMagie();
  }

  async function handleToggle(id) {
    const carte = carti.find((c) => c.id === id);
    try {
      const actualizat = await updateCarte(id, { citita: !carte.citita });
      setCarti((prev) => prev.map((c) => (c.id === id ? actualizat : c)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteCarte(id);
      setCarti((prev) => prev.filter((c) => c.id !== id));
      if (carteJurnal && carteJurnal.id === id) setCarteJurnal(null);
      if (carteOracol && carteOracol.id === id) setCarteOracol(null);
      if (carteRezumat && carteRezumat.id === id) setCarteRezumat(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleInvocaOracol() {
    if (carti.length === 0) return;
    const necitite = carti.filter((c) => !c.citita);
    const bazin = necitite.length > 0 ? necitite : carti;
    const aleasa = bazin[Math.floor(Math.random() * bazin.length)];
    setCarteOracol(aleasa);
    redaSunetMagie();
  }

  function handleDeschideJurnal(carte) {
    setCarteJurnal(carte);
    setJurnalRating(Number(carte.rating) || 5);
    setJurnalPagina(Number(carte.paginaCurenta) || 0);
    setJurnalTotalPagini(Number(carte.totalPagini) || 320);
    setJurnalCitat(carte.citat || "");
    setJurnalNotite(carte.notite || "");
  }

  function handleDeschideRezumat(carte) {
    setCarteRezumat(carte);
    setSpreadIndex(0);
    setSweepDir("");
    redaFosnetCarte();
  }

  function handleSchimbaPaginaRezumat(directie, targetExplicit = null) {
    if (sweepDir !== "") return;
    if (directie === "next" && spreadIndex < 2) {
      const urmatorul = targetExplicit !== null ? targetExplicit : spreadIndex + 1;
      redaFosnetCarte();
      setSweepDir("sweep-next");
      setTimeout(() => setSpreadIndex(urmatorul), 340);
      setTimeout(() => setSweepDir(""), 760);
    } else if (directie === "prev" && spreadIndex > 0) {
      const anteriorul = targetExplicit !== null ? targetExplicit : spreadIndex - 1;
      redaFosnetCarte();
      setSweepDir("sweep-prev");
      setTimeout(() => setSpreadIndex(anteriorul), 340);
      setTimeout(() => setSweepDir(""), 760);
    }
  }

  const carteCr7Id = (() => {
    const gasita = carti.find(
      (c) =>
        c.titluAutor &&
        (c.titluAutor.toLowerCase().includes("cr7") ||
          c.titluAutor.toLowerCase().includes("ronaldo"))
    );
    return gasita ? gasita.id : carti[0]?.id;
  })();

  const esteCarteaCr7 =
    carteRezumat && String(carteRezumat.id) === String(carteCr7Id);

  function obtineContinutSpread(carte, indexSpread) {
    if (esteCarteaCr7) return PAGINI_REZUMAT_CR7[indexSpread];
    const [titluCurat, autorCurat] =
      carte?.titluAutor && carte.titluAutor.includes("-")
        ? carte.titluAutor.split("-").map((s) => s.trim())
        : [carte?.titluAutor || "Manuscris", "Autor Clasic"];

    const paginiGenerice = [
      {
        stangaTitlu: `Fila I • ${titluCurat}`,
        stangaSubtitlu: `Autor: ${autorCurat} • Colecția ${carte?.gen || "Literatură"}`,
        stangaText: "Acest volum face parte din arhiva Sanctuarului BiblioTech. Paginile sale păstrează parfumul cernelii vechi, însă rezumatul detaliat nu a fost încă transcris de cronicari.",
        stangaCitat: carte?.citat || "„Doar ediția specială CR7 are în prezent cronica integrală transcrisă în sanctuar.”",
        dreaptaTitlu: "Fila II • Fișa Tehnică a Ediției",
        dreaptaSubtitlu: `Format: ${carte?.format || "Broșată"} • Evaluare: ${"★".repeat(Number(carte?.rating) || 5)}`,
        dreaptaText: carte?.notite || "Poți răsfoi mai departe filele acestui manuscris direct de la colțul îndoit al paginii pentru a inspecta pergamentul.",
        dreaptaStat: `📜 Status în arhivă: ${carte?.citita ? "Volum parcurs / Împrumutat" : "Disponibil la raft"}`,
      },
      {
        stangaTitlu: "Fila III • Pergament în Așteptare",
        stangaSubtitlu: "Secțiunea Cronicarilor",
        stangaText: "Fiecare volum din bibliotecă poate fi răsfoit filă cu filă. Pentru acest manuscris, filele de mijloc sunt păstrate albe pentru viitoarele traduceri și adnotări.",
        stangaCitat: "„Răsfoiește mai departe pentru a ajunge la sigiliul final al cărții.”",
        dreaptaTitlu: "Fila IV • Însemnări de Arhivă",
        dreaptaSubtitlu: "Sanctuarul Literar BiblioTech",
        dreaptaText: "Dacă dorești să citești povestea completă pe 6 pagini despre ambiție, recorduri și trofee, deschide volumul special dedicat lui Cristiano Ronaldo (CR7).",
        dreaptaStat: "🕯️ Sfat: Apasă pe colțul îndoit al paginii pentru a schimba foaia.",
      },
      {
        stangaTitlu: "Fila V • Epilogul Manuscrisului",
        stangaSubtitlu: "Ultima deschidere a volumului",
        stangaText: "Ai ajuns la ultimele pagini ale acestui volum. Păstrează cartea pe raftul tău preferat sau marcheaz-o ca parcursă după finalizarea lecturii.",
        stangaCitat: "„O carte citită este o călătorie care rămâne pentru totdeauna în memorie.”",
        dreaptaTitlu: "Fila VI • Sigiliul Bibliotecii",
        dreaptaSubtitlu: "Arhivă Oficială Verificată",
        dreaptaText: "Manuscris înregistrat în catalogul digital BiblioTech. Toate drepturile de lectură și adnotare aparțin cititorului.",
        dreaptaStat: "⚜️ Sfârșitul Manuscrisului • Folosește colțul din stânga-jos pentru întoarcere.",
      },
    ];
    return paginiGenerice[indexSpread];
  }

  function handleSalveazaJurnal(e) {
    e.preventDefault();
    if (!carteJurnal) return;
    const dateActualizate = {
      rating: Number(jurnalRating),
      paginaCurenta: Math.min(Number(jurnalPagina), Number(jurnalTotalPagini)),
      totalPagini: Math.max(1, Number(jurnalTotalPagini)),
      citat: jurnalCitat,
      notite: jurnalNotite,
    };
    setCarti((prev) => prev.map((c) => c.id === carteJurnal.id ? { ...c, ...dateActualizate } : c));
    const jurnaleSalvate = JSON.parse(localStorage.getItem("bibliotech_jurnale") || "{}");
    jurnaleSalvate[carteJurnal.id] = dateActualizate;
    localStorage.setItem("bibliotech_jurnale", JSON.stringify(jurnaleSalvate));
    redaSunetMagie();
    setCarteJurnal(null);
  }

  const cartiAfisate = carti.filter((carte) => {
    const potrivireFiltru = filtru === "toate" ? true : filtru === "disponibile" ? !carte.citita : carte.citita;
    const termen = cautare.trim().toLowerCase();
    const potrivireCautare = !termen || (carte.titluAutor && carte.titluAutor.toLowerCase().includes(termen)) || (carte.gen && carte.gen.toLowerCase().includes(termen));
    return potrivireFiltru && potrivireCautare;
  });

  const termenMuzica = cautareMuzica.trim().toLowerCase();
  const pieseFiltrate = playlistPauza.filter((p) => !termenMuzica || p.nume.toLowerCase().includes(termenMuzica) || (p.artist && p.artist.toLowerCase().includes(termenMuzica)) || (p.subtitlu && p.subtitlu.toLowerCase().includes(termenMuzica)));
  const pieseRelaxFiltrate = pieseFiltrate.filter((p) => p.categorie === "relax");
  const pieseYoutubeFiltrate = pieseFiltrate.filter((p) => p.categorie === "youtube");

  const categoriiUnice = grupare === "gen" ? [...new Set(cartiAfisate.map((c) => c.gen))].sort() : [...new Set(cartiAfisate.map((c) => c.rating))].sort((a, b) => b - a);
  const imprumutateCount = carti.filter((c) => c.citita).length;
  const disponibileCount = carti.length - imprumutateCount;
  const procentLectura = jurnalTotalPagini > 0 ? Math.min(100, Math.round((jurnalPagina / jurnalTotalPagini) * 100)) : 0;
  const rangCititor = imprumutateCount >= 8 ? "🔮 Marele Mag Arhivar" : imprumutateCount >= 4 ? "⚜️ Maestru Cronicar" : imprumutateCount >= 1 ? "🕯️ Păzitor al Pergamentelor" : "📜 Inițiat al Sanctuarului";
  const procentRangHeader = carti.length > 0 ? Math.round((imprumutateCount / carti.length) * 100) : 0;
  const mediaStele = carti.length > 0 ? (carti.reduce((acc, c) => acc + (Number(c.rating) || 5), 0) / carti.length).toFixed(1) : "5.0";
  const topCarti = [...carti].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)).slice(0, 3);

  function handleCopiazaRezumat() {
    const textShare = `🕯️ SANCTUARUL BIBLIOTECH 🕯️\nRang: ${rangCititor}\n📚 Volume în arhivă: ${carti.length} (${imprumutateCount} parcurse)\n⭐ Evaluare medie: ${mediaStele}/5\n🏆 Top Manuscrise:\n${topCarti.map((c) => `• ${c.titluAutor} (${"★".repeat(Number(c.rating) || 5)})`).join("\n")}\n🔗 Explorează colecția: ${window.location.href}`;
    navigator.clipboard.writeText(textShare);
    setMesajCopiat(true);
    setTimeout(() => setMesajCopiat(false), 3000);
  }

  const spreadCurent = carteRezumat ? obtineContinutSpread(carteRezumat, spreadIndex) : null;

  return (
    <>
      <div className="ambient-library-bg" aria-hidden="true"></div>
      <div className="ambient-candle-glows" aria-hidden="true"></div>
      <div className="cosmic-stars" aria-hidden="true"></div>
      <div className="bottom-warm-vignette" aria-hidden="true"></div>
      <div className="mouse-candle-light" aria-hidden="true"></div>

      {ytEmbedUrl && (
        <div style={{ display: "none" }}>
          <iframe title="Muzică Pauză YT" src={ytEmbedUrl} allow="autoplay; encrypted-media"></iframe>
        </div>
      )}

      {!inBiblioteca && (
        <div className={`landing-portal ${seDeschide ? "opening" : ""}`}>
          <div className="portal-inner-light" aria-hidden="true"></div>
          <div className="door door-left" aria-hidden="true"><div className="door-panel-top"></div><div className="door-panel-bottom"></div><div className="door-handle"></div></div>
          <div className="door door-right" aria-hidden="true"><div className="door-panel-top"></div><div className="door-panel-bottom"></div><div className="door-handle"></div></div>
          <div className="portal-center-content">
            <div className="portal-candle" aria-hidden="true"><span className="flacara-3d"></span><span className="fitil-3d"></span><span className="ceara-3d"></span></div>
            <h1 className="portal-title">BiblioTech</h1>
            <p className="portal-subtitle">Sanctuarul Cărților și al Poveștilor</p>
            <button className="enter-library-btn" onClick={handleIntra} disabled={seDeschide}><span className="btn-key-icon">🗝️</span> Intră în Bibliotecă</button>
          </div>
        </div>
      )}

      <div className={`main-app-wrapper ${seDeschide ? "app-entering" : ""} ${inBiblioteca ? "app-entered" : ""}`}>
        <nav className="top-navbar">
          <div className="navbar-inner">
            <div className="navbar-brand">
              <div className="lumanare-realista navbar-candle" aria-hidden="true"><span className="aura-lumanare"></span><span className="flacara-3d"></span><span className="fitil-3d"></span><span className="picatura-ceara"></span><span className="ceara-3d"></span><span className="suport-auriu"></span></div>
              <div><span className="brand-name">BiblioTech</span><span className="brand-tag">Arhivă Digitală</span></div>
            </div>
            <div className="navbar-search">
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input type="text" placeholder="Caută după titlu, autor sau colecție..." value={cautare} onChange={(e) => setCautare(e.target.value)} aria-label="Caută cărți" />
              {cautare && <button className="clear-search-btn" onClick={() => setCautare("")} title="Șterge căutarea">✕</button>}
            </div>
            <div className="navbar-actions">
              <button type="button" className={`timer-pomodoro-btn ${timerPornit ? "running" : ""}`} onClick={() => setTimerPornit(!timerPornit)} title="Pornește clepsidra (25 min)">⏳ {formateazaTimp(secundeRamas)}</button>
              <button type="button" className={`ambient-toggle-btn ${ambientActiv ? "active" : ""}`} onClick={toggleAmbient} title="Oprește muzica ambientală">{ambientActiv ? "🎵 Ambiental: ON" : "🔇 Ambiental: OFF"}</button>
              <button type="button" className={`ambient-toggle-btn ${muzicaPauzaActiva ? "active" : ""}`} onClick={() => setArataModalMuzica(true)} title="Alege muzica de pauză">{muzicaPauzaActiva ? "🎧 Muzică: ON" : "🎵 Muzică de pauză"}</button>
              <button type="button" className="share-shelf-btn" onClick={() => setArataCardShare(true)}>🏆 Cardul Meu</button>
              <div className="realm-selector-wrapper">
                <select className="realm-select" value={tema} onChange={(e) => handleSchimbaTema(e.target.value)} aria-label="Alege Tărâmul Vizual">
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

        <main className="site-main-container">
          <header className="app-header">
            <div className="header-bg-image" aria-hidden="true"></div>
            <div className="header-warm-overlay" aria-hidden="true"></div>
            <span className="hero-corner corner-tl" aria-hidden="true">❖</span><span className="hero-corner corner-tr" aria-hidden="true">❖</span><span className="hero-corner corner-bl" aria-hidden="true">❖</span><span className="hero-corner corner-br" aria-hidden="true">❖</span>
            <div className="header-candles-group" aria-hidden="true">
              <div className="candle-3d candle-tall"><span className="flame"></span><span className="wick"></span><span className="wax"></span></div>
              <div className="candle-3d candle-medium"><span className="flame"></span><span className="wick"></span><span className="wax"></span></div>
              <div className="candle-3d candle-short"><span className="flame"></span><span className="wick"></span><span className="wax"></span></div>
            </div>
            <div className="header-content">
              <span className="hero-eyebrow">✦ SALA DE LECTURĂ & COLECȚII ✦</span>
              <h1>Sanctuarul Literar BiblioTech</h1>
              <p>Explorează volumele în ediție 3D, răsfoiește rezumatele pe ecran și păstrează-ți manuscrisele în arhivă</p>
              <div className="hero-quote-ribbon">
                <span className="hero-quote-text">{CITATE_SANCTUAR[indexCitat]}</span>
                <button type="button" className="hero-quote-next-btn" onClick={() => setIndexCitat((prev) => (prev + 1) % CITATE_SANCTUAR.length)} title="Schimbă citatul">↻ Alt citat</button>
              </div>
              <div className="hero-royal-bar">
                <div className="hero-rank-chip"><span className="hero-rank-label">Rangul tău:</span><strong>{rangCititor}</strong></div>
                <div className="hero-xp-box">
                  <div className="hero-xp-labels"><span>Progres Colecție</span><span>{imprumutateCount}/{carti.length} parcurse ({procentRangHeader}%)</span></div>
                  <div className="hero-xp-track"><div className="hero-xp-fill" style={{ width: `${procentRangHeader}%` }}></div></div>
                </div>
                {carti.length > 0 && (
                  <button type="button" className="hero-cr7-spotlight-btn" onClick={() => { const carteCr7 = carti.find((c) => String(c.id) === String(carteCr7Id)) || carti[0]; handleDeschideRezumat(carteCr7); }}>⚽ Citește Ediția CR7</button>
                )}
              </div>
            </div>
          </header>

          {/* ================================================================================= */}
          {/* Formularul pe pagină (Cerința Etapei 7 - S7-R1, S7-R6) + Bara Control */}
          {/* ================================================================================= */}
       <div style={{ marginBottom: "30px" }}> {/* Spațiu sub formular, fără chenarul mare .panel */}
  <CarteForm onAdd={handleAdd} /> {/* Randează direct caseta mică de mahon */}
</div> {/* Închide containerul */}

          <section className="panel">
            <div className="catalog-control-bar">
              <div className="library-nav-tabs" role="tablist">
                <button className={`lib-tab tab-all ${filtru === "toate" ? "active" : ""}`} onClick={() => schimbaFiltruCuTranzitie("toate")}><span className="tab-icon">🏛️</span><span className="tab-label">Marea Sală</span><span className="tab-count">{carti.length}</span></button>
                <button className={`lib-tab tab-available ${filtru === "disponibile" ? "active" : ""}`} onClick={() => schimbaFiltruCuTranzitie("disponibile")}><span className="tab-icon">🕯️</span><span className="tab-label">Disponibile</span><span className="tab-count">{disponibileCount}</span></button>
                <button className={`lib-tab tab-borrowed ${filtru === "imprumutate" ? "active" : ""}`} onClick={() => schimbaFiltruCuTranzitie("imprumutate")}><span className="tab-icon">🔮</span><span className="tab-label">Împrumutate</span><span className="tab-count">{imprumutateCount}</span></button>
                <button type="button" className="oracle-trigger-btn" onClick={handleInvocaOracol}>✨ Ce citesc azi?</button>
              </div>
              <div className="grupare-magic-switch">
                <span className="grupare-label">Ordonează rafturile:</span>
                <div className="magic-pill-box">
                  <button className={grupare === "gen" ? "pill-option active" : "pill-option"} onClick={() => schimbaGrupareCuTranzitie("gen")}>📜 După Gen</button>
                  <button className={grupare === "rating" ? "pill-option active" : "pill-option"} onClick={() => schimbaGrupareCuTranzitie("rating")}>⭐ După Stele</button>
                </div>
              </div>
            </div>

            {loading && <p className="info" data-testid="loading">Se încarcă biblioteca... Se aprind lumânările.</p>}
            {error && <p className="error" data-testid="error">Nu am putut încărca datele: {error}. Rulează <code>npm run api</code>.</p>}
            
            {!loading && !error && (
              <div className="sala-rafturi-viewport">
                <div className={`portal-flash-wave ${tranzitieRaft !== "idle" ? "active" : ""}`} aria-hidden="true"></div>
                <div className={`grupuri-genuri wing-transition-${tranzitieRaft}`}>
                  {categoriiUnice.map((categorie) => {
                    const cartiDinCategorie = cartiAfisate.filter((c) => grupare === "gen" ? c.gen === categorie : c.rating === categorie);
                    return (
                      <div key={categorie} className="gen-sectiune">
                        <div className="raft-eticheta-wrapper">
                          <h3 className="gen-titlu">{grupare === "rating" ? `${categorie} Stele ${"★".repeat(categorie)}` : categorie}</h3>
                          <span className="raft-vol-count">{cartiDinCategorie.length} {cartiDinCategorie.length === 1 ? "volum" : "volume"} pe raft</span>
                        </div>
                        <CarteList carti={cartiDinCategorie} onToggle={handleToggle} onDelete={handleDelete} onOpenJurnal={handleDeschideJurnal} onOpenRezumat={handleDeschideRezumat} onHoverBook={redaFosnetCarte} />
                      </div>
                    );
                  })}
                  {cartiAfisate.length === 0 && (
                    <div className="empty-state-box">
                      <span className="empty-icon">🕯️</span>
                      <p className="empty">Nu am găsit niciun manuscris în această aripă a bibliotecii.</p>
                      {cautare && <button className="reset-filter-btn" onClick={() => setCautare("")}>Resetează căutarea</button>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>

        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-brand"><span>🕯️ <strong>BiblioTech</strong> — Sistem Digital de Gestiune și Lectură</span></div>
            <div className="footer-stats"><span>Arhivă activă: {carti.length} volume</span><span>•</span><span>Disponibile la raft: {disponibileCount}</span><span>•</span><span>Împrumutate: {imprumutateCount}</span></div>
          </div>
        </footer>
      </div>

      {carteRezumat && spreadCurent && (
        <div className="jurnal-modal-overlay" onClick={() => setCarteRezumat(null)}>
          <div className="rezumat-3d-book-wrapper" onClick={(e) => e.stopPropagation()}>
            <button className="jurnal-close-btn" onClick={() => setCarteRezumat(null)} title="Închide Cartea">✕</button>
            <div className="rezumat-top-banner"><span className="rezumat-badge-mode">{esteCarteaCr7 ? "⚽ EDIȚIE SPECIALĂ ILUSTRATĂ • CRISTIANO RONALDO (CR7)" : `📖 LECTURĂ MANUSCRIS • ${carteRezumat.titluAutor}`}</span></div>
            
            <div className={`rezumat-book-stage ${sweepDir}`}>
              <div className={`rezumat-page rezumat-page-left ${spreadIndex > 0 && !sweepDir ? "can-turn-prev" : ""}`} onClick={() => handleSchimbaPaginaRezumat("prev")}>
                <div className="rezumat-page-inner">
                  <span className="rezumat-page-header">{esteCarteaCr7 ? "CR7: OBSESIA PERFECȚIUNII" : carteRezumat.titluAutor}</span>
                  <h3 className="rezumat-chapter-title">{spreadCurent.stangaTitlu}</h3>
                  <span className="rezumat-chapter-sub">{spreadCurent.stangaSubtitlu}</span>
                  <div className="jurnal-divider"><span>{esteCarteaCr7 ? "⚽" : "۞"}</span></div>
                  <p className="rezumat-body-text">{spreadCurent.stangaText}</p>
                  <blockquote className="rezumat-quote-callout">{spreadCurent.stangaCitat}</blockquote>
                  <span className="rezumat-page-number">— Pagina {spreadIndex * 2 + 1} —</span>
                </div>
                {spreadIndex > 0 && !sweepDir && (
                  <>
                    <button type="button" className="peel-side-pill pill-left" onClick={(e) => { e.stopPropagation(); handleSchimbaPaginaRezumat("prev"); }}>⬅ Pagina {spreadIndex * 2 - 1}</button>
                    <button type="button" className="corner-peel-widget corner-peel-left" onClick={(e) => { e.stopPropagation(); handleSchimbaPaginaRezumat("prev"); }} title="Pagina anterioară"><span className="peel-under-page"></span><span className="peel-folded-flap"></span></button>
                  </>
                )}
              </div>
              <div className={`rezumat-page rezumat-page-right ${spreadIndex < 2 && !sweepDir ? "can-turn-next" : ""}`} onClick={() => handleSchimbaPaginaRezumat("next")}>
                <div className="rezumat-page-inner">
                  <span className="rezumat-page-header">SANCTUARUL BIBLIOTECH • ARHIVA 3D</span>
                  <h3 className="rezumat-chapter-title">{spreadCurent.dreaptaTitlu}</h3>
                  <span className="rezumat-chapter-sub">{spreadCurent.dreaptaSubtitlu}</span>
                  <div className="jurnal-divider"><span>{esteCarteaCr7 ? "👑" : "⚜"}</span></div>
                  <p className="rezumat-body-text">{spreadCurent.dreaptaText}</p>
                  <div className="rezumat-highlight-box">{spreadCurent.dreaptaStat}</div>
                  <span className="rezumat-page-number">— Pagina {spreadIndex * 2 + 2} —</span>
                </div>
                {spreadIndex < 2 && !sweepDir && (
                  <>
                    <button type="button" className="peel-side-pill pill-right" onClick={(e) => { e.stopPropagation(); handleSchimbaPaginaRezumat("next"); }}>Pagina {spreadIndex * 2 + 3} ➔</button>
                    <button type="button" className="corner-peel-widget corner-peel-right" onClick={(e) => { e.stopPropagation(); handleSchimbaPaginaRezumat("next"); }} title="Răsfoiește pagina"><span className="peel-under-page"></span><span className="peel-folded-flap"></span></button>
                  </>
                )}
              </div>
              <div className="rezumat-center-spine" aria-hidden="true"></div>
              {sweepDir !== "" && (
                <div className={`rezumat-magic-sweep ${sweepDir}`} aria-hidden="true">
                  <div className="sweep-breeze-core"><span className="sweep-sparkle s1">✦</span><span className="sweep-sparkle s2">✧</span><span className="sweep-sparkle s3">✦</span></div>
                </div>
              )}
            </div>
            
            <div className="rezumat-controls-bar">
              <div className="rezumat-dots">
                {[0, 1, 2].map((idx) => (
                  <button key={idx} type="button" className={`rezumat-dot ${spreadIndex === idx ? "active" : ""}`} onClick={() => { if (idx > spreadIndex) handleSchimbaPaginaRezumat("next", idx); if (idx < spreadIndex) handleSchimbaPaginaRezumat("prev", idx); }}>Pag. {idx * 2 + 1}–{idx * 2 + 2}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {arataModalMuzica && (
        <div className="jurnal-modal-overlay" onClick={() => setArataModalMuzica(false)}>
          <div className="oracle-modal-box music-modal-royal" onClick={(e) => e.stopPropagation()}>
            <button className="jurnal-close-btn" onClick={() => setArataModalMuzica(false)} title="Închide">✕</button>
            <span className="story-header-ornament" style={{ display: "block", textAlign: "center" }}>✦ GRAMOFONUL SANCTUARULUI ✦</span>
            <h2 className="oracle-title" style={{ textAlign: "center", marginBottom: "12px" }}>Alege Muzica de Pauză ({playlistPauza.length} piese)</h2>
            <div className="music-import-box">
              <label className="music-import-label">📥 Lipește un link de Playlist YouTube pentru import automat:</label>
              <div className="music-import-row">
                <input type="text" className="music-import-input" placeholder="https://www.youtube.com/playlist?list=PL..." value={linkImportPlaylist} onChange={(e) => setLinkImportPlaylist(e.target.value)} />
                <button type="button" className="music-import-btn" disabled={seImportaPlaylist || !linkImportPlaylist.trim()} onClick={() => importaDeLaLinkYoutube(linkImportPlaylist.trim(), false)}>{seImportaPlaylist ? "⏳ Se extrag..." : "+ Importă Automat"}</button>
              </div>
              {mesajImport && <span className="music-import-status">{mesajImport}</span>}
            </div>
            <div className="music-search-box">
              <span className="music-search-icon" aria-hidden="true">🔍</span>
              <input type="text" className="music-search-input" placeholder="Caută în playlist după melodie sau artist..." value={cautareMuzica} onChange={(e) => setCautareMuzica(e.target.value)} />
              {cautareMuzica && <button type="button" className="music-search-clear" onClick={() => setCautareMuzica("")} title="Șterge căutarea">✕</button>}
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
                        <div key={piesa.id} className={`music-track-card ${esteSelectata ? "selected" : ""} ${cantaAcum ? "playing" : ""}`} onClick={() => setSelectId(piesa.id)} onDoubleClick={() => { setSelectId(piesa.id); pornestePiesaSelectata(piesa.id); }}>
                          <span className="track-icon-circle">{piesa.icon}</span>
                          <div className="track-info-col"><span className="track-title-text">{piesa.nume}</span><span className="track-sub-text">🎤 {piesa.artist} • {piesa.subtitlu}</span></div>
                          <div className="track-status-col">{cantaAcum ? <span className="track-playing-badge"><span className="eq-bar b1"></span><span className="eq-bar b2"></span><span className="eq-bar b3"></span>În redare</span> : esteSelectata ? <span className="track-selected-pill">Selectată ✓</span> : <span className="track-play-hint">Alege</span>}</div>
                        </div>
                      );
                    })}
                  </>
                )}
                {pieseYoutubeFiltrate.length > 0 && (
                  <>
                    <div className="music-category-header" style={{ marginTop: pieseRelaxFiltrate.length > 0 ? "12px" : "0" }}>🎵 Colecția YouTube ({pieseYoutubeFiltrate.length})</div>
                    {pieseYoutubeFiltrate.map((piesa) => {
                      const esteSelectata = selectId === piesa.id;
                      const cantaAcum = muzicaPauzaActiva && piesaActivaId === piesa.id;
                      return (
                        <div key={piesa.id} className={`music-track-card ${esteSelectata ? "selected" : ""} ${cantaAcum ? "playing" : ""}`} onClick={() => setSelectId(piesa.id)} onDoubleClick={() => { setSelectId(piesa.id); pornestePiesaSelectata(piesa.id); }}>
                          <span className="track-icon-circle yt-icon">{piesa.icon}</span>
                          <div className="track-info-col"><span className="track-title-text">{piesa.nume}</span><span className="track-sub-text">🎤 {piesa.artist} • {piesa.subtitlu}</span></div>
                          <div className="track-status-col">{cantaAcum ? <span className="track-playing-badge"><span className="eq-bar b1"></span><span className="eq-bar b2"></span><span className="eq-bar b3"></span>În redare</span> : esteSelectata ? <span className="track-selected-pill">Selectată ✓</span> : <span className="track-play-hint">Alege</span>}
                          {piesa.custom && <button type="button" className="track-delete-btn" title="Elimină piesa din playlist" onClick={(e) => handleStergePiesaCustom(piesa.id, e)}>✕</button>}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
                {pieseFiltrate.length === 0 && <div className="music-empty-search">Nu am găsit nicio melodie sau artist pentru „{cautareMuzica}”.</div>}
              </div>
              <div className="oracle-actions" style={{ marginTop: "16px" }}>
                <button type="button" className="jurnal-btn-cancel" style={{ color: "#fde68a", borderColor: "#fde047" }} onClick={handleOpresteMuzicaPauza}>⏹ Oprește Muzica</button>
                <button type="submit" className="jurnal-btn-save">▶ Redă Piesa Selectată</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {carteJurnal && (
        <div className="jurnal-modal-overlay" onClick={() => setCarteJurnal(null)}>
          <div className="jurnal-open-book" onClick={(e) => e.stopPropagation()}>
            <button className="jurnal-close-btn" onClick={() => setCarteJurnal(null)} title="Închide Jurnalul">✕</button>
            <form className="jurnal-pages-grid" onSubmit={handleSalveazaJurnal}>
              <div className="jurnal-page jurnal-page-left">
                <div className="jurnal-page-border">
                  <span className="jurnal-eyebrow">⚜ FIȘĂ DE ARHIVĂ & PROGRES ⚜</span>
                  <h2 className="jurnal-book-title">{carteJurnal.titluAutor}</h2>
                  <div className="jurnal-badges-row"><span className="jurnal-tag">📚 Colecția: {carteJurnal.gen || "Literatură"}</span><span className="jurnal-tag">📖 Format: {carteJurnal.format || "Broșată"}</span></div>
                  <div className="jurnal-divider"><span>۞</span></div>
                  <div className="jurnal-section-box">
                    <label className="jurnal-label">Evaluarea ta ({jurnalRating}/5 stele):</label>
                    <div className="jurnal-interactive-stars">
                      {[1, 2, 3, 4, 5].map((stea) => (
                        <button type="button" key={stea} className={`jurnal-star-btn ${stea <= jurnalRating ? "active" : ""}`} onClick={() => setJurnalRating(stea)}>★</button>
                      ))}
                    </div>
                  </div>
                  <div className="jurnal-section-box">
                    <label className="jurnal-label">Progresul lecturii ({procentLectura}% parcurs):</label>
                    <div className="jurnal-pages-inputs">
                      <div className="jurnal-input-group"><span>Pagina curentă:</span><input type="number" min="0" max={jurnalTotalPagini} value={jurnalPagina} onChange={(e) => setJurnalPagina(e.target.value)} /></div>
                      <span className="jurnal-slash">/</span>
                      <div className="jurnal-input-group"><span>Total pagini:</span><input type="number" min="1" value={jurnalTotalPagini} onChange={(e) => setJurnalTotalPagini(e.target.value)} /></div>
                    </div>
                    <div className="jurnal-progress-track"><div className="jurnal-progress-fill" style={{ width: `${procentLectura}%` }}></div></div>
                  </div>
                  <div className="jurnal-section-box">
                    <label className="jurnal-label">❝ Citat memorabil din volum:</label>
                    <textarea className="jurnal-textarea jurnal-quote-box" rows="2" placeholder="Scrie aici un pasaj..." value={jurnalCitat} onChange={(e) => setJurnalCitat(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="jurnal-page jurnal-page-right">
                <div className="jurnal-page-border">
                  <span className="jurnal-eyebrow">✒️ ÎNSEMNĂRILE CITITORULUI</span>
                  <label className="jurnal-label" style={{ marginTop: "8px" }}>Impresii, idei și rezumatul manuscrisului:</label>
                  <textarea className="jurnal-textarea jurnal-notes-lined" rows="8" placeholder="Așterne aici gândurile tale..." value={jurnalNotite} onChange={(e) => setJurnalNotite(e.target.value)} />
                  <div className="jurnal-modal-actions">
                    <button type="button" className="jurnal-btn-cancel" onClick={() => setCarteJurnal(null)}>Închide fără salvare</button>
                    <button type="submit" className="jurnal-btn-save">📜 Salvează cu Sigiliu</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {arataCardShare && (
        <div className="jurnal-modal-overlay" onClick={() => setArataCardShare(false)}>
          <div className="collector-card-modal" onClick={(e) => e.stopPropagation()}>
            <button className="jurnal-close-btn" onClick={() => setArataCardShare(false)} title="Închide Cardul">✕</button>
            <div className="collector-story-frame">
              <div className="story-header-ornament">✦ SANCTUARUL BIBLIOTECH ✦</div>
              <h2 className="story-main-title">Certificat de Arhivar</h2>
              <div className="story-rank-badge">{rangCititor}</div>
              <div className="story-stats-grid">
                <div className="story-stat-box"><span className="story-stat-num">{carti.length}</span><span className="story-stat-label">Volume în Raft</span></div>
                <div className="story-stat-box"><span className="story-stat-num">{imprumutateCount}</span><span className="story-stat-label">Volume Parcurse</span></div>
                <div className="story-stat-box"><span className="story-stat-num">{mediaStele} ★</span><span className="story-stat-label">Media Colecției</span></div>
              </div>
              <div className="story-top-books">
                <span className="story-top-label">👑 Manuscrise de Onoare din Raftul Meu:</span>
                {topCarti.map((c, idx) => (
                  <div key={c.id} className="story-book-row">
                    <span className="story-book-rank">#{idx + 1}</span><span className="story-book-name">{c.titluAutor}</span><span className="story-book-stars">{"★".repeat(Number(c.rating) || 5)}</span>
                  </div>
                ))}
              </div>
              <div className="story-footer-seal"><span className="seal-wax-circle">📜</span><span className="seal-signature">Arhivă Oficială Verificată • BiblioTech</span></div>
            </div>
            <div className="collector-card-actions">
              <button type="button" className="jurnal-btn-save" onClick={handleCopiazaRezumat}>{mesajCopiat ? "✨ Copiat în Clipboard!" : "📋 Copiază Rezumatul & Link-ul Raftului"}</button>
            </div>
          </div>
        </div>
      )}

      {carteOracol && (
        <div className="jurnal-modal-overlay" onClick={() => setCarteOracol(null)}>
          <div className="oracle-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="jurnal-close-btn" onClick={() => setCarteOracol(null)} title="Închide Oracolul">✕</button>
            <div className="oracle-spotlight"></div>
            <span className="story-header-ornament">✦ PROFEȚIA ORACOLULUI LITERAR ✦</span>
            <h2 className="oracle-title">Manuscrisul Ales Pentru Tine</h2>
            <div className="oracle-book-showcase">
              <span className="oracle-book-genre">{carteOracol.gen || "Literatură"} • {carteOracol.format || "Broșată"}</span>
              <h3 className="oracle-book-name">{carteOracol.titluAutor}</h3>
              <div className="oracle-stars">{"★".repeat(Number(carteOracol.rating) || 5)}</div>
            </div>
            <p className="oracle-prophecy-text">„Soarta a ales acest volum dintre rafturile sanctuarului. Deschide-i paginile astăzi și lasă povestea să prindă viață.”</p>
            <div className="oracle-actions">
              <button type="button" className="jurnal-btn-cancel" style={{ color: "#fde68a", borderColor: "#fde047" }} onClick={handleInvocaOracol}>🎲 Alege Alt Volum</button>
              <button type="button" className="jurnal-btn-save" onClick={() => { const aleasa = carteOracol; setCarteOracol(null); handleDeschideRezumat(aleasa); }}>📖 Citește Rezumatul Cărții</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}