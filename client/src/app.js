const CountriesSelectView = require('./views/countries_select_view');
const CountryList = require('./models/country_list');
const phraseList = require('./models/phrase_list');


const app = function(){
  const countriesSelectView = new CountriesSelectView(document.querySelector('#countries'));
  const world = new CountryList('https://restcountries.eu/rest/v2/all?fields=name;languages');

  world.onUpdate = function(countries) {
    countriesSelectView.render(countries);
  };

  world.populate();

  countriesSelectView.onChange = function(country){
    console.log(country);
    const dummyPhrase = "Hello";
    const languageToTranslateTo = country.languages[0].iso639_1;
    console.log(dummyPhrase);
    console.log(languageToTranslateTo);
  }
}

document.addEventListener("DOMContentLoaded", app)
