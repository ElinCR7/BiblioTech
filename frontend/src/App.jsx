import { useEffect, useRef, useState } from "react";
import "./App.css";
import CarteList from "./components/CarteList.jsx";
import { fetchCarti } from "./api.js";

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

// -------------------------------------------------------------------------
// PLAYLIST-UL BIBLIOTECII (10 piese totale)
// - Primele 5 sunt alese de mine (liniștitoare / lofi / pian)
// - Următoarele 5 sunt sloturile tale unde poți pune propriile link-uri de pe YT!
// -------------------------------------------------------------------------
const PLAYLIST_PAUZA = [
  // 5 piese alese de mine
 { id: "https://stream.zeno.fm/f3wvbbqmdg8uv", nume: "☕ Lofi Hip Hop Radio" },
  { id: "https://stream.zeno.fm/0r0xa792cheuv", nume: "🎹 Peaceful Piano Relax" },
  { id: "https://stream.zeno.fm/f9725h5avwzuv", nume: "🎷 Smooth Jazz & Study" },
  { id: "https://stream.zeno.fm/bb8uv144rd0uv", nume: "🌿 Ambient Nature & Sleep" },
  { id: "https://stream.zeno.fm/f9725h5avwzuv", nume: "📖 Classic Reading Lounge" },
  // Cele 5 piese unde poți schimba id-ul (înlocuiești șirul din ghilimele cu ID-ul tău de YouTube)
  { id: "bKDdT_nyP54", nume: "🎵 Smack That-Akon" },
  { id: "_aNcOe7nBeA", nume: "🎵 Cum esti tu-Vanilla" },
  { id: "sby_UG1INVg", nume: "🎵 Diamante si inele-Marko Glass x Bvcovia" },
  { id: "sQ4Y9IkAgoQ", nume: "🎵 7din7 Vanilla x Alex Velea" },
  { id: "8aRor905cCw", nume: "🎵 Billionaire-Bruno Mars" },
];

