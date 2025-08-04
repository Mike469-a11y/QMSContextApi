import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { DEFAULT_THEME, THEMES } from '../types/theme.js';

// Theme Context
const ThemeContext = createContext(null);

// Theme actions
const THEME_ACTIONS = {
  SET_THEME: 'SET_THEME',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_PRIMARY_COLOR: 'SET_PRIMARY_COLOR',
  SET_FONT_SIZE: 'SET_FONT_SIZE',
  RESET_THEME: 'RESET_THEME'
};

// Theme reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.SET_THEME:
      return {
        ...state,
        mode: action.payload
      };
    case THEME_ACTIONS.TOGGLE_THEME:
      return {
        ...state,
        mode: state.mode === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
      };
    case THEME_ACTIONS.SET_PRIMARY_COLOR:
      return {
        ...state,
        primaryColor: action.payload
      };
    case THEME_ACTIONS.SET_FONT_SIZE:
      return {
        ...state,
        fontSize: action.payload
      };
    case THEME_ACTIONS.RESET_THEME:
      return DEFAULT_THEME;
    default:
      return state;
  }
};

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const [theme, dispatch] = useReducer(themeReducer, DEFAULT_THEME);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('qms_theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        Object.keys(parsedTheme).forEach(key => {
          if (key === 'mode') {
            dispatch({ type: THEME_ACTIONS.SET_THEME, payload: parsedTheme[key] });
          } else if (key === 'primaryColor') {
            dispatch({ type: THEME_ACTIONS.SET_PRIMARY_COLOR, payload: parsedTheme[key] });
          } else if (key === 'fontSize') {
            dispatch({ type: THEME_ACTIONS.SET_FONT_SIZE, payload: parsedTheme[key] });
          }
        });
      } catch (error) {
        console.error('Error parsing saved theme:', error);
        localStorage.removeItem('qms_theme');
      }
    }
  }, []);

  // Save theme to localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('qms_theme', JSON.stringify(theme));
    
    // Apply theme to document root for CSS variables
    const root = document.documentElement;
    root.setAttribute('data-theme', theme.mode);
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--font-size', theme.fontSize);
  }, [theme]);

  const setTheme = (mode) => {
    dispatch({ type: THEME_ACTIONS.SET_THEME, payload: mode });
  };

  const toggleTheme = () => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_THEME });
  };

  const setPrimaryColor = (color) => {
    dispatch({ type: THEME_ACTIONS.SET_PRIMARY_COLOR, payload: color });
  };

  const setFontSize = (size) => {
    dispatch({ type: THEME_ACTIONS.SET_FONT_SIZE, payload: size });
  };

  const resetTheme = () => {
    dispatch({ type: THEME_ACTIONS.RESET_THEME });
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    setPrimaryColor,
    setFontSize,
    resetTheme
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook to use ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;