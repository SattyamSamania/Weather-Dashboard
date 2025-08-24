import { NextResponse } from "next/server";

const BASE = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

const DEFAULT_COUNTRY = "IN";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        let city = searchParams.get("city");

        if (!city) {
            return NextResponse.json({ error: "City name is required" }, { status: 400 });
        }

        city = city.trim();
        const encoded = encodeURIComponent(city);

        const currentUrl = `${BASE}/weather?q=${encoded}&appid=${API_KEY}&units=metric`;
        const forecastUrl = `${BASE}/forecast?q=${encoded}&appid=${API_KEY}&units=metric`;

        let resCurrent = await fetch(currentUrl);
        let resForecast = await fetch(forecastUrl);

        if (resCurrent.status === 404 || resForecast.status === 404) {
            const encodedWithCountry = encodeURIComponent(`${city},${DEFAULT_COUNTRY}`);
            resCurrent = await fetch(
                `${BASE}/weather?q=${encodedWithCountry}&appid=${API_KEY}&units=metric`
            );
            resForecast = await fetch(
                `${BASE}/forecast?q=${encodedWithCountry}&appid=${API_KEY}&units=metric`
            );
        }

        const current = await resCurrent.json();
        const forecast = await resForecast.json();

        if (!resCurrent.ok) {
            return NextResponse.json(
                { error: current?.message || "Failed to fetch current weather" },
                { status: resCurrent.status }
            );
        }

        if (!resForecast.ok) {
            return NextResponse.json(
                { error: forecast?.message || "Failed to fetch forecast" },
                { status: resForecast.status }
            );
        }

        return NextResponse.json({ current, forecast });
    } catch (err) {
        console.error("Weather API Error:", err);
        return NextResponse.json(
            { error: "Unexpected error while fetching weather" },
            { status: 500 }
        );
    }
}
