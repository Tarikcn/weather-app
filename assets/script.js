// Global variables
var APIkey = "&appid=99d1a7e58f500ed377f1399b47f88c6a";
var searchInput = $("#search-input");
var submitBtn = $("#submit-btn");
var citiesList = $(".previous-cities");
var todayContainer = $("#today-container");
var currentWeather = $(".current-weather");
var forecast5 = $(".forecast-container");
var cityHistory = [];

//fetch data from current weather api, and display desired data on the page
function curentConditions(coord) {
  let lat = coord[0].lat.toString();
  let lon = coord[0].lon.toString();
  let currentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}${APIkey}&units=metric`;
}
