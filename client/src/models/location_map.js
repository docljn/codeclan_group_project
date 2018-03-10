const Highcharts = require("highcharts/highmaps");

const worldMap = require("../resources/world_robinson.js");

const LocationMap = function () {
  this.map = null;
};

LocationMap.prototype.create = function (container, countryCodeArray, seriesName) {
  const mapDataObject = {
    chart: {
      map: worldMap,
      borderWidth: 0
    },

    title: {
      text: ""
    },

    subtitle: {
      text: "Where you will be understood"
    },

    legend: {
      enabled: false
    },

    series: [{
      enableMouseTracking: false,
      name: seriesName,
      data: [
        countryCodeArray
      ]
    }]
  };

  const map = Highcharts.mapChart(container, mapDataObject);
  this.map = map;

};

LocationMap.prototype.createCommonLanguageCountries = function (container, countriesWhereTargetIsSpokenArray){
  const countryCodeArray = countriesWhereTargetIsSpokenArray.map( function (country) {
    let countryCode = country.alpha2Code.toLowerCase();
    const requiredData = [countryCode, 500];
    return requiredData;
  });
  console.log(countryCodeArray);
  const mapDataObject = {
    chart: {
      map: worldMap,
      borderWidth: 0
    },
    title: {
      text: "Where you will be understood"
    },
    subtitle: {
      text: ""
    },

    legend: {
      enabled: false
    },

    series: [{
      enableMouseTracking: false,
      data:
        countryCodeArray

    }]
  };
  const map = Highcharts.mapChart(container, mapDataObject);
  this.map = map;
};



module.exports = LocationMap;
