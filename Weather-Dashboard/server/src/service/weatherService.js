import dotenv from 'dotenv';
dotenv.config();
// Weather Object Class
class Weather {
    constructor(city, country, description, temperature, feelsLike, humidity, windSpeed) {
        this.city = city;
        this.country = country;
        this.description = description;
        this.temperature = temperature;
        this.feelsLike = feelsLike;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
    }
}
// Weather Service Class
export class WeatherService {
    constructor(cityName) {
        this.baseURL = 'https://api.openweathermap.org/data/2.5'; // Set default if env not available
        this.apiKey = process.env.WEATHER_API_KEY || 'e685f88ec6c82051e4253e3d7ee91831';
        this.cityName = cityName;
    }
    async fetchLocationData(query) {
        const response = await fetch(`${this.baseURL}/weather?q=${encodeURIComponent(query)}&appid=${this.apiKey}&units=metric`);
        if (!response.ok) {
            console.log(`could not fetch location data`);
            return [];
        }
        else {
            const coordinates = await response.json();
            return coordinates;
        }
    }
    destructureLocationData(locationData) {
        try {
            const lat = locationData[0].lat;
            const lon = locationData[0].lon;
            return { lat: lat, lon: lon };
        }
        catch (error) {
            console.error('location not found');
            this.cityName = 'location not found';
            return { lat: 90, lon: 0 };
        }
    }
    buildGeocodeQuery() {
        return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=5&appid=${this.apiKey}`;
    }
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly&appid=${this.apiKey}&units=metric`;
    }
    async fetchAndDestructureLocationData() {
        return this.destructureLocationData(await this.fetchLocationData(this.buildGeocodeQuery()));
    }
    async fetchWeatherData(coordinates) {
        const currentWeather = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?${this.buildWeatherQuery(coordinates)}`)).json();
        const forecast = await (await fetch(`https://api.openweathermap.org/data/2.5/forecast?${this.buildWeatherQuery(coordinates)}`)).json();
        return { currentWeather: currentWeather, forecast: forecast };
    }
    parseCurrentWeather(response) {
        const current = response;
        let name;
        if (this.cityName === `location not found`) {
            name = `location not found, here's the weather for Orlando, FL instead`;
        }
        else {
            name = response.name;
        }
        return new Weather(name, `${(new Date()).toDateString()}`, current.weather[0].description, current.main.temp, current.main.feels_like, current.main.humidity, current.wind.speed);
    }
    parseForecast(response) {
        const forecast = response.list;
        const weatherArray = [];
        for (let i = 0; i < forecast.length; i += 8) {
            const weather = forecast[i];
            const date = new Date(weather.dt * 1000);
            const weatherObj = new Weather(this.cityName, date.toDateString(), weather.weather[0].description, weather.main.temp, weather.main.feels_like, weather.main.humidity, weather.wind.speed);
            weatherArray.push(weatherObj);
        }
        return weatherArray;
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(currentWeather, weatherData) {
        const weatherArray = [currentWeather];
        weatherArray.push(...weatherData);
        return weatherArray;
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(_city) {
        try {
            const locationData = await this.fetchAndDestructureLocationData();
            const combinedWeatherData = await this.fetchWeatherData(locationData);
            const current = this.parseCurrentWeather(combinedWeatherData.currentWeather);
            const forecast = this.parseForecast(combinedWeatherData.forecast);
            const weather = this.buildForecastArray(current, forecast);
            return weather;
        }
        catch (error) {
            console.error(`there was an error getting weather data`);
            return;
        }
    }
}
export default {
    createWeatherService(cityName) {
        return new WeatherService(cityName);
    }
};
