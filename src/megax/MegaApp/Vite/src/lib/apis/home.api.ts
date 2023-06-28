import { Forecast } from "../models/home.model";
import api from "./api";

export async function fetchWeatherForecast() {
  const response = await api.get<Forecast[]>("/api/weatherforecast");
  return response.data;
}
