import React from 'react';
import type { WeatherData, Units } from '../types/weather';
import { getWeatherIcon, formatTemperature, getCurrentDateTime } from '../utils/weatherUtils';

interface WeatherCardProps {
  weather: WeatherData;
  units: Units;
  onToggleFavorite: (weather: WeatherData) => void;
  isFavorite: boolean;
  onShare: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  units,
  onToggleFavorite,
  isFavorite,
  onShare,
}) => {
  const { date, time } = getCurrentDateTime(weather.timezone);

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div className="location">
          <h2 className="city-name">{weather.name}</h2>
          <p className="country">{weather.sys.country}</p>
          <div className="date-time">
            <p className="date">{date}</p>
            <p className="time">{time}</p>
          </div>
        </div>
        <div className="weather-actions">
          <button
            onClick={() => onToggleFavorite(weather)}
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button onClick={onShare} className="share-btn" title="Share weather">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>
        <div className="weather-icon">
          <img
            src={getWeatherIcon(weather.weather[0].icon)}
            alt={weather.weather[0].description}
          />
        </div>
      </div>

      <div className="temperature">
        <span className="temp-value">{Math.round(weather.main.temp)}</span>
        <span className="temp-unit">{units === 'metric' ? '°C' : '°F'}</span>
      </div>

      <div className="weather-description">
        <p className="condition">{weather.weather[0].main}</p>
        <p className="description">{weather.weather[0].description}</p>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <div className="detail-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="detail-content">
            <p className="detail-label">Feels like</p>
            <p className="detail-value">{formatTemperature(weather.main.feels_like, units)}</p>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 19a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8z"></path>
              <path d="M12 6v6l4 2"></path>
            </svg>
          </div>
          <div className="detail-content">
            <p className="detail-label">Humidity</p>
            <p className="detail-value">{weather.main.humidity}%</p>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"></path>
              <path d="M9.6 4.6A2 2 0 1 1 11 8H2"></path>
              <path d="M12.6 19.4A2 2 0 1 0 14 16H2"></path>
            </svg>
          </div>
          <div className="detail-content">
            <p className="detail-label">Wind Speed</p>
            <p className="detail-value">{weather.wind.speed} {units === 'metric' ? 'm/s' : 'mph'}</p>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </div>
          <div className="detail-content">
            <p className="detail-label">Pressure</p>
            <p className="detail-value">{weather.main.pressure} hPa</p>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <div className="detail-content">
            <p className="detail-label">Visibility</p>
            <p className="detail-value">{(weather.visibility / 1000).toFixed(1)} km</p>
          </div>
        </div>
      </div>
    </div>
  );
};