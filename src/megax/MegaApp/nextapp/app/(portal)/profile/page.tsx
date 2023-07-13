"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { fetchWeatherForecastThunk } from "@/lib/store/weather.state";
import { useEffect } from "react";

export default function ProfilePage() {
  const appDispatch = useAppDispatch();
  const { weatherForecast: weather, loading } = useAppSelector(s => s.weather);

  useEffect(() => {
    appDispatch(fetchWeatherForecastThunk());
  }, []);

  return (
    <>
      {loading && <div>Loading...</div>}
      {weather &&
        weather.map((x: { date: string; summary: string }) => (
          <div>
            {x.date} - {x.summary}
          </div>
        ))}
      <h2>Profile</h2>
    </>
  );
}
