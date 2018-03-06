const express = require("express");
const phrasesRouter = express.Router();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

MongoClient.connect(url, function(err, client){
  console.log("error log", err);
  const db = client.db("travel_lingo");

  phrasesRouter.get("/phrase/:languageCode", function(req, res){
    const languageCode = req.params.languageCode;
    const collection = db.collection(languageCode);
    collection.find({}).toArray(function(err, docs){
      res.json(docs);
    })
  })

  phrasesRouter.post("/phrase/:languageCode", function(req, res){

    const languageCode = req.params.languageCode;
    const collection = db.collection(languageCode);
    collection.insert({phrase: req.body.phrase});
    res.status(201);
    res.send();
  })

  // Delete All route - Deletes all phrases in a language collection

  phrasesRouter.delete("/phrase/:languageCode", function(req, res){
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