export default function App() {
  const [carti, setCarti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stări pentru Temă, Filtre și Căutare
  const [tema, setTema] = useState(temaInitiala);
  const [filtru, setFiltru] = useState("toate");
  const [grupare, setGrupare] = useState("gen");
  const [cautare, setCautare] = useState("");

  // Stări pentru Ușile 3D și Tranziții
  const [inBiblioteca, setInBiblioteca] = useState(false);
  const [seDeschide, setSeDeschide] = useState(false);
  const [tranzitieRaft, setTranzitieRaft] = useState("idle");

  // Stare pentru Ploaie / Ambient
  const [ambientActiv, setAmbientActiv] = useState(false);
  const audioCtxRef = useRef(null);
  const rainGainRef = useRef(null);

  // Stări pentru Muzică de Pauză
  const [arataModalMuzica, setArataModalMuzica] = useState(false);
  const [selectId, setSelectId] = useState(PLAYLIST_PAUZA[0].id);
  const [ytEmbedUrl, setYtEmbedUrl] = useState("");

  // Stare pentru Clepsidră / Timer Pomodoro (25 minute)
  const [timerPornit, setTimerPornit] = useState(false);
  const [secundeRamas, setSecundeRamas] = useState(25 * 60);

  // Stări pentru Jurnalul de Lectură (Modal 1)
  const [carteJurnal, setCarteJurnal] = useState(null);
  const [jurnalRating, setJurnalRating] = useState(5);
  const [jurnalPagina, setJurnalPagina] = useState(0);
  const [jurnalTotalPagini, setJurnalTotalPagini] = useState(320);
  const [jurnalCitat, setJurnalCitat] = useState("");
  const [jurnalNotite, setJurnalNotite] = useState("");

  // Stări pentru Cardul de Colecționar / Story (Modal 2)
  const [arataCardShare, setArataCardShare] = useState(false);
  const [mesajCopiat, setMesajCopiat] = useState(false);

  // Stări pentru Oracolul Bibliotecii (Modal 3)
  const [carteOracol, setCarteOracol] = useState(null);

  // Stări pentru Adăugare Manuscris Nou (Modal 4)
  const [arataModalAdauga, setArataModalAdauga] = useState(false);
  const [nouTitlu, setNouTitlu] = useState("");
  const [nouAutor, setNouAutor] = useState("");
  const [nouGen, setNouGen] = useState("Fantezie");
  const [nouFormat, setNouFormat] = useState("Broșată");
  const [nouRating, setNouRating] = useState(5);
  const [nouTotalPagini, setNouTotalPagini] = useState(300);

  // 1. Încărcarea cărților de la API (Strict Etapa 6: useEffect + ignore)[cite: 3, 6]
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
    return () => {
      ignore = true;
    };
  }, []);

  // 2. Mouse move pentru lumânare (60 FPS)
  useEffect(() => {
    function handleMouseMove(e) {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 3. Timer Pomodoro / Clepsidră
  useEffect(() => {
    let interval = null;
    if (timerPornit && secundeRamas > 0) {
      interval = setInterval(() => {
        setSecundeRamas((prev) => prev - 1);
      }, 1000);
    } else if (secundeRamas === 0) {
      setTimerPornit(false);
      alert("⏳ Sesiunea de lectură s-a încheiat! Felicitări pentru focalizare.");
      setSecundeRamas(25 * 60);
    }
    return () => clearInterval(interval);
  }, [timerPornit, secundeRamas]);

  function formateazaTimp(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  // Sintetizator Audio (Ploaie + Foșnet + Sunet magic)
  function initAudioContext() {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }

  function toggleAmbient() {
    const ctx = initAudioContext();

    if (!ambientActiv) {
      if (!rainGainRef.current) {
        const bufferSize = ctx.sampleRate * 3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 650;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.05;

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();

        rainGainRef.current = gainNode;
      } else {
        rainGainRef.current.gain.setTargetAtTime(0.05, ctx.currentTime, 0.3);
      }
      setAmbientActiv(true);
    } else {
      if (rainGainRef.current) {
        rainGainRef.current.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2);
      }
      setAmbientActiv(false);
    }
  }

  // Pornirea redării piesei selectate din listă
  function handlePornesteMuzica(e) {
    e.preventDefault();
    if (selectId) {
      setYtEmbedUrl(`https://www.youtube.com/embed/${selectId}?autoplay=1`);
    }
    setArataModalMuzica(false);
  }

  function redaFosnetCarte() {
    if (!ambientActiv || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    const bufferSize = ctx.sampleRate * 0.06;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1400;

    const gain = ctx.createGain();
    gain.gain.value = 0.035;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }

  function redaSunetMagie() {
    if (!ambientActiv || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
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
  }

  function handleIntra() {
    setSeDeschide(true);
    setTimeout(() => {
      setInBiblioteca(true);
    }, 1800);
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
      setTimeout(() => {
        setTranzitieRaft("idle");
      }, 550);
    }, 360);
  }

  function schimbaGrupareCuTranzitie(nouaGrupare) {
    if (nouaGrupare === grupare || tranzitieRaft !== "idle") return;
    setTranzitieRaft("out");
    setTimeout(() => {
      setGrupare(nouaGrupare);
      setTranzitieRaft("in");
      setTimeout(() => {
        setTranzitieRaft("idle");
      }, 550);
    }, 360);
  }

  function handleToggle(id) {
    setCarti((prev) =>
      prev.map((c) => (c.id === id ? { ...c, citita: !c.citita } : c))
    );
  }

  function handleDelete(id) {
    setCarti((prev) => prev.filter((c) => c.id !== id));
    if (carteJurnal && carteJurnal.id === id) setCarteJurnal(null);
    if (carteOracol && carteOracol.id === id) setCarteOracol(null);
  }

  function handleAdaugaCarteNoua(e) {
    e.preventDefault();
    if (!nouTitlu.trim() || !nouAutor.trim()) return;

    const carteNoua = {
      id: Date.now(),
      titluAutor: `${nouTitlu.trim()} - ${nouAutor.trim()}`,
      gen: nouGen,
      format: nouFormat,
      rating: Number(nouRating),
      citita: false,
      paginaCurenta: 0,
      totalPagini: Number(nouTotalPagini) || 300,
      citat: "Prima filă din noua poveste...",
      notite: "Manuscris adăugat în arhivă.",
    };

    setCarti((prev) => [carteNoua, ...prev]);
    setNouTitlu("");
    setNouAutor("");
    setArataModalAdauga(false);
    redaSunetMagie();
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

    setCarti((prev) =>
      prev.map((c) =>
        c.id === carteJurnal.id ? { ...c, ...dateActualizate } : c
      )
    );

    const jurnaleSalvate = JSON.parse(
      localStorage.getItem("bibliotech_jurnale") || "{}"
    );
    jurnaleSalvate[carteJurnal.id] = dateActualizate;
    localStorage.setItem("bibliotech_jurnale", JSON.stringify(jurnaleSalvate));

    redaSunetMagie();
    setCarteJurnal(null);
  }

  const cartiAfisate = carti.filter((carte) => {
    const potrivireFiltru =
      filtru === "toate"
        ? true
        : filtru === "disponibile"
        ? !carte.citita
        : carte.citita;

    const termen = cautare.trim().toLowerCase();
    const potrivireCautare =
      !termen ||
      (carte.titluAutor && carte.titluAutor.toLowerCase().includes(termen)) ||
      (carte.gen && carte.gen.toLowerCase().includes(termen));

    return potrivireFiltru && potrivireCautare;
  });

  const categoriiUnice =
    grupare === "gen"
      ? [...new Set(cartiAfisate.map((c) => c.gen))].sort()
      : [...new Set(cartiAfisate.map((c) => c.rating))].sort((a, b) => b - a);

  const imprumutateCount = carti.filter((c) => c.citita).length;
  const disponibileCount = carti.length - imprumutateCount;

  const procentLectura =
    jurnalTotalPagini > 0
      ? Math.min(100, Math.round((jurnalPagina / jurnalTotalPagini) * 100))
      : 0;

  const rangCititor =
    imprumutateCount >= 8
      ? "🔮 Marele Mag Arhivar"
      : imprumutateCount >= 4
      ? "⚜️ Maestru Cronicar"
      : imprumutateCount >= 1
      ? "🕯️ Păzitor al Pergamentelor"
      : "📜 Inițiat al Sanctuarului";

  const mediaStele =
    carti.length > 0
      ? (
          carti.reduce((acc, c) => acc + (Number(c.rating) || 5), 0) /
          carti.length
        ).toFixed(1)
      : "5.0";

  const topCarti = [...carti]
    .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
    .slice(0, 3);

  function handleCopiazaRezumat() {
    const textShare = `🕯️ SANCTUARUL BIBLIOTECH 🕯️\nRang: ${rangCititor}\n📚 Volume în arhivă: ${carti.length} (${imprumutateCount} parcurse)\n⭐ Evaluare medie: ${mediaStele}/5\n🏆 Top Manuscrise:\n${topCarti
      .map((c) => `• ${c.titluAutor} (${"★".repeat(Number(c.rating) || 5)})`)
      .join("\n")}\n🔗 Explorează colecția: ${window.location.href}`;

    navigator.clipboard.writeText(textShare);
    setMesajCopiat(true);
    setTimeout(() => setMesajCopiat(false), 3000);
  }

  return (
    <>
      <div className="ambient-library-bg" aria-hidden="true"></div>
      <div className="ambient-candle-glows" aria-hidden="true"></div>
      <div className="cosmic-stars" aria-hidden="true"></div>
      {ambientActiv && (
        <div className="ambient-rain-layer" aria-hidden="true"></div>
      )}
      <div className="bottom-warm-vignette" aria-hidden="true"></div>
      <div className="mouse-candle-light" aria-hidden="true"></div>

      {/* Player ascuns pentru muzica de pauză de pe YouTube */}
      {ytEmbedUrl && (
        <div style={{ display: "none" }}>
          <iframe title="Muzică Pauză YT" src={ytEmbedUrl} allow="autoplay"></iframe>
        </div>
      )}

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
            <p className="portal-subtitle">
              Sanctuarul Cărților și al Poveștilor
            </p>

            <button
              className="enter-library-btn"
              onClick={handleIntra}
              disabled={seDeschide}
            >
              <span className="btn-key-icon">🗝️</span> Intră în Bibliotecă
            </button>
          </div>
        </div>
      )}

      <div
        className={`main-app-wrapper ${seDeschide ? "app-entering" : ""} ${
          inBiblioteca ? "app-entered" : ""
        }`}
      >
        <nav className="top-navbar">
          <div className="navbar-inner">
            <div className="navbar-brand">
              <div
                className="lumanare-realista navbar-candle"
                aria-hidden="true"
              >
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

            <div className="navbar-search">
              <span className="search-icon" aria-hidden="true">
                🔍
              </span>
              <input
                type="text"
                placeholder="Caută după titlu, autor sau colecție..."
                value={cautare}
                onChange={(e) => setCautare(e.target.value)}
                aria-label="Caută cărți"
              />
              {cautare && (
                <button
                  className="clear-search-btn"
                  onClick={() => setCautare("")}
                  title="Șterge căutarea"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="navbar-actions">
              {/* Clepsidra / Timer Pomodoro */}
              <button
                type="button"
                className={`timer-pomodoro-btn ${timerPornit ? "running" : ""}`}
                onClick={() => setTimerPornit(!timerPornit)}
                title="Pornește sau oprește clepsidra de lectură (25 min)"
              >
                ⏳ {formateazaTimp(secundeRamas)}
              </button>

              {/* Buton Ploaie & Sunet */}
              <button
                type="button"
                className={`ambient-toggle-btn ${ambientActiv ? "active" : ""}`}
                onClick={toggleAmbient}
                title="Activează sau oprește sunetul ambiental de ploaie"
              >
                {ambientActiv ? "🌧️ Ambient: ON" : "🔇 Ambient: OFF"}
              </button>

              {/* Buton Muzică de Pauză (Select din listă) */}
              <button
                type="button"
                className={`ambient-toggle-btn ${ytEmbedUrl ? "active" : ""}`}
                onClick={() => setArataModalMuzica(true)}
                title="Alege muzica de pauză"
              >
                🎵 Muzică de pauză
              </button>

              {/* Buton Cardul Meu */}
              <button
                type="button"
                className="share-shelf-btn"
                onClick={() => setArataCardShare(true)}
              >
                🏆 Cardul Meu
              </button>

              {/* Selectorul cu cele 5 Tărâmuri */}
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

        <main className="site-main-container">
          <header className="app-header">
            <div className="header-bg-image" aria-hidden="true"></div>
            <div className="header-warm-overlay" aria-hidden="true"></div>

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
              <span className="hero-eyebrow">
                ✦ SALA DE LECTURĂ & COLECȚII ✦
              </span>
              <h1>Sanctuarul Literar BiblioTech</h1>
              <p>
                Explorează volumele în ediție 3D, folosește clepsidra de lectură
                și adaugă manuscrise noi în arhivă
              </p>
            </div>
          </header>

          <section className="panel">
            <div className="catalog-control-bar">
              <div className="library-nav-tabs" role="tablist">
                <button
                  className={`lib-tab tab-all ${
                    filtru === "toate" ? "active" : ""
                  }`}
                  onClick={() => schimbaFiltruCuTranzitie("toate")}
                >
                  <span className="tab-icon">🏛️</span>
                  <span className="tab-label">Marea Sală</span>
                  <span className="tab-count">{carti.length}</span>
                </button>

                <button
                  className={`lib-tab tab-available ${
                    filtru === "disponibile" ? "active" : ""
                  }`}
                  onClick={() => schimbaFiltruCuTranzitie("disponibile")}
                >
                  <span className="tab-icon">🕯️</span>
                  <span className="tab-label">Disponibile</span>
                  <span className="tab-count">{disponibileCount}</span>
                </button>

                <button
                  className={`lib-tab tab-borrowed ${
                    filtru === "imprumutate" ? "active" : ""
                  }`}
                  onClick={() => schimbaFiltruCuTranzitie("imprumutate")}
                >
                  <span className="tab-icon">🔮</span>
                  <span className="tab-label">Împrumutate</span>
                  <span className="tab-count">{imprumutateCount}</span>
                </button>

                {/* Butonul Oracolul Bibliotecii */}
                <button
                  type="button"
                  className="oracle-trigger-btn"
                  onClick={handleInvocaOracol}
                >
                  ✨ Ce citesc azi?
                </button>

                {/* Buton Adăugare Carte Nouă */}
                <button
                  type="button"
                  className="add-book-trigger-btn"
                  onClick={() => setArataModalAdauga(true)}
                >
                  + Înscrie Manuscris
                </button>
              </div>

              <div className="grupare-magic-switch">
                <span className="grupare-label">Ordonează rafturile:</span>
                <div className="magic-pill-box">
                  <button
                    className={
                      grupare === "gen" ? "pill-option active" : "pill-option"
                    }
                    onClick={() => schimbaGrupareCuTranzitie("gen")}
                  >
                    📜 După Gen
                  </button>
                  <button
                    className={
                      grupare === "rating"
                        ? "pill-option active"
                        : "pill-option"
                    }
                    onClick={() => schimbaGrupareCuTranzitie("rating")}
                  >
                    ⭐ După Stele
                  </button>
                </div>
              </div>
            </div>

            {/* Cele 3 stări obligatorii pentru Etapa 6: Loading, Error, Success[cite: 3, 6] */}
            {loading && (
              <p className="info">
                Se încarcă biblioteca... Se aprind lumânările și se încarcă rafturile.
              </p>
            )}

            {error && (
              <p className="error">
                Nu am putut încărca datele: {error}. Rulează <code>npm run api</code>?
              </p>
            )}

            {!loading && !error && (
              <div className="sala-rafturi-viewport">
                <div
                  className={`portal-flash-wave ${
                    tranzitieRaft !== "idle" ? "active" : ""
                  }`}
                  aria-hidden="true"
                ></div>

                <div
                  className={`grupuri-genuri wing-transition-${tranzitieRaft}`}
                >
                  {categoriiUnice.map((categorie) => {
                    const cartiDinCategorie = cartiAfisate.filter((c) =>
                      grupare === "gen"
                        ? c.gen === categorie
                        : c.rating === categorie
                    );
                    return (
                      <div key={categorie} className="gen-sectiune">
                        <div className="raft-eticheta-wrapper">
                          <h3 className="gen-titlu">
                            {grupare === "rating"
                              ? `${categorie} Stele ${"★".repeat(categorie)}`
                              : categorie}
                          </h3>
                          <span className="raft-vol-count">
                            {cartiDinCategorie.length}{" "}
                            {cartiDinCategorie.length === 1
                              ? "volum"
                              : "volume"}{" "}
                            pe raft
                          </span>
                        </div>

                        <CarteList
                          carti={cartiDinCategorie}
                          onToggle={handleToggle}
                          onDelete={handleDelete}
                          onOpenJurnal={handleDeschideJurnal}
                          onHoverBook={redaFosnetCarte}
                        />
                      </div>
                    );
                  })}

                  {cartiAfisate.length === 0 && (
                    <div className="empty-state-box">
                      <span className="empty-icon">🕯️</span>
                      <p className="empty">
                        Nu am găsit niciun manuscris în această aripă a
                        bibliotecii.
                      </p>
                      {cautare && (
                        <button
                          className="reset-filter-btn"
                          onClick={() => setCautare("")}
                        >
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

        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <span>
                🕯️ <strong>BiblioTech</strong> — Sistem Digital de Gestiune și
                Lectură
              </span>
            </div>
            <div className="footer-stats">
              <span>Arhivă activă: {carti.length} volume</span>
              <span>•</span>
              <span>Disponibile la raft: {disponibileCount}</span>
              <span>•</span>
              <span>Împrumutate: {imprumutateCount}</span>
            </div>
          </div>
        </footer>
      </div>

      {/* ========================================================= */}
      {/* MODAL PENTRU ALEGEREA PIESEI DIN LISTĂ                    */}
      {/* ========================================================= */}
      {arataModalMuzica && (
        <div
          className="jurnal-modal-overlay"
          onClick={() => setArataModalMuzica(false)}
        >
          <div
            className="oracle-modal-box"
            style={{ maxWidth: "460px", textAlign: "left" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="jurnal-close-btn"
              onClick={() => setArataModalMuzica(false)}
              title="Închide"
            >
              ✕
            </button>

            <span
              className="story-header-ornament"
              style={{ display: "block", textAlign: "center" }}
            >
              ✦ COLECȚIA AUDIO ✦
            </span>
            <h2
              className="oracle-title"
              style={{ textAlign: "center", fontSize: "1.45rem" }}
            >
              Alege Muzica de Pauză
            </h2>

            <form onSubmit={handlePornesteMuzica}>
              <div className="jurnal-section-box" style={{ marginBottom: "15px" }}>
                <label className="jurnal-label">Selectează piesa dorită:</label>
                <select
                  value={selectId}
                  onChange={(e) => setSelectId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "4px",
                    border: "1px solid #b45309",
                    background: "#fffbeb",
                    color: "#291507",
                    fontFamily: "sans-serif",
                    fontSize: "0.9rem",
                  }}
                >
                  {PLAYLIST_PAUZA.map((piesa, idx) => (
                    <option key={idx} value={piesa.id}>
                      {piesa.nume}
                    </option>
                  ))}
                </select>
                <small style={{ display: "block", marginTop: "6px", color: "#78350f", fontSize: "0.78rem" }}>
                  * Poți schimba cele 5 piese personalizate direct în cod, sus în fișierul `App.jsx`, la secțiunea <code>PLAYLIST_PAUZA</code>.
                </small>
              </div>

              <div className="oracle-actions">
                <button
                  type="button"
                  className="jurnal-btn-cancel"
                  style={{ color: "#fde68a", borderColor: "#fde047" }}
                  onClick={() => {
                    setYtEmbedUrl("");
                    setArataModalMuzica(false);
                  }}
                >
                  Oprește Muzica
                </button>
                <button type="submit" className="jurnal-btn-save">
                  🎵 Redă Piesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MODAL 1: JURNALUL DE LECTURĂ                           */}
      {/* ========================================================= */}
      {carteJurnal && (
        <div
          className="jurnal-modal-overlay"
          onClick={() => setCarteJurnal(null)}
        >
          <div
            className="jurnal-open-book"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="jurnal-close-btn"
              onClick={() => setCarteJurnal(null)}
              title="Închide Jurnalul"
            >
              ✕
            </button>

            <form className="jurnal-pages-grid" onSubmit={handleSalveazaJurnal}>
              <div className="jurnal-page jurnal-page-left">
                <div className="jurnal-page-border">
                  <span className="jurnal-eyebrow">
                    ⚜ FIȘĂ DE ARHIVĂ & PROGRES ⚜
                  </span>

                  <h2 className="jurnal-book-title">
                    {carteJurnal.titluAutor}
                  </h2>

                  <div className="jurnal-badges-row">
                    <span className="jurnal-tag">
                      📚 Colecția: {carteJurnal.gen || "Literatură"}
                    </span>
                    <span className="jurnal-tag">
                      📖 Format: {carteJurnal.format || "Broșată"}
                    </span>
                  </div>

                  <div className="jurnal-divider">
                    <span>۞</span>
                  </div>

                  <div className="jurnal-section-box">
                    <label className="jurnal-label">
                      Evaluarea ta ({jurnalRating}/5 stele):
                    </label>
                    <div className="jurnal-interactive-stars">
                      {[1, 2, 3, 4, 5].map((stea) => (
                        <button
                          type="button"
                          key={stea}
                          className={`jurnal-star-btn ${
                            stea <= jurnalRating ? "active" : ""
                          }`}
                          onClick={() => setJurnalRating(stea)}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="jurnal-section-box">
                    <label className="jurnal-label">
                      Progresul lecturii ({procentLectura}% parcurs):
                    </label>

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
                      <div
                        className="jurnal-progress-fill"
                        style={{ width: `${procentLectura}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="jurnal-section-box">
                    <label className="jurnal-label">
                      ❝ Citat memorabil din volum:
                    </label>
                    <textarea
                      className="jurnal-textarea jurnal-quote-box"
                      rows="2"
                      placeholder="Scrie aici un pasaj sau un citat care ți-a plăcut..."
                      value={jurnalCitat}
                      onChange={(e) => setJurnalCitat(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="jurnal-page jurnal-page-right">
                <div className="jurnal-page-border">
                  <span className="jurnal-eyebrow">
                    ✒️ ÎNSEMNĂRILE CITITORULUI
                  </span>

                  <label className="jurnal-label" style={{ marginTop: "8px" }}>
                    Impresii, idei și rezumatul manuscrisului:
                  </label>

                  <textarea
                    className="jurnal-textarea jurnal-notes-lined"
                    rows="8"
                    placeholder="Așterne aici gândurile tale despre carte, personajele principale sau ideile cu care ai rămas după lectură..."
                    value={jurnalNotite}
                    onChange={(e) => setJurnalNotite(e.target.value)}
                  />

                  <div className="jurnal-modal-actions">
                    <button
                      type="button"
                      className="jurnal-btn-cancel"
                      onClick={() => setCarteJurnal(null)}
                    >
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

      {/* ========================================================= */}
      {/* 5. MODAL 2: CARDUL DE COLECȚIONAR                         */}
      {/* ========================================================= */}
      {arataCardShare && (
        <div
          className="jurnal-modal-overlay"
          onClick={() => setArataCardShare(false)}
        >
          <div
            className="collector-card-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="jurnal-close-btn"
              onClick={() => setArataCardShare(false)}
              title="Închide Cardul"
            >
              ✕
            </button>

            <div className="collector-story-frame">
              <div className="story-header-ornament">
                ✦ SANCTUARUL BIBLIOTECH ✦
              </div>
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
                <span className="story-top-label">
                  👑 Manuscrise de Onoare din Raftul Meu:
                </span>
                {topCarti.map((c, idx) => (
                  <div key={c.id} className="story-book-row">
                    <span className="story-book-rank">#{idx + 1}</span>
                    <span className="story-book-name">{c.titluAutor}</span>
                    <span className="story-book-stars">
                      {"★".repeat(Number(c.rating) || 5)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="story-footer-seal">
                <span className="seal-wax-circle">📜</span>
                <span className="seal-signature">
                  Arhivă Oficială Verificată • BiblioTech
                </span>
              </div>
            </div>

            <div className="collector-card-actions">
              <button
                type="button"
                className="jurnal-btn-save"
                onClick={handleCopiazaRezumat}
              >
                {mesajCopiat
                  ? "✨ Copiat în Clipboard!"
                  : "📋 Copiază Rezumatul & Link-ul Raftului"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MODAL 3: ORACOLUL LITERAR                              */}
      {/* ========================================================= */}
      {carteOracol && (
        <div
          className="jurnal-modal-overlay"
          onClick={() => setCarteOracol(null)}
        >
          <div
            className="oracle-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="jurnal-close-btn"
              onClick={() => setCarteOracol(null)}
              title="Închide Oracolul"
            >
              ✕
            </button>

            <div className="oracle-spotlight"></div>
            <span className="story-header-ornament">
              ✦ PROFEȚIA ORACOLULUI LITERAR ✦
            </span>
            <h2 className="oracle-title">Manuscrisul Ales Pentru Tine</h2>

            <div className="oracle-book-showcase">
              <span className="oracle-book-genre">
                {carteOracol.gen || "Literatură"} •{" "}
                {carteOracol.format || "Broșată"}
              </span>
              <h3 className="oracle-book-name">{carteOracol.titluAutor}</h3>
              <div className="oracle-stars">
                {"★".repeat(Number(carteOracol.rating) || 5)}
              </div>
            </div>

            <p className="oracle-prophecy-text">
              „Soarta a ales acest volum dintre rafturile sanctuarului.
              Deschide-i paginile astăzi și lasă povestea să prindă viață.”
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
                  handleDeschideJurnal(aleasa);
                }}
              >
                ✒️ Deschide Jurnalul Cărții
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. MODAL 4: FORMULARUL "+ ÎNSCRIE MANUSCRIS"              */}
      {/* ========================================================= */}
      {arataModalAdauga && (
        <div
          className="jurnal-modal-overlay"
          onClick={() => setArataModalAdauga(false)}
        >
          <div
            className="oracle-modal-box"
            style={{ maxWidth: "440px", textAlign: "left" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="jurnal-close-btn"
              onClick={() => setArataModalAdauga(false)}
              title="Închide"
            >
              ✕
            </button>

            <span
              className="story-header-ornament"
              style={{ display: "block", textAlign: "center" }}
            >
              ✦ ARHIVARE NOUĂ ✦
            </span>
            <h2
              className="oracle-title"
              style={{ textAlign: "center", fontSize: "1.45rem" }}
            >
              Înscrie Manuscris pe Raft
            </h2>

            <form onSubmit={handleAdaugaCarteNoua}>
              <div className="jurnal-section-box" style={{ marginBottom: "12px" }}>
                <label className="jurnal-label">Titlul Volumului:</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Crimă și Pedeapsă"
                  value={nouTitlu}
                  onChange={(e) => setNouTitlu(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #b45309",
                    background: "#fffbeb",
                    color: "#291507",
                    fontFamily: "Georgia, serif",
                  }}
                />
              </div>

              <div className="jurnal-section-box" style={{ marginBottom: "12px" }}>
                <label className="jurnal-label">Autorul:</label>
                <input
                  type="text"
                  required
                  placeholder="ex: F. Dostoievski"
                  value={nouAutor}
                  onChange={(e) => setNouAutor(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #b45309",
                    background: "#fffbeb",
                    color: "#291507",
                    fontFamily: "Georgia, serif",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <div className="jurnal-section-box" style={{ marginBottom: 0 }}>
                  <label className="jurnal-label">Gen / Colecție:</label>
                  <select
                    value={nouGen}
                    onChange={(e) => setNouGen(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "7px",
                      borderRadius: "4px",
                      border: "1px solid #b45309",
                      background: "#fffbeb",
                      color: "#291507",
                    }}
                  >
                    <option value="Fantezie">Fantezie</option>
                    <option value="SF">SF</option>
                    <option value="Clasice">Clasice</option>
                    <option value="Filosofie">Filosofie</option>
                    <option value="Istorie">Istorie</option>
                    <option value="Mister">Mister</option>
                  </select>
                </div>

                <div className="jurnal-section-box" style={{ marginBottom: 0 }}>
                  <label className="jurnal-label">Format:</label>
                  <select
                    value={nouFormat}
                    onChange={(e) => setNouFormat(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "7px",
                      borderRadius: "4px",
                      border: "1px solid #b45309",
                      background: "#fffbeb",
                      color: "#291507",
                    }}
                  >
                    <option value="Broșată">Broșată</option>
                    <option value="Cartonată">Cartonată</option>
                    <option value="Digitală">Digitală</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  dir: "ltr",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <div className="jurnal-section-box" style={{ marginBottom: 0 }}>
                  <label className="jurnal-label">Evaluare (1-5):</label>
                  <select
                    value={nouRating}
                    onChange={(e) => setNouRating(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "7px",
                      borderRadius: "4px",
                      border: "1px solid #b45309",
                      background: "#fffbeb",
                      color: "#291507",
                    }}
                  >
                    <option value="5">★★★★★ (5)</option>
                    <option value="4">★★★★☆ (4)</option>
                    <option value="3">★★★☆☆ (3)</option>
                    <option value="2">★★☆☆☆ (2)</option>
                    <option value="1">★☆☆☆☆ (1)</option>
                  </select>
                </div>

                <div className="jurnal-section-box" style={{ marginBottom: 0 }}>
                  <label className="jurnal-label">Total Pagini:</label>
                  <input
                    type="number"
                    min="1"
                    value={nouTotalPagini}
                    onChange={(e) => setNouTotalPagini(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "7px",
                      borderRadius: "4px",
                      border: "1px solid #b45309",
                      background: "#fffbeb",
                      color: "#291507",
                      textAlign: "center",
                    }}
                  />
                </div>
              </div>

              <div className="oracle-actions">
                <button
                  type="button"
                  className="jurnal-btn-cancel"
                  style={{ color: "#fde68a", borderColor: "#fde047" }}
                  onClick={() => setArataModalAdauga(false)}
                >
                  Renunță
                </button>
                <button type="submit" className="jurnal-btn-save">
                  📜 Așază pe Raft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}