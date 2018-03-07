const CountriesSelectView = require("./views/countries_select_view");
const CountryList = require("./models/country_list");
const phraseList = require("./models/phrase_list");


const app = function(){
// om start

// if ( 'speechSynthesis' in window ) {
//   const phrase1 = new SpeechSynthesisUtterance('Hola');
//   const phrase2 = new SpeechSynthesisUtterance('Bonjour');
//   phrase1.lang = ('es-ES');
//   window.speechSynthesis.speak(phrase1);
//   phrase2.lang = ('fr-FR');
//   window.speechSynthesis.speak(phrase2);
// }

  const input_text = "Hello";
  const pitchValue = 1
  const rateValue = 1
  let voices = []
  // ** problem with getVoices **
  voices = window.speechSynthesis.getVoices();
  console.log(typeof speechSynthesis);

  // console.log("voices", voices);
  const utterThis = new SpeechSynthesisUtterance(input_text);
  utterThis.voice = voices[10];


  const countriesSelectView = new CountriesSelectView(document.querySelector("#countries"));
  const world = new CountryList("https://restcountries.eu/rest/v2/all?fields=name;languages;flag;alpha2Code");
// om end
  world.onUpdate = function(countries) {
    countriesSelectView.render(countries);
  };
  world.populate();

  countriesSelectView.onChange = function(country){
    const languageToTranslateTo = country.languages[0].iso639_1;
    const flag_src = country.flag;
    // om start
    const country_alpha2Code = country.alpha2Code;
    // om end
    const request = new XMLHttpRequest();
    request.open("POST", "/translate_api/");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onload = requestComplete;
    const requestBody = {language: languageToTranslateTo};
    console.log("request body", requestBody);
    request.send(JSON.stringify(requestBody));
    createFlag(flag_src);
  };
};

const requestComplete = function(){
  if(this.status !== 200) return;
  const jsonString = this.responseText;
  const translatedPhraseArray = JSON.parse(jsonString);
  console.log("output of requestComplete", translatedPhraseArray);
  populateBody(translatedPhraseArray);
};

const populateBody = function(translatedPhraseArray){
  const div = document.getElementById("phrases");
  div.innerText = "";
  for (let i=0; i < translatedPhraseArray.data.length; i++){
    const pOrig = document.createElement("p");
    pOrig.innerText = phraseList[i];
    const pTrans = document.createElement("p");
    pTrans.innerText = translatedPhraseArray.data[i];
    div.appendChild(pOrig);
    div.appendChild(pTrans);
  }
};

const createFlag = function(flagImage){
  const div = document.getElementById("flag_id");
  div.innerHTML = "";
  const img = document.createElement("img");
  console.log(flagImage);
  img.src = flagImage;
  img.width = 90;
  div.appendChild(img);
}

document.addEventListener("DOMContentLoaded", app);
