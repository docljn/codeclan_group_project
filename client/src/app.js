const CountriesSelectView = require("./views/countries_select_view");
const CountryList = require("./models/country_list");
const phraseList = require("./models/phrase_list");
const Request = require("./services/request");

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
    buildPhraseTable(country);

    // see if there is  db entry for this languageCode
    const requestURL = "http://localhost:3000/phrases/" + targetLanguageCode ;
    const mongoRequest = new Request(requestURL);
    mongoRequest.get(languagePresentRequestComplete);

    createFlag(flag_src);
    createWeatherDisplay(countryCapital);
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
}

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

const createFlag = function(flagImage){
  const div = document.getElementById("flag_id");
  div.innerHTML = "";
  const img = document.createElement("img");
  img.src = flagImage;
  img.id = "flag_image";
  div.appendChild(img);
};

const createWeatherDisplay = function (city) {
  // THIS IS FOR THE ALTERNATE WEATHER API
  // const createWeatherDisplay = function (latlng) {
  // api.openweathermap.org/data/2.5/weather?q=London,uk
  // api.openweathermap.org/data/2.5/weather?lat=35&lon=139
  // http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID={APIKEY}
  // const openWeatherAPI = {
  //   url: "http://api.openweathermap.org/data/2.5/weather?",
  //   key: "62b03d8973a50751df56ad8de8a4cc3c"
  // };
  // let completeURL = openWeatherAPI.url + "lat=" + latlng[0] + "&lon=" + latlng[1] + "&APPID=" + openWeatherAPI.key;
  // Source for url and key commented out to avoid exceding api call limits
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
