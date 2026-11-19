import CarteCard from "./CarteCard.jsx";

export default function CarteList({
  carti,
  onToggle,
  onDelete,
  onOpenJurnal,
  onOpenRezumat,
  onHoverBook,
}) {
  if (!carti || carti.length === 0) {
    return (
      <p className="empty empty-state-box" data-testid="empty" style={{width: "100%"}}>
        <span className="empty-icon">🕯️</span>
        Nu există nicio carte pe acest raft.
      </p>
    );
  }

  return (
    <ul className="raft-carti" style={{ paddingLeft: 0 }}>
      {carti.map((carte) => (
        <CarteCard
          key={carte.id}
          carte={carte}
          onToggle={onToggle}
          onDelete={onDelete}
          onOpenJurnal={onOpenJurnal}
          onOpenRezumat={onOpenRezumat}
          onHoverBook={onHoverBook}
        />
      ))}
    </ul>
  );
}