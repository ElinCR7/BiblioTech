export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001"; // Adresa serverului API

async function request(path, options = {}) { // Funcție comună pentru toate cererile HTTP
  const headers = { ...(options.headers || {}) }; // Copiază headerele suplimentare dacă există
  if (options.body) { // Verifică dacă cererea trimite date (POST sau PATCH)
    headers["Content-Type"] = "application/json"; // Adaugă JSON doar când există body (evită 400)
  } // Închide if
  const res = await fetch(`${API_URL}${path}`, { ...options, headers }); // Trimite cererea către server
if (!res.ok) {
  const body = await res.json().catch(() => ({}));
  throw new Error(body.error || `Eroare server: ${res.status}`);
}
return res.status === 204 ? null : res.json(); // <--- VERIFICĂ SĂ EXISTE LINIA ASTA!
} // Încheie request

export function fetchCarti() { // Cere lista completă de cărți
  return request("/carti"); // Trimite GET /carti
} // Încheie fetchCarti

export function fetchCarte(id) { // Cere o singură carte după id (Etapa 8)[cite: 7]
  return request(`/carti/${id}`); // Trimite GET /carti/:id[cite: 7]
} // Încheie fetchCarte

export function createCarte(carte) { // Adaugă o carte nouă pe server
  return request("/carti", { method: "POST", body: JSON.stringify(carte) }); // Trimite POST /carti
} // Încheie createCarte

export function updateCarte(id, changes) { // Modifică parțial o carte existentă
  return request(`/carti/${id}`, { method: "PATCH", body: JSON.stringify(changes) }); // Trimite PATCH /carti/:id
} // Încheie updateCarte

export function deleteCarte(id) { // Șterge o carte de pe server
  return request(`/carti/${id}`, { method: "DELETE" }); // Trimite DELETE /carti/:id
} // Încheie deleteCarte