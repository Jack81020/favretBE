const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

const filePath = 'data.json';

// Funzione per leggere i dati dal file JSON
function readData() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Funzione per scrivere i dati nel file JSON
function writeData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// API REST

// Lettura di tutti gli elementi
app.get('/songs', (req, res) => {
    const data = readData();
    res.json(data.songs);
});

// Lettura di un elemento specifico
app.get('/songs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = readData();
    const item = data.songs.find(item => item.id === id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).send('Elemento non trovato');
    }
});

// Aggiunta di un nuovo elemento
app.post('/songs', (req, res) => {
    const newItem = req.body;
    const data = readData();
    newItem.id = data.songs.length > 0 ? Math.max(...data.songs.map((currSong) => currSong.id))+1 : 1;    
    data.songs.push(newItem);
    writeData(data);
    res.json(newItem);
});

// Modifica di un elemento esistente
app.put('/songs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedItem = req.body;
    const data = readData();
    const index = data.songs.findIndex(item => item.id === id);
    if (index !== -1) {
        updatedItem.id = id;
        data.songs[index] = updatedItem;
        writeData(data);
        res.json(updatedItem);
    } else {
        res.status(404).send('Elemento non trovato');
    }
});

// Eliminazione di un elemento
app.delete('/songs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = readData();
    const index = data.songs.findIndex(item => item.id === id);
    if (index !== -1) {
        data.songs.splice(index, 1);
        writeData(data);
        res.status(204).send();
    } else {
        res.status(404).send('Elemento non trovato');
    }
});

app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});