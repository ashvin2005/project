import { useState, useCallback } from 'react';
import type { WeatherData, ForecastData, AirQualityData, Units, Language } from '../types/weather';

const API_KEY = '7a51ce4a257b81e7874899962d4bc194';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const useWeatherAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeatherByCity = useCallback(async (
    cityName: string, 
    units: Units = 'metric', 
    lang: Language = 'en'
  ): Promise<WeatherData | null> => {
    if (!cityName.trim()) {
      setError('Please enter a city name');
      return null;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=${units}&lang=${lang}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        } else {
          throw new Error('Failed to fetch weather data. Please try again later.');
        }
      }

      const data: WeatherData = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCoords = useCallback(async (
    lat: number, 
    lon: number, 
    units: Units = 'metric', 
    lang: Language = 'en'
  ): Promise<WeatherData | null> => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}&lang=${lang}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data for your location.');
      }

      const data: WeatherData = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchForecast = useCallback(async (
    cityName: string, 
    units: Units = 'metric', 
    lang: Language = 'en'
  ): Promise<ForecastData | null> => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=${units}&lang=${lang}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch forecast data.');
      }

      const data: ForecastData = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchForecastByCoords = useCallback(async (
    lat: number, 
    lon: number, 
    units: Units = 'metric', 
    lang: Language = 'en'
  ): Promise<ForecastData | null> => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}&lang=${lang}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch forecast data.');
      }

      const data: ForecastData = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAirQuality = useCallback(async (lat: number, lon: number): Promise<AirQualityData | null> => {
    try {
      const response = await fetch(
        `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch air quality data.');
      }

      const data: AirQualityData = await response.json();
      return data;
    } catch (err) {
      console.error('Air quality fetch error:', err);
      return null;
    }
  }, []);

  return {
    loading,
    error,
    setError,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    fetchForecast,
    fetchForecastByCoords,
    fetchAirQuality,
  };
};