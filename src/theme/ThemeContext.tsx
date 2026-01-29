import React, { createContext, useState, useContext, useEffect } from 'react';
import { AsyncStorage } from '../sharedBase/globalImport';

// const themes = {
//   light: {
//     background: '#ffffff',
//     surface: '#f8f9fa',
//     text: '#000000',
//     primary: '#007AFF',
//     primaryLight: '#D0E8FF',
//     border: '#dee2e6',
//   },
//   dark: {
//     background: '#121212',
//     surface: '#1C2526',
//     text: '#ffffff',
//     primary: '#BB86FC',
//     primaryLight: '#EAD9FD',
//     border: '#ffffff',
//   },
//   blue: {
//     background: '#E3F2FD',
//     surface: '#ffffff',
//     text: '#000000',
//     primary: '#1565C0',
//     primaryLight: '#D6EAFB',
//     border: '#BBDEFB',
//   },
//   green: {
//     background: '#E8F5E9',
//     surface: '#ffffff',
//     text: '#000000',
//     primary: '#388E3C',
//     primaryLight: '#D0EDD2',
//     border: '#C8E6C9',
//   },
//   red: {
//     background: '#FFEBEE',
//     surface: '#ffffff',
//     text: '#000000',
//     primary: '#D32F2F',
//     primaryLight: '#F9D6D5',
//     border: '#FFCDD2',
//   },
//   purple: {
//     background: '#F3E5F5',
//     surface: '#ffffff',
//     text: '#000000',
//     primary: '#7B1FA2',
//     primaryLight: '#E8D8F1',
//     border: '#E1BEE7',
//   },
//   orange: {
//     background: '#FFF3E0',
//     surface: '#ffffff',
//     text: '#000000',
//     primary: '#F57C00',
//     primaryLight: '#FFE0B2',
//     border: '#FFE0B2',
//   },
// };

const themes = {
  light: {
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#000000',
    primary: '#007AFF',
    primaryLight: '#90C2FF',
    border: '#dee2e6',
  },
  dark: {
    background: '#121212',
    surface: '#1C2526',
    text: '#ffffff',
    primary: '#BB86FC',
    primaryLight: '#9D66D6',
    border: '#ffffff',
  },
  blue: {
    background: '#E3F2FD',
    surface: '#ffffff',
    text: '#000000',
    primary: '#1565C0',
    primaryLight: '#6B9FD3',
    border: '#BBDEFB',
  },
  green: {
    background: '#E8F5E9',
    surface: '#ffffff',
    text: '#000000',
    primary: '#388E3C',
    primaryLight: '#6BAF6E',
    border: '#C8E6C9',
  },
  red: {
    background: '#FFEBEE',
    surface: '#ffffff',
    text: '#000000',
    primary: '#D32F2F',
    primaryLight: '#E57373',
    border: '#FFCDD2',
  },
  purple: {
    background: '#F3E5F5',
    surface: '#ffffff',
    text: '#000000',
    primary: '#7B1FA2',
    primaryLight: '#AB47BC',
    border: '#E1BEE7',
  },
  orange: {
    background: '#FFF3E0',
    surface: '#ffffff',
    text: '#000000',
    primary: '#F57C00',
    primaryLight: '#FF9800',
    border: '#FFE0B2',
  },
};

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  // const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('appTheme');

      if (savedTheme) {
        setTheme(savedTheme);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async (selectedTheme) => {
    setTheme(selectedTheme);
    await AsyncStorage.setItem('appTheme', selectedTheme);
  };

  const value = {
    theme: themes[theme],
    mode: theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
