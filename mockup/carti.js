
const carti = [
    { id: 1, titluAutor: "Fizica tristeții", citita: false, format: "Broșată" },
    { id: 2, titluAutor: "Atomic Habits", citita: true, format: "Digitală" },
    { id: 3, titluAutor: "Stăpânul Inelelor", citita: false, format: "Cartonată" }
];

const FORMATE = ["Cartonată", "Broșată", "Digitală"];

// 1. Listarea titlurilor (folosește map)
function listeazaTitluri(lista) {
    return lista.map((c) => c.titluAutor);
}

// 2. Numărarea elementelor necitite (folosește filter)
function numaraNecitite(lista) {
    return lista.filter((c) => !c.citita).length;
}

// 3. Căutarea după titlu sau autor (folosește filter)
function cautaDupaTitluSauAutor(lista, text) {
    const textCautat = text.toLowerCase();
    return lista.filter((c) => c.titluAutor.toLowerCase().includes(textCautat));
}

// Căutarea unui element după ID (folosește find)
function gasesteDupaId(lista, id) {
    return lista.find((c) => c.id === id);
}

// Calcul ID nou (folosește reduce)
function nextId(lista) {
    return lista.reduce((max, c) => Math.max(max, c.id), 0) + 1;
}

// 4. Adăugarea unui element cu validare (funcție imutabilă)
function adaugaCarte(lista, titluAutor, format) {
    const titluCurat = titluAutor.trim();
    
    // Validare
    if (!titluCurat) {
        console.log("Eroare validare: Titlul și autorul nu pot fi goale!");
        return lista; // Se întoarce lista neschimbată
    }
    if (!FORMATE.includes(format)) {
        console.log("Eroare validare: Format invalid! Trebuie să fie: " + FORMATE.join(", "));
        return lista; // Se întoarce lista neschimbată
    }

    const carteNoua = {
        id: nextId(lista),
        titluAutor: titluCurat,
        citita: false,
        format: format
    };

    // Returnează un array NOU
    return [...lista, carteNoua];
}

// 5. Comutarea stării (funcție imutabilă cu map)
function comutaCitita(lista, id) {
    return lista.map((c) => (c.id === id ? { ...c, citita: !c.citita } : c));
}

// 6. Ștergerea (funcție imutabilă cu filter)
function stergeCarte(lista, id) {
    return lista.filter((c) => c.id !== id);
}

// =========================================================
// TESTE ÎN CONSOLĂ (pentru a respecta cerințele din ghid)
// =========================================================
console.log("--- Citire ---");
console.log("Titluri:", listeazaTitluri(carti).join(", "));
console.log("Necitite:", numaraNecitite(carti));
console.log("Căutare 'habits':", listeazaTitluri(cautaDupaTitluSauAutor(carti, "habits")).join(", "));
console.log("Găsit carte cu ID 2:", gasesteDupaId(carti, 2).titluAutor);

console.log("--- Adăugare ---");
let lista = adaugaCarte(carti, "Dune - Frank Herbert", "Cartonată");
console.log("Lista nouă:", lista.length, "cărți");
console.log("Originalul a rămas cu:", carti.length, "cărți");

console.log("--- Modificare și ștergere ---");
lista = comutaCitita(lista, 1); 
console.log("După bifarea id 1, necitite:", numaraNecitite(lista));
lista = stergeCarte(lista, 3);
console.log("După ștergerea id 3:", listeazaTitluri(lista).join(", "));

console.log("--- Validare ---");
adaugaCarte(lista, "   ", "Broșată"); // Test respingere nume gol
adaugaCarte(lista, "Harry Potter", "Audiobook"); // Test respingere etichetă inexistentă