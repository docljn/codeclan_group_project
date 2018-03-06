const translate = require('google-translate-api');
const phrase_list = require('./phrase_list');

const translatePhrase = function(phraseToTranslate, language){
console.log(phraseToTranslate, language);

translate (phraseToTranslate, {to: language}).then(res =>{
  console.log(res.text);
})
}



// const translate = require('google-translate-api');
//
// translate('Ik spreek Engels', {to: 'en'}).then(res => {
//     console.log(res.text);
//     //=> I speak English
//     console.log(res.from.language.iso);
//     //=> nl
// }).catch(err => {
//     console.error(err);
// });
