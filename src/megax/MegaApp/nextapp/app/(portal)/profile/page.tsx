"use client";

import client from "@/lib/api";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [weather, setWeather] = useState([]);
  useEffect(() => {
    async function fetchWeather() {
      const res = await client.get("/be/weatherforecast");
      setWeather(res.data);
    }

    fetchWeather();
  }, []);
  return (
    <>
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
