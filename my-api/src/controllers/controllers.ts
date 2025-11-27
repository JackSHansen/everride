import { Request, Response } from 'express';
import { prisma } from '../prisma.js';

// Dummy mode toggle
const USE_DUMMY = process.env.USE_DUMMY_DATA === 'true';

// Dummy users (bruges kun i dummy mode)
const D_USERS = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob',   email: 'bob@example.com'   },
  { id: 3, name: 'Carol', email: 'carol@example.com' },
];

export const getRecords = async (req: Request, res: Response) => {
  if (USE_DUMMY) {
    return res.json(D_USERS);
  }
  try {
    const data = await prisma.user.findMany();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Tilføjet: hent enkelt bruger efter id
export const getRecordById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  if (USE_DUMMY) {
    const user = D_USERS.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Tilføjet: sider (grundlæggende HTML svar)
export const homePage = (req: Request, res: Response) => {
  res.send(`
    <h1>Velkommen til Everride</h1>
    <p>Forside - enkel demo side</p>
    <nav>
      <a href="/cars">Biler til salg</a> |
      <a href="/branches">Afdelinger</a> |
      <a href="/about">Om os</a> |
      <a href="/contact">Kontakt</a>
    </nav>
  `);
};

export const carsPage = (req: Request, res: Response) => {
  // Eksempelindhold — udskift med DB-data efter behov
  res.send(`
    <h1>Biler til salg</h1>
    <ul>
      <li><a href="/cars/1">Tesla Model 3 (detaljer)</a></li>
      <li><a href="/cars/2">VW Golf (detaljer)</a></li>
      <li><a href="/cars/3">Ford Focus (detaljer)</a></li>
    </ul>
    <a href="/cars/list">Se alle som liste</a><br/>
    <a href="/">Tilbage til forsiden</a>
  `);
};

// Tilføjet: liste-visning for biler
export const carsListPage = (req: Request, res: Response) => {
  // Simpel liste; kan senere hente fra DB
  res.send(`
    <h1>Liste over biler</h1>
    <ol>
      <li>Tesla Model 3</li>
      <li>VW Golf</li>
      <li>Ford Focus</li>
    </ol>
    <a href="/cars">Tilbage til biler</a>
  `);
};

// Tilføjet: detaljer-visning (eksempel)
export const carDetailPage = (req: Request, res: Response) => {
  const id = req.params.id;
  // Her kan du hente data fra DB baseret på id
  res.send(`
    <h1>Detaljer for bil #${id}</h1>
    <p>Dette er en simpel demo-side for bil med id ${id}.</p>
    <a href="/cars">Tilbage til biler</a>
  `);
};

// Opdateret: branchesPage med links til regioner
export const branchesPage = (req: Request, res: Response) => {
  res.send(`
    <h1>Afdelinger</h1>
    <ul>
      <li><a href="/branches/jylland">Jylland</a></li>
      <li><a href="/branches/fyn">Fyn</a></li>
      <li><a href="/branches/sjaelland">Sjælland</a></li>
    </ul>
    <a href="/">Tilbage til forsiden</a>
  `);
};

// Tilføjet: region-sider
export const jyllandPage = (req: Request, res: Response) => {
  res.send(`
    <h1>Afdelinger - Jylland</h1>
    <ul><li>Aarhus</li><li>Aalborg</li></ul>
    <a href="/branches">Tilbage til afdelinger</a>
  `);
};

export const fynPage = (req: Request, res: Response) => {
  res.send(`
    <h1>Afdelinger - Fyn</h1>
    <ul><li>Odense</li></ul>
    <a href="/branches">Tilbage til afdelinger</a>
  `);
};

export const sjaellandPage = (req: Request, res: Response) => {
  res.send(`
    <h1>Afdelinger - Sjælland</h1>
    <ul><li>København</li></ul>
    <a href="/branches">Tilbage til afdelinger</a>
  `);
};

// Tilføjet: håndter POST fra kontaktformular
export const contactSubmit = (req: Request, res: Response) => {
  const { name, message } = req.body;
  // I produktion: valider/lagre besked i DB eller send mail
  res.send(`
    <h1>Tak, ${name || 'gæst'}</h1>
    <p>Vi har modtaget din besked:</p>
    <pre>${message || '(ingen besked)'}</pre>
    <a href="/">Tilbage til forsiden</a>
  `);
};

export const aboutPage = (req: Request, res: Response) => {
  res.send(`
    <h1>Om os</h1>
    <p>Information om virksomheden...</p>
    <a href="/">Tilbage til forsiden</a>
  `);
};

export const contactPage = (req: Request, res: Response) => {
  res.send(`
    <h1>Kontakt os</h1>
    <form action="/contact" method="POST">
      <label for="name">Navn:</label>
      <input type="text" id="name" name="name" required>
      <label for="message">Besked:</label>
      <textarea id="message" name="message" required></textarea>
      <button type="submit">Send besked</button>
    </form>
    <a href="/">Tilbage til forsiden</a>
  `);
};