"use client"

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import WeatherCard from "@/components/WeatherCard";

const SearchBar = dynamic(() => import("@/components/SearchBar"), { ssr: false });

const CITIES_KEY = "cities_v1";
const DEFAULT_CITIES = ["London", "Delhi", "Mumbai"];

export default function Page() {
  const [cities, setCities] = useState(DEFAULT_CITIES);

  // Load saved cities from localStorage on client only
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CITIES_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length) setCities(arr);
      }
    } catch { }
  }, []);

  // Save to localStorage whenever cities change
  useEffect(() => {
    try {
      localStorage.setItem(CITIES_KEY, JSON.stringify(cities));
    } catch { }
  }, [cities]);

  function removeCity(name) {
    setCities(cities.filter((c) => c.toLowerCase() !== (name || "").toLowerCase()));
  }

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 text-gray-900">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-sky-700">🌤 Weather Dashboard</h1>
        <p className="text-slate-500 mt-2">
          Current weather + 5-day forecasts. Add cities to track.
        </p>
      </header>

      {/* Client-only SearchBar */}
      <div className="mb-8 flex justify-center">
        <SearchBar cities={cities} setCities={setCities} />
      </div>

      {/* Weather Cards */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((c) => (
          <WeatherCard key={c} city={c} onRemove={removeCity} />
        ))}
      </section>
    </main>
  );
}
