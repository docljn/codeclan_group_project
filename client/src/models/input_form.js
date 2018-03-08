const InputForm = function(){

};

InputForm.prototype.create = function () {
  console.log("Create form called");
  const inputForm = document.getElementById("custom-phrase");
  console.log(inputForm);
  const textInput = document.createElement("input");
  const submitButton = document.createElement("button");
  const formLabel = document.createElement("label");

  formLabel.for = "custom-phrase";
  formLabel.innerText = "Custom Phrase";

  textInput.id = "text-input";
  textInput.placeholderText = "Enter your own phrase for translation";

  submitButton.id = "translate-phrase-button";
  // submitButton.name = "Translate Phrase";
  submitButton.innerText = "Translate Phrase";
  inputForm.appendChild(textInput);
  inputForm.appendChild(submitButton);
  inputForm.appendChild(formLabel);

  submitButton.addEventListener("click", translatePhraseButtonClicked);

};

translatePhraseButtonClicked = function () {
  const phraseInput = document.getElementById("text-input");
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



module.exports = InputForm;
