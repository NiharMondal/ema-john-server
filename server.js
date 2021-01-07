const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const { ResumeToken } = require('mongodb');
require('dotenv').config()

const app = express();

app.use(cors());
app.use(bodyParser.json());
const port = 4000;


const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.kpq4d.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("emaJohnStore").collection("allProducts");
  const orderCollection = client.db("emaJohnStore").collection("orders");
  console.log('database conected')

 

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    console.log(product)
    productCollection.insertOne(product)
      .then(result => {
      res.send(result)
    })
  })

  app.get('/products', (req, res) => {
    productCollection.find({})
      .toArray((err, document) => {
      res.send(document)
    })
  })

  app.get('/product/:key', (req, res) => {
    productCollection.find({key: req.params.key})
      .toArray((err, document) => {
        res.send(document[0])
      })
  })
  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productCollection.find({ key: { $in: productKeys } })
      .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order)
      .then(result => {
        res.send(result)
      })
  })

  app.get('/', (req, res) => {
    res.send('hello word')
  })

});


app.listen(process.env.PORT || port)