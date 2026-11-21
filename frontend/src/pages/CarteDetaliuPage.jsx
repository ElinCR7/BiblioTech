import { useEffect, useState } from "react"; // Importă hook-urile React pentru state și efecte
import { Link, useParams } from "react-router-dom"; // Importă Link și useParams pentru citirea :id
import { fetchCarte } from "../api.js"; // Importă funcția care cere o singură carte de la server
import styles from "./CarteDetaliuPage.module.css"; // Importă stilurile locale ale paginii de detaliu

export default function CarteDetaliuPage() { // Componenta paginii de detaliu (/carti/:id)
  const { id } = useParams(); // Extrage id-ul din adresă (întotdeauna ca text)
  const [carte, setCarte] = useState(null); // State pentru datele cărții primite de la server
  const [loading, setLoading] = useState(true); // State care indică încărcarea datelor
  const [error, setError] = useState(null); // State pentru eventuale erori (ex: 404)

  useEffect(() => { // Efect care rulează ori de câte ori se schimbă id-ul din URL
    let ignore = false; // Flag pentru a evita actualizarea state-ului după demontare
    fetchCarte(id) // Trimite cererea GET /carti/:id către server
      .then((data) => { // Se execută dacă serverul răspunde cu succes
        if (!ignore) { // Verifică dacă pagina este încă montată
          setCarte(data); // Salvează datele cărții în state
          setError(null); // Șterge eventuala eroare rămasă de la un id anterior
        } // Închide verificarea ignore
      }) // Încheie blocul then
      .catch((err) => { // Se execută dacă serverul răspunde cu eroare (ex: 404)
        if (!ignore) setError(err.message); // Salvează mesajul de eroare în state
      }) // Încheie blocul catch
      .finally(() => { // Se execută indiferent dacă a fost succes sau eroare
        if (!ignore) setLoading(false); // Oprește indicatorul de încărcare
      }); // Încheie blocul finally
    return () => { // Funcția de curățare apelată la demontare sau schimbare de id
      ignore = true; // Marchează efectul ca expirat
    }; // Încheie funcția de curățare
  }, [id]); // Lista de dependențe: reîncarcă datele când se schimbă id-ul

  if (loading) { // Dacă datele încă se încarcă
    return ( // Returnează mesajul de încărcare
      <p className="info" data-testid="loading"> {/* Reper test automat pentru loading */}
        Se încarcă... {/* Text afișat în timpul încărcării */}
      </p> // Închide paragraful
    ); // Încheie return
  } // Încheie verificarea loading

  if (error) { // Dacă a apărut o eroare (ex: /carti/999)
    return ( // Returnează panoul de eroare cu link înapoi
      <section className="panel"> {/* Panou global stilizat din index.css */}
        <p className="error" data-testid="error"> {/* Reper test automat pentru eroare */}
          Cartea nu a putut fi încărcată: {error} {/* Afișează mesajul de eroare */}
        </p> {/* Închide mesajul de eroare */}
        <Link to="/">Înapoi la bibliotecă</Link> {/* Link fără reîncărcare către lista principală */}
      </section> // Închide secțiunea
    ); // Încheie return
  } // Încheie verificarea error

  return ( // Returnează pagina completă cu detaliile cărții
    <section className={`panel ${styles.detail}`} data-testid="detail"> {/* Reper test automat pentru detaliu */}
      <Link to="/" className={styles.back}> {/* Link de întoarcere la lista principală */}
        ← Înapoi la bibliotecă {/* Textul linkului */}
      </Link> {/* Închide Link */}

      <h2 className={carte.citita ? styles.done : undefined} data-testid="detail-title"> {/* Titlul marcat pentru teste */}
        {carte.titluAutor} {/* Afișează titlul și autorul cărții */}
      </h2> {/* Închide titlul */}

      <dl className={styles.fields}> {/* Listă de definiții pentru câmpurile cărții */}
        <dt>Gen</dt> {/* Etichetă gen */}
        <dd> {/* Valoare gen */}
          <span className="badge">{carte.gen || "Literatură"}</span> {/* Etichetă globală badge */}
        </dd> {/* Închide dd */}

        <dt>Format</dt> {/* Etichetă format */}
        <dd>{carte.format || "Broșată"}</dd> {/* Valoare format */}

        <dt>Evaluare</dt> {/* Etichetă evaluare */}
        <dd>{"★".repeat(Number(carte.rating) || 5)} ({carte.rating || 5}/5)</dd> {/* Stele și notă */}

        <dt>Total pagini</dt> {/* Etichetă număr pagini */}
        <dd>{carte.totalPagini || 300}</dd> {/* Valoare număr pagini */}

        <dt>Status</dt> {/* Etichetă status */}
        <dd>{carte.citita ? "Împrumutată / Citită" : "Disponibilă"}</dd> {/* Statusul curent */}

        <dt>ID</dt> {/* Etichetă ID */}
        <dd>{carte.id}</dd> {/* ID-ul elementului din baza de date */}
      </dl> {/* Închide lista de definiții */}
    </section> // Închide secțiunea de detaliu
  ); // Încheie return
} // Încheie componenta CarteDetaliuPage