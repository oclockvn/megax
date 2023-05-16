"use client";
// const fetchWeatherData = async () => {
//   const res = await fetch('http://localhost:3000/api/weatherforecast')
//   const data = res.json()
//   console.log(data)

//   return data
// }
import axios from "axios";
import { useEffect, useState } from "react";

const AboutPage = () => {
  const [weather, setWeather] = useState([]);
  useEffect(() => {
    async function fetchWeather() {
      const res = await axios("/api/weatherforecast");
      setWeather(res.data);
    }

    fetchWeather();
  }, []);

  // const weather = await fetchWeatherData();

  return (
    <>
      <h2>About us</h2>
      {weather.map((x: { date: string; summary: string }, index: number) => (
        <div key={index}>
          {x.date} - {x.summary}
        </div>
      ))}
    </>
  );
};

export default AboutPage;
