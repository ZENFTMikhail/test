import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'db.json');
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5001;

const readDb = () => {
    const data = fs.readFileSync(dbPath, { encoding: 'utf-8' }); // Исправлено
    return JSON.parse(data);
  };



app.get('/info', (req,res) => {
    const db = readDb();
    res.json(db.info);
});

app.post('/login', (req,res) => {
    const { email, password } = req.body;
    const db = readDb();

    const user = db.users.find(user => user.email === email && user.password === password);
    if (user) {
        res.json({success: true, data: {token: user.token}});
    } else {
        res.status(401).json({success: false, error: "Invalid"})
    }
});

app.get('/profile', (req, res) => {
    const token = req.query.token;

    const db = readDb();
    const user = db.users.find(user => user.token === token);

    if (user) {
        res.json({ success: true, data: { fullname: user.fullname, email: user.email, imgUrl: user.imgUrl } });
    } else {
        res.status(401).json({ success: false, error: "Invalid token" });
    }
});


app.get('/author', (req, res) => {
    setTimeout(() => {
      const db = readDb();
      const author = db.authors[Math.floor(Math.random() * db.authors.length)];
      res.json({ success: true, data: author });
    }, 3500); 
  });
  

  app.get('/quote', (req, res) => {
    setTimeout(() => {
      const { token, authorId } = req.query;
      const db = readDb();
  
      const user = db.users.find(user => user.token === token);
      if (!user) {
        return res.status(401).json({ success: false, error: "Invalid token" });
      }
      const authorIdNum = parseInt(authorId, 10);
      const authorQuotes = db.quotes.filter(q => q.authorId === authorIdNum);

      const randomQuote = authorQuotes[Math.floor(Math.random() * authorQuotes.length)];

      
      if (randomQuote) {
        res.json({ success: true, data: randomQuote });
      } else {
        res.status(404).json({ success: false, error: "Quote not found" });
      }
    }, 5000); 
  });
  
  

app.delete('/logout', (req, res) => {
    const { token } = req.query;
    res.json({ success: true, data: {} });
  });


  app.listen(PORT, () => {
    console.log("Server is running")
  })
