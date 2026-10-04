import React from 'react';
import { Code2, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  totalChallenges: number;
}

export const Header: React.FC<HeaderProps> = ({ totalChallenges }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-group">
          <div className="logo-icon-wrapper">
            <Code2 size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="logo-title">ReactLab</span>
              <span className="logo-badge">Workbench</span>
            </div>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          background: 'var(--bg-surface)',
          padding: '6px 12px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}>
          <Sparkles size={14} color="var(--accent-primary)" />
          <span><b>{totalChallenges}</b> Challenges Ready</span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="icon-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun size={18} color="#f59e0b" />
          ) : (
            <Moon size={18} color="#6366f1" />
          )}
        </button>
      </div>
    </header>
  );
};
