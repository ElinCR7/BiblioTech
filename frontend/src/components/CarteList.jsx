import CarteCard from "./CarteCard.jsx";

export default function CarteList({
  carti,
  onToggle,
  onDelete,
  onOpenJurnal,
  onHoverBook,
}) {
  return (
    <div className="raft-carti">
      {carti.map((carte) => (
        <CarteCard
          key={carte.id}
          carte={carte}
          onToggle={onToggle}
          onDelete={onDelete}
          onOpenJurnal={onOpenJurnal}
          onHoverBook={onHoverBook}
        />
      ))}
    </div>
  );
}