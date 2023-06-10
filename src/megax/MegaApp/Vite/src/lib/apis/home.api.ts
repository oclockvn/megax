import { Forecast } from "../models/home.model";
import api from "./axios.instance";

export async function fetchWeatherForecast() {
  const response = await api.get<Forecast[]>("/api/weatherforecast");

  return response.data;
}
