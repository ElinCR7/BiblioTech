export default function DesprePage() { // Componenta paginii statice Despre
  return ( // Returnează panoul cu descrierea proiectului
    <section className="panel"> {/* Panou global stilizat din index.css */}
      <h2>Despre BiblioTech</h2> {/* Titlul paginii */}
      <p> {/* Paragraf cu descrierea aplicației */}
        BiblioTech este o aplicație de gestiune a bibliotecii personale construită pas cu pas,
        pe parcursul semestrului, în cadrul proiectului de Tehnologii Web.
      </p> {/* Închide paragraful de descriere */}
      <p> {/* Paragraf cu tehnologiile folosite */}
        Stack: React, Vite, React Router, CSS Modules, Node.js, Express, MariaDB, Docker.
      </p> {/* Închide paragraful de tehnologii */}
    </section> // Închide secțiunea
  ); // Încheie return
} // Încheie componenta DesprePage