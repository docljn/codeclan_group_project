const express = require("express");
const phrasesRouter = express.Router();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

MongoClient.connect(url, function(err, client){
  console.log("error log", err);
  const db = client.db("travel_lingo");

  phrasesRouter.get("/phrases/:languageCode", function(req, res){
    const languageCode = req.params.languageCode;
    const collection = db.collection(languageCode);
    collection.find({}).toArray(function(err, docs){
      res.json(docs);
    })
  })
  // maybe this route should dd 1 phrase at a time
  // to the languageCode collection
  phrasesRouter.post("/phrases/:languageCode", function(req, res){
    console.log("params", req.params.languageCode);
    const languageCode = req.params.languageCode;
    console.log("languageCode", languageCode);
    const collection = db.collection(languageCode);
    console.log("Request body. phrases", req.body.phrases);

    collection.insert({phraseList: req.body.phrases});
    res.status(201);
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
