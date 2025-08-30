import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('motive-theme');
      return savedTheme ? JSON.parse(savedTheme) : false;
    } catch (error) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('motive-theme', JSON.stringify(isDarkMode));
    } catch (error) {
      console.warn('Could not save theme to localStorage');
    }
    
    const themeClass = isDarkMode ? 'dark-theme' : 'light-theme';
    
    document.documentElement.className = themeClass;
    document.body.className = themeClass;
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    document.body.style.display = 'none';
    const height = document.body.offsetHeight;
    document.body.style.display = '';
    
    if (height >= 0) {
      console.log('Theme applied successfully');
    }
    
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
