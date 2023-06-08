import client from "../api";
import { WeatherForecast } from "../models/weather.model";
import { delay } from "../util";

// import api from "@/lib/api"
export async function fetchWeatherForecast() {
  await delay(2000);
  const response = await client.get<WeatherForecast[]>("/be/weatherforecast");
  return response.data;
}
