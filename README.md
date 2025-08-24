# Weather Dashboard Frontend

A **Next.js + Tailwind CSS** frontend for a Weather Dashboard app.  
Displays current weather and 5-day forecasts for multiple cities with features like city search, autocomplete suggestions, and user preferences.

---

## **Features**

- Display **current weather** and 5-day forecasts for multiple cities.
- **Add/remove favorite cities**.
- **Responsive design** using Tailwind CSS.
- Integration-ready with a backend API for:
  - Weather data
  - User preferences
  - Cached city list

---

## **Tech Stack**

- **Frontend:** Next.js 13 (App Router)
- **Styling:** Tailwind CSS
- **State Management:** React `useState` & `useEffect`
- **API Integration:** RESTful calls to backend (e.g., weather service)

---

## **Installation**

1. Clone the repository:

```bash
git clone https://github.com/<username>/weather-dashboard.git
cd weather-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Create .env.local file in the root with your API keys:

```bash
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
```

4. Run the development server:

```bash
npm run dev
```

Open http://localhost:3000
in your browser.
