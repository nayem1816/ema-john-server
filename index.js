const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cfpno.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  app.post("/addProduct", (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });

  app.get("/products", (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/product/:key", (req, res) => {
    productsCollection.find(req.params.key).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  app.post("/productByKey", (req, res) => {
    const productKey = req.body;
    console.log(productKey);
    productsCollection
      .find({ key: { $in: productKey } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post("/addOrder", (req, res) => {
    const orders = req.body;
    ordersCollection.insertOne(orders).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
