import "./App.css";

const carti = [
  { id: 1, titluAutor: "Fizica tristeții", citita: false, format: "Broșată" },
  { id: 2, titluAutor: "Atomic Habits", citita: true, format: "Digitală" },
  { id: 3, titluAutor: "Stăpânul Inelelor", citita: false, format: "Cartonată" }
];

export default function App() {
  const necitite = carti.filter((c) => !c.citita).length;

  return (
    <>
      <header className="app-header">
        <h1>BiblioTech</h1>
        <p>Sistem De Gestionare A Unei Biblioteci</p>
        <p className="status-text">{carti.length} cărți, dintre care {necitite} necitite</p>
      </header>

      <main className="container">
        <section className="panel">
          <h2>Cărțile mele</h2>
          <pre className="json-output">{JSON.stringify(carti, null, 2)}</pre>
        </section>
      </main>
    </>
  );
}