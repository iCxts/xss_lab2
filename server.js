const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;
const note = [];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function sanitizeInput(input) {
  let sanitized = input;

  sanitized = sanitized.replace(/<script>/gi, '');
  sanitized = sanitized.replace(/<\/script>/gi, '');

  sanitized = sanitized.replace(/onclick/g, '');
  sanitized = sanitized.replace(/onerror/g, '');
  sanitized = sanitized.replace(/onload/g, '');
  sanitized = sanitized.replace(/onmouseover/g, '');

  return sanitized;
}

app.get('/', (req, res) => {
  res.render('index', { note });
});

app.get('/notes', (req, res) => {
  res.render('notes', { note });
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/notes/create', (req, res) => {
  const { title, content } = req.body;

  const sanitizedTitle = sanitizeInput(title || '');
  const sanitizedContent = sanitizeInput(content || '');

  const newNote = {
    id: note.length + 1,
    title: sanitizedTitle,
    content: sanitizedContent,
    createdAt: new Date().toISOString()
  };

  note.push(newNote);
  res.redirect('/notes');
});

app.get('/notes/:id', (req, res) => {
  const foundNote = note.find(n => n.id === parseInt(req.params.id));
  if (!foundNote) {
    return res.status(404).send('Note not found');
  }

  res.render('note', { note: foundNote });
});

app.get('/report/:id', async (req, res) => {
  const noteId = parseInt(req.params.id);
  const foundNote = note.find(n => n.id === noteId);

  if (!foundNote) {
    return res.status(404).send('Note not found');
  }

  res.send('Generating report...');
  viewAsAdmin(noteId);
});

app.get('/log', (req, res) => {
  console.log('=== CAPTURED DATA ===');
  console.log('Query:', req.query);
  console.log('=== END OF DATA ===');
  res.send('Logged');
});

async function viewAsAdmin(noteId) {
  let browser;
  try {
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setCookie({
      name: 'flag',
      value: 'FLAG{meowmeowcat92}',
      domain: 'localhost',
      path: '/'
    })

    const url = `http://localhost:${PORT}/notes/${noteId}`;
    console.log('Visiting as admin:', url);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('Page visited successfully');
  } catch (error) {
    console.error('Error view as admin:', error);
  } finally {
    if (browser) await browser.close();
  }
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


