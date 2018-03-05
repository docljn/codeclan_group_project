const CountriesSelectView = require('./views/countries_select_view');
const CountryList = require('./models/country_list');


const app = function(){
  const countriesSelectView = new CountriesSelectView(document.querySelector('#countries'));
  const world = new CountryList('https://restcountries.eu/rest/v2/all?fields=name;languages');

  world.onUpdate = function(countries) {
    countriesSelectView.render(countries);
  };

  world.populate();

  countriesSelectView.onChange = function(country){
    console.log(country);
  }



}

document.addEventListener("DOMContentLoaded", app)
