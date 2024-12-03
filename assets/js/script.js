const APIKey = "8760fe8a41b2493802e8cf54d1c73071";

let lat;
let lon;

const searchButtonEl = document.querySelector('#search-button');
const weatherForecastEl = document.querySelector('#weather-forecast');
const currentWeatherEl = document.querySelector('#current-weather');

function handleSearchFormSubmit(event) {
  event.preventDefault();
  const searchInputCity = document.querySelector('#search-input').value;

  if (!searchInputCity) {
    console.error('You need a search input value!');
    return;
  }

  // Call the helper function to fetch weather for the input city
  handleSearchForCity(searchInputCity);
};

const handleSearchForCity = (city) => {
  // Clear previous weather forecast data
  weatherForecastEl.innerHTML = '';
  currentWeatherEl.innerHTML = '';
  
  // First API call to get the coordinates (latitude and longitude)
  const coordQueryURLWithCity = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}`;

  fetch(coordQueryURLWithCity)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        console.error('City not found!');
        return;
      }

    // Extract latitude and longitude from the response
    lat = data[0].lat;
    lon = data[0].lon;

    console.log(`Coordinates for ${city}: lat = ${lat}, lon = ${lon}`);
      
    // Save the city to local storage
    saveCityToLocalStorage(city);
    displaySavedCities();

     // ---- Current Weather Query ----
     // Fetch current weather data
     const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;

     return fetch(currentWeatherURL);
    })
    .then(response => response.json())
    .then(currentWeatherData => {
      // Handle current weather data
      console.log('Current weather data:', currentWeatherData);

     if (currentWeatherData) {
       // Create elements for current weather
       const weatherIconEl = document.createElement('img');  // Create an image element for the icon
       const currentTempEl = document.createElement('h4');
       const currentDescriptionEl = document.createElement('h4');
       const currentHumidtyEl = document.createElement('h4');
       const currentWindSpeedEl = document.createElement('h4');

       const currentTemp = currentWeatherData.main.temp;
       const currentDescription = currentWeatherData.weather[0].description;
       const currentHumidty = currentWeatherData.main.humidity;
       const currentWindSpeed = currentWeatherData.wind.speed;
       const iconCode = currentWeatherData.weather[0].icon;  // Get the icon code

       // Set the image source to the OpenWeatherMap icon URL
       weatherIconEl.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
       weatherIconEl.alt = currentDescription; // Set alt text as the description

       currentTempEl.textContent = `Current Temperature: ${currentTemp}°F `;
       currentDescriptionEl.textContent = `Current Condition: ${currentDescription} `;
       currentHumidtyEl.textContent = `Humidity: ${currentHumidty} `;
       currentWindSpeedEl.textContent = `Wind Speed: ${currentWindSpeed} `;

       // Append current weather data to the current-weather div
       currentWeatherEl.appendChild(weatherIconEl);
       currentWeatherEl.appendChild(currentTempEl);
       currentWeatherEl.appendChild(currentDescriptionEl);
       currentWeatherEl.appendChild(currentHumidtyEl);
       currentWeatherEl.appendChild(currentWindSpeedEl);
     } else {
       console.error('Current weather data not found!');
     }


     // ---- Five Day Forecast Query ----
     // Make the second API call to get the weather forecast using lat and lon
     const queryURLWithCoords = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;

     // Fetch the weather forecast data
     return fetch(queryURLWithCoords);
    })
  .then(response => response.json())
  .then(weatherData => {
    // Handle the weather data and display it in the #weather-forecast div
    console.log(weatherData);
    // return weatherData;

    if (weatherData && weatherData.list) {
     // Create an array to store the daily forecasts
     const dailyForecasts = [];
     let daysCount = 0;

    weatherData.list.forEach(item => {
     // Get the date for the current item (convert the timestamp to a date)
     const forecastDate = new Date(item.dt * 1000);
     const foremattedDate = forecastDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

     // If we haven't already added a forecast for this date, add it
     if (daysCount < 5 && !dailyForecasts.some(f => f.date === foremattedDate)) {
         const iconCode = item.weather[0].icon;  // Get the icon code for each forecast
         dailyForecasts.push({
           date: foremattedDate,
           temp: item.main.temp,
           description: item.weather[0].description,
           icon: iconCode // Add the icon code to the forecast data
         });
         daysCount++; // Increment the days counter once we add a new forecast
        }
     });

    dailyForecasts.forEach(forecast => {
        const forecastEl = document.createElement('div');
        forecastEl.classList.add('forecast-item');

        const dateEl = document.createElement('h4');
        const temperatureEl = document.createElement('h4');
        const descriptionEl = document.createElement('h4');
        const humidityEl = document.createElement('h4');
        const windSpeedEl = document.createElement('h4');
        const weatherIconEl = document.createElement('img'); // Create an image element for the icon

        dateEl.textContent = forecast.date;
        temperatureEl.textContent = `Temperature: ${forecast.temp}°F`;
        descriptionEl.textContent = `Condition: ${forecast.description}`;
        humidityEl.textContent = `Humidity: ${forecast.humidity}`;
        windSpeedEl.textContent = `Wind Speed: ${forecast.windSpeed}`;

        // Set the image source to the OpenWeatherMap icon URL
        weatherIconEl.src = `http://openweathermap.org/img/wn/${forecast.icon}@2x.png`;
        weatherIconEl.alt = forecast.description;  // Set alt text as the description

        // Append the icon and weather data to the forecast div
        forecastEl.appendChild(weatherIconEl);
        forecastEl.appendChild(dateEl);
        forecastEl.appendChild(temperatureEl);
        forecastEl.appendChild(descriptionEl);
        forecastEl.appendChild(humidityEl);
        forecastEl.appendChild(windSpeedEl);

        // Append the forecast to the weather-forecast div
        weatherForecastEl.appendChild(forecastEl);
      });
    } else {
      console.error('Weather data not found!');
    }
  })
  .catch(error => {
    console.error('Error fetching weather data:', error);
  });
};

const saveCityToLocalStorage = (city) => {
  let savedCities = JSON.parse(localStorage.getItem('cities')) || [];
  console.log('Saving city:', city);
  if (!savedCities.includes(city)) {
    savedCities.push(city);
    localStorage.setItem('cities', JSON.stringify(savedCities));
  }
  console.log('Saved cities:', savedCities);
};

const readCityFromStorage = (city) => {
  let savedCities = JSON.parse(localStorage.getItem('cities')) || [];
  return savedCities.includes(city);
};

const displaySavedCities = () => {
    const savedCities = JSON.parse(localStorage.getItem('cities')) || [];
    const cityListEl = document.querySelector('#city-buttons'); 
    cityListEl.innerHTML = '';

    savedCities.forEach(city => {
      const cityEl = document.createElement('button');
      cityEl.textContent = city;

      // Add a click event listener to each city button
      cityEl.addEventListener('click', () => {
        // Call the same function that handles the weather search, but with the clicked city name
        handleSearchForCity(city);
      })

      cityListEl.appendChild(cityEl);
    });
};

// Display saved cities on page load
window.addEventListener('load', displaySavedCities);

searchButtonEl.addEventListener('click', handleSearchFormSubmit);
