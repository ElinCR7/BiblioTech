import { Router } from "express";
import { parseId, valideazaCarte } from "../validation.js";

const router = Router();

let carti = [
  { id: 2, titluAutor: "Mentalitatea CR7 - Elin Dogaru", citita: true, format: "Cartonată", gen: "Sport", rating: 5 },
  { id: 3, titluAutor: "CR7 - Elin Dogaru", citita: true, format: "Digitală", gen: "Sport", rating: 5 },
  { id: 4, titluAutor: "Secrete CR7 - Elin Dogaru", citita: true, format: "Broșată", gen: "Sport", rating: 4 },
  { id: 5, titluAutor: "Magia CR7 - Elin Dogaru", citita: false, format: "Cartonată", gen: "Sport", rating: 4 },
  { id: 6, titluAutor: "Stil CR7 - Elin Dogaru", citita: true, format: "Broșată", gen: "Sport", rating: 4 },
  { id: 7, titluAutor: "Gol de aur - Elin Dogaru", citita: true, format: "Cartonată", gen: "Sport", rating: 3 },
  { id: 8, titluAutor: "Tactică - Elin Dogaru", citita: false, format: "Broșată", gen: "Sport", rating: 3 },
  { id: 9, titluAutor: "Gloria - Elin Dogaru", citita: true, format: "Digitală", gen: "Sport", rating: 3 },
  { id: 10, titluAutor: "Fotbal - Elin Dogaru", citita: true, format: "Digitală", gen: "Sport", rating: 2 },
  { id: 11, titluAutor: "Meciul - Elin Dogaru", citita: false, format: "Cartonată", gen: "Sport", rating: 2 },
  { id: 12, titluAutor: "Noapte - Elin Dogaru", citita: false, format: "Broșată", gen: "Sport", rating: 2 },
  { id: 13, titluAutor: "Golgheter - Elin Dogaru", citita: true, format: "Broșată", gen: "Sport", rating: 1 },
  { id: 14, titluAutor: "Campion - Elin Dogaru", citita: false, format: "Digitală", gen: "Sport", rating: 1 },
  { id: 16, titluAutor: "Răscumpărată - Melissa Tiroiu", citita: false, format: "Broșată", gen: "Romantism", rating: 5 },
  { id: 17, titluAutor: "Heart Bones - Melissa Tiroiu", citita: false, format: "Digitală", gen: "Romantism", rating: 5 },
  { id: 18, titluAutor: "Iubire eternă - Melissa Tiroiu", citita: true, format: "Cartonată", gen: "Romantism", rating: 5 },
  { id: 19, titluAutor: "Elevul Dima - Melissa Tiroiu", citita: true, format: "Broșată", gen: "Romantism", rating: 4 },
  { id: 20, titluAutor: "Invitație la vals - Melissa Tiroiu", citita: false, format: "Digitală", gen: "Romantism", rating: 4 },
  { id: 21, titluAutor: "Pași în doi - Melissa Tiroiu", citita: true, format: "Cartonată", gen: "Romantism", rating: 4 },
  { id: 22, titluAutor: "Profesorul - Melissa Tiroiu", citita: false, format: "Broșată", gen: "Romantism", rating: 3 },
  { id: 23, titluAutor: "Dragoste în timp - Melissa Tiroiu", citita: true, format: "Digitală", gen: "Romantism", rating: 3 },
  { id: 24, titluAutor: "Vara trecută - Melissa Tiroiu", citita: false, format: "Broșată", gen: "Romantism", rating: 3 },
  { id: 25, titluAutor: "Jurnalul - Melissa Tiroiu", citita: false, format: "Broșată", gen: "Romantism", rating: 2 },
  { id: 26, titluAutor: "Sub aceeași stea - Melissa Tiroiu", citita: true, format: "Digitală", gen: "Romantism", rating: 2 },
  { id: 27, titluAutor: "Promisiunea - Melissa Tiroiu", citita: false, format: "Cartonată", gen: "Romantism", rating: 2 },
  { id: 28, titluAutor: "Me Before You - Melissa Tiroiu", citita: false, format: "Broșată", gen: "Romantism", rating: 1 },
  { id: 31, titluAutor: "Mândrie și prejudecată - Melissa", citita: false, format: "Cartonată", gen: "Clasice", rating: 5 },
  { id: 32, titluAutor: "Enigma Otiliei - Melissa", citita: false, format: "Broșată", gen: "Clasice", rating: 5 },
  { id: 33, titluAutor: "Micul Prinț - Exupéry", citita: false, format: "Cartonată", gen: "Clasice", rating: 5 },
  { id: 34, titluAutor: "Moara cu noroc - Melissa", citita: true, format: "Cartonată", gen: "Clasice", rating: 4 },
  { id: 35, titluAutor: "Ultima noapte - Petrescu", citita: false, format: "Broșată", gen: "Clasice", rating: 4 },
  { id: 36, titluAutor: "Ion - Rebreanu", citita: true, format: "Digitală", gen: "Clasice", rating: 4 },
  { id: 38, titluAutor: "Rusoaica - Mihăescu", citita: true, format: "Digitală", gen: "Clasice", rating: 3 },
  { id: 39, titluAutor: "Părintele Goriot - Balzac", citita: false, format: "Cartonată", gen: "Clasice", rating: 3 },
  { id: 40, titluAutor: "Pădurea spânzuraților - Rebreanu", citita: false, format: "Cartonată", gen: "Clasice", rating: 2 },
  { id: 41, titluAutor: "The Great Gatsby - Fitzgerald", citita: false, format: "Broșată", gen: "Clasice", rating: 2 },
  { id: 42, titluAutor: "Ghepardinul - Lampedusa", citita: true, format: "Digitală", gen: "Clasice", rating: 2 },
  { id: 43, titluAutor: "Crimă și pedeapsă - Dostoievski", citita: false, format: "Broșată", gen: "Clasice", rating: 1 },
  { id: 44, titluAutor: "Oameni de piatră - Rebreanu", citita: false, format: "Broșată", gen: "Clasice", rating: 1 },
  { id: 46, titluAutor: "Alchimistul - Coelho", citita: false, format: "Broșată", gen: "Ficțiune", rating: 5 },
  { id: 47, titluAutor: "Fizica tristeții - Gospodinov", citita: false, format: "Cartonată", gen: "Ficțiune", rating: 5 },
  { id: 48, titluAutor: "Hobbitul - Tolkien", citita: true, format: "Cartonată", gen: "Ficțiune", rating: 5 },
  { id: 49, titluAutor: "1984 - George Orwell", citita: false, format: "Broșată", gen: "Ficțiune", rating: 4 },
  { id: 50, titluAutor: "Ferma animalelor - Orwell", citita: true, format: "Broșată", gen: "Ficțiune", rating: 4 },
  { id: 51, titluAutor: "De veghe în lan - Salinger", citita: false, format: "Cartonată", gen: "Ficțiune", rating: 4 },
  { id: 52, titluAutor: "Harry Potter 1 - Rowling", citita: true, format: "Cartonată", gen: "Ficțiune", rating: 3 },
  { id: 53, titluAutor: "Urzeala tronurilor - Martin", citita: true, format: "Cartonată", gen: "Ficțiune", rating: 3 },
  { id: 54, titluAutor: "Fundația - Isaac Asimov", citita: false, format: "Digitală", gen: "Ficțiune", rating: 3 },
  { id: 55, titluAutor: "Iluzii - Richard Bach", citita: false, format: "Broșată", gen: "Ficțiune", rating: 2 },
  { id: 56, titluAutor: "Eseu despre orbire - Saramago", citita: false, format: "Broșată", gen: "Ficțiune", rating: 2 },
  { id: 57, titluAutor: "Dune - Frank Herbert", citita: true, format: "Cartonată", gen: "Ficțiune", rating: 2 },
  { id: 58, titluAutor: "Lumea Nouă - Huxley", citita: false, format: "Broșată", gen: "Ficțiune", rating: 1 },
  { id: 61, titluAutor: "Atomic Habits - Clear", citita: true, format: "Digitală", gen: "Dezvoltare", rating: 5 },
  { id: 62, titluAutor: "Puterea obișnuinței - Duhigg", citita: false, format: "Digitală", gen: "Dezvoltare", rating: 5 },
  { id: 63, titluAutor: "Inteligența emoțională - Goleman", citita: true, format: "Cartonată", gen: "Dezvoltare", rating: 5 },
  { id: 64, titluAutor: "Gândire rapidă - Kahneman", citita: false, format: "Cartonată", gen: "Dezvoltare", rating: 4 },
  { id: 65, titluAutor: "Arta subtilă - Manson", citita: true, format: "Broșată", gen: "Dezvoltare", rating: 4 },
  { id: 66, titluAutor: "Puterea prezentului - Tolle", citita: false, format: "Digitală", gen: "Dezvoltare", rating: 4 },
  { id: 67, titluAutor: "Psihologia maselor - Freud", citita: true, format: "Broșată", gen: "Dezvoltare", rating: 3 },
  { id: 68, titluAutor: "Managementul timpului - Tracy", citita: false, format: "Cartonată", gen: "Dezvoltare", rating: 3 },
  { id: 69, titluAutor: "Arta comunicării - Carnegie", citita: true, format: "Digitală", gen: "Dezvoltare", rating: 3 },
  { id: 70, titluAutor: "Cursa de șobolani - Kiyosaki", citita: true, format: "Digitală", gen: "Dezvoltare", rating: 2 },
  { id: 71, titluAutor: "Tată sărac - Kiyosaki", citita: false, format: "Broșată", gen: "Dezvoltare", rating: 2 },
  { id: 72, titluAutor: "Ghidul investitorului - Kiyosaki", citita: true, format: "Cartonată", gen: "Dezvoltare", rating: 2 },
  { id: 73, titluAutor: "Fii lider - Maxwell", citita: false, format: "Cartonată", gen: "Dezvoltare", rating: 1 },
];

