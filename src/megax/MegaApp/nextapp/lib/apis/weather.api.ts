import api from "../api";
import { WeatherForecast } from "../models/weather.model";
import { delay } from "../util";

// import api from "@/lib/api"
export async function fetchWeatherForecast() {
  await delay(2000);
  const response = await api.get<WeatherForecast[]>("/api/weatherforecast");
  return response.data;
}
