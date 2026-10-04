import React, { useState, useMemo } from 'react';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import { EventLoggerProvider } from './context/EventLoggerContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChallengeView } from './components/ChallengeView';
import { CHALLENGES, CATEGORIES } from './challenges/registry';

export const AppContent: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(CHALLENGES[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filtered challenges
  const filteredChallenges = useMemo(() => {
    return CHALLENGES.filter((c) => {
      const matchesCategory =
        selectedCategory === 'All' || c.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Find currently active challenge (fallback to first filtered if current is filtered out)
  const currentChallenge = useMemo(() => {
    const found = CHALLENGES.find((c) => c.id === selectedId);
    if (found && filteredChallenges.some((c) => c.id === found.id)) {
      return found;
    }
    return filteredChallenges[0] || CHALLENGES[0];
  }, [selectedId, filteredChallenges]);

  return (
    <div className="app-container">
      <Header
        totalChallenges={CHALLENGES.length}
      />

      <div className="app-layout">
        <Sidebar
          challenges={filteredChallenges}
          selectedId={currentChallenge?.id || ''}
          onSelect={(id) => setSelectedId(id)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={CATEGORIES}
        />

        {currentChallenge && <ChallengeView challenge={currentChallenge} />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <EventLoggerProvider>
        <AppContent />
      </EventLoggerProvider>
    </ThemeProvider>
  );
}
