const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 8080;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u2izr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


//Root url
app.get("/", (req, res) => {
    res.send("Welcome to Simple Vocabulary Web App Server");
})


//Mongodb connect
client.connect(err => {
    const wordsCollection = client.db(`${process.env.DB_NAME}`).collection("vocabularyWords");

    //Get all words
    app.get("/allWords", (req, res) => {

        wordsCollection.find({})
        .toArray((error, documents) => {
            
            res.send(documents)
        }) 
    })


    //Add new word
    app.post("/addNewWord", (req, res) => {

        const data = req.body;
        wordsCollection.insertOne(data)
        .then(result => {
            
            res.send(result.insertedCount > 0)
        })
        
    })

    //find single word by id
    app.get("/wordById/:id", (req, res) => {

        const id = req.params.id;
        wordsCollection.find({_id: ObjectId(id)})
        .toArray((error, documents) => {
            
            res.send(documents[0]);
        })
    })


    //Route not found
    app.get("*", (req, res) => {
        res.send("Route not found")
    })
    console.log("Database is connected");
});



//port listening
app.listen(process.env.PORT || port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
  