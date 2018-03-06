const languageCodes = require ('../resources/language_codes');

const CountryList = function(url) {
  this.countries = [];
  this.onUpdate = null;
  this.url = url;
};

CountryList.prototype.populate = function(){
  let filteredCountries = [{'languages': [
    { 'iso639_1': 'en', 'name': ''} ] , name: 'Select destination country', index: 0}];

  const request = new XMLHttpRequest();
  request.open('GET', this.url);
  request.onload = function() {
    if (request.status === 200) {
      const jsonString = request.responseText;
      const countries = JSON.parse(jsonString);
      this.countries = countries;
      this.countries.forEach(function(country){
        if (languageCodes.includes(country.languages[0].iso639_1)){
          filteredCountries.push(country);
        }
      });
      this.onUpdate(filteredCountries);
    }
  }.bind(this);
  request.send(null);
};

module.exports = CountryList;
