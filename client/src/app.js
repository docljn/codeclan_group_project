const CountriesSelectView = require("./views/countries_select_view");
const CountryList = require("./models/country_list");
const phraseList = require("./models/phrase_list");
// const translatePhrase = require("./models/translate");


const app = function(){

  const getHomeTextButton = document.querySelector("#submit_phrase");
  getHomeTextButton.addEventListener('click', getHomeTextButtonClicked);

  const countriesSelectView = new CountriesSelectView(document.querySelector("#countries"));
  const world = new CountryList("https://restcountries.eu/rest/v2/all?fields=name;languages;flag");

  world.onUpdate = function(countries) {
    countriesSelectView.render(countries);
  };
  world.populate();

  countriesSelectView.onChange = function(country){
    const languageToTranslateTo = country.languages[0].iso639_1;
    localStorage.setItem("targetLanguage", languageToTranslateTo);
    const flag_src = country.flag;
    const request = new XMLHttpRequest();
    request.open("POST", "/translate_api/");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onload = requestComplete;
    const requestBody = {language: languageToTranslateTo, phrase: "n/a" };
    console.log("request body", requestBody);
    request.send(JSON.stringify(requestBody));
    createFlag(flag_src);
  };
};

const requestComplete = function(){
  // console.log("request complete target language", languageToTranslateTo);
  if(this.status !== 200) return;
  const jsonString = this.responseText;
  const translatedPhraseArray = JSON.parse(jsonString);
  console.log("output of requestComplete", translatedPhraseArray);
  populateBody(translatedPhraseArray);
};

const populateBody = function(translatedPhraseArray){
  const div = document.getElementById("phrases");
  // console.log(localStorage.getItem("targetLanguage"));
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

const getHomeTextButtonClicked = function(){
  console.log("Home text buttonclicked");
  // const formInput = document.getElementsByClass("form");
  // formInput.setAttribute("action", "/translate_api/"+ )
  const phraseInput = document.getElementById("input-phrase")
  // const phraseToTranslate = [phraseInput.innerText];
  const phraseToTranslate = "Dummy phrase";
  const languageCode = localStorage.getItem("targetLanguage");
  console.log(" language code", languageCode);
  console.log("phraseToTranslate", phraseToTranslate);

  const request = new XMLHttpRequest();
  request.open("POST", "/translate_api/");
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.onload = appendNewTranslation;
  const requestBody = {language: languageCode, phrase: [phraseToTranslate]};
  console.log("request body", requestBody);
  request.send(JSON.stringify(requestBody));

}

const appendNewTranslation = function(){
  if(this.status !== 200) return;
  const jsonString = this.responseText;
  const translatedPhraseArray = JSON.parse(jsonString);
  console.log("output of appendNewTranslatione", translatedPhraseArray);


  const div = document.getElementById("phrases");
  const pOrig = document.createElement("p");
  pOrig.innerText = phraseInput;
  const pTrans = document.createElement("p");
  pTrans.innerText = translation;
  div.appendChild(pOrig);
  div.appendChild(pTrans);
}

document.addEventListener("DOMContentLoaded", app);
