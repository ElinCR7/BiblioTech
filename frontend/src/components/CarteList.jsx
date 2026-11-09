import CarteCard from "./CarteCard.jsx";

export default function CarteList({ carti, onToggle, onDelete }) {
<<<<<<< HEAD
  return (
    <div className="raft-carti">
      {carti.map((carte) => (
        <CarteCard
          key={carte.id}
          carte={carte}
=======
  if (carti.length === 0) {
    return <p className="empty">Nu există nicio carte.</p>;
  }

  return (
    <ul className="carte-list">
      {carti.map((carte) => (
        <CarteCard 
          key={carte.id} 
          carte={carte} 
>>>>>>> e93cd7b049be1dd773cb55d00b3cab479cc88eb3
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
<<<<<<< HEAD
    </div>
=======
    </ul>
>>>>>>> e93cd7b049be1dd773cb55d00b3cab479cc88eb3
  );
}