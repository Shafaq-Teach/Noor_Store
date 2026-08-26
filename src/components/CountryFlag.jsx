import React from 'react';

export const CountryFlag = ({ language, className = "w-6 h-4 rounded-sm shadow-sm" }) => {
  if (language === 'uyghur') {
    return (
      <svg viewBox="0 0 36 24" className={className}>
        {/* Sky Blue Background */}
        <rect width="36" height="24" fill="#4A90E2" />
        {/* Crescent */}
        <circle cx="14" cy="12" r="8" fill="#FFFFFF" />
        <circle cx="16.5" cy="12" r="6.5" fill="#4A90E2" />
        {/* 5-pointed Star */}
        <polygon
          fill="#FFFFFF"
          points="23.5,8 24.8,11.2 28.2,11.2 25.5,13.2 26.5,16.5 23.5,14.5 20.5,16.5 21.5,13.2 18.8,11.2 22.2,11.2"
        />
      </svg>
    );
  }

  if (language === 'arabic') {
    return (
      <svg viewBox="0 0 36 24" className={className}>
        {/* Syrian 3-band Tricolor */}
        <rect width="36" height="8" y="0" fill="#007A3D" />
        <rect width="36" height="8" y="8" fill="#FFFFFF" />
        <rect width="36" height="8" y="16" fill="#111111" />
        {/* 3 Red Stars */}
        <polygon
          fill="#D52B1E"
          points="9,9.5 9.8,11.5 12,11.5 10.2,12.8 10.9,15 9,13.6 7.1,15 7.8,12.8 6,11.5 8.2,11.5"
        />
        <polygon
          fill="#D52B1E"
          points="18,9.5 18.8,11.5 21,11.5 19.2,12.8 19.9,15 18,13.6 16.1,15 16.8,12.8 15,11.5 17.2,11.5"
        />
        <polygon
          fill="#D52B1E"
          points="27,9.5 27.8,11.5 30,11.5 28.2,12.8 28.9,15 27,13.6 25.1,15 25.8,12.8 24,11.5 26.2,11.5"
        />
      </svg>
    );
  }

  // English - US Flag
  return (
    <svg viewBox="0 0 36 24" className={className}>
      {/* 7 Stripes */}
      <rect width="36" height="3.43" y="0" fill="#B22234" />
      <rect width="36" height="3.43" y="3.43" fill="#FFFFFF" />
      <rect width="36" height="3.43" y="6.86" fill="#B22234" />
      <rect width="36" height="3.43" y="10.29" fill="#FFFFFF" />
      <rect width="36" height="3.43" y="13.72" fill="#B22234" />
      <rect width="36" height="3.43" y="17.15" fill="#FFFFFF" />
      <rect width="36" height="3.43" y="20.58" fill="#B22234" />
      {/* Blue Canton */}
      <rect width="16" height="13.72" fill="#3C3B6E" />
      {/* Star dots */}
      <circle cx="4" cy="3.5" r="0.9" fill="#FFFFFF" />
      <circle cx="8" cy="3.5" r="0.9" fill="#FFFFFF" />
      <circle cx="12" cy="3.5" r="0.9" fill="#FFFFFF" />
      <circle cx="6" cy="7" r="0.9" fill="#FFFFFF" />
      <circle cx="10" cy="7" r="0.9" fill="#FFFFFF" />
      <circle cx="4" cy="10.5" r="0.9" fill="#FFFFFF" />
      <circle cx="8" cy="10.5" r="0.9" fill="#FFFFFF" />
      <circle cx="12" cy="10.5" r="0.9" fill="#FFFFFF" />
    </svg>
  );
};
