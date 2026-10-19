// Un singur element din listă, primit prin props.
const ETICHETE_FORMAT = { brosata: "Broșată", digitala: "Digitală", cartonata: "Cartonată" };

// Funcție utilitară pentru a potrivi formatul tău brut la o cheie sigură
const getFormatKey = (formatString) => {
  if (formatString === "Broșată") return "brosata";
  if (formatString === "Digitală") return "digitala";
  return "cartonata";
};

export default function CarteCard({ carte }) {
  const formatKey = getFormatKey(carte.format);

  return (
    <li className={carte.citita ? "carte-card done" : "carte-card"}>
      <div>
        <h3>{carte.titluAutor}</h3>
        <span className={`badge badge-${formatKey}`}>
          Format {ETICHETE_FORMAT[formatKey]}
        </span>
      </div>
      <span className="status">{carte.citita ? "Citită" : "Necitită"}</span>
    </li>
  );
}