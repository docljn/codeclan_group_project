const CountriesSelectView = require("./views/countries_select_view");
const CountryList = require("./models/country_list");
const phraseList = require("./models/phrase_list");
const Request = require("./services/request");


const app = function(){

  let voices = [];
  populateVoiceList();
  if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }
  const getCustomPhraseButton = document.querySelector("#submit_phrase");
  getCustomPhraseButton.addEventListener('click', getCustomPhraseButtonClicked);

  const countriesSelectView = new CountriesSelectView(document.querySelector("#countries"));
  const world = new CountryList("https://restcountries.eu/rest/v2/all?fields=name;languages;flag;alpha2Code");

  world.onUpdate = function(countries) {
    countriesSelectView.render(countries);
  };
  world.populate();

  countriesSelectView.onChange = function(country){
    const languageToTranslateTo = country.languages[0].iso639_1;
    localStorage.setItem("targetLanguage", languageToTranslateTo);
    const flag_src = country.flag;
    const country_alpha2Code = country.alpha2Code;
    const speechLanguage =  languageToTranslateTo + "-" + country_alpha2Code;
    console.log("speechLanguage", speechLanguage);
    const request = new XMLHttpRequest();
    request.open("POST", "/translate_api/");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onload = requestComplete;
    const requestBody = {language: languageToTranslateTo, phrase: "n/a" };
    // console.log("request body", requestBody);
    request.send(JSON.stringify(requestBody));
    createFlag(flag_src);
    // ** hardcoded phrase at the moment to prove text to speech works **
    speakPhrase("bonjour", speechLanguage);
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

  const languageCode = localStorage.getItem("targetLanguage");
  const requestURL = "http://localhost:3000/phrases/" + languageCode ;
  const mongoRequest = new Request(requestURL);
  mongoRequest.get(getPhraseRequestComplete);
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

function speakPhrase(phrase, speechLanguage) {
  let msg = new SpeechSynthesisUtterance();
  msg.text = phrase;
  msg.lang = speechLanguage;

  for(let i=0;i<voices.length;i++){
    if(voices[i].lang==speechLanguage) {
      msg.voice = voices[i];
    }
  };
  speechSynthesis.speak(msg);
}

function populateVoiceList() {
  if(typeof speechSynthesis === 'undefined') {
    return;
  }
  voices = speechSynthesis.getVoices();
  console.log("voices", voices);

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
  const translatedPhrase = JSON.parse(jsonString).data;
  console.log("translated phrase", translatedPhrase);
  const originalPhrase = document.getElementById("phrase_input").value;
  // console.log("output of requestComplete", translatedPhrase);
  const languageCode = localStorage.getItem("targetLanguage");
  const requestURL = "http://localhost:3000/phrases/" + languageCode ;
  console.log("RequestURL", requestURL);
  const mongoRequest = new Request(requestURL);
  const bodyToSend = {originalPhrase: originalPhrase, translatedPhrase: translatedPhrase };
  // const bodyToSend = {originalPhrase: phraseToTranslate.value, translatedPhrase: translatedPhrase.data };
  console.log("Body to send", bodyToSend);
  mongoRequest.post(mongoRequestComplete, bodyToSend);

  appendTranslationPair(originalPhrase, translatedPhrase);
};

const appendTranslationPair = function(originalPhrase, translatedPhrase){
  const div = document.getElementById("phrases");
  const pOrig = document.createElement("p");
  // console.log(phraseToTranslate);
  const pTrans = document.createElement("p");

  // console.log(translatedPhrase);
  pOrig.innerText = originalPhrase;
  pTrans.innerText = translatedPhrase;
  div.prepend(pTrans);
  div.prepend(pOrig);
  // div.appendChild(pOrig);
  // div.appendChild(pTrans);
  // console.log(translatedPhrase);
  // pTrans.innerText = translatedPhrase.data;
  // div.prepend(pTrans);
  // div.prepend(pOrig);
}

const mongoRequestComplete = function(){
  console.log("mongo post complete");
}

const getPhraseRequestComplete = function(allPhrases){
  console.log(allPhrases);
  allPhrases.forEach(function(phrasePair){
    console.log("phrasePair", phrasePair);
    const originalPhrase = phrasePair.originalPhrase;
    const translatedPhrase = phrasePair.translatedPhrase;
    console.log("translatedPhrase", translatedPhrase);
    appendTranslationPair(originalPhrase, translatedPhrase);
  })
}

document.addEventListener("DOMContentLoaded", app);
