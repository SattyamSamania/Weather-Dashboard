"use client";

import { useEffect, useState } from "react";
import { fetchWeather } from "@/lib/weatherApi";

const CACHE_KEY_PREFIX = "weather_v1_"; // Cache per city
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export default function WeatherCard({ city, onRemove }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        // Check localStorage cache first
        const cacheRaw = localStorage.getItem(
          CACHE_KEY_PREFIX + city.toLowerCase()
        );
        if (cacheRaw) {
          const cache = JSON.parse(cacheRaw);
          if (Date.now() - cache.timestamp < CACHE_TTL) {
            if (!cancelled) {
              setData(cache.data);
              setLoading(false);
              return;
            }
          }
        }

        // Fetch fresh data
        const res = await fetchWeather(city);

        if (!cancelled) {
          setData(res);
          setLoading(false);
          setError(null);
          // Save to cache
          localStorage.setItem(
            CACHE_KEY_PREFIX + city.toLowerCase(),
            JSON.stringify({ data: res, timestamp: Date.now() })
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setData(null);
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [city]);

  // Weekday labels
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (loading) {
    return (
      <div className="rounded-2xl p-6 bg-slate-100/80 text-slate-900 shadow-md animate-pulse">
        <p>Loading {city}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-6 bg-red-100/80 text-red-700 shadow-md">
        <div className="flex justify-between items-center">
          <span>
            {city} – {error}
          </span>
          <button
            onClick={() => onRemove(city)}
            className="ml-2 text-red-800 hover:text-red-900 font-bold"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  const { current, forecast } = data;

  return (
    <div className="relative rounded-2xl p-6 bg-gradient-to-br from-blue-400 via-sky-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">{current.name}</h2>
        <button
          onClick={() => onRemove(city)}
          className="ml-2 text-white hover:text-gray-200 font-bold"
        >
          ✕
        </button>
      </div>

      {/* Current Weather */}
      <p className="text-2xl font-semibold">
        {Math.round(current.main.temp)}°C
      </p>
      <p className="capitalize">{current.weather[0].description}</p>

      {/* 5-day Forecast */}
      <div className="mt-4 grid grid-cols-5 gap-2 text-center text-sm">
        {forecast.list
          .filter((_, i) => i % 8 === 0)
          .slice(0, 5)
          .map((item) => {
            const d = new Date(item.dt_txt);
            const day = days[d.getUTCDay()];
            return (
              <div
                key={item.dt}
                className="bg-white/20 rounded-lg p-2 backdrop-blur-sm"
              >
                <div className="font-semibold">{day}</div>
                <div>{Math.round(item.main.temp)}°</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
