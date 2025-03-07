const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

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
app.get('/items', (req, res) => {
    const data = readData();
    res.json(data);
});

// Lettura di un elemento specifico
app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = readData();
    const item = data.find(item => item.id === id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).send('Elemento non trovato');
    }
});

// Aggiunta di un nuovo elemento
app.post('/items', (req, res) => {
    const newItem = req.body;
    const data = readData();
    newItem.id = data.length > 0 ? data[data.length - 1].id + 1 : 1;
    data.push(newItem);
    writeData(data);
    res.json(newItem);
});

// Modifica di un elemento esistente
app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedItem = req.body;
    const data = readData();
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
        updatedItem.id = id;
        data[index] = updatedItem;
        writeData(data);
        res.json(updatedItem);
    } else {
        res.status(404).send('Elemento non trovato');
    }
});

// Eliminazione di un elemento
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = readData();
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
        data.splice(index, 1);
        writeData(data);
        res.status(204).send();
    } else {
        res.status(404).send('Elemento non trovato');
    }
});

app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});