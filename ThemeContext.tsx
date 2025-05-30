import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark';

type ThemeContextType = {
  theme: ThemeMode;
  toggleTheme: () => void;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    accent: string;
    danger: string;
    success: string;
    warning: string;
  };
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme();
  // Default to dark mode as specified in the requirements
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    // If you want to follow system theme, uncomment this
    // setTheme(deviceTheme === 'dark' ? 'dark' : 'light');
  }, [deviceTheme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const lightColors = {
    primary: '#00FF99',
    background: '#F5F5F5',
    card: '#FFFFFF',
    text: '#121212',
    border: '#EEEEEE',
    notification: '#FF5252',
    accent: '#00FF99',
    danger: '#FF5252',
    success: '#4CAF50',
    warning: '#FFC107',
  };

  const darkColors = {
    primary: '#00FF99',
    background: '#121212',
    card: '#181818',
    text: '#FFFFFF',
    border: '#333333',
    notification: '#FF5252',
    accent: '#00FF99',
    danger: '#FF5252',
    success: '#4CAF50',
    warning: '#FFC107',
  };

  const fonts = {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    bold: 'Poppins_700Bold',
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        colors,
        fonts,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};