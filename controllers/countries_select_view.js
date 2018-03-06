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
    this.countries = countries;
    this.countries.forEach(function(country, index) {
      country.index = index;
      this.addOption(country, index);
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
