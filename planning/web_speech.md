# Web Speech API
<https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API>
<https://github.com/mdn/web-speech-api/>
<https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API>
<https://www.sitepoint.com/talking-web-pages-and-the-speech-synthesis-api/>

Speech synthesis is accessed via the SpeechSynthesis interface, a text-to-speech component that allows programs to read out their text content (normally via the device's default speech synthesiser.) Different voice types are represented by SpeechSynthesisVoice objects, and different parts of text that you want to be spoken are represented by SpeechSynthesisUtterance objects. You can get these spoken by passing them to the SpeechSynthesis.speak() method.

## Key features

### SpeechSynthesis
The controller interface for the speech service; this can be used to retrieve information about the synthesis voices available on the device, start and pause speech, and other commands besides.
### SpeechSynthesisErrorEvent
Contains information about any errors that occur while processing SpeechSynthesisUtterance objects in the speech service.
### SpeechSynthesisEvent
Contains information about the current state of SpeechSynthesisUtterance objects that have been processed in the speech service.
### SpeechSynthesisUtterance
Represents a speech request. It contains the content the speech service should read and information about how to read it (e.g. language, pitch and volume.)
### SpeechSynthesisVoice
Represents a voice that the system supports. Every SpeechSynthesisVoice has its own relative speech service including information about language, name and URI.
### Window.speechSynthesis
Specced out as part of a [NoInterfaceObject] interface called SpeechSynthesisGetter, and Implemented by the Window object, the speechSynthesis property provides access to the SpeechSynthesis controller, and therefore the entry point to speech synthesis functionality.

## Browser Compatibility
Support for Web Speech API speech synthesis is still getting there across mainstream browsers, and is currently limited to the following:
- Firefox desktop and mobile support it in Gecko 42+ (Windows)/44+, without prefixes, and it can be turned on by flipping the media.webspeech.synth.enabled flag to true in about:config.
- Firefox OS 2.5+ supports it, by default, and without the need for any permissions.
- Chrome for Desktop and Android have supported it since around version 33, without prefixes.

## Getting it working
<http://blog.teamtreehouse.com/getting-started-speech-synthesis-api>
You only need two lines of code to have your web application speak.
```javascript
var utterance = new SpeechSynthesisUtterance('Hello World');
window.speechSynthesis.speak(utterance);
```
1. create a new instance of SpeechSynthesisUtterance and pass in the text that you’d like to be spoken
  - this SpeechSynthesisUtterance object also contains information on how the text should be spoken
2. pass the instance of SpeechSynthesisUtterance to the speak method on the speechSynthesis interface.

### The speechSynthesis Interface
- on the window object
- methods:
  - speak(SpeechSynthesisUtterance)
  - cancel()
  - pause()
  - resume()
  - getVoices() - returns results asynchronously
- attributes: (default for all is false)
  - pending
  - speaking
  - paused

### Selecting a Voice
First, access the list available voices:
```javascript
var voices = window.speechSynthesis.getVoices();
```
Each SpeechSynthesisVoiceobject has:
- name – A human-readable name that describes the voice.
- voiceURI – A URI specifying the location of the speech synthesis service for this voice.
- lang – The language code for this voice.
- default – Set to true if this is the default voice used by the browser.
- localService – The API can use both local and remote services to handle speech synthesis.
  - If this attribute is set to true the speech synthesis for this voice is handled by a local service. If it’s false a remote service is being used. This attribute can be useful if you’re building an app that needs to work offline. You could use a remote service when an internet connection is present, and fallback to a local service if a connection is not available.

### Using a Voice
First, check whether the browser supports speech synthesis:
```javascript
if ('speechSynthesis' in window) {
 // Synthesis support. Make your web apps talk!
}
```
Set the voice property on your SpeechSynthesisUtterance instance to the desired SpeechSynthesisVoice object.
```javascript

var utterance = new SpeechSynthesisUtterance('Hello World');
var voices = window.speechSynthesis.getVoices();

// find the object in the voices list with the desired attribute
// set the voice property on our instance of SpeechSynthesisUtterance
utterance.voice = voices.filter(function(voice) { return voice.name == 'Alex'; })[0];
// speak
window.speechSynthesis.speak(utterance);
```

### Setting the details of an Utterance
- change the text to be spoken:
```javascript
utterance.text = 'Hello Universe';
```
- change the language to be spoken:
  - default is the language of the HTML document
```javascript
utterance.lang = 'en-US';
```
- there are other controls like pitch, speed and volume but these are not supported by all voices

Demo code: <https://codepen.io/matt-west/pen/wGzuJ>
Original spec: <https://w3c.github.io/speech-api/speechapi.html#tts-section>

### Languages supported
```javascript
speechSynthesis.getVoices().forEach(function(voice) {
  console.log(voice.lang);
});
```
Firefox:
en-US
it-IT
sv-SE
fr-CA
de-DE
he-IL
id-ID
en-GB
es-AR
nl-BE
en-scotland
en-US
ro-RO
pt-PT
es-ES
es-MX
th-TH
en-AU
ja-JP
sk-SK
hi-IN
it-IT
pt-BR
ar-SA
hu-HU
zh-TW
el-GR
ru-RU
en-IE
es-ES
nb-NO
es-MX
en-US
da-DK
fi-FI
zh-HK
en-ZA
fr-FR
zh-CN
en-IN
en-US
nl-NL
tr-TR
ko-KR
ru-RU
pl-PL
cs-CZ

Chrome:
en-GB
en-US
it-IT
sv-SE
fr-CA
de-DE
he-IL
id-ID
es-AR
nl-BE
en
en-US
ro-RO
pt-PT
es-ES
es-MX
th-TH
en-AU
ja-JP
sk-SK
hi-IN
it-IT
pt-BR
ar-SA
hu-HU
zh-TW
el-GR
ru-RU
en-IE
es-ES
nb-NO
es-MX
en-US
da-DK
fi-FI
zh-HK
en-ZA
fr-FR
zh-CN
en-IN
en-US
nl-NL
tr-TR
ko-KR
ru-RU
pl-PL
cs-CZ
de-DE
en-US
en-GB
es-ES
es-US
fr-FR
hi-IN
id-ID
it-IT
ja-JP
ko-KR
nl-NL
pl-PL
pt-BR
ru-RU
zh-CN
zh-HK
zh-TW
