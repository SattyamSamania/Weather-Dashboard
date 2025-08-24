"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchWeather } from "@/lib/weatherApi";

export default function SearchBar({ cities, setCities }) {
    const [cityName, setCityName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddCity = async () => {
        if (!cityName.trim()) return;
        setError("");
        setLoading(true);

        try {
            // Check if city already exists
            if (cities.some((c) => c === cityName.trim())) {
                setError("City already added");
                return;
            }

            // Validate city by calling API
            await fetchWeather(cityName.trim());

            // If success, add city name (WeatherCard will fetch details)
            setCities([...cities, cityName.trim()]);
            setCityName("");
        } catch (err) {
            setError("City not found");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full max-w-md">
            <div className="flex gap-2">
                <Input
                    type="text"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="Enter city name..."
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && handleAddCity()}
                />
                <Button onClick={handleAddCity} disabled={loading}>
                    {loading ? "Adding..." : "Add"}
                </Button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
