const APIKey = "8760fe8a41b2493802e8cf54d1c73071";
// let city;
// let state;
// let country;
let lat;
let lon;

// const coordQueryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&appid=${APIKey}`
// const queryURL = `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;


const searchFormEl = document.querySelector('#search-form');

function handleSearchFormSubmit(event) {
  event.preventDefault();

  const searchInputCity = document.querySelector('#search-input').value;
  const formatInputVal = document.querySelector('#format-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }
  
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

    // Now, make the second API call to get the weather forecast using lat and lon
    const queryURLWithCoords = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;

    // Fetch the weather forecast data
    return fetch(queryURLWithCoords);
 })
 .then(response => response.json())
 .then(weatherData => {
   // Handle the weather data (you can display it as needed)
   console.log(weatherData);
   return weatherData;

   // If you want to redirect to another page, you can pass the data along with the query string
//    const queryString = `./search-results.html?q=${searchInputCity}&format=${formatInputVal}`;
//    location.assign(queryString);
//  })
//  .catch(error => {
//    console.error('Error:', error);
 });
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);



//   const queryString = `./search-results.html?q=${searchInputVal}&format=${formatInputVal}`;

//   fetch(queryURL);

// searchFormEl.addEventListener('submit', handleSearchFormSubmit);