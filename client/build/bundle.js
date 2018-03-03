/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/src/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/src/app.js":
/*!***************************!*\
  !*** ./client/src/app.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const CountriesSelectView = __webpack_require__(/*! ./views/countries_select_view */ "./client/src/views/countries_select_view.js");

const CountryList = __webpack_require__(/*! ./models/country_list */ "./client/src/models/country_list.js");


const app = function(){
  const countriesSelectView = new CountriesSelectView(document.querySelector('#countries'));
  const world = new CountryList('https://restcountries.eu/rest/v1');

  world.onUpdate = function(countries) {
    countriesSelectView.render(countries);
  };

  world.populate();


}

document.addEventListener("DOMContentLoaded", app)


/***/ }),

/***/ "./client/src/models/country_list.js":
/*!*******************************************!*\
  !*** ./client/src/models/country_list.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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


/***/ }),

/***/ "./client/src/views/countries_select_view.js":
/*!***************************************************!*\
  !*** ./client/src/views/countries_select_view.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map