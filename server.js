const express = require('express');
const app = express();
const translate = require('google-translate-api');
const languageCodes = require('./client/src/resources/language_codes');
const bodyParser = require('body-parser');
const path = require('path');
const phraseList = require('./client/src/models/phrase_list');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let aWord = '';


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// app.get('/translate_api', function(req, res){
//   // proof of concept: we can call the api
//   translate('I love Moscow', {to: languageCodes[0]}).then(translateRes => {
//     console.log(translateRes.text);
//     aWord = translateRes.text;
//     res.json({data: aWord});
//     console.log(res.from.language.iso);
//
//   }).catch(err => {
//     console.error('console error', err);
//   });
//
// });

app.post('/translate_api/', function (req, expressResponse) {

  const languageToTranslateTo = req.body.language;

  const promises = phraseList.map( function (phraseToTranslate) {
    return translate(phraseToTranslate, {to: languageToTranslateTo});
  });

  console.log('promises', promises);

  Promise.all(promises)
    // values is the array which results from the promises being fulfilled
    .then( function (values) {
      // it's fine up to here....
      console.log(values);
      const phrases = values.map( function (value) {
        return value.text;
      });
      const jsonString = JSON.stringify(phrases);
      expressResponse.json({data: phrases});

    })
    .catch(err => {
      console.error('console error', err);
    });




});

// THIS IS WHAT WE USED FOR A SINGLE PHRASE TRANSLATION REQUEST
// app.post('/translate_api/', function (req, expressResponse) {
//   const phraseToTranslate = req.body.phrase;
//   const languageToTranslateTo = req.body.language;
//
//   translate(phraseToTranslate, {to: languageToTranslateTo}).then(translateResponse => {
//     console.log(translateResponse.text);
//     aWord = translateResponse.text;
//     expressResponse.json({data: aWord});
//     console.log(translateResponse.from.language.iso);
//
//   }).catch(err => {
//     console.error('console error', err);
//   });
// });


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
