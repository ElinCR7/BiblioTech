import CarteCard from "./CarteCard.jsx";

export default function CarteList({ carti, onToggle, onDelete }) {
  if (carti.length === 0) {
    return <p className="empty">Nu există nicio carte.</p>;
  }

  return (
    <ul className="carte-list">
      {carti.map((carte) => (
        <CarteCard 
          key={carte.id} 
          carte={carte} 
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}