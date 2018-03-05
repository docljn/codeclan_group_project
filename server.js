const express = require('express');
const app = express();
const translate = require('google-translate-api');
// const phrase_list = require('./phrase_list');

let aWord = "";
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.get('/translate_api', function(req, res){
  // const translatePhrase = function(phraseToTranslate, language){
  //
  // console.log(phraseToTranslate, language);
  //
  // translate (phraseToTranslate, {to: language}).then(res =>{
  //   console.log(res.text);
  // })
  // }



  const languageCodes = [ 'af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'co', 'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'iw', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no', 'ny', 'ps', 'fa', 'pl', 'pt', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn','sd','si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tl', 'tg', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu']

  // languageCodes.forEach(function(code){
  translate('I love Moscow', {to: 'ta'}).then(translateRes => {
    console.log(translateRes.text);
    aWord = translateRes.text;
    // return;

    // app.get('/', function(req, res){
    res.json({data: aWord});
    // })
    //=> I speak English
    console.log(res.from.language.iso);
    //=> nl
  }).catch(err => {
    console.error("console error", err);
  });

})
//
// })

app.use(express.static('client/build'));
// app.use(require(__dirname + '/controllers/countries_controller'))


const server = app.listen(3000, function () {
  console.log('TravelApp listening at ' + this.address().port);
});
