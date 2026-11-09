import CarteCard from "./CarteCard.jsx";

export default function CarteList({ carti, onToggle, onDelete }) {
  return (
    <div className="raft-carti">
      {carti.map((carte) => (
        <CarteCard
          key={carte.id}
          carte={carte}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}