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
  let currentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}${APIkey}`;
  fetch(currentWeatherAPI)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // city's name, and use moment to get the date
      var city = data.name;
      var date = moment().format(" DD/MM/YYYY");
      // weather condition icon
      var weatherIcon = data.weather[0].icon;
      var urlIcon = "https://openweathermap.org/img/w/" + weatherIcon + ".png";
      var cityHeader = $("<h2>").html(city + date);
      todayContainer.addClass("card");
      currentWeather.addClass("card-body");
      currentWeather.prepend(cityHeader);
      currentWeather.append($("<img>").attr("src", urlIcon));
      // temp, feels like, humidity, windspeed
      var temp = Math.ceil(data.main.temp);
      currentWeather.append($("<p>").html("Temperature: " + temp + " &#8451"));
      var feelsLike = Math.ceil(data.main.feels_like);
      currentWeather.append(
        $("<p>").html("Feels Like: " + feelsLike + " &#8451")
      );
      var humidity = data.main.humidity;
      currentWeather.append($("<p>").html("Humidity: " + humidity + " %"));
      var windSpeed = data.wind.speed;
      currentWeather.append($("<p>").html("Wind Speed: " + windSpeed + " MPH"));
    });
}
//fetch 5 days forecast api and display the next 5 days forecast onto the page
function futureConditions(coord) {
  let lat = coord[0].lat.toString();
  let lon = coord[0].lon.toString();
  let forecastAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}${APIkey}&units=metric`;

  fetch(forecastAPI)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (var i = 5; i < 38; i += 8) {
        // Create a div for each forecast card
        var weatherCard = $("<div>").attr(
          "class",
          "col five-days text-white rounded-lg p-2"
        );
        // variables
        var list = data.list[i];
        var main = data.list[i].main;
        forecast5.append(weatherCard);
        // Get the date and format using momentJs
        cardDate = moment(list.dt_txt.split(" ")[0]).format("l");
        // Display Date
        weatherCard.append($("<h4>").html(cardDate));
        // Display Icon
        var iconCode = list.weather[0].icon;
        var urlIcon = `https://openweathermap.org/img/w/${iconCode}.png`;
        weatherCard.append($("<img>").attr("src", urlIcon));
        // display temp, windspeed, and humidity
        var temp = Math.ceil(main.temp);
        weatherCard.append($("<p>").html("Temp: " + temp + " &#8451"));
        var windSpeed = list.wind.speed;
        weatherCard.append($("<p>").html("Wind Speed: " + windSpeed + " KPH"));
        var humidity = main.humidity;
        weatherCard.append($("<p>").html("Humidity: " + humidity + " %"));
      }
    });
}
function showWeather() {
  // Clear existing search results
  currentWeather.empty();
  forecast5.empty();
  // get the city's name, store it in a variable
  let cityName = searchInput.val();
  saveCityList(cityName);

  searchInput.val("");
  // fetch lat and lon
  let geoCodingAPI =
    "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + APIkey;

  fetch(geoCodingAPI)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      curentConditions(data);
      futureConditions(data);
    });
}
// Render list of previous search input onto the page
function renderCities() {
  var savedCity = JSON.parse(localStorage.getItem("cityHistory"));
  if (savedCity !== null) {
    cityHistory = savedCity;
    for (let i = 0; i < cityHistory.length; i++) {
      // render no more than 5 searches
      if (i === 4) {
        break;
      }
      let cityBtn = $("<button>").attr(
        "class",
        "btn btn-secondary btn-block cityBtn"
      );
      cityBtn.text(cityHistory[i]);
      citiesList.append(cityBtn);
    }
  }
}

// Save new Input into local storage
function saveCityList(cityName) {
  let checkHistory = cityHistory.includes(cityName);
  if (!checkHistory && cityName !== "") {
    cityHistory.unshift(cityName);
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
    citiesList.empty();
    renderCities();
  }
}

renderCities();

// search Button, click event
submitBtn.on("click", showWeather);

// Search history buttons, click event
$(".cityBtn").on("click", function (event) {
  var clickCity = event.target.innerText;
  $("#search-input").val(clickCity);
  showWeather();
});
