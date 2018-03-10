const PhraseTableView = function(tableBody){
  this.tableBody = tableBody;
};

const app = require("../app.js");


PhraseTableView.prototype.buildPhraseTable = function(country){
  const homeLanguage = document.getElementById("home_language");
  homeLanguage.innerText = "English";
  const targetLanguage = document.getElementById("target_language");
  targetLanguage.innerText = country.languages[0].name;
};

PhraseTableView.prototype.clearPhraseTable = function(){
  const homeLanguage = document.getElementById("home_language");
  homeLanguage.innerText = "";
  const targetLanguage = document.getElementById("target_language");
  targetLanguage.innerText = "";

};


PhraseTableView.prototype.appendTranslationPair = function(originalPhrase, translatedPhrase){
  const languageCode = localStorage.getItem("targetLanguage");
  console.log("originalPhrase", originalPhrase);
  const tableBody = document.getElementById("phrase_table_body");

  const tableRow = document.createElement("tr");
  tableRow.setAttribute("id", translatedPhrase);
  const originalPhraseTag = document.createElement("td");
  originalPhraseTag.innerText = originalPhrase;
  const translatedPhraseTag = document.createElement("td");

  const speakButtonCell = document.createElement("td");
  const speakButton = document.createElement("button");
  speakButton.addEventListener("click", function() {
    speakButtonClicked(translatedPhrase);
  });
  speakButton.innerText = "speak";
  speakButtonCell.appendChild(speakButton);

  const deleteButtonCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.addEventListener("click", function(){
    deleteButtonClicked(languageCode, translatedPhrase);
  });
  deleteButton.innerText = "delete";
  deleteButtonCell.appendChild(deleteButton);


  translatedPhraseTag.setAttribute("lang", languageCode);
  translatedPhraseTag.innerText = translatedPhrase;

  tableRow.appendChild(originalPhraseTag);
  tableRow.appendChild(translatedPhraseTag);
  tableRow.appendChild(speakButtonCell);
  tableRow.appendChild(deleteButtonCell);
  tableBody.appendChild(tableRow);

};

PhraseTableView.prototype.speakButtonClicked = function(translatedPhrase){
  const speechLanguage = localStorage.getItem("speechLanguage");

  textToSpeech.speakPhrase(translatedPhrase, speechLanguage);
  console.log("speak button speakButtonClicked");
};

module.exports = PhraseTableView;
