const Highcharts = require("highcharts/highmaps");

const worldMap = require("../resources/world_robinson.js");

const LocationMap = function () {

};

LocationMap.prototype.create = function (container, mapCountryCode, countryName) {
  const mapDataObject = {
    chart: {
      map: worldMap,
      borderWidth: 0
    },

    title: {
      text: ""
    },

    subtitle: {
      text: ""
    },

    legend: {
      enabled: false
    },

    series: [{
      enableMouseTracking: false,
      name: countryName,
      data: [
        [mapCountryCode, 500]
      ]
    }]
  };

  const map = Highcharts.mapChart(container, mapDataObject);

};


// updating the map can include:
// Series.addPoint(), Point.update(), Chart.addSeries(), Chart.update() etc.
// create the data you need to make a map


module.exports = LocationMap;
