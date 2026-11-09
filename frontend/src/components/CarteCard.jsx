export default function CarteCard({ carte, onToggle, onDelete }) { // Definim componenta unei cărți și primim datele + funcțiile din părinte
  const nota = Number(carte.rating) || 1; // Convertim ratingul cărții în număr (sau punem 1 dacă lipsește)
  const steleText = "★".repeat(nota); // Generăm un șir cu exact atâtea stele câte are nota cărții (ex: "★★★★")

  const formatClasa = carte.format // Verificăm dacă există formatul cărții (Broșată, Cartonată, Digitală)
    ? carte.format.toLowerCase().replace("ș", "s").replace("ă", "a") // Îl transformăm în litere mici fără diacritice pentru clasa CSS
    : "brosata"; // Dacă nu este specificat, folosim "brosata" ca valoare implicită

  const [titlu, autor] = // Extragem separat titlul și autorul din textul "Titlu - Autor"
    carte.titluAutor && carte.titluAutor.includes("-") // Verificăm dacă textul conține cratimă
      ? carte.titluAutor.split("-").map((s) => s.trim()) // Despărțim textul la cratimă și eliminăm spațiile goale de pe margini
      : [carte.titluAutor || "", ""]; // Dacă nu are cratimă, punem tot textul ca titlu și lăsăm autorul gol

  return ( // Începem afișarea structurii vizuale (JSX) a cărții
    <div className={`book-shelf-slot ${carte.citita ? "citita" : ""}`}> {/* Spațiul ocupat de carte pe raft; adaugă clasa "citita" dacă e împrumutată */}
      <div className="book-volume"> {/* Cutia 3D a cărții care iese în față și se rotește când pui mouse-ul pe ea */}
        
        <div className="book-spine"> {/* Cotorul cărții (partea vizibilă când cartea stă închisă pe raft) */}
          <div className="spine-ribs"> {/* Containerul pentru nervurile aurii în relief de pe cotor */}
            <span></span><span></span><span></span><span></span> {/* Cele 4 linii orizontale aurii de pe cotor */}
          </div> {/* Închidem containerul nervurilor */}
          <span className="spine-text">{carte.titluAutor}</span> {/* Textul scris vertical pe cotorul cărții */}
        </div> {/* Închidem cotorul cărții */}

        <div className="book-inside-pages"> {/* Pagina din dreapta (blocul de foi de pergament) */}
          <div className="interior-header"> {/* Partea de sus a paginii din dreapta (cu titlul și autorul) */}
            <span className="interior-titlu-mic">Manuscris Original</span> {/* Subtitlu mic decorativ deasupra titlului */}
            <span className="interior-titlu-complet" title={carte.titluAutor}> {/* Titlul complet al cărții scris pe pagină */}
              {titlu} {/* Afișează numele cărții */}
            </span> {/* Închidem eticheta titlului */}
            {autor && <span className="interior-autor-pagina">{autor}</span>} {/* Afișează numele autorului doar dacă există */}
          </div> {/* Închidem antetul paginii din dreapta */}

          <div className="book-actions"> {/* Zona de jos a paginii din dreapta cu bifa și butonul de ștergere */}
            <label className="checkbox-label"> {/* Eticheta clicabilă pentru căsuța de bifat */}
              <input /* Căsuța de bifat (checkbox) */
                type="checkbox" /* Specifică tipul inputului ca bifă */
                checked={carte.citita} /* Bifează căsuța dacă proprietatea "citita" este true */
                onChange={() => onToggle(carte.id)} /* La click, apelează funcția care schimbă starea cărții */
              /> {/* Închidem inputul */}
              <span className="status-text-inside"> {/* Textul care arată starea curentă a cărții */}
                {carte.citita ? "Împrumutată" : "Disponibilă"} {/* Afișează "Împrumutată" sau "Disponibilă" în funcție de stare */}
              </span> {/* Închidem textul stării */}
            </label> {/* Închidem eticheta bifei */}

            <button className="btn-danger" onClick={() => onDelete(carte.id)}> {/* Butonul care șterge cartea la click */}
              Elimină din raft {/* Textul de pe butonul de ștergere */}
            </button> {/* Închidem butonul */}
          </div> {/* Închidem zona de acțiuni */}
        </div> {/* Închidem pagina din dreapta */}

        <div className="book-front-cover" data-stele={steleText}> {/* Coperta față; trimite stelele către CSS prin atributul data-stele */}
          <div className="cover-outside"> {/* Fața exterioară a coperții */}
            <span className={`badge badge-${formatClasa}`}>{carte.format}</span> {/* Eticheta colorată din colț cu formatul cărții */}
            <div className="cover-content"> {/* Containerul care centrează titlul și autorul pe copertă */}
              <h3 className="book-title">{titlu}</h3> {/* Titlul cărții pe coperta exterioară */}
              <div className="cover-ornament"></div> {/* Linia aurie decorativă dintre titlu și autor */}
              <p className="book-author">{autor}</p> {/* Numele autorului pe coperta exterioară */}
            </div> {/* Închidem conținutul coperții */}
          </div> {/* Închidem fața exterioară a coperții */}

          <div className="cover-inside"> {/* Pagina din stânga (dosul coperții când cartea se deschide) */}
            <div className="left-page-frame"> {/* Chenarul dublu din interiorul paginii stângi (centrat pe mijloc) */}
              <div className="left-page-category"> {/* Secțiunea cu categoria cărții */}
                <span className="cat-tiny-label">Colecția</span> {/* Text mic deasupra numelui categoriei */}
                <span className="cat-name">{carte.gen || "Literatură"}</span> {/* Numele categoriei din care face parte cartea */}
              </div> {/* Închidem secțiunea categoriei */}

              <div className="left-page-rating"> {/* Secțiunea cu evaluarea cărții pe mijlocul paginii */}
                <span className="interior-titlu-mic">Evaluare ({nota}/5)</span> {/* Textul care arată nota numerică (ex: 5/5) */}
                <div className="rating-stars"> {/* Containerul pastilă pentru stele */}
                  <span className="stea plina">{steleText}</span> {/* Stelele aurii afișate pe pagină */}
                </div> {/* Închidem containerul stelelor */}
              </div> {/* Închidem secțiunea evaluării */}
            </div> {/* Închidem chenarul paginii stângi */}
          </div> {/* Închidem pagina din stânga */}
        </div> {/* Închidem coperta față */}

      </div> {/* Închidem volumul 3D */}
    </div> // Închidem slotul de pe raft
  ); // Închidem instrucțiunea return
} // Închidem funcția CarteCard
const ETICHETE_FORMAT = { brosata: "Broșată", digitala: "Digitală", cartonata: "Cartonată" };

const getFormatKey = (formatString) => {
  if (formatString === "Broșată") return "brosata";
  if (formatString === "Digitală") return "digitala";
  return "cartonata";
};

export default function CarteCard({ carte, onToggle, onDelete }) {
  const formatKey = getFormatKey(carte.format);

  return (
    <li className={carte.citita ? "carte-card done" : "carte-card"}>
      <label className="carte-main">
        <input
          type="checkbox"
          checked={carte.citita}
          onChange={() => onToggle(carte.id)}
        />
        <div>
          <h3>{carte.titluAutor}</h3>
          <span className={`badge badge-${formatKey}`}>
            Format {ETICHETE_FORMAT[formatKey]}
          </span>
        </div>
      </label>
      
      <button
        className="btn-danger"
        onClick={() => onDelete(carte.id)}
        aria-label={`Șterge ${carte.titluAutor}`}
      >
        Șterge
      </button>
    </li>
  );
}