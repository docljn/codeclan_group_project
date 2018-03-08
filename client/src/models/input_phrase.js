const InputForm = function(formOptionsObject){
  
  this.formLabelText = formOptionsObject.formLabelText;
  this.buttonText = formOptionsObject.buttonText;
  this.formId = formOptionsObject.formId;
  this.placeholderText = formOptionsObject.placeholderText;
  this.parentElementId = formOptionsObject.parentElementId;
}

InputPhrase.prototype.create = function () {
  const parentElement = document.getElementById(this.parentElementId);
  const inputForm = document.createElement("form");
  const textInput = document.createElement("input");
  const submitButton = document.createElement("button");
  const formLabel = document.createElement("label");

  formLabel.for = this.formId;
  formLabel.innerText = this.formLabelText;

  textInput.id = "text-input";
  textInput.placeholderText = this.placeholderText;

  submitButton.id = "translate-phrase-button";
  submitButton.name = this.buttonText;
  submitButton.innerText = this.buttonText;

  inputForm.appendChild(textInput);
  inputForm.appendChild(submitButton);
  inputForm.appendChild(formLabel);

  parentElement.appendChild(inputForm);

};

module.exports = InputForm;
