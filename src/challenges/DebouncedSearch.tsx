import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sparkles, X } from 'lucide-react';
import { useEventLogger } from '../context/EventLoggerContext';

const MOCK_ITEMS = [
  { name: 'useState', category: 'Basic Hook', desc: 'Preserves state values between component renders.' },
  { name: 'useEffect', category: 'Basic Hook', desc: 'Performs side effects like data fetching or subscriptions.' },
  { name: 'useContext', category: 'Basic Hook', desc: 'Consumes context values without prop drilling.' },
  { name: 'useMemo', category: 'Performance Hook', desc: 'Caches the result of a calculation between renders.' },
  { name: 'useCallback', category: 'Performance Hook', desc: 'Caches a function definition between re-renders.' },
  { name: 'useRef', category: 'Ref Hook', desc: 'References a DOM element or value without causing re-renders.' },
  { name: 'useTransition', category: 'Concurrent Hook', desc: 'Updates state without blocking the responsive UI.' },
  { name: 'useId', category: 'Accessibility Hook', desc: 'Generates unique IDs for accessible form inputs.' },
];

export const DebouncedSearchChallenge: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  const { logEvent } = useEventLogger();

  // Debounce Effect
  useEffect(() => {
    if (!searchTerm) {
      setDebouncedTerm('');
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);
    logEvent('Timer', `Debounce timer started for: "${searchTerm}" (500ms)`);

    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setIsDebouncing(false);
      logEvent('Debounce', `Query fired to search API: "${searchTerm}"`);
    }, 500);

    // Cleanup function on next keystroke
    return () => {
      clearTimeout(handler);
      logEvent('Cleanup', 'Previous debounce timer cleared due to new keystroke');
    };
  }, [searchTerm, logEvent]);

  const filteredItems = MOCK_ITEMS.filter((item) =>
    item.name.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
    item.desc.toLowerCase().includes(debouncedTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Debounced Input Search</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Delay network requests until user pauses typing</p>
        </div>
        {isDebouncing && (
          <span style={{
            fontSize: '0.75rem',
            padding: '4px 8px',
            borderRadius: '4px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: 'var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Loader2 size={12} className="animate-spin" />
            Debouncing...
          </span>
        )}
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search React hooks (e.g. memo, ref, effect)..."
          className="demo-input"
          style={{ paddingLeft: '38px', paddingRight: '36px' }}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              logEvent('onClick', 'Cleared search term');
            }}
            className="icon-btn"
            style={{ position: 'absolute', right: '8px', width: '26px', height: '26px' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* State Inspector Box */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        padding: '12px',
        borderRadius: '8px',
        background: 'var(--bg-surface)',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-mono)'
      }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Immediate Input:</span>
          <div style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>"{searchTerm}"</div>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Debounced Search Term:</span>
          <div style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>"{debouncedTerm}"</div>
        </div>
      </div>

      {/* Filtered Result Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No hooks found matching "{debouncedTerm}"
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.name}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                    {item.name}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--accent-primary)'
                  }}>
                    {item.category}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {item.desc}
                </div>
              </div>
              <Sparkles size={14} color="var(--accent-cyan)" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const debouncedSearchCode = `import React, { useState, useEffect } from 'react';

// Custom Hook: useDebounce
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timer to update value after specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel timer if value changes (or component unmounts)
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Component Usage
export const SearchWithDebounce = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      console.log('Sending API search request for:', debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Type to search..."
    />
  );
};`;
