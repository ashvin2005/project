import React from 'react';
import type { AirQualityData } from '../types/weather';
import { getAQILevel } from '../utils/weatherUtils';

interface AirQualityCardProps {
  airQuality: AirQualityData;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  const aqi = airQuality.list[0];
  const level = getAQILevel(aqi.main.aqi);

  return (
    <div className="air-quality-card">
      <h3 className="air-quality-title">Air Quality Index</h3>
      
      <div className="aqi-main">
        <div className="aqi-value" style={{ color: level.color }}>
          {aqi.main.aqi}
        </div>
        <div className="aqi-label" style={{ color: level.color }}>
          {level.label}
        </div>
      </div>

      <div className="aqi-components">
        <div className="component-item">
          <span className="component-label">PM2.5</span>
          <span className="component-value">{aqi.components.pm2_5.toFixed(1)} μg/m³</span>
        </div>
        <div className="component-item">
          <span className="component-label">PM10</span>
          <span className="component-value">{aqi.components.pm10.toFixed(1)} μg/m³</span>
        </div>
        <div className="component-item">
          <span className="component-label">O₃</span>
          <span className="component-value">{aqi.components.o3.toFixed(1)} μg/m³</span>
        </div>
        <div className="component-item">
          <span className="component-label">NO₂</span>
          <span className="component-value">{aqi.components.no2.toFixed(1)} μg/m³</span>
        </div>
      </div>
    </div>
  );
};