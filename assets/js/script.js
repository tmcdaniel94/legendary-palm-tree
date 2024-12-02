const APIKey = "8760fe8a41b2493802e8cf54d1c73071";
// let city;
// let state;
// let country;
let lat;
let lon;

// const coordQueryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&appid=${APIKey}`
// const queryURL = `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;


const searchButtonEl = document.querySelector('#search-button');
const weatherForecastEl = document.querySelector('#weather-forecast');

function handleSearchFormSubmit(event) {
  event.preventDefault();

  const searchInputCity = document.querySelector('#search-input').value;
//   const formatInputVal = document.querySelector('#format-input').value;

  if (!searchInputCity) {
    console.error('You need a search input value!');
    return;
  }

  // Clear previous weather forecast data
  weatherForecastEl.innerHTML = '';
  
  // First API call to get the coordinates (latitude and longitude)
  const coordQueryURLWithCity = `http://api.openweathermap.org/geo/1.0/direct?q=${searchInputCity}&appid=${APIKey}`;

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

      console.log(`Coordinates for ${searchInputCity}: lat = ${lat}, lon = ${lon}`);

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
        dailyForecasts.push({
          date: foremattedDate,
          temp: item.main.temp,
          description: item.weather[0].description
        });
        daysCount++; // Increment the days counter once we add a new forecast
       }
    });

    dailyForecasts.forEach(forecast => {
        const forecastEl = document.createElement('div');
        forecastEl.classList.add('forecast-item');

        const dateEl = document.createElement('h3');
        const temperatureEl = document.createElement('p');
        const descriptionEl = document.createElement('p');

        dateEl.textContent = forecast.date;
        temperatureEl.textContent = `Temperature: ${forecast.temp}°F`;
        descriptionEl.textContent = `Condition: ${forecast.description}`;

        // Append each element to the forecast div
        forecastEl.appendChild(dateEl);
        forecastEl.appendChild(temperatureEl);
        forecastEl.appendChild(descriptionEl);

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


searchButtonEl.addEventListener('click', handleSearchFormSubmit);
