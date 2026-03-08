import React, { createContext, useContext, useState, useEffect } from 'react';
import { theme as defaultTheme } from './theme';
import { storage } from '../utils/storage';

const ThemeContext = createContext({
  theme: defaultTheme,
  userPersona: null,
  setUserPersona: () => {},
});

export function ThemeProvider({ children }) {
  const [userPersona, setUserPersonaState] = useState(null);

  useEffect(() => {
    const loadPersona = async () => {
      const saved = await storage.getAsync('userPersona');
      if (saved) setUserPersonaState(saved);
    };
    loadPersona();
  }, []);

  const setUserPersona = async (persona) => {
    setUserPersonaState(persona);
    await storage.set('userPersona', persona);
  };

  const value = {
    theme: defaultTheme,
    userPersona,
    setUserPersona,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
