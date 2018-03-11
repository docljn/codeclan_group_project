const TextToSpeech = function(){
  this.voices = [];
};

TextToSpeech.prototype.getVoices = function(){
  if(typeof speechSynthesis === "undefined") {
    return;
  }
  this.voices = speechSynthesis.getVoices();
  if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = TextToSpeech.prototype.getVoices;
  }
  console.log("this.voices - getVoices", this.voices);
}

TextToSpeech.prototype.speakPhrase = function(phrase, speechLanguage){

  if(typeof speechSynthesis === "undefined") {
    return;
  }
  this.voices = speechSynthesis.getVoices();
  if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = TextToSpeech.prototype.getVoices;
  }
  console.log("this.voices - speak phrase 1", this.voices);

  let speech = new SpeechSynthesisUtterance();
  let selectedLanguageCode = speechLanguage.slice(0,2);
  console.log("selectedLanguageCode", selectedLanguageCode);
  speech.text = phrase;
  speech.lang = speechLanguage;
  console.log("speech.lang", speech.lang);
  console.log("this.voices - speakPhrase 2", this.voices);

  this.voices.forEach(function(voice){
    console.log("voice.lang", voice.lang);
    console.log("speechLanguage", speechLanguage);
    if (voice.lang === speechLanguage){
      console.log("voice.lang", voice.lang);
      console.log("speechLanguage", speechLanguage);
      speech.voice = voice;
      console.log("speech.voice 1", speech.voice);
      return;
    }
    // else{
    //   let voiceLanguageCode = voice.lang.slice(0,2);
    //   console.log("voiceLanguageCode", voiceLanguageCode);
    //   if (voiceLanguageCode === selectedLanguageCode){
    //     speech.voice = voice;
    //     console.log("speech.voice 2", speech.voice);
    //     return;
    //   }
    // }
  });
console.log("speech voice - before speak", speech.voice);

  speechSynthesis.speak(speech);
}

module.exports = TextToSpeech;
