import express from 'express';
import path from 'path';
import fs from 'fs';


const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
const dbPath = path.join(__dirname, 'db.json');

const readDb = () => {
    const data = fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
}



app.get('/info', (req,res) => {
    const db = readDb();
    res.json(db.info);
});

app.post('/login', (req,res) => {
    const { email, password } = req.body;
    const db = readDb();

    const user = db.users.find(user => user.email === email && user.password === password);
    if (user) {
        res.json({success: true, date: {token: user.token}});
    } else {
        res.status(401).json({success: false, error: "Invalid"})
    }
});

app.get('/profile', (req,res) => {
    const {token} = req.body;
    const db = readDb();

    const user = db.users.find(user => user.token === token);

    if (user) {
        res.json({success: true, data: {fullName: user.fullName, email: user.email}})
    } else {
        res.status(401).json({success: false, error: "Invalid"})
    }
})
