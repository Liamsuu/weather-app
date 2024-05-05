import "./style.css";
import weatherLogo from "./logo.svg"; // maybe change logo after to something that fits
import changeUnitLogo from "./rotate-left.svg";
import github from "./github.svg";
import Weather from "../components/weather";
import Forecast from "../components/forecast";
import checkInputValidity from "../components/checkValidity";

const WEATHER_API_KEY = "5ecc5123eac74a06bad220316243004";
const userLocationInput = document.querySelector("#search-location");
const locationForm = document.querySelector("#location-form");
const imageTag = document.querySelector("#nav-logo");
const githubFooter = document.querySelector("#github-footer");
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
const dayTwoChangeUnitImage = document.querySelector(
  "#day-two-temp-unit-image"
);
const dayThreeChangeUnitImage = document.querySelector(
  "#day-three-temp-unit-image"
);
const dayFourChangeUnitImage = document.querySelector(
  "#day-four-temp-unit-image"
);

// used for adding text content
const secondDayWrapper = document.querySelector("#day_two_temp");
const thirdDayWrapper = document.querySelector("#day_three_temp");
const fourthDayWrapper = document.querySelector("#day_four_temp");

const changeUnitImg = new Image();
changeUnitImg.src = changeUnitLogo;
changeTempUnitElem.src = changeUnitImg.src;
dayTwoChangeUnitImage.src = changeUnitImg.src;
dayThreeChangeUnitImage.src = changeUnitImg.src;
dayFourChangeUnitImage.src = changeUnitImg.src;

// this is just the github icon the footer
const githubLogo = new Image();
githubLogo.src = github; // this is just the imported image name above.
githubFooter.src = githubLogo.src;
githubFooter.addEventListener("click", () => {
  window.location.href = "https://github.com/Liamsuu";
});

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

