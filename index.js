const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const uri = "mongodb+srv://Kawsar:123456ka@cluster0.u2izr.mongodb.net/vocabularyWebApp?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//Root url
app.get("/", (req, res) => {
    res.send("Welcome to Simple Vocabulary Web App Server");
})



client.connect(err => {
    const wordsCollection = client.db("vocabularyWebApp").collection("vocabularyWords");

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


    //Route not found
    app.get("*", (req, res) => {
        res.send("Route not found")
    })
    console.log("Database is connected");
});



//port listening
app.listen(8080, () => {
    console.log("8080 is port listening the server");
})