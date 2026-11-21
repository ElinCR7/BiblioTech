import { Link } from "react-router-dom"; // Importă Link pentru întoarcere fără reîncărcare

export default function NotFoundPage() { // Componenta paginii pentru adrese inexistente
  return ( // Returnează panoul 404
    <section className="panel" data-testid="not-found"> {/* Reper test automat Etapa 8 */}
      <h2>Pagina nu există</h2> {/* Titlul paginii 404 */}
      <p className="info">Adresa cerută nu duce nicăieri.</p> {/* Mesaj informativ */}
      <Link to="/">Înapoi la bibliotecă</Link> {/* Link către pagina principală */}
    </section> // Închide secțiunea
  ); // Încheie return
} // Încheie componenta NotFoundPage