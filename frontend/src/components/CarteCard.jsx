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