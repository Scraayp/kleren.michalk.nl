"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const location = "Amsterdam"; // Set your location name here

  const getWeather = async () => {
    const place_id = "amsterdam"; // Replace with your place_id or lat/lon
    const apiKey = process.env.API_KEY; // Replace with your API key
    const sections = "current"; // Define the sections you need
    const timezone = "UTC"; // Adjust the timezone if needed
    const units = "metric"; // "metric" or "imperial"

    try {
      const response = await fetch(
        `https://www.meteosource.com/api/v1/free/point?place_id=${place_id}&sections=${sections}&timezone=${timezone}&units=${units}&key=${apiKey}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      console.log(data);
      setWeather(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  const getClothes = () => {
    if (!weather || !weather.current) return "Loading...";
    const temp = weather.current.temperature;
    if (temp > 20) {
      return "Korte broek en t-shirt";
    } else {
      return "Lange broek en trui";
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!weather) {
    return <div>Loading...</div>;
  }

  return (
    <main className="">
      <section className="">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <h1 className="text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-black dark:text-white">
            Welke kleren zou ik aandoen?
          </h1>
          <h2 className="text-center dark:text-white text-2xl">
            Gebaseerd op: {location}
          </h2>
        </div>
        <div>
          <p className="text-black dark:text-white text-xl font-bold text-center">
            Temperatuur op dit moment:{" "}
            <span className="font-normal">
              {weather.current.temperature} °C
            </span>
          </p>
          <p className="text-black dark:text-white text-xl font-bold text-center">
            Kans op regen:{" "}
            <span className="font-normal">
              {weather.current.precipitation.total} % (
              {weather.current.precipitation.type})
            </span>
          </p>
          <p className="text-black dark:text-white text-xl font-bold text-center">
            Weersomstandigheden:{" "}
            <span className="font-normal">{weather.current.summary}</span>
          </p>

          <p className="text-black dark:text-white text-xl font-bold text-center mt-20">
            Kleren:
            <br />
            <span className="font-normal">{getClothes()}</span>
          </p>
        </div>
      </section>
    </main>
  );
}
