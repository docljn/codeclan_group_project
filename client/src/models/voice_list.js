const VoiceList = function(){
  this.voices = [];
  this.onUpdate = null;
};

VoiceList.prototype.populate = function(){
  if(typeof speechSynthesis === "undefined") {
    return;
  }
  this.voices = speechSynthesis.getVoices();
  console.log("this.voices", this.voices);
}

VoiceList.prototype.speakPhrase = function(phrase, speechLanguage){
  let speech = new SpeechSynthesisUtterance();
  speech.text = phrase;
  speech.lang = speechLanguage;

  if (this.voices.includes(speechLanguage)){
      speech.voice = speechLanguage;
      console.log("speech.voice", speech.voice);
  }

  speechSynthesis.speak(speech);
}

module.exports = VoiceList;
