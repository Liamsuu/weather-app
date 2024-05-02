import "./style.css";
import weatherLogo from "./logo.png";

const WEATHER_API_KEY = "5ecc5123eac74a06bad220316243004";
const userLocationInput = document.querySelector("input"); // change to id of input after
const navBar = document.querySelector("nav");
const logo = new Image();
logo.src = weatherLogo;
logo.id = "nav-logo";
navBar.appendChild(logo);

async function getLiveWeather(locationValue) {
  try {
    const todaysWeather = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${locationValue}`,
      { mode: "cors" }
    );

    const todaysWeatherJson = await todaysWeather.json();
    console.log(todaysWeatherJson);
    return todaysWeatherJson.current.condition.text;
    // if I want this result i must get it by using something with "await" such as 'console.log(await getLiveWeather("cardiff"))
  } catch (error) {
    throw new Error(error);
  }
}

// function getuserInput() {}
