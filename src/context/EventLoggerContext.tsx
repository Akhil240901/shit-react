import React, { createContext, useContext, useState, useCallback } from 'react';

export interface LogEntry {
  id: string;
  time: string;
  tag: string;
  message: string;
}

interface EventLoggerContextType {
  logs: LogEntry[];
  logEvent: (tag: string, message: string) => void;
  clearLogs: () => void;
}

const EventLoggerContext = createContext<EventLoggerContextType | undefined>(undefined);

export const EventLoggerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const logEvent = useCallback((tag: string, message: string) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now
      .getMilliseconds()
      .toString()
      .padStart(3, '0')}`;

    const newEntry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      time,
      tag,
      message,
    };

    setLogs((prev) => [newEntry, ...prev.slice(0, 49)]); // keep latest 50 logs
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <EventLoggerContext.Provider value={{ logs, logEvent, clearLogs }}>
      {children}
    </EventLoggerContext.Provider>
  );
};

export const useEventLogger = (): EventLoggerContextType => {
  const context = useContext(EventLoggerContext);
  if (!context) {
    throw new Error('useEventLogger must be used within an EventLoggerProvider');
  }
  return context;
};
