import { useState } from "react";

const FORMAT_EDITIE = [
  { value: "Broșată", label: "Broșată" },
  { value: "Cartonată", label: "Cartonată" },
  { value: "Digitală", label: "Digitală" },
];

const GENURI = [
  { value: "Fantezie", label: "Fantezie" },
  { value: "SF", label: "SF" },
  { value: "Clasice", label: "Clasice" },
  { value: "Filosofie", label: "Filosofie" },
  { value: "Istorie", label: "Istorie" },
  { value: "Mister", label: "Mister" },
];

const TITLU_MAX = 100;

export default function CarteForm({ onAdd }) {
  const [titluAutor, setTitluAutor] = useState("");
  const [gen, setGen] = useState("Fantezie");
  const [format, setFormat] = useState("Broșată");
  const [rating, setRating] = useState(5);
  const [totalPagini, setTotalPagini] = useState(300);

  const [eroare, setEroare] = useState("");
  const [trimite, setTrimite] = useState(false);

  function valideaza() {
    const t = titluAutor.trim();
    if (t === "") return "Titlul și autorul sunt obligatorii.";
    if (t.length > 100) return `Titlul are maximum 100 de caractere.`;
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const mesaj = valideaza();
    if (mesaj) {
      setEroare(mesaj);
      return;
    }
    setEroare("");
    setTrimite(true);

    try {
      await onAdd({
        titluAutor: titluAutor.trim(),
        gen,
        format,
        rating: Number(rating),
        totalPagini: Number(totalPagini) || 300,
        citita: false,
        paginaCurenta: 0,
        citat: "Prima filă din noua poveste...",
        notite: "Manuscris adăugat în arhivă.",
      });
      setTitluAutor("");
      setGen("Fantezie");
      setFormat("Broșată");
      setRating(5);
      setTotalPagini(300);
    } catch (err) {
      setEroare(err.message);
    } finally {
      setTrimite(false);
    }
  }

  return (
    <div className="form-mahon-wrapper">
      {/* Lumânările decorative stânga-dreapta */}
      <div className="lumanare-form stanga lumanare-realista" aria-hidden="true">
        <span className="aura-lumanare"></span>
        <span className="flacara-3d"></span>
        <span className="fitil-3d"></span>
        <span className="picatura-ceara"></span>
        <span className="ceara-3d"></span>
        <span className="suport-auriu"></span>
      </div>
      <div className="lumanare-form dreapta lumanare-realista" aria-hidden="true">
        <span className="aura-lumanare"></span>
        <span className="flacara-3d"></span>
        <span className="fitil-3d"></span>
        <span className="picatura-ceara"></span>
        <span className="ceara-3d"></span>
        <span className="suport-auriu"></span>
      </div>

      <form className="task-form custom-carte-form" onSubmit={handleSubmit} noValidate data-testid="form">
        <div className="form-ornament-header">
           <span className="hero-corner corner-tl" style={{top: "6px", left: "6px"}}>❖</span>
           <span className="hero-corner corner-tr" style={{top: "6px", right: "6px"}}>❖</span>
           <h3 className="form-mahon-title">Înregistrare Manuscris</h3>
           <div className="jurnal-divider" style={{margin: "4px 0 16px 0"}}><span>📜</span></div>
        </div>

        <div className="jurnal-section-box form-spacing">
          <label className="jurnal-label">Titlu și Autor</label>
          <input
            type="text"
            className="mahon-input"
            value={titluAutor}
            onChange={(e) => setTitluAutor(e.target.value)}
            placeholder="ex: Crimă și Pedeapsă - F. Dostoievski"
            maxLength={100}
            aria-invalid={Boolean(eroare)}
            data-testid="form-title"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div className="jurnal-section-box form-spacing">
            <label className="jurnal-label">Gen / Colecție</label>
            <select
              className="mahon-input"
              value={gen}
              onChange={(e) => setGen(e.target.value)}
              data-testid="form-gen"
            >
              <option value="Fantezie">Fantezie</option>
              <option value="SF">SF</option>
              <option value="Clasice">Clasice</option>
              <option value="Filosofie">Filosofie</option>
              <option value="Istorie">Istorie</option>
              <option value="Mister">Mister</option>
            </select>
          </div>

          <div className="jurnal-section-box form-spacing">
            <label className="jurnal-label">Format</label>
            <select
              className="mahon-input"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              data-testid="form-format"
            >
              <option value="Broșată">Broșată</option>
              <option value="Cartonată">Cartonată</option>
              <option value="Digitală">Digitală</option>
            </select>
          </div>

          <div className="jurnal-section-box form-spacing">
            <label className="jurnal-label">Evaluare (1-5)</label>
            <select
              className="mahon-input"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              data-testid="form-rating"
            >
              <option value="5">★★★★★ (5)</option>
              <option value="4">★★★★☆ (4)</option>
              <option value="3">★★★☆☆ (3)</option>
              <option value="2">★★☆☆☆ (2)</option>
              <option value="1">★☆☆☆☆ (1)</option>
            </select>
          </div>

          <div className="jurnal-section-box form-spacing">
            <label className="jurnal-label">Total Pagini</label>
            <input
              type="number"
              className="mahon-input"
              min="1"
              value={totalPagini}
              onChange={(e) => setTotalPagini(e.target.value)}
              data-testid="form-totalPagini"
            />
          </div>
        </div>

        {eroare && (
          <p className="error" data-testid="form-error" style={{marginBottom: "12px"}}>
            {eroare}
          </p>
        )}

        <button type="submit" disabled={trimite} data-testid="form-submit" className="mahon-btn-save w-100">
          {trimite ? "Se salvează pe server..." : "✨ Așază pe Raft"}
        </button>
      </form>
    </div>
  );
}