import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const WEATHER_ICONS = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '⛅',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

const WeatherWidget = ({ city, compact = false }) => {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (city && user) {
      setLoading(true);
      setError('');
      axios.get(`/api/weather/${encodeURIComponent(city)}`)
        .then(r => setWeather(r.data))
        .catch(() => setError('Weather unavailable'))
        .finally(() => setLoading(false));
    }
  }, [city, user]);

  if (!user || !city) return null;
  if (loading) return <div style={{ padding: '10px 16px', background: 'var(--surface)', borderRadius: 10, fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 16, height: 16, border: '2px solid var(--border)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />Loading weather...</div>;
  if (error || !weather) return null;

  const icon = WEATHER_ICONS[weather.icon] || '🌤';

  if (compact) return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 13 }}>
      <span>{icon}</span>
      <span>{weather.temp}°C</span>
      <span style={{ color: 'var(--text-muted)' }}>{weather.city}</span>
    </div>
  );

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 36 }}>{icon}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{weather.city}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{weather.description}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[['🌡️ Temp', `${weather.temp}°C`], ['🤔 Feels', `${weather.feels_like}°C`], ['💧 Humidity', `${weather.humidity}%`]].map(([l, v]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold)' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
        💡 <span>{weather.suggestion}</span>
        {weather.mock && <span style={{ fontSize: 11, opacity: .6 }}>(demo data)</span>}
      </div>
    </div>
  );
};

export default WeatherWidget;
