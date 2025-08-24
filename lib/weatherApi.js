// lib/weatherApi.js
const BASE = "https://api.openweathermap.org/data/2.5";
const CACHE_KEY = "weatherCache_v1";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}
function writeCache(obj) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  } catch { }
}

export async function fetchWeather(city) {
  // accept string or object like { name: "London" }
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const cityName = typeof city === "string" ? city : city?.name;
  if (!cityName) throw new Error("City name is required");

  const key = cityName.toLowerCase();
  const now = Date.now();
  const cache = readCache();
  const hit = cache[key];
  if (hit && now - hit.ts < CACHE_TTL_MS) {
    // console.log("cache hit for", cityName);
    return hit.data;
  }

  const encoded = encodeURIComponent(cityName);
  const currentUrl = `${BASE}/weather?q=${encoded}&appid=${apiKey}&units=metric`;
  const forecastUrl = `${BASE}/forecast?q=${encoded}&appid=${apiKey}&units=metric`;

  // debug logs (remove in production)
  // console.log("Request URLs:", currentUrl, forecastUrl);

  const [resCurrent, resForecast] = await Promise.all([
    fetch(currentUrl),
    fetch(forecastUrl),
  ]);

  const current = await resCurrent.json();
  const forecast = await resForecast.json();

  if (!resCurrent.ok) {
    throw new Error(current?.message || "Failed to fetch current weather");
  }
  if (!resForecast.ok) {
    throw new Error(forecast?.message || "Failed to fetch forecast");
  }

  const combined = { current, forecast };
  cache[key] = { ts: now, data: combined };
  writeCache(cache);

  return combined;
}
