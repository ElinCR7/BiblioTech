export const FORMATE = ["Broșată", "Cartonată", "Digitală"];
export const GENURI = [
  "Literatură",
  "SF",
  "Fantezie",
  "Clasice",
  "Istorie",
  "Biografie",
  "Dezvoltare",
  "Sport",
  "Romantism",
  "Ficțiune",
];
const TITLU_MAX = 100;

export function valideazaCarte(body, { partial = false } = {}) {
  const erori = [];
  const date = {};

  if (!partial || body.titluAutor !== undefined) {
    if (typeof body.titluAutor !== "string" || body.titluAutor.trim() === "") {
      erori.push("titluAutor este obligatoriu");
    } else if (body.titluAutor.trim().length > TITLU_MAX) {
      erori.push(`titluAutor are maximum ${TITLU_MAX} de caractere`);
    } else {
      date.titluAutor = body.titluAutor.trim();
    }
  }

  if (!partial || body.format !== undefined) {
    const f = body.format ?? "Broșată";
    if (!FORMATE.includes(f)) {
      erori.push(`format trebuie să fie una din: ${FORMATE.join(", ")}`);
    } else {
      date.format = f;
    }
  }

  if (!partial || body.gen !== undefined) {
    const g = body.gen ?? "Literatură";
    if (!GENURI.includes(g)) {
      erori.push(`gen trebuie să fie una din: ${GENURI.join(", ")}`);
    } else {
      date.gen = g;
    }
  }

  if (!partial || body.rating !== undefined) {
    const r = body.rating ?? 5;
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      erori.push("rating trebuie să fie un număr întreg între 1 și 5");
    } else {
      date.rating = r;
    }
  }

  if (body.citita !== undefined) {
    if (typeof body.citita !== "boolean") {
      erori.push("citita trebuie să fie true sau false");
    } else {
      date.citita = body.citita;
    }
  } else if (!partial) {
    date.citita = false;
  }

  return { erori, date };
}

export function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}