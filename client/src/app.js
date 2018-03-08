const CountriesSelectView = require("./views/countries_select_view");
const CountryList = require("./models/country_list");
const phraseList = require("./models/phrase_list");


const app = function(){

  const getCustomPhraseButton = document.querySelector("#submit_phrase");
  getCustomPhraseButton.addEventListener("click", getCustomPhraseButtonClicked);

  const countriesSelectView = new CountriesSelectView(document.querySelector("#countries"));
  const world = new CountryList("https://restcountries.eu/rest/v2/all?fields=name;languages;flag;capital;latlng");

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
    const countryLatLng = country.latlng; // needed for local weather
    const request = new XMLHttpRequest();
    request.open("POST", "/translate_api/");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onload = requestComplete;
    const requestBody = {language: languageToTranslateTo, phrase: "n/a" };
    console.log("request body", requestBody);
    request.send(JSON.stringify(requestBody));
    createFlag(flag_src);
    createWeatherDisplay(countryLatLng); // for weather
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
  img.src = flagImage;
  img.width = 90;
  div.appendChild(img);
};

const createWeatherDisplay = function (latlng) {
  // api.openweathermap.org/data/2.5/weather?q=London,uk
  // api.openweathermap.org/data/2.5/weather?lat=35&lon=139
  // http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID={APIKEY}
  const openWeatherAPI = {
    url: "http://api.openweathermap.org/data/2.5/weather?",
    key: "62b03d8973a50751df56ad8de8a4cc3c"
  };
  let completeURL = openWeatherAPI.url + "lat=" + latlng[0] + "&lon=" + latlng[1] + "&APPID=" + openWeatherAPI.key;
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
  stationHeading.innerText = "Nearest Weather Station";

  const weatherUL = document.createElement("ul");

  const icon = document.createElement("img");
  icon.src = weatherIconSource;
  icon.width = "50";

  const liStation = document.createElement("li");
  liStation.innerText = nearestWeatherStation;

  const liTemp = document.createElement("li");
  liTemp.innerText = currentTemperature + htmlDegrees + ": " + weatherDescription;

  weatherUL.appendChild(icon);
  weatherUL.appendChild(liTemp);
  weatherUL.appendChild(liStation);

  weatherDiv.appendChild(stationHeading);
  weatherDiv.appendChild(weatherUL);

};



const getCustomPhraseButtonClicked = function(){
  console.log("Home text buttonclicked");
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
  const translatedPhrase = JSON.parse(jsonString);
  console.log("output of requestComplete", translatedPhrase);
  appendNewTranslation(translatedPhrase);
};

const appendNewTranslation = function(translatedPhrase){
  const div = document.getElementById("phrases");
  const pOrig = document.createElement("p");
  const phraseToTranslate = document.getElementById("phrase_input");
  pOrig.innerText = phraseToTranslate.value;
  console.log(phraseToTranslate);
  const pTrans = document.createElement("p");
  console.log(translatedPhrase);
  pTrans.innerText = translatedPhrase.data;
  div.prepend(pTrans);
  div.prepend(pOrig);
};

document.addEventListener("DOMContentLoaded", app);
