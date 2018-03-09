const CountriesSelectView = require("./views/countries_select_view");
const CountryList = require("./models/country_list");
const phraseList = require("./models/phrase_list");
const Request = require("./services/request");
const WeatherDisplay = require("./models/weather_display");

/* start of app code */
const app = function(){
  let voices = [];

  populateVoiceList();
  if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }

  const getCustomPhraseButton = document.querySelector("#submit_phrase");
  getCustomPhraseButton.addEventListener("click", getCustomPhraseButtonClicked);

  const countriesSelectView = new CountriesSelectView(document.querySelector("#countries"));

  const world = new CountryList("https://restcountries.eu/rest/v2/all?fields=name;languages;flag;capital;latlng;alpha2Code");

  world.onUpdate = function(countries) {
    countriesSelectView.render(countries);
  };
  world.populate();

  countriesSelectView.onChange = function(country){
    // console.log(country);
    const targetLanguageCode = country.languages[0].iso639_1;
    localStorage.setItem("targetLanguage", targetLanguageCode);
    const flag_src = country.flag;
    const countryCapital = country.capital;
    // const countryLatLng = country.latlng; // needed for local weather alternate api
    const country_alpha2Code = country.alpha2Code;
    // console.log(country_alpha2Code);
    const speechLanguage =  targetLanguageCode + "-" + country_alpha2Code;
    // console.log("speechLanguage", speechLanguage);
    localStorage.setItem("speechLanguage", speechLanguage);
    const tableBody = document.getElementById("phrase_table_body");
    tableBody.innerText = "";
    if (targetLanguageCode != "en"){
      buildPhraseTable(country);
      // see if there is  db entry for this languageCode
      const requestURL = "http://localhost:3000/phrases/" + targetLanguageCode ;
      const mongoRequest = new Request(requestURL);
      mongoRequest.get(languagePresentRequestComplete);
    } else clearPhraseTable();

    createFlag(flag_src);
    const localWeatherDisplay = new WeatherDisplay();
    localWeatherDisplay.create(countryCapital);
    // createWeatherDisplay(countryLatLng); // for alt weatherAPI
    // ** hardcoded phrase at the moment to prove text to speech works **
    speakPhrase("bonjour", speechLanguage);
  };
};

const languagePresentRequestComplete = function(allPhrases){

  console.log(allPhrases.length);
  if (allPhrases.length === 0){
    const targetLanguageCode = localStorage.getItem("targetLanguage");
    const request = new XMLHttpRequest();
    request.open("POST", "/translate_api/");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onload = translateRequestComplete;
    const requestBody = {language: targetLanguageCode, phrase: "n/a" };
    request.send(JSON.stringify(requestBody));
  } else {
    for (let i=0; i < allPhrases.length; i++){
      const originalPhrase = allPhrases[i].originalPhrase;
      const translatedPhrase = allPhrases[i].translatedPhrase;
      appendTranslationPair (originalPhrase, translatedPhrase);
    }
  }
};

/* End of app code */

const translateRequestComplete = function(){
  if(this.status !== 200) return;
  const jsonString = this.responseText;
  const translatedPhraseArray = JSON.parse(jsonString);

  for (let i=0; i < translatedPhraseArray.data.length; i++){

    const originalPhrase = phraseList[i];
    console.log("originalPhrase", originalPhrase);
    const translatedPhrase = translatedPhraseArray.data[i];
    console.log("translatedPhrase", translatedPhrase);
    savePhrasePair(originalPhrase, translatedPhrase);
  }
};

const buildPhraseTable = function(country){
  const homeLanguage = document.getElementById("home_language");
  homeLanguage.innerText = "English";
  const targetLanguage = document.getElementById("target_language");
  targetLanguage.innerText = country.languages[0].name;
}

const clearPhraseTable = function(){
  const homeLanguage = document.getElementById("home_language");
  homeLanguage.innerText = "";
  const targetLanguage = document.getElementById("target_language");
  targetLanguage.innerText = "";

}

const createFlag = function(flagImage){
  const div = document.getElementById("flag_id");
  div.innerHTML = "";
  const img = document.createElement("img");
  img.src = flagImage;
  img.id = "flag_image";
  div.appendChild(img);
};




function speakPhrase(phrase, speechLanguage) {
  let msg = new SpeechSynthesisUtterance();
  msg.text = phrase;
  msg.lang = speechLanguage;

  for(let i=0;i<voices.length;i++){
    if(voices[i].lang==speechLanguage) {
      msg.voice = voices[i];
    }
  }
  speechSynthesis.speak(msg);
}

function populateVoiceList() {
  if(typeof speechSynthesis === "undefined") {
    return;
  }
  voices = speechSynthesis.getVoices();
  // console.log("voices", voices);
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
};

const requestCompleteSinglePhrase = function(){
  if(this.status !== 200) return;
  const jsonString = this.responseText;
  const translatedPhrase = JSON.parse(jsonString).data;
  // console.log("translated phrase", translatedPhrase);
  const originalPhrase = document.getElementById("phrase_input").value;
  // console.log("output of requestComplete", translatedPhrase);
  const speechLanguage  = localStorage.getItem("speechLanguage");
  speakPhrase(translatedPhrase, speechLanguage)

  savePhrasePair(originalPhrase, translatedPhrase);
};

const savePhrasePair = function(originalPhrase, translatedPhrase){

  const languageCode = localStorage.getItem("targetLanguage");

  const requestURL = "http://localhost:3000/phrases/" + languageCode ;
  // console.log("RequestURL", requestURL);
  const mongoRequest = new Request(requestURL);
  const bodyToSend = {originalPhrase: originalPhrase, translatedPhrase: translatedPhrase };
  // console.log("Body to send", bodyToSend);
  mongoRequest.post(mongoRequestComplete, bodyToSend);
  appendTranslationPair(originalPhrase, translatedPhrase);
};


const appendTranslationPair = function(originalPhrase, translatedPhrase){
  const tableBody = document.getElementById("phrase_table_body");

  const tableRow = document.createElement("tr");
  const originalPhraseTag = document.createElement("th");
  originalPhraseTag.innerText = originalPhrase;
  const translatedPhraseTag = document.createElement("td");
  const languageCode = localStorage.getItem("targetLanguage");
  translatedPhraseTag.setAttribute('lang', languageCode);
  translatedPhraseTag.innerText = translatedPhrase;

  tableRow.appendChild(originalPhraseTag);
  tableRow.appendChild(translatedPhraseTag);
  tableBody.appendChild(tableRow);

};

const mongoRequestComplete = function(){
  console.log("mongo post complete");
};

// I t doesn't look like this is used now.
//  ripe for deletion!
const getPhraseRequestComplete = function(allPhrases){
  console.log(allPhrases);
  allPhrases.forEach(function(phrasePair){
    // console.log("phrasePair", phrasePair);
    const originalPhrase = phrasePair.originalPhrase;
    const translatedPhrase = phrasePair.translatedPhrase;
    // console.log("translatedPhrase", translatedPhrase);
    appendTranslationPair(originalPhrase, translatedPhrase);
  });
};

document.addEventListener("DOMContentLoaded", app);
