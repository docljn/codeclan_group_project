const CountriesSelectView = require("./views/countries_select_view");
const CountryList = require("./models/country_list");
const phraseList = require("./models/phrase_list");
const Request = require("./services/request");

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
    const targetLanguageCode = country.languages[0].iso639_1;
    localStorage.setItem("targetLanguage", targetLanguageCode);
    const flag_src = country.flag;
    const countryName = country.name;
    const countryCapital = country.capital;
    // const countryLatLng = country.latlng; // needed for local weather alternate api
    const country_alpha2Code = country.alpha2Code;
    const speechLanguage =  targetLanguageCode + "-" + country_alpha2Code;
    localStorage.setItem("speechLanguage", speechLanguage);
    const phraseTable = document.getElementById("phrase-table-id");
    phraseTable.hidden = false;
    const tableBody = document.getElementById("phrase_table_body");
    tableBody.innerText = "";
    const inputPhraseSection = document.getElementById("input-phrase-section");
    inputPhraseSection.hidden = false;
    if (targetLanguageCode != "en"){
      buildPhraseTable(country);
      // see if there is  db entry for this languageCode
      const requestURL = "http://localhost:3000/phrases/" + targetLanguageCode ;
      const mongoRequest = new Request(requestURL);
      mongoRequest.get(languagePresentRequestComplete);
    } else clearPhraseTable();

    createFlag(flag_src, countryName);
    createWeatherDisplay(countryCapital);
    // createWeatherDisplay(countryLatLng); // for alt weatherAPI
  };
};

const languagePresentRequestComplete = function(allPhrases){

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

const translateRequestComplete = function(){
  if(this.status !== 200) return;
  const jsonString = this.responseText;
  const translatedPhraseArray = JSON.parse(jsonString);

  for (let i=0; i < translatedPhraseArray.data.length; i++){

    const originalPhrase = phraseList[i];
    const translatedPhrase = translatedPhraseArray.data[i];
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

const createFlag = function(flagImage, countryName){
  const div = document.getElementById("flag_id");
  div.innerHTML = "";
  const img = document.createElement("img");
  img.src = flagImage;
  img.id = "flag_image";
  img.alt = "Flag of " + countryName;
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
}

const getCustomPhraseButtonClicked = function(){
  const phraseInput = document.getElementById("phrase_input");
  const phraseToTranslate = phraseInput.value;
  const languageCode = localStorage.getItem("targetLanguage");

  const requestPhrase = new XMLHttpRequest();
  requestPhrase.open("POST", "/translate_api/single_phrase/");
  requestPhrase.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  requestPhrase.onload = requestCompleteSinglePhrase;
  const requestBody = {language: languageCode, phrase: phraseToTranslate};
  requestPhrase.send(JSON.stringify(requestBody));
};

const requestCompleteSinglePhrase = function(){
  if(this.status !== 200) return;
  const jsonString = this.responseText;
  const translatedPhrase = JSON.parse(jsonString).data;
  const originalPhrase = document.getElementById("phrase_input").value;
  const speechLanguage  = localStorage.getItem("speechLanguage");
  speakPhrase(translatedPhrase, speechLanguage)

  savePhrasePair(originalPhrase, translatedPhrase);
};

const savePhrasePair = function(originalPhrase, translatedPhrase){

  const languageCode = localStorage.getItem("targetLanguage");

  const requestURL = "http://localhost:3000/phrases/" + languageCode ;
  const mongoRequest = new Request(requestURL);
  const bodyToSend = {originalPhrase: originalPhrase, translatedPhrase: translatedPhrase };
  mongoRequest.post(mongoRequestComplete, bodyToSend);
  appendTranslationPair(originalPhrase, translatedPhrase);
};


const appendTranslationPair = function(originalPhrase, translatedPhrase){
  const speechLanguage = localStorage.getItem("speechLanguage");
  const languageCode = localStorage.getItem("targetLanguage");

  const tableBody = document.getElementById("phrase_table_body");

  const tableRow = document.createElement("tr");
  tableRow.setAttribute("id", translatedPhrase);
  const originalPhraseTag = document.createElement("td");
  originalPhraseTag.innerText = originalPhrase;
  const translatedPhraseTag = document.createElement("td");

  const speakButtonCell = document.createElement("td");
  const speakButton = document.createElement("button")
  speakButton.addEventListener("click", function() {
    speakButtonClicked(translatedPhrase);
  });
  speakButton.innerText = "speak";
  speakButtonCell.appendChild(speakButton);

  const deleteButtonCell = document.createElement("td");
  const deleteButton = document.createElement("button")
  deleteButton.addEventListener("click", function(){
    deleteButtonClicked(languageCode, translatedPhrase);
  })
  deleteButton.innerText = "delete";
  deleteButtonCell.appendChild(deleteButton);


  translatedPhraseTag.setAttribute('lang', languageCode);
  translatedPhraseTag.innerText = translatedPhrase;

  tableRow.appendChild(originalPhraseTag);
  tableRow.appendChild(translatedPhraseTag);
  tableRow.appendChild(speakButtonCell);
  tableRow.appendChild(deleteButtonCell);
  tableBody.appendChild(tableRow);

};

const mongoRequestComplete = function(){
  console.log("mongo post complete");
};

const speakButtonClicked = function(translatedPhrase){
  const speechLanguage = localStorage.getItem("speechLanguage");
  speakPhrase(translatedPhrase, speechLanguage)
  console.log("speak button speakButtonClicked");
};

const deleteButtonClicked = function(languageCode, translatedPhrase){
  const encodedPhrase = encodeURIComponent(translatedPhrase);
  const requestURL = "http://localhost:3000/phrases/" + languageCode +"/"+ encodedPhrase ;
  const mongoRequest = new Request(requestURL);
  mongoRequest.delete(mongoRequestComplete);
  const rowToRemove = document.getElementById(translatedPhrase);
  rowToRemove.innerHTML = "";
};


// I t doesn't look like this is used now.
//  ripe for deletion!
const getPhraseRequestComplete = function(allPhrases){
  allPhrases.forEach(function(phrasePair){
    const originalPhrase = phrasePair.originalPhrase;
    const translatedPhrase = phrasePair.translatedPhrase;
    appendTranslationPair(originalPhrase, translatedPhrase);
  });
};

document.addEventListener("DOMContentLoaded", app);
