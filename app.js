
const apiKey = "dd5f01c84fa748fdfa4e6a6fef8e10da";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const saveBtn = document.querySelector(".save-btn");
const savedMsg = document.querySelector(".saved-msg");
const savedCitiesList = document.querySelector(".city-list");
const clearBtn = document.querySelector(".clear-btn");

// Load the saved city from localStorage if it exists
const savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];

// Function to update the saved cities list
function updateSavedCities() {
    savedCitiesList.innerHTML = "";
    savedCities.forEach(city => {
        const cityItem = document.createElement("li");
        cityItem.textContent = city;
        cityItem.addEventListener("click", () => checkWeather(city));
        savedCitiesList.appendChild(cityItem);
    });
}

// Initialize saved cities on page load
updateSavedCities();

async function checkWeather(city) {
    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        const data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "images/clear.png";
        } else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "images/rain.png";
        } else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        } else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "images/mist.png";
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
}

// Event listener for search button
searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim();
    checkWeather(city);
});

// Save the city as a favorite
saveBtn.addEventListener("click", () => 
{
    const city = document.querySelector(".city").innerText;

    if (city && !savedCities.includes(city)) {
        // Add city to saved cities if not already saved
        savedCities.push(city);

        // Save updated list to localStorage
        localStorage.setItem("savedCities", JSON.stringify(savedCities));

        // Show confirmation message
        savedMsg.style.display = "block";

        // Hide the confirmation message after 3 seconds
        setTimeout(() => {
            savedMsg.style.display = "none";
        }, 3000);

        // Update the saved cities list on the page
        updateSavedCities();
    } else if (!city) {
        alert("Please search for a city first.");
    } else {
        alert("City is already saved.");
    }
});

// Clear all saved cities
clearBtn.addEventListener("click", () => 
{
    localStorage.removeItem("savedCities");
    savedCities.length = 0;  // Empty the array
    updateSavedCities();
});



