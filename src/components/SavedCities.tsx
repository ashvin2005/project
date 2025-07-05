import React from 'react';
import type { SavedCity } from '../types/weather';

interface SavedCitiesProps {
  savedCities: SavedCity[];
  onCitySelect: (city: SavedCity) => void;
  onCityRemove: (cityId: string) => void;
}

export const SavedCities: React.FC<SavedCitiesProps> = ({
  savedCities,
  onCitySelect,
  onCityRemove,
}) => {
  if (savedCities.length === 0) {
    return null;
  }

  return (
    <div className="saved-cities">
      <h3 className="saved-cities-title">Favorite Cities</h3>
      <div className="saved-cities-list">
        {savedCities.map((city) => (
          <div key={city.id} className="saved-city-item">
            <button
              onClick={() => onCitySelect(city)}
              className="saved-city-btn"
            >
              <span className="city-name">{city.name}</span>
              <span className="city-country">{city.country}</span>
            </button>
            <button
              onClick={() => onCityRemove(city.id)}
              className="remove-city-btn"
              title="Remove from favorites"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};