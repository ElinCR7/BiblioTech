import { StrictMode } from "react"; // Activează verificările suplimentare React în dezvoltare[cite: 2]
import { createRoot } from "react-dom/client"; // Importă funcția care montează aplicația în DOM[cite: 2]
import { BrowserRouter } from "react-router-dom"; // Oferă contextul de rutare fără reîncărcare[cite: 2]
import App from "./App.jsx"; // Importă componenta principală cu harta rutelor[cite: 2]
import "./index.css"; // Importă stilurile globale comune[cite: 2]

createRoot(document.getElementById("root")).render( // Selectează #root din index.html și randează[cite: 2]
  <StrictMode> {/* Verifică eventualele probleme React */}
    <BrowserRouter> {/* Înconjoară aplicația pentru a activa React Router[cite: 2] */}
      <App /> {/* Randează harta rutelor */}
    </BrowserRouter> {/* Închide contextul de rutare */}
  </StrictMode> // Închide modul strict
); // Încheie apelul render