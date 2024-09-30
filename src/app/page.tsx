"use client";

import { useEffect, useState } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Droplet,
  Thermometer,
} from "lucide-react";

type Weather = {
  lat: string;
  lon: string;
  elevation: number;
  timezone: string;
  units: string;
  current: {
    icon: string;
    icon_num: number;
    summary: string;
    temperature: number;
    wind: {
      speed: number;
      angle: number;
      dir: string;
    };
    precipitation: {
      total: number;
      type: string;
    };
    cloud_cover: number;
  };
  hourly: null | any;
  daily: null | any;
};

const weatherIcons: { [key: string]: any } = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
};

export default function WeatherApp() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState<string | null>(null);
  const location = "Amsterdam";

  const getWeather = async () => {
    const place_id = "amsterdam";
    const apiKey = "t0jfawpj2p8oy1qie7wutvb6ht9me0mz1pkvxr6w";
    const sections = "current";
    const timezone = "UTC";
    const units = "metric";

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
    if (temp > 28) {
      return "Naakt is prima, maar korte broek en t-shirt is ook goed";
    } else if (temp > 20) {
      return "Korte broek en t-shirt";
    } else if (temp > 17) {
      return "Lange broek en t-shirt";
    } else if (temp > 14) {
      return "Lange broek en trui";
    } else {
      return "Lange broek en jas";
    }
  };

  const getWeatherIcon = () => {
    if (!weather || !weather.current) return Sun;
    const summary = weather.current.summary.toLowerCase();
    if (summary.includes("rain")) return CloudRain;
    if (summary.includes("snow")) return CloudSnow;
    if (summary.includes("cloud")) return Cloud;
    return Sun;
  };

  const getBackgroundClass = () => {
    if (!weather || !weather.current) return "from-blue-400 to-blue-200";
    const summary = weather.current.summary.toLowerCase();
    if (summary.includes("rain")) return "from-gray-400 to-blue-300";
    if (summary.includes("snow")) return "from-gray-100 to-blue-100";
    if (summary.includes("cloud")) return "from-gray-300 to-blue-200";
    return "from-yellow-200 to-blue-400";
  };

  if (error) {
    return (
      <div className="text-center text-red-500 text-xl p-4">Error: {error}</div>
    );
  }

  if (!weather) {
    return (
      <div className="text-center text-gray-500 text-xl p-4">Loading...</div>
    );
  }

  const WeatherIcon = getWeatherIcon();

  return (
    <main
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${getBackgroundClass()} transition-all duration-1000`}
    >
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-8 max-w-2xl w-full mx-4">
        <h1 className="text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white mb-4 text-center">
          Welke kleren zou ik aandoen?
        </h1>
        <h2 className="text-center text-white text-2xl mb-8">
          Gebaseerd op: {location}
        </h2>

        <div className="flex justify-center mb-8">
          <WeatherIcon className="w-32 h-32 text-white" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center justify-center">
            <Thermometer className="w-8 h-8 text-white mr-2" />
            <p className="text-white text-xl">
              <span className="font-bold">Temperatuur: </span>
              {weather.current.temperature} °C
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Droplet className="w-8 h-8 text-white mr-2" />
            <p className="text-white text-xl">
              <span className="font-bold">Kans op regen: </span>
              {weather.current.precipitation.total}% (
              {weather.current.precipitation.type})
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Wind className="w-8 h-8 text-white mr-2" />
            <p className="text-white text-xl">
              <span className="font-bold">Wind: </span>
              {weather.current.wind.speed} m/s ({weather.current.wind.dir})
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Cloud className="w-8 h-8 text-white mr-2" />
            <p className="text-white text-xl">
              <span className="font-bold">Bewolking: </span>
              {weather.current.cloud_cover}%
            </p>
          </div>
        </div>

        <p className="text-white text-xl font-bold text-center mb-4">
          Weersomstandigheden:{" "}
          <span className="font-normal">{weather.current.summary}</span>
        </p>

        <div className="bg-white bg-opacity-30 rounded-lg p-6 mt-8">
          <p className="text-white text-2xl font-bold text-center mb-2">
            Aanbevolen kleding:
          </p>
          <p className="text-white text-xl text-center">{getClothes()}</p>
        </div>
      </div>
    </main>
  );
}
