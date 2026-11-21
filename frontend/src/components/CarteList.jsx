import CarteCard from "./CarteCard.jsx"; // Importă cardul 3D complet al cărții
import styles from "./CarteList.module.css"; // Importă stilul raftului lat din CSS Module

export default function CarteList({ // Componenta raftului care primește toate funcțiile
  carti, // Lista de cărți din categoria curentă
  onToggle, // Funcția de bifare (PATCH)
  onDelete, // Funcția de ștergere (DELETE)
  onOpenJurnal, // Funcția care deschide modalul Jurnal
  onOpenRezumat, // Funcția care deschide modalul Rezumat 3D
  onHoverBook, // Funcția care redă sunetul de foșnet la hover
}) {
  if (!carti || carti.length === 0) { // Verifică dacă raftul este gol
    return ( // Afișează mesajul de raft gol
      <p className={`empty ${styles.emptyFull}`} data-testid="empty"> {/* Reper test automat */}
        🕯️ Nu există nicio carte pe acest raft. {/* Text mesaj */}
      </p> // Închide paragraful
    ); // Încheie return
  } // Închide if

  return ( // Returnează raftul orizontal pe toată lățimea
    <ul className={styles.shelf}> {/* Raftul din lemn stilizat prin CSS Module */}
      {carti.map((carte) => ( // Parcurge fiecare carte de pe acest raft
        <CarteCard // Randează cartea 3D
          key={carte.id} // Cheie unică React
          carte={carte} // Datele cărții
          onToggle={onToggle} // Trimite bifarea
          onDelete={onDelete} // Trimite ștergerea
          onOpenJurnal={onOpenJurnal} // Trimite deschiderea jurnalului
          onOpenRezumat={onOpenRezumat} // Trimite deschiderea rezumatului
          onHoverBook={onHoverBook} // Trimite sunetul de foșnet
        /> // Închide CarteCard
      ))} {/* Încheie map */}
    </ul> // Închide ul
  ); // Încheie return
} // Încheie CarteList