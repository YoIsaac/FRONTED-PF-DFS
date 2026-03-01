"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function Clima() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    apiFetch('/external/weather')
      .then(data => setWeather(data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Clima Actual</h1>
      {weather && (
        <div>
          <p>Ciudad: {weather.city}</p>
          <p>Temperatura: {weather.weather.temperature}°C</p>
          <p>Viento: {weather.weather.windspeed} km/h</p>
        </div>
      )}
    </div>
  );
}