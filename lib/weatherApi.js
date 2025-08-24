const CACHE_KEY = "weatherCache_v2";
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
  const cityName = typeof city === "string" ? city : city?.name;
  if (!cityName) throw new Error("City name is required");

  const key = cityName.toLowerCase();
  const now = Date.now();
  const cache = readCache();

  const hit = cache[key];
  if (hit && now - hit.ts < CACHE_TTL_MS) {
    return hit.data;
  }

  const res = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch weather for ${cityName}`);
  }

  const data = await res.json();

  cache[key] = { ts: now, data };
  writeCache(cache);

  return data;
}
