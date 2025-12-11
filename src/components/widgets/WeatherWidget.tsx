import { useState, useEffect } from "react";
import axios from "axios";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "";
  const CITY = "Baku";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
        );
        setWeather(response.data);
        setError("");
      } catch (err: any) {
        console.error("Weather fetch error:", err);
        setWeather({
          name: "Baku",
          main: {
            temp: 22,
            feels_like: 23,
            humidity: 65,
          },
          weather: [{ main: "Clear", description: "clear sky" }],
        });
        setError("Using fallback data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !weather) {
    return <div className="p-4">Loading weather...</div>;
  }

  if (!weather) {
    return <div className="p-4 text-red-500">Failed to load weather</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">Weather</h3>
      </div>
      {error && <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-2">{error}</p>}
      <div className="space-y-2">
        <div className="text-2xl font-bold">{weather.name}</div>
        <div className="text-3xl font-bold">
          {Math.round(weather.main.temp)}°C
        </div>
        <div className="text-gray-600 dark:text-gray-300 capitalize">
          {weather.weather[0].description}
        </div>
        <div className="flex justify-between text-sm mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <span className="text-gray-500 dark:text-gray-300">Feels like:</span>
            <span className="ml-2">
              {Math.round(weather.main.feels_like)}°C
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-300">Humidity:</span>
            <span className="ml-2">{weather.main.humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
