const CountryList = function(url) {
  this.countries = [];
  this.onUpdate = null;
  this.url = url;
};

CountryList.prototype.populate = function(){
  let filteredCountries = [];
  const languageCodes = [ 'af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'zh', 'co', 'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'iw', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no', 'ny', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn','sd','si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tl', 'tg', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu']
  const request = new XMLHttpRequest();
  request.open("GET", this.url);
  request.onload = function() {
    if (request.status === 200) {
      const jsonString = request.responseText;
      const countries = JSON.parse(jsonString);
      this.countries = countries;
      this.countries.forEach(function(country){
        if (languageCodes.includes(country.languages[0].iso639_1)){
          filteredCountries.push(country);
        }
      })
      this.onUpdate(filteredCountries);
    }
  }.bind(this);
  request.send(null);
}

module.exports = CountryList;
