import React, { useState } from 'react';
import { Terminal, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useEventLogger } from '../context/EventLoggerContext';

export const EventLogger: React.FC = () => {
  const { logs, clearLogs } = useEventLogger();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="event-logger-panel">
      <div className="logger-header">
        <div className="logger-title">
          <Terminal size={14} />
          <span>Real-Time Event Stream</span>
          <span className="live-indicator" title="Listening to interactive events..." />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
            ({logs.length} logged)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {logs.length > 0 && (
            <button
              type="button"
              onClick={clearLogs}
              className="toolbar-btn"
              style={{ padding: '3px 8px', fontSize: '0.7rem' }}
              title="Clear Event Stream"
            >
              <Trash2 size={12} />
              Clear
            </button>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="icon-btn"
            style={{ width: '26px', height: '26px' }}
            title={collapsed ? 'Expand Log' : 'Collapse Log'}
          >
            {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="logger-body">
          {logs.length === 0 ? (
            <div className="logger-empty">
              No events captured yet. Click buttons, type into inputs, or toggle switches to inspect events!
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="log-entry">
                <span className="log-time">[{log.time}]</span>
                <span className="log-tag">&lt;{log.tag}&gt;</span>
                <span className="log-msg">{log.message}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
