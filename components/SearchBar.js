"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchWeather } from "@/lib/weatherApi";

export default function SearchBar({ cities, setCities }) {
    const [cityName, setCityName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    // Fetch city suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (cityName.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const res = await fetch(
                    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
                );
                const data = await res.json();

                const filtered = data.filter(
                    (s) => !cities.some((c) => c.toLowerCase() === s.name.toLowerCase())
                );

                setSuggestions(filtered || []);
            } catch {
                setSuggestions([]);
            }
        };

        const timeout = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeout);
    }, [cityName, cities.join(",")]);


    const handleAddCity = async (city) => {
        const cityLabel = city?.name || cityName.trim();
        if (!cityLabel) return;

        setError("");
        setLoading(true);

        try {
            if (cities.some((c) => c.toLowerCase() === cityLabel.toLowerCase())) {
                setError("City already added");
                return;
            }

            await fetchWeather(cityLabel);
            setCities([...cities, cityLabel]);
            setCityName("");
            setSuggestions([]); // ✅ clear dropdown after selection
        } catch {
            setError("City not found");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full max-w-md relative">
            <div className="flex gap-2">
                <Input
                    type="text"
                    value={cityName}
                    onChange={(e) => {
                        setCityName(e.target.value);
                        if (error) setError("");
                    }}
                    placeholder="Enter city name..."
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && handleAddCity()}
                />
                <Button onClick={() => handleAddCity()} disabled={loading}>
                    {loading ? "Adding..." : "Add"}
                </Button>
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
                <ul className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-md z-10 max-h-48 overflow-auto">
                    {suggestions.map((s, idx) => (
                        <li
                            key={idx}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleAddCity(s)}
                        >
                            {s.name}, {s.state ? s.state + ", " : ""}{s.country}
                        </li>
                    ))}
                </ul>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
