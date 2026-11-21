import { useState } from "react"; // Importă hook-ul useState pentru câmpurile controlate ale formularului
import styles from "./CarteForm.module.css"; // Importă stilurile locale ale formularului (CSS Module)

export default function CarteForm({ onAdd }) { // Componenta formularului care primește callback-ul onAdd din CartiPage
  const [titluAutor, setTitluAutor] = useState(""); // State pentru titlul și autorul cărții
  const [gen, setGen] = useState("Literatură"); // State pentru genul/categoria cărții
  const [format, setFormat] = useState("Broșată"); // State pentru formatul fizic/digital
  const [rating, setRating] = useState(5); // State pentru evaluarea în stele (1–5)
  const [formError, setFormError] = useState(null); // State pentru mesajul de validare
  const [submitting, setSubmitting] = useState(false); // State care blochează dublu-click-ul în timpul cererii POST

  async function handleSubmit(e) { // Funcția apelată la trimiterea formularului
    e.preventDefault(); // Oprește reîncărcarea implicită a paginii de către browser
    const titluCurat = titluAutor.trim(); // Elimină spațiile goale de la început și sfârșit
    if (titluCurat.length < 3) { // Validează ca titlul să aibă cel puțin 3 caractere
      setFormError("Introdu titlul și autorul (minim 3 caractere)."); // Afișează eroarea de validare
      return; // Oprește trimiterea către server
    } // Închide verificarea de lungime

    setFormError(null); // Curăță eventuala eroare anterioară
    setSubmitting(true); // Dezactivează butonul până răspunde serverul
    try { // Încearcă trimiterea către API
      await onAdd({ // Apelează funcția primită prin props (care face POST /carti)
        titluAutor: titluCurat, // Trimite titlul curățat
        gen, // Trimite genul selectat
        format, // Trimite formatul selectat
        rating: Number(rating), // Convertește nota la număr
        citita: false, // O carte nouă este implicit disponibilă (necitită)
      }); // Închide obiectul trimis
      setTitluAutor(""); // Golește câmpul de text după adăugare cu succes
      setRating(5); // Resetează rating-ul la 5 stele
    } catch (err) { // Dacă serverul returnează eroare
      setFormError(`Nu am putut adăuga cartea: ${err.message}`); // Afișează eroarea primită
    } finally { // Se execută indiferent de rezultat
      setSubmitting(false); // Reactivează butonul de trimitere
    } // Închide blocul try-catch-finally
  } // Închide handleSubmit

  return ( // Returnează formularul stilizat în chenarul comun .panel
    <form className={`panel ${styles.form}`} onSubmit={handleSubmit} data-testid="add-form">
      {/* Antetul formularului cu titlu și lumânare decorativă */}
      <div className={styles.header}>
        {/* Titlul secțiunii de adăugare */}
        <h2 className={styles.title}>🕯️ Adaugă un Volum Nou în Arhivă</h2>
        {/* Subtitlu descriptiv */}
        <p className={styles.subtitle}>Completează detaliile manuscrisului pentru a-l așeza pe raft</p>
      </div>

      {/* Grila care aranjează câmpurile formularului */}
      <div className={styles.grid}>
        {/* Câmpul principal pentru titlu și autor */}
        <div className={styles.fieldWide}>
          {/* Etichetă asociată inputului */}
          <label className={styles.label} htmlFor="titlu-autor">Titlu - Autor</label>
          {/* Input controlat legat de state-ul titluAutor */}
          <input
            id="titlu-autor"
            type="text"
            className={styles.input}
            placeholder="Ex: Dune - Frank Herbert"
            value={titluAutor}
            onChange={(e) => setTitluAutor(e.target.value)}
            data-testid="input-title"
          />
        </div>

        {/* Selectorul de gen literar */}
        <div className={styles.field}>
          {/* Etichetă gen */}
          <label className={styles.label} htmlFor="gen-carte">Colecție / Gen</label>
          {/* Dropdown controlat pentru gen */}
          <select
            id="gen-carte"
            className={styles.select}
            value={gen}
            onChange={(e) => setGen(e.target.value)}
            data-testid="input-gen"
          >
            {/* Opțiunile de gen */}
            <option value="Literatură">Literatură</option>
            <option value="SF">SF</option>
            <option value="Fantezie">Fantezie</option>
            <option value="Clasice">Clasice</option>
            <option value="Istorie">Istorie</option>
            <option value="Biografie">Biografie</option>
            <option value="Dezvoltare">Dezvoltare</option>
          </select>
        </div>

        {/* Selectorul de format */}
        <div className={styles.field}>
          {/* Etichetă format */}
          <label className={styles.label} htmlFor="format-carte">Format</label>
          {/* Dropdown controlat pentru format */}
          <select
            id="format-carte"
            className={styles.select}
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            data-testid="input-format"
          >
            {/* Opțiunile de format */}
            <option value="Broșată">Broșată</option>
            <option value="Cartonată">Cartonată</option>
            <option value="Digitală">Digitală</option>
          </select>
        </div>

        {/* Selectorul de evaluare în stele */}
        <div className={styles.field}>
          {/* Etichetă evaluare */}
          <label className={styles.label} htmlFor="rating-carte">Evaluare</label>
          {/* Dropdown controlat pentru rating */}
          <select
            id="rating-carte"
            className={styles.select}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            data-testid="input-rating"
          >
            {/* Opțiunile 1–5 stele */}
            <option value={5}>★★★★★ (5/5)</option>
            <option value={4}>★★★★ (4/5)</option>
            <option value={3}>★★★ (3/5)</option>
            <option value={2}>★★ (2/5)</option>
            <option value={1}>★ (1/5)</option>
          </select>
        </div>
      </div>

      {/* Afișează eroarea de validare sau de server dacă există */}
      {formError && (
        <p className="error" data-testid="form-error">
          {formError}
        </p>
      )}

      {/* Zona butonului de trimitere */}
      <div className={styles.actions}>
        {/* Butonul submit care adaugă cartea pe server */}
        <button type="submit" className={`btn ${styles.submitBtn}`} disabled={submitting} data-testid="submit-btn">
          {submitting ? "⏳ Se așază pe raft..." : "✨ Adaugă pe Raft"}
        </button>
      </div>
    </form>
  ); // Închide return
} // Închide componenta CarteForm