import type { WeatherCondition } from '../types/weather';

export const getWeatherIcon = (iconCode: string) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const formatTemperature = (temp: number, units: 'metric' | 'imperial' = 'metric') => {
  const rounded = Math.round(temp);
  const unit = units === 'metric' ? '°C' : '°F';
  return `${rounded}${unit}`;
};

export const formatTime = (timestamp: number, timezone: number) => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
};

export const formatDate = (timestamp: number, timezone: number) => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

export const getCurrentDateTime = (timezone: number) => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const localTime = new Date(utc + (timezone * 1000));
  
  return {
    date: localTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: localTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
};

export const getWeatherBackground = (condition: WeatherCondition, isDark: boolean = false) => {
  const backgrounds = {
    Clear: isDark 
      ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    Clouds: isDark
      ? 'linear-gradient(135deg, #434343 0%, #000000 100%)'
      : 'linear-gradient(135deg, #d7d2cc 0%, #304352 100%)',
    Rain: isDark
      ? 'linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)'
      : 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    Drizzle: isDark
      ? 'linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)'
      : 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    Thunderstorm: isDark
      ? 'linear-gradient(135deg, #2c1810 0%, #8b4513 100%)'
      : 'linear-gradient(135deg, #373b44 0%, #4286f4 100%)',
    Snow: isDark
      ? 'linear-gradient(135deg, #e6ddd4 0%, #d5d4d0 100%)'
      : 'linear-gradient(135deg, #e6ddd4 0%, #d5d4d0 100%)',
    Mist: isDark
      ? 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)'
      : 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
    Fog: isDark
      ? 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)'
      : 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
    Smoke: isDark
      ? 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)'
      : 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
    Haze: isDark
      ? 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)'
      : 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
    Dust: isDark
      ? 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)'
      : 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
    Sand: isDark
      ? 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)'
      : 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
    Ash: isDark
      ? 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)'
      : 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
    Squall: isDark
      ? 'linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)'
      : 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    Tornado: isDark
      ? 'linear-gradient(135deg, #2c1810 0%, #8b4513 100%)'
      : 'linear-gradient(135deg, #373b44 0%, #4286f4 100%)',
    default: isDark
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  };

  return backgrounds[condition] || backgrounds.default;
};

export const getAQILevel = (aqi: number) => {
  const levels = [
    { max: 1, label: 'Good', color: '#00e400' },
    { max: 2, label: 'Fair', color: '#ffff00' },
    { max: 3, label: 'Moderate', color: '#ff7e00' },
    { max: 4, label: 'Poor', color: '#ff0000' },
    { max: 5, label: 'Very Poor', color: '#8f3f97' },
  ];

  const level = levels.find(l => aqi <= l.max) || levels[levels.length - 1];
  return level;
};

export const parseSearchInput = (input: string) => {
  const trimmed = input.trim();
  
  // Check if it's coordinates (lat,lon)
  const coordsMatch = trimmed.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
  if (coordsMatch) {
    return {
      type: 'coords' as const,
      lat: parseFloat(coordsMatch[1]),
      lon: parseFloat(coordsMatch[2]),
    };
  }

  // Check if it's a ZIP code (US format: 12345 or 12345-6789)
  const zipMatch = trimmed.match(/^\d{5}(-\d{4})?$/);
  if (zipMatch) {
    return {
      type: 'zip' as const,
      zip: trimmed,
    };
  }

  // Default to city name
  return {
    type: 'city' as const,
    city: trimmed,
  };
};

export const shareWeather = async (weather: any) => {
  const text = `Current weather in ${weather.name}, ${weather.sys.country}: ${Math.round(weather.main.temp)}°C, ${weather.weather[0].description}`;
  const url = window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Weather Update',
        text,
        url,
      });
    } catch (error) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${text}\n${url}`);
      alert('Weather info copied to clipboard!');
    }
  } else {
    // Fallback to clipboard
    await navigator.clipboard.writeText(`${text}\n${url}`);
    alert('Weather info copied to clipboard!');
  }
};