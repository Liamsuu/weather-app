import "./style.css";
import weatherLogo from "./logo.png"; // maybe change logo after to something that fits
import changeUnitLogo from "./rotate-left.svg";
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
const humidityWrapper = document.querySelector("#humidity-wrapper");
const windWrapper = document.querySelector("#wind-wrapper");
const uvWrapper = document.querySelector("#uv-wrapper");

const weatherIconElem = document.querySelector("#weather-icon");
const changeTempUnitElem = document.querySelector("#temp-change-unit");
const changeUnitImg = new Image();
changeUnitImg.src = changeUnitLogo;
changeTempUnitElem.src = changeUnitImg.src;

imageTag.src = weatherLogo;
let currentLocationWeatherInfo;
let tomorrowsWeatherInfo;
let dayAfterTomorrowWeatherInfo;
let finalDayWeatherInfo;

// Takes a string value(name of location), gets the JSON file with information on that places weather for the SAME DAY. Returns an array of information that is needed to be used.
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
    locationInfo.push(await todaysWeatherJson.current.humidity);
    locationInfo.push(await todaysWeatherJson.current.wind_mph);
    locationInfo.push(await todaysWeatherJson.current.uv);

    return locationInfo; // will return name, current degreesC, current weather.
    // if I want this result i must get it by using something with "await" such as 'console.log(await getLiveWeather("cardiff"))
  } catch (error) {
    throw new Error(error); // gets thrown when place name is not found
  }
}

// Adds the temperature and the weather condition(cloudy, rainy, etc) to the FIRST BOX.
function addFirstSectionInfo() {
  locTitleWrapper.firstChild.nextSibling.textContent =
    currentLocationWeatherInfo.location;
  weatherTempWrapper.firstChild.nextSibling.textContent =
    currentLocationWeatherInfo.degreeC;
  weatherConditionWrapper.firstChild.nextSibling.textContent =
    currentLocationWeatherInfo.weatherCondition;
  const weatherImg = new Image();
  weatherImg.src = currentLocationWeatherInfo.weatherLogo;
  weatherIconElem.src = weatherImg.src;
  changeTempUnitElem.onclick = () => {
    if (
      weatherTempWrapper.firstChild.nextSibling.textContent ===
      currentLocationWeatherInfo.degreeC
    ) {
      weatherTempWrapper.firstChild.nextSibling.textContent =
        currentLocationWeatherInfo.degreeF;
    } else {
      weatherTempWrapper.firstChild.nextSibling.textContent =
        currentLocationWeatherInfo.degreeC;
    }
  };
}

// Used to add locations 'extra' information to the second box.
function addAdditionalInfo() {
  humidityWrapper.firstChild.nextSibling.textContent = `Humidity: ${currentLocationWeatherInfo.humidity}%`;
  windWrapper.firstChild.nextSibling.textContent = `Wind: ${currentLocationWeatherInfo.wind_mph} mph`;
  uvWrapper.firstChild.nextSibling.textContent = `Uv Index: ${currentLocationWeatherInfo.uv}`;
}

function setCurrentWeather(infoHolder) {
  currentLocationWeatherInfo = new Weather(
    infoHolder[0],
    infoHolder[1],
    infoHolder[2],
    infoHolder[3],
    infoHolder[4]
  );

  currentLocationWeatherInfo.setHumiditty(infoHolder[5]); // double check its at 5, 6 ,7  indices.
  currentLocationWeatherInfo.setWindMph(infoHolder[6]);
  currentLocationWeatherInfo.setUv(infoHolder[7]);

  currentLocationWeatherInfo.weatherLogo = `https:${currentLocationWeatherInfo.weatherLogo}`; // it's not originally a https link
  currentLocationWeatherInfo.degreeC = `${currentLocationWeatherInfo.degreeC}\u00B0 C`;
  currentLocationWeatherInfo.degreeF = `${currentLocationWeatherInfo.degreeF}\u00B0 F`;
}

// Checks input box was submitted with correct rejex, if not it will keep validating everytime the input field is changed,
// if correct then submit button will work again. The error will catch whether or not the API finds a place with that name
locationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (checkInputValidity(userLocationInput.value) === true) {
    try {
      const weatherInfo = await getLocationData(userLocationInput.value);

      setCurrentWeather(weatherInfo);
      addFirstSectionInfo();
      addAdditionalInfo();

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

// add initial values when website is loaded.(London in this case) - in the future could change it to show based on the IP address location
window.addEventListener("load", async () => {
  const initialLocationValues = await getLocationData("london");
  setCurrentWeather(initialLocationValues);
  addFirstSectionInfo();
  addAdditionalInfo();
});
