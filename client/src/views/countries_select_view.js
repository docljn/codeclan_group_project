const CountrySelectView = function(selectElement) {
  this.selectElement = selectElement;
  this.onChange = undefined;
  this.countries = [];
  this.selectElement.addEventListener('change', function (e) {
      const target = e.target;
      const index = target.selectedIndex;
      const country = this.countries[index];
      this.onChange(country);
  }.bind(this), false);
};

CountrySelectView.prototype.render = function(countries){
    this.selectElement.innerHTML = "";
    const languageCodes = [ 'af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'zh', 'co', 'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'iw', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no', 'ny', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn','sd','si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tl', 'tg', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu']

    this.countries = countries;
    this.countries.forEach(function(country, index) {
      console.log(country.name);
      console.log(country.languages[0]);
      if (languageCodes.includes(country.languages[0])){
        country.index = index;
        this.addOption(country, index);
      }
    }.bind(this));
}

CountrySelectView.prototype.addOption = function(country, index){
    const option = document.createElement("option");
    option.value = index;
    option.text = country.name;
    this.selectElement.appendChild(option);
}

CountrySelectView.prototype.setSelectedIndex = function(index){
    this.selectElement.selectedIndex = index;
}

module.exports = CountrySelectView;
