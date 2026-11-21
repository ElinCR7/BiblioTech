import { Route, Routes } from "react-router-dom"; // Importă componentele pentru definirea rutelor[cite: 5]
import Layout from "./components/Layout.jsx"; // Importă layout-ul comun (antet + subsol)[cite: 5]
import CartiPage from "./pages/CartiPage.jsx"; // Importă pagina principală cu formular și listă[cite: 2, 5]
import CarteDetaliuPage from "./pages/CarteDetaliuPage.jsx"; // Importă pagina de detaliu[cite: 2, 5]
import DesprePage from "./pages/DesprePage.jsx"; // Importă pagina de prezentare[cite: 5]
import NotFoundPage from "./pages/NotFoundPage.jsx"; // Importă pagina 404[cite: 5]

export default function App() { // Componenta care conține doar harta rutelor[cite: 5]
  return ( // Returnează structura rutelor
    <Routes> {/* Containerul tuturor rutelor aplicației[cite: 1, 5] */}
      <Route element={<Layout />}> {/* Ruta părinte fără path care aplică Layout-ul[cite: 1, 5] */}
        <Route path="/" element={<CartiPage />} /> {/* Ruta principală: formular + listă[cite: 5] */}
        <Route path="/carti/:id" element={<CarteDetaliuPage />} /> {/* Ruta de detaliu conform tw.json[cite: 2, 5] */}
        <Route path="/despre" element={<DesprePage />} /> {/* Ruta paginii Despre[cite: 5] */}
        <Route path="*" element={<NotFoundPage />} /> {/* Prinde orice adresă inexistentă[cite: 1, 5] */}
      </Route> {/* Închide ruta de Layout */}
    </Routes> // Închide Routes
  ); // Încheie return
} // Încheie componenta App