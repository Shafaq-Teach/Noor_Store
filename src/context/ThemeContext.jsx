import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppStrings } from '../data/strings';

export const THEMES = {
  sky_blue: {
    id: 'sky_blue',
    nameUg: 'كۆكتۇغ كۆك',
    nameAr: 'الأزرق السماوي',
    nameEn: 'Sky Blue',
    emoji: '🌊',
    primary: '#1E88E5',
    secondary: '#00A8CC',
    light: {
      bg: '#DDF0F9',
      surface: '#EBF6FD',
      surfaceVariant: '#D2E8F6',
      textPrimary: '#0B2E46',
      textSecondary: '#336080',
      border: '#BDE0F5',
      primaryContainer: '#D2ECFA',
      onPrimaryContainer: '#0D47A1'
    },
    dark: {
      bg: '#0B1E2C',
      surface: '#132F45',
      surfaceVariant: '#1E425E',
      textPrimary: '#E2F3FD',
      textSecondary: '#91C4E5',
      border: '#2A5578',
      primaryContainer: '#1565C0',
      onPrimaryContainer: '#D2ECFA'
    }
  },
  royal_gold: {
    id: 'royal_gold',
    nameUg: 'نۇرلۇق ئالتۇن',
    nameAr: 'الذهب الملكي',
    nameEn: 'Royal Gold',
    emoji: '👑',
    primary: '#D49A00',
    secondary: '#1E5B84',
    light: {
      bg: '#FAF7EE',
      surface: '#FFFDF5',
      surfaceVariant: '#F4ECDB',
      textPrimary: '#2C2411',
      textSecondary: '#6B5C3D',
      border: '#E8DCBF',
      primaryContainer: '#FDF3D6',
      onPrimaryContainer: '#6B4E00'
    },
    dark: {
      bg: '#1C1914',
      surface: '#2A241B',
      surfaceVariant: '#3D3425',
      textPrimary: '#FDF6E3',
      textSecondary: '#D1C4A5',
      border: '#4E4330',
      primaryContainer: '#7A5800',
      onPrimaryContainer: '#FFE082'
    }
  },
  emerald: {
    id: 'emerald',
    nameUg: 'زۇمرەت يېشىل',
    nameAr: 'الزمرد الأخضر',
    nameEn: 'Emerald Oasis',
    emoji: '🌿',
    primary: '#059669',
    secondary: '#F59E0B',
    light: {
      bg: '#F0FDF4',
      surface: '#FFFFFF',
      surfaceVariant: '#DCFCE7',
      textPrimary: '#062C1E',
      textSecondary: '#166534',
      border: '#BBF7D0',
      primaryContainer: '#D1FAE5',
      onPrimaryContainer: '#064E3B'
    },
    dark: {
      bg: '#062117',
      surface: '#0D3526',
      surfaceVariant: '#154D38',
      textPrimary: '#ECFDF5',
      textSecondary: '#A7F3D0',
      border: '#1F6348',
      primaryContainer: '#047857',
      onPrimaryContainer: '#A7F3D0'
    }
  },
  midnight_purple: {
    id: 'midnight_purple',
    nameUg: 'ئېسىل بىنەپشە',
    nameAr: 'البنفسجي الفاخر',
    nameEn: 'Midnight Amethyst',
    emoji: '🔮',
    primary: '#7C3AED',
    secondary: '#EC4899',
    light: {
      bg: '#FAF5FF',
      surface: '#FFFFFF',
      surfaceVariant: '#F3E8FF',
      textPrimary: '#2E1065',
      textSecondary: '#6B21A8',
      border: '#E9D5FF',
      primaryContainer: '#EDE9FE',
      onPrimaryContainer: '#4C1D95'
    },
    dark: {
      bg: '#140C24',
      surface: '#22143D',
      surfaceVariant: '#321E59',
      textPrimary: '#FAF5FF',
      textSecondary: '#DDD6FE',
      border: '#452A77',
      primaryContainer: '#6D28D9',
      onPrimaryContainer: '#EDE9FE'
    }
  }
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    return localStorage.getItem('noor_theme') || 'sky_blue';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('noor_dark_mode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('noor_language') || 'uyghur';
  });

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('noor_view_mode') || 'web'; // 'mobile' | 'web'
  });

  const currentTheme = THEMES[currentThemeId] || THEMES.sky_blue;
  const themeColors = isDarkMode ? currentTheme.dark : currentTheme.light;

  useEffect(() => {
    localStorage.setItem('noor_theme', currentThemeId);
  }, [currentThemeId]);

  useEffect(() => {
    localStorage.setItem('noor_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('noor_language', language);
    const dir = language === 'english' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language === 'uyghur' ? 'ug' : language === 'arabic' ? 'ar' : 'en');
  }, [language]);

  useEffect(() => {
    localStorage.setItem('noor_view_mode', viewMode);
  }, [viewMode]);

  const cycleTheme = () => {
    const keys = Object.keys(THEMES);
    const currentIndex = keys.indexOf(currentThemeId);
    const nextIndex = (currentIndex + 1) % keys.length;
    setCurrentThemeId(keys[nextIndex]);
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const toggleViewMode = () => setViewMode(prev => prev === 'mobile' ? 'web' : 'mobile');

  const t = (key) => {
    const dict = AppStrings[language] || AppStrings.uyghur;
    return dict[key] || AppStrings.english[key] || key;
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      currentThemeId,
      setCurrentThemeId,
      cycleTheme,
      isDarkMode,
      toggleDarkMode,
      themeColors,
      language,
      setLanguage,
      viewMode,
      setViewMode,
      toggleViewMode,
      t
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
