import { Link } from "react-router-dom"; // Importă Link pentru navigare fără reîncărcare spre /carti/:id
import styles from "./CarteCard.module.css"; // Importă stilurile locale 3D ale cărții

export default function CarteCard({ // Componenta cărții 3D cu toate funcțiile din Etapa 7
  carte, // Obiectul carte de pe server
  onToggle, // Funcția de bifare (PATCH)
  onDelete, // Funcția de ștergere (DELETE)
  onOpenJurnal, // Funcția care deschide Jurnalul
  onOpenRezumat, // Funcția care deschide Rezumatul 3D
  onHoverBook, // Funcția care redă sunetul de foșnet
}) {
  const nota = Number(carte.rating) || 1; // Citește nota ca număr
  const steleText = "★".repeat(nota); // Generează stelele pentru afișare
  const formatClasa = carte.format // Construiește clasa pentru badge-ul de format
    ? carte.format.toLowerCase().replace("ș", "s").replace("ă", "a") // Curăță diacriticele
    : "brosata"; // Valoare implicită

  const [titlu, autor] = // Separă titlul de autor dacă există cratimă
    carte.titluAutor && carte.titluAutor.includes("-")
      ? carte.titluAutor.split("-").map((s) => s.trim()) // Împarte în [titlu, autor]
      : [carte.titluAutor || "", ""]; // Dacă nu are cratimă, autorul e gol

  return ( // Returnează cartea 3D pe raft
    <li // Element <li> obligatoriu pentru verificarea automată
      className={carte.citita ? `${styles.slot} ${styles.citita}` : styles.slot} // Lățime fixă 54px + roz dacă e citită
      onMouseEnter={() => onHoverBook && onHoverBook()} // Redă sunetul de foșnet la hover
      data-testid="item" // Reper test automat
      data-id={carte.id} // ID-ul cărții pentru verificarea după refresh
    >
      <div className={styles.volume}> {/* Volumul 3D (cotor + copertă + pagini) */}
        <div className={styles.spine}> {/* Cotorul vizibil pe raft */}
          <Link // Titlul de pe cotor devine link spre pagina de detaliu
            to={`/carti/${carte.id}`} // Ruta de detaliu /carti/:id
            className={styles.spineLink} // Stil vertical pe cotor
            data-testid="item-link" // Reper test automat Etapa 8
          >
            {carte.titluAutor} {/* Titlul și autorul */}
          </Link> {/* Închide Link */}
        </div> {/* Închide cotorul */}

        <div className={styles.pages}> {/* Pagina din dreapta (vizibilă la deschidere) */}
          <span style={{ fontSize: "0.56rem", textTransform: "uppercase", color: "#92400e", letterSpacing: "1.5px", fontWeight: "bold" }}>
            Manuscris Original {/* Etichetă decorativă sus */}
          </span>
          <Link to={`/carti/${carte.id}`} className={styles.detailLink} title="Deschide pagina de detaliu"> {/* Link spre detaliu */}
            {titlu} {/* Titlul cărții */}
          </Link>
          {autor && <span style={{ fontSize: "0.74rem", fontStyle: "italic", color: "#78350f" }}>{autor}</span>} {/* Autorul */}

          <div className={styles.actions}> {/* Zona de bifare și ștergere */}
            <label className={styles.checkboxLabel}> {/* Etichetă checkbox */}
              <input // Căsuța de bifare
                type="checkbox" // Tip checkbox
                checked={carte.citita} // Starea din server
                onChange={() => onToggle(carte.id)} // Trimite PATCH la server
                aria-label={`Marchează ${carte.titluAutor}`} // Etichetă accesibilitate
                data-testid="item-toggle" // Reper test automat
              /> {/* Închide input */}
              <span>{carte.citita ? "Împrumutată" : "Disponibilă"}</span> {/* Status */}
            </label> {/* Închide label */}

            <button // Butonul de ștergere
              type="button" // Nu trimite formulare
              className="btn-danger" // Clasă globală din index.css
              onClick={() => onDelete(carte.id)} // Trimite DELETE la server
              aria-label={`Șterge ${carte.titluAutor}`} // Etichetă accesibilitate
              data-testid="item-delete" // Reper test automat
            >
              Șterge {/* Text buton */}
            </button> {/* Închide button */}
          </div> {/* Închide actions */}
        </div> {/* Închide pages */}

        <div className={styles.frontCover}> {/* Coperta față 3D */}
          <div className={styles.coverOutside}> {/* Exteriorul copertei */}
            <span className={`badge badge-${formatClasa}`}>{carte.format || "Broșată"}</span> {/* Badge format */}
            <h3 style={{ fontSize: "1rem", margin: "8px 0 4px", color: "#fffbeb" }}>{titlu}</h3> {/* Titlul pe copertă */}
            <p style={{ fontSize: "0.78rem", fontStyle: "italic", color: "#fde68a" }}>{autor}</p> {/* Autorul pe copertă */}
          </div> {/* Închide coverOutside */}

          <div className={styles.coverInside}> {/* Pagina din stânga (Colecția + Rezumat + Jurnal + Stele) */}
            <div> {/* Zona de categorie */}
              <span style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "2px", color: "#92400e", display: "block" }}>Colecția</span>
              <strong style={{ fontSize: "0.85rem", color: "var(--turcuaz)" }}>{carte.gen || "Literatură"}</strong>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}> {/* Butoanele interactive */}
              <button // Buton deschidere Rezumat 3D
                type="button"
                className="btn-rezumat-open"
                onClick={(e) => { e.stopPropagation(); onOpenRezumat && onOpenRezumat(carte); }} // Deschide rezumatul
              >
                📖 Citește Rezumat
              </button>
              <button // Buton deschidere Jurnal
                type="button"
                className="btn-jurnal"
                onClick={(e) => { e.stopPropagation(); onOpenJurnal && onOpenJurnal(carte); }} // Deschide jurnalul
              >
                ✒️ Jurnal
              </button>
            </div>

            <div> {/* Evaluarea în stele */}
              <span style={{ fontSize: "0.6rem", color: "#92400e", display: "block" }}>Evaluare ({nota}/5)</span>
              <span style={{ color: "#d97706", fontSize: "1rem", letterSpacing: "2px" }}>{steleText}</span>
            </div>
          </div> {/* Închide coverInside */}
        </div> {/* Închide frontCover */}
      </div> {/* Închide volume */}
    </li> // Închide li
  ); // Încheie return
} // Încheie CarteCard