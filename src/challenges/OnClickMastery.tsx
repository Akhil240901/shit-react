import React, { useState, useCallback } from 'react';
import { MousePointerClick, RefreshCw, Zap, AlertTriangle, Layers } from 'lucide-react';
import { useEventLogger } from '../context/EventLoggerContext';

export const OnClickMasteryChallenge: React.FC = () => {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [lastAction, setLastAction] = useState('None');
  const [parentClicked, setParentClicked] = useState(false);
  const { logEvent } = useEventLogger();

  // Simple direct handler
  const handleDirectClick = () => {
    setCount((prev) => prev + step);
    setLastAction(`Direct Click (+${step})`);
    logEvent('onClick', `Direct handler fired: count increased by ${step}`);
  };

  // Handler with arguments
  const handleWithArg = (customDelta: number) => {
    setCount((prev) => prev + customDelta);
    setLastAction(`Delta Click (${customDelta > 0 ? '+' : ''}${customDelta})`);
    logEvent('onClick', `Parameterized handler fired: delta = ${customDelta}`);
  };

  // The famous React interview trap: Batching test
  // If you do setCount(count + 1) three times, count only increases by 1!
  // If you do setCount(prev => prev + 1) three times, count increases by 3!
  const handleTripleIncrementBroken = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    setLastAction('Stale State Trap: setCount(count + 1) x 3');
    logEvent('onClick:Trap', `Called setCount(count + 1) 3 times. Due to closure/batching, it only adds 1!`);
  };

  const handleTripleIncrementFixed = () => {
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setLastAction('Functional Updater: setCount(prev => prev + 1) x 3');
    logEvent('onClick:Fixed', `Called setCount(prev => prev + 1) 3 times. Successfully added 3!`);
  };

  // Stop propagation demo
  const handleChildClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLastAction('Child Clicked (e.stopPropagation() used)');
    logEvent('onClick:Child', 'Child clicked with e.stopPropagation()! Parent event blocked.');
  };

  const handleParentClick = () => {
    setParentClicked(true);
    setLastAction('Parent Container Clicked!');
    logEvent('onClick:Parent', 'Parent container onClick triggered (bubbling)');
    setTimeout(() => setParentClicked(false), 1200);
  };

  const handleReset = useCallback(() => {
    setCount(0);
    setLastAction('Reset to 0');
    logEvent('onClick:Reset', 'Counter reset to 0');
  }, [logEvent]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Counter Display Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderRadius: '12px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current Value
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1 }}>
            {count}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Last Event: <b style={{ color: 'var(--text-primary)' }}>{lastAction}</b>
          </span>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="demo-btn demo-btn-secondary"
          style={{ padding: '8px 12px', fontSize: '0.8rem' }}
          title="Reset Counter"
        >
          <RefreshCw size={14} />
          Reset
        </button>
      </div>

      {/* Test 1: Standard & Param Handlers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          1. Basic Handlers & Step Parameter
        </span>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleDirectClick}
            className="demo-btn"
            id="direct-click-btn"
          >
            <MousePointerClick size={16} />
            onClick=&#123;handleDirectClick&#125; (+{step})
          </button>

          <button
            type="button"
            onClick={() => handleWithArg(5)}
            className="demo-btn demo-btn-secondary"
          >
            onClick=&#123;() =&gt; handleWithArg(5)&#125;
          </button>

          <button
            type="button"
            onClick={() => handleWithArg(-1)}
            className="demo-btn demo-btn-secondary"
          >
            -1
          </button>
        </div>

        {/* Step Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Configure Step:</span>
          {[1, 2, 5, 10].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStep(s);
                logEvent('onChange', `Step updated to ${s}`);
              }}
              style={{
                padding: '3px 10px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                background: step === s ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: step === s ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Test 2: The Classic Interview Batching Trap */}
      <div style={{
        padding: '14px',
        borderRadius: '8px',
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-amber)', fontSize: '0.85rem', fontWeight: 600 }}>
          <AlertTriangle size={16} />
          Interview Question: Calling setCount 3 times in one click
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
          Notice how the "Buggy" button only increments once because it references a stale snapshot, whereas the "Fixed" updater function reads current state.
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button
            type="button"
            onClick={handleTripleIncrementBroken}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: 'rgba(244, 63, 94, 0.2)',
              color: 'var(--accent-rose)',
              border: '1px solid var(--accent-rose)'
            }}
          >
            ❌ setCount(count + 1) x3
          </button>

          <button
            type="button"
            onClick={handleTripleIncrementFixed}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: 'rgba(16, 185, 129, 0.2)',
              color: 'var(--accent-emerald)',
              border: '1px solid var(--accent-emerald)'
            }}
          >
            ✅ setCount(prev =&gt; prev + 1) x3
          </button>
        </div>
      </div>

      {/* Test 3: Event Bubbling & stopPropagation */}
      <div
        onClick={handleParentClick}
        style={{
          padding: '16px',
          borderRadius: '8px',
          border: `2px dashed ${parentClicked ? 'var(--accent-rose)' : 'var(--border-medium)'}`,
          background: parentClicked ? 'rgba(244, 63, 94, 0.1)' : 'var(--bg-surface)',
          transition: 'all 0.3s',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} />
            Parent Container (Click anywhere here)
          </span>
          {parentClicked && <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 600 }}>Bubbled to Parent!</span>}
        </div>

        <button
          type="button"
          onClick={handleChildClick}
          className="demo-btn demo-btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 14px' }}
        >
          <Zap size={14} color="var(--accent-amber)" />
          Child Button (Calls e.stopPropagation())
        </button>
      </div>
    </div>
  );
};

export const onClickMasteryCode = `import React, { useState } from 'react';

export const OnClickInterviewDemo = () => {
  const [count, setCount] = useState(0);

  // 1. Passing direct reference
  const handleDirect = () => {
    setCount((prev) => prev + 1);
  };

  // 2. Passing arguments with arrow function
  const handleWithArg = (delta: number) => {
    setCount((prev) => prev + delta);
  };

  // 3. Stale Closure Trap vs Functional Updater
  // TRAP: Only increments by 1 because count is stale in this execution context
  const buggyTripleIncrement = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  // SOLUTION: Functional updater queues updates sequentially
  const correctTripleIncrement = () => {
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
  };

  // 4. Stopping Event Bubbling
  const handleChildClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log('Child clicked, bubbling prevented!');
  };

  return (
    <div onClick={() => console.log('Parent container clicked!')}>
      <h2>Count: {count}</h2>
      <button onClick={handleDirect}>+1</button>
      <button onClick={() => handleWithArg(5)}>+5</button>
      <button onClick={correctTripleIncrement}>+3 (Functional)</button>
      <button onClick={handleChildClick}>Child Only</button>
    </div>
  );
};`;
