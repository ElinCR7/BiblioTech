import { Link } from "react-router-dom"; // Link pentru navigarea fără reîncărcare către /carti/:id
import styles from "./CarteCard.module.css"; // Stilurile 3D locale ale cărții

export default function CarteCard({
  carte, // Obiectul carte primit de la server
  onToggle, // Funcția de bifare (PATCH)
  onDelete, // Funcția de ștergere (DELETE)
  onOpenJurnal, // Deschide modalul Jurnal
  onOpenRezumat, // Deschide modalul Rezumat 3D
  onHoverBook, // Redă sunetul de foșnet la hover
}) {
  const nota = Number(carte.rating) || 1; // Citește nota ca număr
  const steleText = "★".repeat(nota); // Generează stelele pentru afișare
  const formatClasa = carte.format
    ? carte.format.toLowerCase().replace("ș", "s").replace("ă", "a") // Clasă CSS fără diacritice
    : "brosata"; // Valoare implicită

  const [titlu, autor] =
    carte.titluAutor && carte.titluAutor.includes("-")
      ? carte.titluAutor.split("-").map((s) => s.trim()) // Separă titlul de autor dacă există cratimă
      : [carte.titluAutor || "", ""]; // Altfel păstrează textul complet ca titlu

  return (
    <li
      className={carte.citita ? `${styles.slot} ${styles.citita}` : styles.slot}
      onMouseEnter={() => onHoverBook && onHoverBook()}
      data-testid="item"
      data-id={carte.id}
    >
      {/* Volumul 3D al cărții (cotor, pagini și copertă) */}
      <div className={styles.volume}>
        {/* Cotorul vizibil pe raft cu link spre pagina de detaliu */}
        <div className={styles.spine}>
          <Link
            to={`/carti/${carte.id}`}
            className={styles.spineLink}
            data-testid="item-link"
          >
            <span data-testid="item-title">{carte.titluAutor}</span>
          </Link>
        </div>

        {/* Pagina din dreapta (vizibilă când se deschide cartea) */}
        <div className={styles.pages}>
          <span
            style={{
              fontSize: "0.56rem",
              textTransform: "uppercase",
              color: "#92400e",
              letterSpacing: "1.5px",
              fontWeight: "bold",
            }}
          >
            Manuscris Original
          </span>

          <Link
            to={`/carti/${carte.id}`}
            className={styles.detailLink}
            title="Deschide pagina de detaliu"
          >
            {titlu}
          </Link>

          {autor && (
            <span style={{ fontSize: "0.74rem", fontStyle: "italic", color: "#78350f" }}>
              {autor}
            </span>
          )}

          {/* Acțiunile CRUD: bifare și ștergere */}
          <div className={styles.actions}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={carte.citita}
                onChange={() => onToggle(carte.id)}
                aria-label={`Marchează ${carte.titluAutor}`}
                data-testid="item-toggle"
              />
              <span>{carte.citita ? "Împrumutată" : "Disponibilă"}</span>
            </label>

            <button
              type="button"
              className="btn-danger"
              onClick={() => onDelete(carte.id)}
              aria-label={`Șterge ${carte.titluAutor}`}
              data-testid="item-delete"
            >
              Șterge
            </button>
          </div>
        </div>

        {/* Coperta din față care se deschide 3D la hover */}
        <div className={styles.frontCover}>
          {/* Exteriorul copertei */}
          <div className={styles.coverOutside}>
            <span className={`badge badge-${formatClasa}`}>
              {carte.format || "Broșată"}
            </span>
            <h3 style={{ fontSize: "1rem", margin: "8px 0 4px", color: "#fffbeb" }}>
              {titlu}
            </h3>
            <p style={{ fontSize: "0.78rem", fontStyle: "italic", color: "#fde68a" }}>
              {autor}
            </p>
          </div>

          {/* Interiorul copertei (pagina din stânga) */}
          <div className={styles.coverInside}>
            <div>
              <span
                style={{
                  fontSize: "0.55rem",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: "#92400e",
                  display: "block",
                }}
              >
                Colecția
              </span>
              <strong style={{ fontSize: "0.85rem", color: "var(--turcuaz)" }}>
                {carte.gen || "Literatură"}
              </strong>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
              <button
                type="button"
                className="btn-rezumat-open"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenRezumat) onOpenRezumat(carte);
                }}
              >
                📖 Citește Rezumat
              </button>
              <button
                type="button"
                className="btn-jurnal"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenJurnal) onOpenJurnal(carte);
                }}
              >
                ✒️ Jurnal
              </button>
            </div>

            <div>
              <span style={{ fontSize: "0.6rem", color: "#92400e", display: "block" }}>
                Evaluare ({nota}/5)
              </span>
              <span style={{ color: "#d97706", fontSize: "1rem", letterSpacing: "2px" }}>
                {steleText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}