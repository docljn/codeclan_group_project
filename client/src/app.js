const CountriesSelectView = require("./views/countries_select_view");
const CountryList = require("./models/country_list");
const phraseList = require("./models/phrase_list");
const Request = require("./services/request");


const app = function(){

  const getCustomPhraseButton = document.querySelector("#submit_phrase");
  getCustomPhraseButton.addEventListener('click', getCustomPhraseButtonClicked);

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
    // console.log("request body", requestBody);
    request.send(JSON.stringify(requestBody));
    createFlag(flag_src);
  };
};

const requestComplete = function(){
  if(this.status !== 200) return;
  const jsonString = this.responseText;
  const translatedPhraseArray = JSON.parse(jsonString);
  // console.log("output of requestComplete", translatedPhraseArray);
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
  // console.log(flagImage);
  img.src = flagImage;
  img.width = 90;
  div.appendChild(img);
}

const getCustomPhraseButtonClicked = function(){
  // console.log("Home text buttonclicked");
  const phraseInput = document.getElementById("phrase_input");
  const phraseToTranslate = phraseInput.value;
  const languageCode = localStorage.getItem("targetLanguage");
  const requestPhrase = new XMLHttpRequest();
  requestPhrase.open("POST", "/translate_api/single_phrase/");
  requestPhrase.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  requestPhrase.onload = requestCompleteSinglePhrase;
  const requestBody = {language: languageCode, phrase: phraseToTranslate};
  // console.log("request body", requestBody);
  requestPhrase.send(JSON.stringify(requestBody));
}

const requestCompleteSinglePhrase = function(){
  if(this.status !== 200) return;
  const jsonString = this.responseText;
  const translatedPhrase = JSON.parse(jsonString);
  // console.log("output of requestComplete", translatedPhrase);
  appendNewTranslation(translatedPhrase);
};

const appendNewTranslation = function(translatedPhrase){
  const div = document.getElementById("phrases");
  const pOrig = document.createElement("p");
  const phraseToTranslate = document.getElementById("phrase_input");
  pOrig.innerText = phraseToTranslate.value;
  // console.log(phraseToTranslate);
  const pTrans = document.createElement("p");
  // console.log(translatedPhrase);
  pTrans.innerText = translatedPhrase.data;
  div.appendChild(pOrig);
  div.appendChild(pTrans);

  const languageCode = localStorage.getItem("targetLanguage");
  const requestURL = "http://localhost:3000/phrases/" + languageCode ;
  // console.log("RequestURL", requestURL);
  const mongoRequest = new Request(requestURL);
  const bodyToSend = {originalPhrase: phraseToTranslate.value, translatedPhrase: translatedPhrase.data };
  // console.log("Body to send", bodyToSend);
  mongoRequest.post(mongoRequestComplete, bodyToSend);

}

const mongoRequestComplete = function(){
  console.log("mongo post complete");
}

document.addEventListener("DOMContentLoaded", app);
