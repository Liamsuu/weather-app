export default class Weather {
  constructor(location, degreeC, degreeF, weatherCondition, weatherLogo) {
    this.location = location;
    this.degreeC = degreeC;
    this.degreeF = degreeF;
    this.weatherCondition = weatherCondition;
    this.weatherLogo = weatherLogo;
    this.humidity = "";
    this.wind_mph = "";
    this.uv = ""; // these bottom 3 will be updated with functions as not all weathers need them here.
  }

  setHumiditty(humidityValue) {
    this.humidity = humidityValue;
  }

  setWindMph(windValue) {
    this.wind_mph = windValue;
  }

  setUv(uvValue) {
    this.uv = uvValue;
  }
}
