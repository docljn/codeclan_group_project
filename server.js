const express = require('express');
const app = express();
const translate = require('google-translate-api');
const languageCodes = require('./client/src/resources/language_codes');
// const phrase_list = require('./phrase_list');

let aWord = '';
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.get('/translate_api', function(req, res){
  // proof of concept: we can call the api
  translate('I love Moscow', {to: languageCodes[0]}).then(translateRes => {
    console.log(translateRes.text);
    aWord = translateRes.text;
    res.json({data: aWord});
    console.log(res.from.language.iso);

  }).catch(err => {
    console.error('console error', err);
  });

});



/*
const translatePhrase = function(phraseToTranslate, language){

console.log(phraseToTranslate, language);

translate (phraseToTranslate, {to: language}).then(res =>{
  console.log(res.text);
})
// }*/


app.use(express.static('client/build'));
// app.use(require(__dirname + '/controllers/countries_controller'))


const server = app.listen(3000, function () {
  console.log('TravelApp listening at ' + this.address().port);
});
