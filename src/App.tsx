import React, { useState, useEffect } from 'react';
import type { WeatherData, ForecastData, AirQualityData, SavedCity, Theme, Units, Language, WeatherCondition } from './types/weather';
import { useWeatherAPI } from './hooks/useWeatherAPI';
import { useGeolocation } from './hooks/useGeolocation';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { AirQualityCard } from './components/AirQualityCard';
import { SavedCities } from './components/SavedCities';
import { WeatherAnimation } from './components/WeatherAnimation';
import { Settings } from './components/Settings';
import { parseSearchInput, getWeatherBackground, shareWeather } from './utils/weatherUtils';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'forecast' | 'air-quality'>('current');
  const [showSettings, setShowSettings] = useState(false);

  // Settings
  const [theme, setTheme] = useLocalStorage<Theme>('weather-theme', 'auto');
  const [units, setUnits] = useLocalStorage<Units>('weather-units', 'metric');
  const [language, setLanguage] = useLocalStorage<Language>('weather-language', 'en');
  const [savedCities, setSavedCities] = useLocalStorage<SavedCity[]>('weather-saved-cities', []);

  // Hooks
  const { loading, error, fetchWeatherByCity, fetchWeatherByCoords, fetchForecast, fetchForecastByCoords, fetchAirQuality } = useWeatherAPI();
  const { loading: geoLoading, error: geoError, coords, getCurrentLocation } = useGeolocation();

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    const isDarkMode = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    root.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    if (weather) {
      const background = getWeatherBackground(weather.weather[0].main as WeatherCondition, isDarkMode);
      root.style.setProperty('--weather-background', background);
    }
  }, [theme, weather]);

  // Auto-detect location on first load
  useEffect(() => {
    if (!weather && !loading && !geoLoading) {
      getCurrentLocation();
    }
  }, []);

  // Fetch weather when coordinates are available
  useEffect(() => {
    if (coords && !weather) {
      handleLocationWeather(coords.lat, coords.lon);
    }
  }, [coords]);

  const handleLocationWeather = async (lat: number, lon: number) => {
    const weatherData = await fetchWeatherByCoords(lat, lon, units, language);
    if (weatherData) {
      setWeather(weatherData);
      
      // Fetch additional data
      const [forecastData, airQualityData] = await Promise.all([
        fetchForecastByCoords(lat, lon, units, language),
        fetchAirQuality(lat, lon),
      ]);
      
      setForecast(forecastData);
      setAirQuality(airQualityData);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    const parsed = parseSearchInput(searchTerm);
    
    if (parsed.type === 'coords') {
      await handleLocationWeather(parsed.lat, parsed.lon);
    } else if (parsed.type === 'zip') {
      const weatherData = await fetchWeatherByCity(parsed.zip, units, language);
      if (weatherData) {
        setWeather(weatherData);
        await fetchAdditionalData(weatherData);
      }
    } else {
      const weatherData = await fetchWeatherByCity(parsed.city, units, language);
      if (weatherData) {
        setWeather(weatherData);
        await fetchAdditionalData(weatherData);
      }
    }
  };

  const fetchAdditionalData = async (weatherData: WeatherData) => {
    const [forecastData, airQualityData] = await Promise.all([
      fetchForecast(weatherData.name, units, language),
      fetchAirQuality(weatherData.coord.lat, weatherData.coord.lon),
    ]);
    
    setForecast(forecastData);
    setAirQuality(airQualityData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      handleSearch(city.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && city.trim()) {
      handleSearch(city.trim());
    }
  };

  const handleToggleFavorite = (weatherData: WeatherData) => {
    const cityId = `${weatherData.name}-${weatherData.sys.country}`;
    const existingIndex = savedCities.findIndex(city => city.id === cityId);
    
    if (existingIndex >= 0) {
      setSavedCities(prev => prev.filter(city => city.id !== cityId));
    } else {
      const newCity: SavedCity = {
        id: cityId,
        name: weatherData.name,
        country: weatherData.sys.country,
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon,
      };
      setSavedCities(prev => [...prev, newCity]);
    }
  };

  const handleCitySelect = (savedCity: SavedCity) => {
    handleLocationWeather(savedCity.lat, savedCity.lon);
    setCity(savedCity.name);
  };

  const handleCityRemove = (cityId: string) => {
    setSavedCities(prev => prev.filter(city => city.id !== cityId));
  };

  const handleShare = () => {
    if (weather) {
      shareWeather(weather);
    }
  };

  const isFavorite = weather ? savedCities.some(city => city.id === `${weather.name}-${weather.sys.country}`) : false;

  return (
    <div className="app">
      {weather && (
        <WeatherAnimation condition={weather.weather[0].main as WeatherCondition} />
      )}
      
      <div className="container">
        <header className="header">
          <div className="header-content">
            <div className="title-section">
              <h1 className="title">Weather App</h1>
              <p className="subtitle">Get comprehensive weather information worldwide</p>
            </div>
            <div className="header-actions">
              <button
                onClick={getCurrentLocation}
                className="location-btn"
                disabled={geoLoading}
                title="Get current location weather"
              >
                {geoLoading ? (
                  <div className="spinner"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="3,11 22,2 13,21 11,13 3,11"></polygon>
                  </svg>
                )}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="settings-btn"
                title="Settings"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m11-7a4 4 0 0 1 0 8 4 4 0 0 1 0-8z"></path>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-container">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter city, ZIP code, or coordinates (lat,lon)..."
              className="search-input"
              disabled={loading}
            />
            <button
              type="submit"
              className="search-button"
              disabled={loading || !city.trim()}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              )}
            </button>
          </div>
        </form>

        <SavedCities
          savedCities={savedCities}
          onCitySelect={handleCitySelect}
          onCityRemove={handleCityRemove}
        />

        {(error || geoError) && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            {error || geoError}
          </div>
        )}

        {weather && (
          <>
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'current' ? 'active' : ''}`}
                onClick={() => setActiveTab('current')}
              >
                Current
              </button>
              <button
                className={`tab ${activeTab === 'forecast' ? 'active' : ''}`}
                onClick={() => setActiveTab('forecast')}
              >
                Forecast
              </button>
              <button
                className={`tab ${activeTab === 'air-quality' ? 'active' : ''}`}
                onClick={() => setActiveTab('air-quality')}
              >
                Air Quality
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'current' && (
                <WeatherCard
                  weather={weather}
                  units={units}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite}
                  onShare={handleShare}
                />
              )}
              
              {activeTab === 'forecast' && forecast && (
                <ForecastCard forecast={forecast} units={units} />
              )}
              
              {activeTab === 'air-quality' && airQuality && (
                <AirQualityCard airQuality={airQuality} />
              )}
            </div>
          </>
        )}

        {!weather && !error && !geoError && !loading && !geoLoading && (
          <div className="welcome-message">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
            </svg>
            <h3>Welcome to Weather App</h3>
            <p>Enter a city name, ZIP code, or coordinates above, or click the location button to get weather for your current location</p>
          </div>
        )}
      </div>

      <Settings
        theme={theme}
        units={units}
        language={language}
        onThemeChange={setTheme}
        onUnitsChange={setUnits}
        onLanguageChange={setLanguage}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

export default App;