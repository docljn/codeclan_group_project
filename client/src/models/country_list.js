const CountryList = function(url) {
  this.countries = [];
  this.onUpdate = null;
  this.url = url;
};

CountryList.prototype.populate = function(){
    const request = new XMLHttpRequest();
    request.open("GET", this.url);
    request.onload = function() {
        if (request.status === 200) {
            const jsonString = request.responseText;
            const countries = JSON.parse(jsonString);
            this.countries = countries;
            this.onUpdate(countries);
        }
    }.bind(this);
    request.send(null);
}

CountryList.prototype.filterCountries = function(countries){

}

module.exports = CountryList;
