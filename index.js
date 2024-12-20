const cityInput = document.querySelector(".ciudad-input")
const searchBtn = document.querySelector(".search-btn")
const apiKey = "c3dc080fba7a632a9b13f84fb2d7d22d"

const weatherInfoSection = document.querySelector(".weather-info")
const notFoundSection = document.querySelector(".not-found")
const searchCitySection = document.querySelector(".search-city")
const forecastContainer = document.querySelector(".forecast-item-container")


const paisTxt = document.querySelector(".pais-txt")
const tempTxt = document.querySelector(".temp-txt")
const conditionTxt = document.querySelector(".condition-txt")
const humedadValueTxt = document.querySelector(".humedad-value-txt")
const windValueTxt = document.querySelector(".viento-value-txt")
const weatherSummaryImg = document.querySelector(".weather-summary-img")
const currentDateTxt = document.querySelector(".fecha-txt")

const forecastItemsContainer = document.querySelector(`.forecast-item-container`)

searchBtn.addEventListener("click", () =>{
    if(cityInput.value.trim() != ""){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ""
        cityInput.blur()
    }
})

cityInput.addEventListener("keydown", (event)=>{
    if(event.key == "Enter" &&
        cityInput.value.trim() != ""
    ){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ""
        cityInput.blur()
    }
})

async function getFetchData(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`; 

    const response = await fetch (apiUrl)
    return response.json()
}

function getWeatherIcon(id) {
    if (id <= 232) return `thunderstorm.svg`
    if (id <= 321) return `drizzle.svg`
    if (id <= 531) return `rain.svg`
    if (id <= 622) return `snow.svg`
    if (id <= 781) return `atmosphere.svg`
    if (id <= 800) return `clear.svg`
    else return `clouds.svg`
}

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: `short`,
        day: `2-digit`,
        month: `short`,
    }
    
    return currentDate.toLocaleDateString(`en-GB`, options)

}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData("weather", city);

    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection);
        return;
    }

    // Actualiza la información del clima actual
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed },
    } = weatherData;

    paisTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + `°C`;
    conditionTxt.textContent = main;
    humedadValueTxt.textContent = humidity + `%`;
    windValueTxt.textContent = speed + `M/s`;

    currentDateTxt.textContent = getCurrentDate();
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

    // Actualiza y muestra el pronóstico
    await updateForecastsInfo(city);
    forecastContainer.style.display = "flex"; // Mostrar la sección forecast
    showDisplaySection(weatherInfoSection);
}


async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData(`forecast`, city);

    if (!forecastsData.list || forecastsData.list.length === 0) {
        forecastContainer.style.display = "none"; // Asegúrate de ocultarlo si no hay datos
        return;
    }

    const timeTaken = `12:00:00`;
    const todayDate = new Date().toISOString().split(`T`)[0];

    forecastItemsContainer.innerHTML = ``;

    forecastsData.list.forEach(forecastWeather => {
        if (
            forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)
        ) {
            updateForecastsItems(forecastWeather);
        }
    });
}


function updateForecastsItems(weatherData) {
    console.log(weatherData);
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData;

    const dateTaken = new Date(date)
    const dateOption = {
        day: `2-digit`,
        month: `short`
    }

    const dateResult = dateTaken.toLocaleDateString(`en-US`, dateOption)

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${new Date(date).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
            })}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
        </div>
    `;

    forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem); // Corrección aquí
}


function showDisplaySection(section){
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = `none`)
        
    section.style.display = `flex`    


}

