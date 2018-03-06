const CountriesSelectView = require("./views/countries_select_view");
const CountryList = require("./models/country_list");
const phraseList = require("./models/phrase_list");


const app = function(){
  const countriesSelectView = new CountriesSelectView(document.querySelector("#countries"));
  const world = new CountryList("https://restcountries.eu/rest/v2/all?fields=name;languages");

  world.onUpdate = function(countries) {
    countriesSelectView.render(countries);
  };

  world.populate();

  countriesSelectView.onChange = function(country){

    // const phraseToTranslate = phraseList[0];
    const languageToTranslateTo = country.languages[0].iso639_1;

    const request = new XMLHttpRequest();

    request.open("POST", "/translate_api/");

    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    request.onload = requestComplete;

    // const requestBody = {phrase: phraseToTranslate, language: languageToTranslateTo}
    const requestBody = {language: languageToTranslateTo};
    console.log("request body", requestBody);
    request.send(JSON.stringify(requestBody));

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
  console.log("transl phr", translatedPhraseArray);
  const div = document.getElementById("phrases");
  div.innerText = "";
  console.log(translatedPhraseArray.data);
  for (let i=0; i < translatedPhraseArray.data.length; i++){
    const pOrig = document.createElement("p");
    pOrig.innerText = phraseList[i];

    const pTrans = document.createElement("p");
    pTrans.innerText = translatedPhraseArray.data[i];

    div.appendChild(pOrig);
    div.appendChild(pTrans);
    console.log(div);

  }
};

document.addEventListener("DOMContentLoaded", app);
