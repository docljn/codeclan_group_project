const CountriesSelectView = require("./views/countries_select_view");
const CountryList = require("./models/country_list");
const phraseList = require("./models/phrase_list");
const Request = require("./services/request");
const InputPhrase = require("./models/input_phrase");


const app = function(){

  // let voices = [];
  populateVoiceList();
  if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }
  const getCustomPhraseButton = document.querySelector("#submit_phrase");
  getCustomPhraseButton.addEventListener("click", getCustomPhraseButtonClicked);

  const countriesSelectView = new CountriesSelectView(document.querySelector("#countries"));


  const world = new CountryList("https://restcountries.eu/rest/v2/all?fields=name;languages;flag;capital;latlng");

  const inputPhrase = new InputPhrase();

  world.onUpdate = function(countries) {
    countriesSelectView.render(countries);
  };
  world.populate();

  countriesSelectView.onChange = function(country){
    const languageToTranslateTo = country.languages[0].iso639_1;
    localStorage.setItem("targetLanguage", languageToTranslateTo);
    const flag_src = country.flag;
    const countryCapital = country.capital;
    console.log(countryCapital);
    // const countryLatLng = country.latlng; // needed for local weather alternate api
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
    createWeatherDisplay(countryCapital);
    // createWeatherDisplay(countryLatLng); // for weather
    // ** hardcoded phrase at the moment to prove text to speech works **
    speakPhrase("bonjour", speechLanguage);
    // inputPhrase.create();
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
    pOrig.id = "original";
    const pTrans = document.createElement("p");
    pTrans.innerText = translatedPhraseArray.data[i];
    pTrans.id = "translation";
    div.appendChild(pOrig);
    div.appendChild(pTrans);
    // div.appendChild(audio);
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
  img.src = flagImage;
  img.id = "flag_image";
  div.appendChild(img);
};

const createWeatherDisplay = function (city) {

  // const createWeatherDisplay = function (latlng) {
  // api.openweathermap.org/data/2.5/weather?q=London,uk
  // api.openweathermap.org/data/2.5/weather?lat=35&lon=139
  // http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID={APIKEY}
  const openWeatherAPI = {
    url: "http://api.openweathermap.org/data/2.5/weather?",
    key: "62b03d8973a50751df56ad8de8a4cc3c"
  };
  // let completeURL = openWeatherAPI.url + "lat=" + latlng[0] + "&lon=" + latlng[1] + "&APPID=" + openWeatherAPI.key;
  let completeURL = openWeatherAPI.url + "q=" + city + "&APPID=" + openWeatherAPI.key;

  makeWeatherRequest(completeURL, sendAPIRequest);
};

const makeWeatherRequest = function (url, callback) {
  const request = new XMLHttpRequest();
  request.open("GET", url);
  request.addEventListener("load", callback);
  request.send();
};

const sendAPIRequest = function () {
  if(this.status !== 200) {
    clearWeatherHtml();
    return;
  }
  const jsonString = this.responseText;
  const weatherObject = JSON.parse(jsonString);
  buildWeatherHtml(weatherObject);
};

const clearWeatherHtml = function () {
  const weatherDiv = document.getElementById("weather");
  weatherDiv.innerHTML = "";
};

const buildWeatherHtml = function (weatherObject) {
  console.log(weatherObject);
  const weatherDiv = document.getElementById("weather");
  weatherDiv.innerHTML = "";

  const nearestWeatherStation = weatherObject.name;

  const weatherDescription =  weatherObject.weather[0].description;

  const weatherIconSource = "http://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/" + weatherObject.weather[0].icon + ".png";

  const currentTemperature = Math.round(weatherObject.main.temp-273);
  const htmlDegrees = "℃";

  // make html elements needed
  const stationHeading = document.createElement("h3");
  stationHeading.innerText = "Weather in " + nearestWeatherStation;

  const weatherUL = document.createElement("ul");

  const icon = document.createElement("img");
  icon.src = weatherIconSource;
  icon.id = "weather_icon";

  const liTemp = document.createElement("li");
  liTemp.innerText = currentTemperature + htmlDegrees + ": " + weatherDescription;

  weatherUL.appendChild(icon);
  weatherUL.appendChild(liTemp);

  weatherDiv.appendChild(stationHeading);
  weatherDiv.appendChild(weatherUL);

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
  let voices = speechSynthesis.getVoices();
  console.log("voices", voices);
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
  console.log("request body", requestBody);
  requestPhrase.send(JSON.stringify(requestBody));
};

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
  pOrig.id = "original";
  pTrans.innerText = translatedPhrase;
  pTrans.id = "translation";
  div.prepend(pTrans);
  div.prepend(pOrig);

};

const mongoRequestComplete = function(){
  console.log("mongo post complete");
};

const getPhraseRequestComplete = function(allPhrases){
  console.log(allPhrases);
  allPhrases.forEach(function(phrasePair){
    console.log("phrasePair", phrasePair);
    const originalPhrase = phrasePair.originalPhrase;
    const translatedPhrase = phrasePair.translatedPhrase;
    console.log("translatedPhrase", translatedPhrase);
    appendTranslationPair(originalPhrase, translatedPhrase);
  });
};

document.addEventListener("DOMContentLoaded", app);
