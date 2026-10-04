import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, Lock, ShieldCheck } from 'lucide-react';
import { useEventLogger } from '../context/EventLoggerContext';

export const ShowHidePasswordChallenge: React.FC = () => {
  const [password, setPassword] = useState('SecretPass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const { logEvent } = useEventLogger();

  const handleToggle = () => {
    const nextState = !showPassword;
    setShowPassword(nextState);
    logEvent('onClick', `Password visibility toggled: ${nextState ? 'VISIBLE (text)' : 'HIDDEN (password)'}`);
  };

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      logEvent('onClick', 'Copied password to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      logEvent('Error', 'Clipboard copy failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    logEvent('onChange', `Input updated: length = ${e.target.value.length}`);
  };

  // Basic strength check
  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#f43f5e', '#f59e0b', '#06b6d4', '#10b981'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          padding: '8px',
          borderRadius: '8px',
          background: 'rgba(99, 102, 241, 0.1)',
          color: 'var(--accent-primary)',
          display: 'flex'
        }}>
          <Lock size={20} />
        </div>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Password Input</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Toggle between type="password" & type="text"</p>
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handleChange}
          placeholder="Enter secure password..."
          className="demo-input"
          style={{ paddingRight: '90px' }}
          id="interview-password-input"
          aria-label="Password Field"
        />
        
        <div style={{ position: 'absolute', right: '8px', display: 'flex', gap: '4px' }}>
          <button
            type="button"
            onClick={handleCopy}
            title="Copy password"
            aria-label="Copy password to clipboard"
            className="icon-btn"
            style={{ width: '32px', height: '32px' }}
          >
            {copied ? <Check size={15} color="var(--accent-emerald)" /> : <Copy size={15} />}
          </button>
          
          <button
            type="button"
            onClick={handleToggle}
            title={showPassword ? 'Hide password' : 'Show password'}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="icon-btn"
            style={{ width: '32px', height: '32px' }}
            id="toggle-visibility-btn"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Password Strength Indicator */}
      {password && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Strength:</span>
            <span style={{ fontWeight: 600, color: strengthColors[Math.max(0, strength - 1)] || '#f43f5e' }}>
              {strengthLabels[Math.max(0, strength - 1)] || 'Too Weak'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                style={{
                  flex: 1,
                  borderRadius: '2px',
                  backgroundColor: step <= strength ? strengthColors[strength - 1] : 'var(--border-subtle)',
                  transition: 'background-color 0.3s'
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.8rem',
        padding: '10px 12px',
        borderRadius: '8px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)'
      }}>
        <ShieldCheck size={16} color="var(--accent-emerald)" />
        <span style={{ color: 'var(--text-secondary)' }}>
          Current input type: <code style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{showPassword ? 'type="text"' : 'type="password"'}</code>
        </span>
      </div>
    </div>
  );
};

export const showHidePasswordCode = `import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const ShowHidePassword = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="password-field">
      <input
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        aria-label="Password"
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};`;
