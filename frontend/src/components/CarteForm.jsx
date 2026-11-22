import { useState } from "react"; // Hook-ul React pentru câmpurile controlate ale formularului
import styles from "./CarteForm.module.css"; // Stilurile locale ale formularului (CSS Module)

export default function CarteForm({ onAdd }) { // Primește funcția asincronă onAdd din CartiPage
  const [titluAutor, setTitluAutor] = useState(""); // State pentru titlu și autor
  const [gen, setGen] = useState("Literatură"); // State pentru colecție / gen
  const [format, setFormat] = useState("Broșată"); // State pentru formatul cărții
  const [rating, setRating] = useState(5); // State pentru evaluarea în stele (1–5)
  const [formError, setFormError] = useState(null); // State pentru mesajul de validare sau eroare server
  const [submitting, setSubmitting] = useState(false); // Blochează dubla trimitere cât timp serverul procesează

  async function handleSubmit(e) { // Funcția apelată la trimiterea formularului
    e.preventDefault(); // Oprește reîncărcarea implicită a paginii
    const titluCurat = titluAutor.trim(); // Elimină spațiile de la început și sfârșit

    if (titluCurat.length === 0) { // Verifică să nu fie gol
      setFormError("Titlul și autorul sunt obligatorii."); // Afișează eroarea inline
      return; // Oprește trimiterea către server
    }

    if (titluCurat.length > 100) { // Verifică limita maximă de 100 de caractere
      setFormError("Titlul și autorul pot avea cel mult 100 de caractere."); // Afișează eroarea inline
      return; // Oprește trimiterea către server
    }

    setFormError(null); // Curăță eroarea anterioară
    setSubmitting(true); // Dezactivează butonul până răspunde serverul

    try { // Trimite cererea POST /carti prin callback-ul onAdd
      await onAdd({ // Așteaptă confirmarea de la server înainte de a goli formularul
        titluAutor: titluCurat, // Titlul curățat
        gen, // Genul ales
        format, // Formatul ales
        rating: Number(rating), // Nota ca număr
        citita: false, // O carte nouă este implicit disponibilă
      });
      setTitluAutor(""); // Golește câmpul doar dacă salvarea pe server a reușit
      setRating(5); // Resetează rating-ul la 5 stele
    } catch (err) { // Dacă serverul este oprit sau returnează eroare
      setFormError(`Nu am putut adăuga cartea: ${err.message}`); // Păstrează textul introdus și afișează eroarea
    } finally { // Rulează indiferent de rezultat
      setSubmitting(false); // Reactivează butonul de trimitere
    }
  }

  return (
    <form
      className={`panel ${styles.form}`}
      onSubmit={handleSubmit}
      noValidate
      data-testid="form"
    >
      {/* Antetul formularului */}
      <div className={styles.header}>
        <h2 className={styles.title}>🕯️ Adaugă un Volum Nou în Arhivă</h2>
        <p className={styles.subtitle}>
          Completează detaliile manuscrisului pentru a-l așeza pe raft
        </p>
      </div>

      {/* Grila câmpurilor controlate */}
      <div className={styles.grid}>
        <div className={styles.fieldWide}>
          <label className={styles.label} htmlFor="titlu-autor">
            Titlu - Autor
          </label>
          <input
            id="titlu-autor"
            type="text"
            className={styles.input}
            placeholder="Ex: Dune - Frank Herbert"
            value={titluAutor}
            onChange={(e) => setTitluAutor(e.target.value)}
            data-testid="form-title"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="gen-carte">
            Colecție / Gen
          </label>
          <select
            id="gen-carte"
            className={styles.select}
            value={gen}
            onChange={(e) => setGen(e.target.value)}
          >
            <option value="Literatură">Literatură</option>
            <option value="SF">SF</option>
            <option value="Fantezie">Fantezie</option>
            <option value="Clasice">Clasice</option>
            <option value="Istorie">Istorie</option>
            <option value="Biografie">Biografie</option>
            <option value="Dezvoltare">Dezvoltare</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="format-carte">
            Format
          </label>
          <select
            id="format-carte"
            className={styles.select}
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="Broșată">Broșată</option>
            <option value="Cartonată">Cartonată</option>
            <option value="Digitală">Digitală</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="rating-carte">
            Evaluare
          </label>
          <select
            id="rating-carte"
            className={styles.select}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={5}>★★★★★ (5/5)</option>
            <option value={4}>★★★★ (4/5)</option>
            <option value={3}>★★★ (3/5)</option>
            <option value={2}>★★ (2/5)</option>
            <option value={1}>★ (1/5)</option>
          </select>
        </div>
      </div>

      {/* Mesaj de eroare inline (validare sau server) */}
      {formError && (
        <p className="error" data-testid="form-error">
          {formError}
        </p>
      )}

      {/* Butonul de trimitere */}
      <div className={styles.actions}>
        <button
          type="submit"
          className={`btn ${styles.submitBtn}`}
          disabled={submitting}
          data-testid="form-submit"
        >
          {submitting ? "⏳ Se așază pe raft..." : "✨ Adaugă pe Raft"}
        </button>
      </div>
    </form>
  );
}