const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://admin:admin@favretdb.c347z.mongodb.net/?appName=FavretDB";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connessione a MongoDB riuscita!');
    return client.db('songs');
  } catch (err) {
    console.error('Errore di connessione a MongoDB:', err);
    throw err;
  }
}

async function run() {
  const db = await connectToDatabase();
  let collection = db.collection("songs");

  // Lettura di tutti gli elementi
  app.get('/songs', async (req, res) => {
    try {
      let results = await collection.find({})
          .toArray();
      res.send(results).status(200);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // Lettura di un elemento specifico
  app.get('/songs/:id', async (req, res) => {
    try {
      let query = {_id: new ObjectId(req.params.id)};
      let result = await collection.findOne(query);
      if (!result) res.send("Not found").status(404);
      else res.send(result).status(200);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // Aggiunta di un nuovo elemento
  app.post('/songs', async (req, res) => {
    try {
      let newDocument = req.body;
      newDocument.date = new Date();
      let result = await collection.insertOne(newDocument);
      res.send(result).status(204);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // Modifica di un elemento esistente
  app.put('/songs/:id', async (req, res) => {
      try {
        delete req.body._id;
        const result = await collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
        if (result.matchedCount > 0) {
          const updatedItem = await collection.findOne({ _id: new ObjectId(req.params.id) });
          res.json(updatedItem);
        } else {
          res.status(404).json({ message: 'Elemento non trovato' });
        }
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
  });

  // Eliminazione di un elemento
  app.delete('/songs/:id', async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      let result = await collection.deleteOne(query);
      res.send(result).status(200);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  app.listen(port, () => {
      console.log(`Server in ascolto sulla porta ${port}`);
  });
}
run().catch(console.dir);