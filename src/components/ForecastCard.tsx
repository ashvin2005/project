import React from 'react';
import type { ForecastData, Units } from '../types/weather';
import { getWeatherIcon, formatTemperature, formatDate } from '../utils/weatherUtils';

interface ForecastCardProps {
  forecast: ForecastData;
  units: Units;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, units }) => {
  // Group forecast by day (5-day forecast)
  const dailyForecast = forecast.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, typeof forecast.list>);

  const days = Object.entries(dailyForecast).slice(0, 5);

  // Get hourly forecast for next 24 hours
  const hourlyForecast = forecast.list.slice(0, 8);

  return (
    <div className="forecast-container">
      {/* 5-Day Forecast */}
      <div className="forecast-section">
        <h3 className="forecast-title">5-Day Forecast</h3>
        <div className="daily-forecast">
          {days.map(([date, dayData]) => {
            const dayItem = dayData[0];
            const minTemp = Math.min(...dayData.map(item => item.main.temp));
            const maxTemp = Math.max(...dayData.map(item => item.main.temp));
            
            return (
              <div key={date} className="daily-item">
                <div className="day-name">
                  {formatDate(dayItem.dt, forecast.city.timezone)}
                </div>
                <div className="day-icon">
                  <img
                    src={getWeatherIcon(dayItem.weather[0].icon)}
                    alt={dayItem.weather[0].description}
                  />
                </div>
                <div className="day-temps">
                  <span className="temp-max">{Math.round(maxTemp)}{units === 'metric' ? '°' : '°F'}</span>
                  <span className="temp-min">{Math.round(minTemp)}{units === 'metric' ? '°' : '°F'}</span>
                </div>
                <div className="day-condition">
                  {dayItem.weather[0].main}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="forecast-section">
        <h3 className="forecast-title">24-Hour Forecast</h3>
        <div className="hourly-forecast">
          {hourlyForecast.map((item, index) => {
            const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', {
              hour: 'numeric',
              hour12: true,
            });
            
            return (
              <div key={index} className="hourly-item">
                <div className="hour-time">{time}</div>
                <div className="hour-icon">
                  <img
                    src={getWeatherIcon(item.weather[0].icon)}
                    alt={item.weather[0].description}
                  />
                </div>
                <div className="hour-temp">
                  {formatTemperature(item.main.temp, units)}
                </div>
                <div className="hour-condition">
                  {item.weather[0].main}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};