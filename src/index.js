import "./style.css";
import weatherLogo from "./logo.png"; // maybe change logo after to something that fits
import Weather from "../components/weather";
import checkInputValidity from "../components/checkValidity";

const WEATHER_API_KEY = "5ecc5123eac74a06bad220316243004";
const userLocationInput = document.querySelector("#search-location");
const locationForm = document.querySelector("#location-form");
const imageTag = document.querySelector("#nav-logo");
imageTag.src = weatherLogo;
let currentLocationWeatherInfo;

async function getLocationData(locationValue) {
  try {
    const todaysWeather = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${locationValue}`,
      { mode: "cors" }
    );

    const todaysWeatherJson = await todaysWeather.json();
    console.log(todaysWeatherJson);
    const locationInfo = [];
    locationInfo.push(await todaysWeatherJson.location.name);
    locationInfo.push(await todaysWeatherJson.current.temp_c);
    locationInfo.push(await todaysWeatherJson.current.temp_f);
    locationInfo.push(await todaysWeatherJson.current.condition.text);
    locationInfo.push(await todaysWeatherJson.current.condition.text);

    return locationInfo; // will return name, current degreesC, current weather.
    // if I want this result i must get it by using something with "await" such as 'console.log(await getLiveWeather("cardiff"))
  } catch (error) {
    throw new Error(error);
  }
}

locationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (checkInputValidity(userLocationInput.value) === true) {
    const weatherInfo = await getLocationData(userLocationInput.value);
    weatherInfo[4] = weatherInfo[4].replace((/^/, "http:"));
    currentLocationWeatherInfo = new Weather(
      weatherInfo[0],
      weatherInfo[1],
      weatherInfo[2],
      weatherInfo[3],
      weatherInfo[4]
    );
    userLocationInput.setCustomValidity("");
  } else if (checkInputValidity(userLocationInput.value) === false) {
    userLocationInput.setCustomValidity("Please type a place name");
    userLocationInput.addEventListener("input", () => {
      if (checkInputValidity(userLocationInput.value)) {
        userLocationInput.setCustomValidity("");
      } else {
        userLocationInput.setCustomValidity("Please type a place name");
      }
    });
  } else {
    console.error("Something went wrong here...");
  }
});
