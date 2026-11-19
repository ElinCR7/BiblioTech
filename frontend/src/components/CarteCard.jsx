export default function CarteCard({
  carte,
  onToggle,
  onDelete,
  onOpenJurnal,
  onOpenRezumat,
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
    <li
      className={`book-shelf-slot ${carte.citita ? "citita" : ""}`}
      onMouseEnter={() => onHoverBook && onHoverBook()}
      data-testid="item"
      data-id={carte.id}
      style={{ listStyle: "none", display: "inline-block" }}
    >
      <div className="book-volume">
        <div className="book-spine">
          <div className="spine-ribs">
            <span></span><span></span><span></span><span></span>
          </div>
          <span className="spine-text" data-testid="item-title">{carte.titluAutor}</span>
        </div>

        <div className="book-inside-pages">
          <div className="right-page-center-box">
            <div className="interior-header">
              <span className="interior-titlu-mic">Manuscris Original</span>
              <span
                className="interior-titlu-complet"
                title="Click pentru a citi rezumatul cărții"
                onClick={() => onOpenRezumat && onOpenRezumat(carte)}
              >
                {titlu}
              </span>
              {autor && <span className="interior-autor-pagina">{autor}</span>}
            </div>

            <div className="right-page-divider" aria-hidden="true"></div>

            <div className="book-actions">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={carte.citita}
                  onChange={() => onToggle(carte.id)}
                  data-testid="item-toggle"
                />
                <span className="status-text-inside">
                  {carte.citita ? "Împrumutată" : "Disponibilă"}
                </span>
              </label>

              <button
                type="button"
                className="btn-danger"
                onClick={() => onDelete(carte.id)}
                data-testid="item-delete"
              >
                Șterge
              </button>
            </div>
          </div>
        </div>

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

              <div className="left-page-buttons-group">
                <button
                  type="button"
                  className="btn-rezumat-open"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenRezumat && onOpenRezumat(carte);
                  }}
                >
                  📖 Citește Rezumat
                </button>

                <button
                  type="button"
                  className="btn-jurnal"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenJurnal && onOpenJurnal(carte);
                  }}
                >
                  ✒️ Jurnal
                </button>
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
    </li>
  );
}