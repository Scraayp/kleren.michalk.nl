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
  Umbrella,
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
  daily: {
    data: [
      {
        all_day: {
          temperature: number;
          temperature_min: number;
          temperature_max: number;
          wind: {
            speed: number;
            dir: string;
            angle: number;
          };
          precipitation: {
            total: number;
            type: string;
          };
        };
      }
    ];
  };
  hourly: null | any;
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
  const [cityName, setCityName] = useState<string>("Amsterdam"); // Default to Amsterdam
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const getWeather = async (lat: number, lon: number) => {
    const apiKey = "t0jfawpj2p8oy1qie7wutvb6ht9me0mz1pkvxr6w";
    const sections = "current,daily";
    const timezone = "UTC";
    const units = "metric";

    try {
      const response = await fetch(
        `https://www.meteosource.com/api/v1/free/point?lat=${lat}&lon=${lon}&sections=${sections}&timezone=${timezone}&units=${units}&key=${apiKey}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      setWeather(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getUserLocation = async () => {
    try {
      // Using ip-api.com to get lat, lon, and city name from IP
      const response = await fetch("http://ip-api.com/json/");
      const data = await response.json();
      setCityName(data.city);
      setLatitude(data.lat);
      setLongitude(data.lon);
    } catch (err) {
      setError("Failed to fetch location, defaulting to Amsterdam.");
      // Default to Amsterdam if there's an error
      setCityName("Amsterdam");
      setLatitude(52.3676); // Amsterdam latitude
      setLongitude(4.9041); // Amsterdam longitude
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      getWeather(latitude, longitude);
    }
  }, [latitude, longitude]);

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
    if (!weather || !weather.current) return "from-blue-600 to-blue-400";
    const summary = weather.current.summary.toLowerCase();
    if (summary.includes("rain")) return "from-gray-600 to-blue-500";
    if (summary.includes("snow")) return "from-gray-300 to-blue-300";
    if (summary.includes("cloud")) return "from-gray-500 to-blue-400";
    return "from-yellow-400 to-blue-600";
  };

  if (error) {
    return (
      <div className="text-center text-red-600 text-xl p-4 bg-white">
        Error: {error}
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="text-center text-gray-800 text-xl p-4 bg-white">
        Loading...
      </div>
    );
  }

  const WeatherIcon = getWeatherIcon();

  return (
    <main
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${getBackgroundClass()} transition-all duration-1000`}
    >
      <div className="bg-white bg-opacity-90 shadow-lg rounded-xl p-8 max-w-2xl w-full mx-4">
        <h1 className="text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-gray-900 mb-4 text-center">
          Welke kleren zou ik aandoen?
        </h1>
        <h2 className="text-center text-gray-800 text-2xl mb-8">
          Gebaseerd op je huidige locatie: {cityName}
        </h2>

        <div className="flex justify-center mb-8">
          <WeatherIcon className="w-32 h-32 text-gray-800" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Huidige weersituatie
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
            <Thermometer className="w-8 h-8 text-gray-800 mr-2" />
            <p className="text-gray-800 text-xl">
              <span className="font-bold">Temperatuur: </span>
              {weather.current.temperature} °C
            </p>
          </div>
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
            <Droplet className="w-8 h-8 text-gray-800 mr-2" />
            <p className="text-gray-800 text-xl">
              <span className="font-bold">Kans op regen: </span>
              {weather.current.precipitation.total}% (
              {weather.current.precipitation.type})
            </p>
          </div>
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
            <Wind className="w-8 h-8 text-gray-800 mr-2" />
            <p className="text-gray-800 text-xl">
              <span className="font-bold">Wind: </span>
              {weather.current.wind.speed} m/s ({weather.current.wind.dir})
            </p>
          </div>
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
            <Cloud className="w-8 h-8 text-gray-800 mr-2" />
            <p className="text-gray-800 text-xl">
              <span className="font-bold">Bewolking: </span>
              {weather.current.cloud_cover}%
            </p>
          </div>
        </div>

        <p className="text-gray-800 text-xl font-bold text-center mb-4 bg-gray-100 rounded-lg p-4">
          Weersomstandigheden:{" "}
          <span className="font-normal">{weather.current.summary}</span>
        </p>

        <div className="bg-blue-100 rounded-lg p-6 mt-8">
          <p className="text-gray-900 text-2xl font-bold text-center mb-2">
            Aanbevolen kleding:
          </p>
          <p className="text-gray-800 text-xl text-center">{getClothes()}</p>
        </div>
      </div>
    </main>
  );
}
