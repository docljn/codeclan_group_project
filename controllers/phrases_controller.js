const express = require("express");
const phrasesRouter = express.Router();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

MongoClient.connect(url, function(err, client){
  // console.log("error log", err);
  const db = client.db("travel_lingo");

  // Gets all phrases for the language code
  phrasesRouter.get("/phrases/:languageCode", function(req, res){
    const languageCode = req.params.languageCode;
    const collection = db.collection(languageCode);
    collection.find({}).toArray(function(err, docs){
      res.json(docs);
    })
  })

  // Create one phrase for language code
  phrasesRouter.post("/phrases/:languageCode", function(req, res){
    // console.log("req lang code in post", req.params.languageCode);
    // console.log("req body translated phrase", req.body.translatedPhrase);
    // console.log("req body original phrase", req.body.originalPhrase);
    const languageCode = req.params.languageCode;
    const collection = db.collection(languageCode);
    collection.insert({originalPhrase: req.body.originalPhrase, translatedPhrase: req.body.translatedPhrase});
    res.status(201);
    res.send();
  })

  // Delete All route - Deletes all phrases in a language collection

  phrasesRouter.delete("/phrases/:languageCode", function(req, res){
    const languageCode = req.params.languageCode;
    const collection = db.collection(languageCode);
    collection.remove();
    res.status(204);
    res.send();

  })

})

module.exports = phrasesRouter;



//
// const express = require('express');
// const countriesRouter = express.Router();
// const MongoClient = require('mongodb').MongoClient;
// const url = 'mongodb://localhost:27017';
//
// MongoClient.connect(url, function(err, client){
//   const db = client.db('bucket_list_app');
//
//   countriesRouter.get('/bucketList', function(req, res) {
//     const collection = db.collection('bucket_countries');
//     collection.find({}).toArray(function(err, docs) {
//       res.json(docs);
//     })
//   })
//
//   countriesRouter.post('/bucketList', function(req, res) {
//     const collection = db.collection('bucket_countries');
//     collection.insert(req.body.country);
//     res.status(200);
//     res.send();
//   })
//
// })
//
//
// module.exports = countriesRouter;
