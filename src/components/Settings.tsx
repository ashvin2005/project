import React from 'react';
import type { Theme, Units, Language } from '../types/weather';

interface SettingsProps {
  theme: Theme;
  units: Units;
  language: Language;
  onThemeChange: (theme: Theme) => void;
  onUnitsChange: (units: Units) => void;
  onLanguageChange: (language: Language) => void;
  isOpen: boolean;
  onClose: () => void;
}

const languages = [
  { code: 'en' as Language, name: 'English' },
  { code: 'es' as Language, name: 'Español' },
  { code: 'fr' as Language, name: 'Français' },
  { code: 'de' as Language, name: 'Deutsch' },
  { code: 'it' as Language, name: 'Italiano' },
  { code: 'pt' as Language, name: 'Português' },
  { code: 'ru' as Language, name: 'Русский' },
  { code: 'ja' as Language, name: '日本語' },
  { code: 'zh' as Language, name: '中文' },
  { code: 'hi' as Language, name: 'हिन्दी' },
  { code: 'ar' as Language, name: 'العربية' },
];

export const Settings: React.FC<SettingsProps> = ({
  theme,
  units,
  language,
  onThemeChange,
  onUnitsChange,
  onLanguageChange,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h3>Settings</h3>
          <button onClick={onClose} className="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="settings-content">
          <div className="setting-group">
            <label className="setting-label">Theme</label>
            <div className="setting-options">
              <button
                className={`setting-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => onThemeChange('light')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                Light
              </button>
              <button
                className={`setting-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => onThemeChange('dark')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                Dark
              </button>
              <button
                className={`setting-btn ${theme === 'auto' ? 'active' : ''}`}
                onClick={() => onThemeChange('auto')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                Auto
              </button>
            </div>
          </div>

          <div className="setting-group">
            <label className="setting-label">Temperature Units</label>
            <div className="setting-options">
              <button
                className={`setting-btn ${units === 'metric' ? 'active' : ''}`}
                onClick={() => onUnitsChange('metric')}
              >
                Celsius (°C)
              </button>
              <button
                className={`setting-btn ${units === 'imperial' ? 'active' : ''}`}
                onClick={() => onUnitsChange('imperial')}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          <div className="setting-group">
            <label className="setting-label">Language</label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="setting-select"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};