let nextId = 74;

function gasesteIndex(req, res) {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Id invalid" });
    return -1;
  }
  const index = carti.findIndex((c) => c.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Cartea nu există" });
    return -1;
  }
  return index;
}

router.get("/", (req, res) => {
  res.json(carti);
});

router.get("/:id", (req, res) => {
  const index = gasesteIndex(req, res);
  if (index === -1) return;
  res.json(carti[index]);
});

router.post("/", (req, res) => {
  const { erori, date } = valideazaCarte(req.body ?? {});
  if (erori.length > 0) {
    return res.status(400).json({ error: erori.join("; ") });
  }
  const carte = { id: nextId++, ...date };
  carti.push(carte);
  res.status(201).json(carte);
});

router.patch("/:id", (req, res) => {
  const index = gasesteIndex(req, res);
  if (index === -1) return;
  const { erori, date } = valideazaCarte(req.body ?? {}, { partial: true });
  if (erori.length > 0) {
    return res.status(400).json({ error: erori.join("; ") });
  }
  carti[index] = { ...carti[index], ...date };
  res.json(carti[index]);
});

router.delete("/:id", (req, res) => {
  const index = gasesteIndex(req, res);
  if (index === -1) return;
  carti.splice(index, 1);
  res.status(204).end();
});

export default router;