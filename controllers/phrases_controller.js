const express = require("express");
const phrasesRouter = express.Router();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

MongoClient.connect(url, function(err, client){
  const db = client.db("traveLingo");

  phrasesRouter.get("/phrases/:languageCode", function(req, res){
    const collection = db.collection(languageCode);
    collection.find({}).toArray(function(err, docs){
      res.json(docs);
    })
  })

  phrasesRouter.post("/phrases/:languageCode", function(req, res){
    const collection = db.collection(languageCode);
    collection.insert(req.body.phrases);
    res.status(200);
    res.send();
  })
})



module.exports = phrasesRouter;
