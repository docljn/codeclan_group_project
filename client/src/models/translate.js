// WE AREN'T USING ANYTHING IN THIS FILE AT THE MOMENT
const translate = require("google-translate-api");
const phrase_list = require("./phrase_list");

const translatePhrase = function(phraseToTranslate, language){
  console.log(phraseToTranslate, language);

  translate (phraseToTranslate, {to: language}).then(res =>{
    console.log(res.text);
  });
};


// THIS IS THE EXAMPLE FROM THE API DOCS
// const translate = require("google-translate-api");
//
// translate("Ik spreek Engels", {to: "en"}).then(res => {
//     console.log(res.text);
//     //=> I speak English
//     console.log(res.from.language.iso);
//     //=> nl
// }).catch(err => {
//     console.error(err);
// });
