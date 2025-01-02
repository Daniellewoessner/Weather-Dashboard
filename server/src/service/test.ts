import WeatherService from './weatherService';

async function test() {
  const service = WeatherService.createWeatherService('London');
  const data = await service.getWeatherForCity('London');
  console.log('Weather:', data);
}

test();