import React from 'react';
import type { WeatherCondition } from '../types/weather';

interface WeatherAnimationProps {
  condition: WeatherCondition;
}

export const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ condition }) => {
  const renderAnimation = () => {
    switch (condition) {
      case 'Rain':
      case 'Drizzle':
        return (
          <div className="rain-animation">
            {Array.from({ length: 50 }, (_, i) => (
              <div
                key={i}
                className="raindrop"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        );
      
      case 'Snow':
        return (
          <div className="snow-animation">
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="snowflake"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                ❄
              </div>
            ))}
          </div>
        );
      
      case 'Thunderstorm':
        return (
          <div className="thunder-animation">
            <div className="lightning" />
          </div>
        );
      
      default:
        return null;
    }
  };

  return <div className="weather-animation">{renderAnimation()}</div>;
};