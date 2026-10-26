import { useState } from "react";
import "./App.css";
import CarteList from "./components/CarteList.jsx";

// Datele inițiale
const CARTI_INITIALE = [
  { id: 1, titluAutor: "Fizica tristeții", citita: false, format: "Broșată" },
  { id: 2, titluAutor: "Atomic Habits", citita: true, format: "Digitală" },
  { id: 3, titluAutor: "Stăpânul Inelelor", citita: false, format: "Cartonată" }
];

// Tema de pornire: cea a sistemului de operare
function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [carti, setCarti] = useState(CARTI_INITIALE);
  const [tema, setTema] = useState(temaInitiala);

  // Actualizare imutabilă: listă nouă, obiect nou pentru elementul schimbat
  function handleToggle(id) {
    setCarti((prev) =>
      prev.map((c) => (c.id === id ? { ...c, citita: !c.citita } : c))
    );
  }

  // Ștergere imutabilă: listă nouă fără elementul șters
  function handleDelete(id) {
    setCarti((prev) => prev.filter((c) => c.id !== id));
  }

  // Comutarea temei
  function handleTema() {
    const noua = tema === "dark" ? "light" : "dark";
    setTema(noua);
    document.documentElement.dataset.theme = noua;
  }

  // Valoare derivată: se recalculează la fiecare randare
  const necitite = carti.filter((c) => !c.citita).length;

  return (
    <>
      <header className="app-header">
        <button
          className="theme-toggle"
          onClick={handleTema}
          aria-pressed={tema === "dark"}
        >
          {tema === "dark" ? "Mod luminos" : "Mod întunecat"}
        </button>
        <h1>BiblioTech</h1>
        <p>Sistem De Gestionare A Unei Biblioteci</p>
        <p className="status-text">{carti.length} cărți, dintre care {necitite} necitite</p>
      </header>

      <main className="container">
        <section className="panel">
          <h2>Cărțile mele</h2>
          <CarteList 
            carti={carti} 
            onToggle={handleToggle} 
            onDelete={handleDelete} 
          />
        </section>
      </main>
    </>
  );
}