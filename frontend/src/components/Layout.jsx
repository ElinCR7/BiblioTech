import { NavLink, Outlet } from "react-router-dom"; // Importă NavLink și Outlet[cite: 5]
import styles from "./Layout.module.css"; // Importă stilurile locale ale layout-ului[cite: 5]

function navClass({ isActive }) { // Returnează clasa activă sau normală pentru NavLink[cite: 5]
  return isActive ? `${styles.link} ${styles.active}` : styles.link; // Combină clasele la activ[cite: 5]
} // Încheie navClass

export default function Layout() { // Componenta de layout comun tuturor paginilor[cite: 5]
  return ( // Returnează antetul, zona de conținut și subsolul
    <> {/* Fragment React */}
      <header className={styles.header}> {/* Antetul comun[cite: 5] */}
        <div className={styles.inner}> {/* Container centrat[cite: 5] */}
          <span className={styles.logo}>🕯️ BiblioTech</span> {/* Logo-ul aplicației[cite: 5] */}
          <nav className={styles.nav} data-testid="nav"> {/* Bara de navigație marcată pentru teste[cite: 5, 11] */}
            <NavLink to="/" end className={navClass}> {/* Link exact către pagina principală[cite: 5, 6] */}
              Biblioteca {/* Textul linkului[cite: 2] */}
            </NavLink> {/* Închide NavLink */}
            <NavLink to="/despre" className={navClass}> {/* Link către pagina Despre[cite: 5] */}
              Despre {/* Textul linkului[cite: 2] */}
            </NavLink> {/* Închide NavLink */}
          </nav> {/* Închide nav */}
        </div> {/* Închide containerul */}
      </header> {/* Închide header */}
      <main className={styles.main}> {/* Zona principală a paginii[cite: 5] */}
        <Outlet /> {/* Locul unde React Router randează pagina curentă[cite: 1, 5] */}
      </main> {/* Închide main */}
      <footer className={styles.footer}>🕯️ BiblioTech — Proiect Tehnologii Web</footer> {/* Subsol[cite: 6] */}
    </> // Închide fragmentul
  ); // Încheie return
} // Încheie Layout