// Used to get JSON for the next three days average temperatures and their dates, and will assign them to an array or array so each day can be turned into Forecast object later more easily.
async function getForecast(locationValue) {
  try {
    const forecastWeather = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${locationValue}&days=4&aqi=no&alerts=no`,
      { mode: "cors" }
    );
    const forecastWeatherJson = await forecastWeather.json();
    console.log(forecastWeatherJson);
    const locationForecastInfo = [[], [], []];
    // 1st day forecast(future weather).
    locationForecastInfo[0].push(
      await forecastWeatherJson.forecast.forecastday[1].date
    );
    locationForecastInfo[0].push(
      await forecastWeatherJson.forecast.forecastday[1].day.avgtemp_c
    );
    locationForecastInfo[0].push(
      await forecastWeatherJson.forecast.forecastday[1].day.avgtemp_f
    );
    // 2nd day forecast(future weather)
    locationForecastInfo[1].push(
      await forecastWeatherJson.forecast.forecastday[2].date
    );
    locationForecastInfo[1].push(
      await forecastWeatherJson.forecast.forecastday[2].day.avgtemp_c
    );
    locationForecastInfo[1].push(
      await forecastWeatherJson.forecast.forecastday[2].day.avgtemp_f
    );
    locationForecastInfo[2].push(
      await forecastWeatherJson.forecast.forecastday[3].date
    );
    locationForecastInfo[2].push(
      await forecastWeatherJson.forecast.forecastday[3].day.avgtemp_c
    );
    locationForecastInfo[2].push(
      await forecastWeatherJson.forecast.forecastday[3].day.avgtemp_f
    );

    return locationForecastInfo;
  } catch (error) {
    throw new Error(error);
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

// Used to add forecast temperatures and dates in the third box
function addForecastInfo() {
  secondDayWrapper.firstElementChild.textContent = tomorrowsWeatherInfo.date;
  secondDayWrapper.firstElementChild.nextElementSibling.firstElementChild.textContent = `Average Temperature: ${tomorrowsWeatherInfo.degreeC}`;
  thirdDayWrapper.firstElementChild.textContent =
    dayAfterTomorrowWeatherInfo.date;
  thirdDayWrapper.firstElementChild.nextElementSibling.firstElementChild.textContent = `Average Temperature: ${dayAfterTomorrowWeatherInfo.degreeC}`;
  fourthDayWrapper.firstElementChild.textContent = finalDayWeatherInfo.date;
  fourthDayWrapper.firstElementChild.nextElementSibling.firstElementChild.textContent = `Average Temperature: ${finalDayWeatherInfo.degreeC}`;

  dayTwoChangeUnitImage.onclick = () => {
    if (
      secondDayWrapper.firstElementChild.nextElementSibling.firstElementChild
        .textContent === `Average Temperature: ${tomorrowsWeatherInfo.degreeC}`
    ) {
      secondDayWrapper.firstElementChild.nextElementSibling.firstElementChild.textContent = `Average Temperature: ${tomorrowsWeatherInfo.degreeF}`;
    } else if (
      secondDayWrapper.firstElementChild.nextElementSibling.firstElementChild
        .textContent === `Average Temperature: ${tomorrowsWeatherInfo.degreeF}`
    ) {
      secondDayWrapper.firstElementChild.nextElementSibling.firstElementChild.textContent = `Average Temperature: ${tomorrowsWeatherInfo.degreeC}`;
    }
  };

  // day3one click here check if
  dayThreeChangeUnitImage.onclick = () => {
    if (
      thirdDayWrapper.firstElementChild.nextElementSibling.firstElementChild
        .textContent ===
      `Average Temperature: ${dayAfterTomorrowWeatherInfo.degreeC}`
    ) {
      thirdDayWrapper.firstElementChild.nextElementSibling.firstElementChild.textContent = `Average Temperature: ${dayAfterTomorrowWeatherInfo.degreeF}`;
    } else if (
      thirdDayWrapper.firstElementChild.nextElementSibling.firstElementChild
        .textContent ===
      `Average Temperature: ${dayAfterTomorrowWeatherInfo.degreeF}`
    ) {
      thirdDayWrapper.firstElementChild.nextElementSibling.firstElementChild.textContent = `Average Temperature: ${dayAfterTomorrowWeatherInfo.degreeC}`;
    }
  };

  dayFourChangeUnitImage.onclick = () => {
    if (
      fourthDayWrapper.firstElementChild.nextElementSibling.firstElementChild
        .textContent === `Average Temperature: ${finalDayWeatherInfo.degreeC}`
    ) {
      fourthDayWrapper.firstElementChild.nextElementSibling.firstElementChild.textContent = `Average Temperature: ${finalDayWeatherInfo.degreeF}`;
    } else if (
      fourthDayWrapper.firstElementChild.nextElementSibling.firstElementChild
        .textContent === `Average Temperature: ${finalDayWeatherInfo.degreeF}`
    ) {
      fourthDayWrapper.firstElementChild.nextElementSibling.firstElementChild.textContent = `Average Temperature: ${finalDayWeatherInfo.degreeC}`;
    }
  };
}

function setCurrentWeather(infoHolder) {
  currentLocationWeatherInfo = new Weather(
    infoHolder[0],
    infoHolder[1],
    infoHolder[2],
    infoHolder[3],
    infoHolder[4]
  );

  // these are not in the constructor as they are not needed for forecasts, so are set individually. EDIT: Forecasts now have their own class so it was not needed to do it this way, but oh well no point changing it now.
  currentLocationWeatherInfo.setHumiditty(infoHolder[5]);
  currentLocationWeatherInfo.setWindMph(infoHolder[6]);
  currentLocationWeatherInfo.setUv(infoHolder[7]);

  currentLocationWeatherInfo.weatherLogo = `https:${currentLocationWeatherInfo.weatherLogo}`; // it's not originally a https link
  currentLocationWeatherInfo.degreeC = `${currentLocationWeatherInfo.degreeC}\u00B0 C`;
  currentLocationWeatherInfo.degreeF = `${currentLocationWeatherInfo.degreeF}\u00B0 F`;
}

function setForecastWeather(infoHolder) {
  tomorrowsWeatherInfo = new Forecast(
    infoHolder[0][0],
    infoHolder[0][1],
    infoHolder[0][2]
  );
  dayAfterTomorrowWeatherInfo = new Forecast(
    infoHolder[1][0],
    infoHolder[1][1],
    infoHolder[1][2]
  );
  finalDayWeatherInfo = new Forecast(
    infoHolder[2][0],
    infoHolder[2][1],
    infoHolder[2][2]
  );

  tomorrowsWeatherInfo.degreeC = `${tomorrowsWeatherInfo.degreeC}\u00B0 C`;
  tomorrowsWeatherInfo.degreeF = `${tomorrowsWeatherInfo.degreeF}\u00B0 F`;
  dayAfterTomorrowWeatherInfo.degreeC = `${dayAfterTomorrowWeatherInfo.degreeC}\u00B0 C`;
  dayAfterTomorrowWeatherInfo.degreeF = `${dayAfterTomorrowWeatherInfo.degreeF}\u00B0 F`;
  finalDayWeatherInfo.degreeC = `${finalDayWeatherInfo.degreeC}\u00B0 C`;
  finalDayWeatherInfo.degreeF = `${finalDayWeatherInfo.degreeF}\u00B0 F`;
}

// Checks input box was submitted with correct rejex, if not it will keep validating everytime the input field is changed,
// if correct then submit button will work again. The error will catch whether or not the API finds a place with that name
locationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (checkInputValidity(userLocationInput.value) === true) {
    try {
      const weatherInfo = await getLocationData(userLocationInput.value);
      const forecastInfo = await getForecast(userLocationInput.value);

      setCurrentWeather(weatherInfo);
      setForecastWeather(forecastInfo);
      addFirstSectionInfo();
      addAdditionalInfo();
      addForecastInfo();

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
  const initialForecastValues = await getForecast("london");
  setCurrentWeather(initialLocationValues);
  setForecastWeather(initialForecastValues);
  addFirstSectionInfo();
  addAdditionalInfo();
  addForecastInfo();
});
