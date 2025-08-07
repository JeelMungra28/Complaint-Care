import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb">
          {isDarkMode ? (
            <svg className="theme-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          ) : (
            <svg className="theme-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2v2m6.07 1.93l-1.41 1.41M20 12h2m-1.93 6.07l-1.41-1.41M12 20v2m-6.07-1.93l1.41-1.41M4 12H2m1.93-6.07l1.41 1.41M12 7a5 5 0 015 5 5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5z" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;