import "./style.css";
import weatherLogo from "./logo.png"; // maybe change logo after to something that fits
import Weather from "../components/weather";
import checkInputValidity from "../components/checkValidity";

const WEATHER_API_KEY = "5ecc5123eac74a06bad220316243004";
const userLocationInput = document.querySelector("#search-location");
const locationForm = document.querySelector("#location-form");
const imageTag = document.querySelector("#nav-logo");
const locTitleWrapper = document.querySelector("#location-title-wrapper"); // use the h1 inside this(its first child).
const weatherTempWrapper = document.querySelector("#temp-wrapper"); // use the p for temp, and img will be a icon that when clicked will change the temp from C to F temp unit.
const weatherConditionWrapper = document.querySelector(
  "#weather-condition-wrapper"
);

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
    locationInfo.push(await todaysWeatherJson.current.condition.icon);

    return locationInfo; // will return name, current degreesC, current weather.
    // if I want this result i must get it by using something with "await" such as 'console.log(await getLiveWeather("cardiff"))
  } catch (error) {
    throw new Error(error);
  }
}

function addFirstSectionInfo() {
  locTitleWrapper.firstChild.nextSibling.textContent =
    currentLocationWeatherInfo.location;
  weatherTempWrapper.firstChild.nextSibling.textContent =
    currentLocationWeatherInfo.degreeC;
  weatherConditionWrapper.firstChild.nextSibling.textContent =
    currentLocationWeatherInfo.weatherCondition;
}

function setCurrentWeather(infoHolder) {
  currentLocationWeatherInfo = new Weather(
    infoHolder[0],
    infoHolder[1],
    infoHolder[2],
    infoHolder[3],
    infoHolder[4]
  );
}

locationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (checkInputValidity(userLocationInput.value) === true) {
    try {
      const weatherInfo = await getLocationData(userLocationInput.value);
      weatherInfo[4] = weatherInfo[4].replace((/^/, "http:"));

      setCurrentWeather(weatherInfo);
      addFirstSectionInfo();

      console.log(currentLocationWeatherInfo);
      userLocationInput.setCustomValidity("");
    } catch (error) {
      console.error(error);
    }
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

// add initial values when website is loaded.
window.addEventListener("load", async () => {
  const initialLocationValues = await getLocationData("london");
  setCurrentWeather(initialLocationValues);
  addFirstSectionInfo();
});
