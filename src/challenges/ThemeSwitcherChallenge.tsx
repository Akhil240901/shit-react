import React, { useState } from 'react';
import { Sun, Moon, Palette, CheckCircle2 } from 'lucide-react';
import { useEventLogger } from '../context/EventLoggerContext';
import { useTheme } from '../context/ThemeContext';

export const ThemeSwitcherChallenge: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [accentColor, setAccentColor] = useState('#6366f1');
  const { logEvent } = useEventLogger();

  const accents = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Cyan', value: '#06b6d4' }
  ];

  const handleToggleTheme = () => {
    toggleTheme();
    logEvent('onClick', `Theme toggled to: ${theme === 'dark' ? 'LIGHT' : 'DARK'}`);
  };

  const handleAccentChange = (color: string, name: string) => {
    setAccentColor(color);
    document.documentElement.style.setProperty('--accent-primary', color);
    logEvent('onClick', `Accent color changed to: ${name} (${color})`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Theme Controller</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Active mode: <b style={{ textTransform: 'uppercase', color: 'var(--accent-primary)' }}>{theme}</b>
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleTheme}
          className="demo-btn demo-btn-secondary"
          style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
          id="theme-toggle-exercise-btn"
        >
          {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#6366f1" />}
          <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
        </button>
      </div>

      {/* Accent Color Chooser */}
      <div>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Palette size={14} />
          Choose Dynamic Brand Accent
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {accents.map((acc) => (
            <button
              key={acc.value}
              type="button"
              onClick={() => handleAccentChange(acc.value, acc.name)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: acc.value,
                border: accentColor === acc.value ? '2px solid white' : '2px solid transparent',
                boxShadow: accentColor === acc.value ? `0 0 10px ${acc.value}` : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                transition: 'transform 0.15s'
              }}
              title={acc.name}
            >
              {accentColor === acc.value && <CheckCircle2 size={16} />}
            </button>
          ))}
        </div>
      </div>

      {/* Mini Preview Component */}
      <div
        style={{
          padding: '16px',
          borderRadius: '10px',
          backgroundColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
          border: '1px solid var(--border-subtle)',
          color: theme === 'dark' ? '#f9fafb' : '#111827',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Theme Preview Card</div>
        <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
          This card demonstrates reactive styles based on React state and CSS custom properties.
        </p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button
            className="demo-btn"
            style={{ fontSize: '0.75rem', padding: '6px 12px', background: accentColor }}
          >
            Brand Button
          </button>
          <span style={{
            fontSize: '0.75rem',
            padding: '4px 8px',
            borderRadius: '4px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            alignSelf: 'center'
          }}>
            Badge Preview
          </span>
        </div>
      </div>
    </div>
  );
};

export const themeSwitcherCode = `import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};`;
