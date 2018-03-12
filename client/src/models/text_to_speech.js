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

  this.voices.forEach(function(voice){
    console.log("voice.lang", voice.lang);
    console.log("speechLanguage", speechLanguage);
    if (voice.lang === speechLanguage){
      console.log("voice.lang", voice.lang);
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
  // ** needs further investigation as when it's needed to set .voice as speechSynthesis still
  // works without setting speech.voice to meet the logic written above e.g. speechLanguage (es-BO) for Bolivia speak phrase works even though there is no voice for (es-BO) so speechSynthesis must be using a fall back of another 'es' speaking voice instead. For Serbia (sr-RS), there is no voice for this language but the word is spoken with an English voice.
  // I assume for more complicated languages like Bengali (bn-BD) there is no voice as it's not possible for the English voice to pronounce the text ? so it appears we only need to set speech.lang.
  // **

console.log("speech voice - before speak", speech.voice);

  speechSynthesis.speak(speech);
}

module.exports = TextToSpeech;
