const apiKey = 'API key'; 
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');

// Leaflet map
const map = L.map('map').setView([0, 0], 2); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        alert('Please enter a city name');
    }
});

function fetchWeatherData(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            updateWeatherInfo(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error.message);
            alert('Could not retrieve weather data. Please check the city name.');
        });
}

function updateWeatherInfo(data) {
    const { name, coord } = data;
    const { temp } = data.main;
    const { description } = data.weather[0];

    locationElement.textContent = `Location: ${name}`;
    temperatureElement.textContent = `Temperature: ${temp}°C`;
    descriptionElement.textContent = `Description: ${description}`;

    const { lat, lon } = coord;
    map.setView([lat, lon], 10); 
    L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${name}</b><br>Temperature: ${temp}°C<br>${description}`)
        .openPopup();
}
