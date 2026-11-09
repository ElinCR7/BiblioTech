export default function CarteCard({
  carte,
  onToggle,
  onDelete,
  onOpenJurnal,
  onHoverBook,
}) {
  const nota = Number(carte.rating) || 1;
  const steleText = "★".repeat(nota);

  const formatClasa = carte.format
    ? carte.format.toLowerCase().replace("ș", "s").replace("ă", "a")
    : "brosata";

  const [titlu, autor] =
    carte.titluAutor && carte.titluAutor.includes("-")
      ? carte.titluAutor.split("-").map((s) => s.trim())
      : [carte.titluAutor || "", ""];

  return (
    <div
      className={`book-shelf-slot ${carte.citita ? "citita" : ""}`}
      onMouseEnter={() => onHoverBook && onHoverBook()}
    >
      <div className="book-volume">
        {/* 1. COTORUL CĂRȚII */}
        <div className="book-spine">
          <div className="spine-ribs">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="spine-text">{carte.titluAutor}</span>
        </div>

        {/* 2. PAGINA DIN DREAPTA */}
        <div className="book-inside-pages">
          <div className="interior-header">
            <span className="interior-titlu-mic">Manuscris Original</span>
            <span
              className="interior-titlu-complet"
              title="Click pentru a deschide Jurnalul de Lectură"
              onClick={() => onOpenJurnal && onOpenJurnal(carte)}
            >
              {titlu}
            </span>
            {autor && <span className="interior-autor-pagina">{autor}</span>}
          </div>

          <div className="book-actions">
            <button
              type="button"
              className="btn-jurnal"
              onClick={() => onOpenJurnal && onOpenJurnal(carte)}
            >
              ✒️ Jurnal de Lectură
            </button>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={carte.citita}
                onChange={() => onToggle(carte.id)}
              />
              <span className="status-text-inside">
                {carte.citita ? "Împrumutată" : "Disponibilă"}
              </span>
            </label>

            <button className="btn-danger" onClick={() => onDelete(carte.id)}>
              Elimină din raft
            </button>
          </div>
        </div>

        {/* 3. COPERTA FAȚĂ + PAGINA DIN STÂNGA */}
        <div className="book-front-cover" data-stele={steleText}>
          <div className="cover-outside">
            <span className={`badge badge-${formatClasa}`}>{carte.format}</span>
            <div className="cover-content">
              <h3 className="book-title">{titlu}</h3>
              <div className="cover-ornament"></div>
              <p className="book-author">{autor}</p>
            </div>
          </div>

          <div className="cover-inside">
            <div className="left-page-frame">
              <div className="left-page-category">
                <span className="cat-tiny-label">Colecția</span>
                <span className="cat-name">{carte.gen || "Literatură"}</span>
              </div>

              <div className="mandala-inner-circle" aria-hidden="true">
                <span className="mandala-center-sun">۞</span>
              </div>

              <div className="left-page-rating">
                <span className="interior-titlu-mic">Evaluare ({nota}/5)</span>
                <div className="rating-stars">
                  <span className="stea plina">{steleText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}