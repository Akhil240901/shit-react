import React, { useState } from 'react';
import { Play, Code, BookOpen, RotateCcw, CheckSquare, HelpCircle, Lightbulb } from 'lucide-react';
import type { Challenge } from '../challenges/types';
import { CodeBlock } from './CodeBlock';
import { EventLogger } from './EventLogger';

interface ChallengeViewProps {
  challenge: Challenge;
}

type TabType = 'preview' | 'code' | 'interview';

export const ChallengeView: React.FC<ChallengeViewProps> = ({ challenge }) => {
  const [activeTab, setActiveTab] = useState<TabType>('preview');
  const [remountKey, setRemountKey] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleReset = () => {
    setRemountKey((prev) => prev + 1);
  };

  const toggleCheck = (index: number) => {
    const key = `${challenge.id}-${index}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const completedCount = challenge.testChecklist.filter(
    (_, idx) => !!checkedItems[`${challenge.id}-${idx}`]
  ).length;

  const ActiveComponent = challenge.component;

  const diffClass =
    challenge.difficulty === 'Beginner'
      ? 'difficulty-beginner'
      : challenge.difficulty === 'Intermediate'
      ? 'difficulty-intermediate'
      : 'difficulty-advanced';

  return (
    <main className="workspace">
      {/* Challenge Banner */}
      <section className="challenge-banner">
        <div className="banner-top-row">
          <div className="banner-meta">
            <span className="category-badge">{challenge.category}</span>
            <span className={`difficulty-badge ${diffClass}`}>
              {challenge.difficulty}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Checklist: <b style={{ color: 'var(--accent-emerald)' }}>{completedCount}/{challenge.testChecklist.length} tested</b>
            </span>
          </div>
        </div>

        <h1 className="banner-title">{challenge.title}</h1>
        <p className="banner-description">{challenge.description}</p>

        <div className="banner-tags">
          {challenge.tags.map((tag) => (
            <span key={tag} className="tag-badge">
              #{tag}
            </span>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <nav className="workspace-tabs" aria-label="Challenge workspace tabs">
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
        >
          <Play size={16} />
          <span>Interactive Playground</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('code')}
          className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
        >
          <Code size={16} />
          <span>Code & Solution</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('interview')}
          className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
        >
          <BookOpen size={16} />
          <span>Interview QA & Checklist ({completedCount}/{challenge.testChecklist.length})</span>
        </button>
      </nav>

      {/* Tab Panels */}
      {activeTab === 'preview' && (
        <div className="playground-container">
          <div className="playground-card">
            <div className="playground-toolbar">
              <div className="playground-toolbar-title">
                <Play size={15} color="var(--accent-primary)" />
                <span>Live Component Canvas</span>
              </div>
              <div className="toolbar-actions">
                <button
                  type="button"
                  onClick={handleReset}
                  className="toolbar-btn"
                  title="Reset component state to initial values"
                >
                  <RotateCcw size={13} />
                  Reset Canvas
                </button>
              </div>
            </div>

            <div className="playground-stage">
              <div className="component-demo-wrapper">
                <ActiveComponent key={remountKey} />
              </div>
            </div>
          </div>

          {/* Integrated Real-Time Event Stream */}
          <EventLogger />
        </div>
      )}

      {activeTab === 'code' && (
        <CodeBlock code={challenge.code} fileName={`${challenge.id}.tsx`} />
      )}

      {activeTab === 'interview' && (
        <div className="notes-container">
          {/* Interview Questions Card */}
          <div className="notes-card">
            <h3 className="notes-card-title">
              <HelpCircle size={18} color="var(--accent-primary)" />
              <span>Key Interview Questions & Answers</span>
            </h3>

            <div>
              {challenge.interviewQuestions.map((qa, idx) => (
                <div key={idx} className="interview-qa-item">
                  <div className="qa-question">
                    Q{idx + 1}: {qa.question}
                  </div>
                  <div className="qa-answer">{qa.answer}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-amber)', marginBottom: '8px' }}>
                <Lightbulb size={16} />
                <span>Senior Dev Tips & Gotchas</span>
              </div>
              <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {challenge.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Test Checklist Card */}
          <div className="notes-card">
            <h3 className="notes-card-title">
              <CheckSquare size={18} color="var(--accent-emerald)" />
              <span>Test My React Checklist</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Check off each behavior as you test it in the Interactive Playground:
            </p>

            <div className="checklist-list">
              {challenge.testChecklist.map((item, idx) => {
                const key = `${challenge.id}-${idx}`;
                const isChecked = !!checkedItems[key];

                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`checklist-item ${isChecked ? 'checked' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="checklist-checkbox"
                    />
                    <span className="checklist-text">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
