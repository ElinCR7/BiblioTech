import CarteCard from "./CarteCard.jsx";

export default function CarteList({ carti }) {
  // 1. dacă lista este goală:
  if (carti.length === 0) {
    return <p className="empty">Nu există nicio carte.</p>;
  }

  // 2. altfel:
  return (
    <ul className="carte-list">
      {carti.map((carte) => (
        <CarteCard key={carte.id} carte={carte} />
      ))}
    </ul>
  );
}