import React, { useState } from 'react';
import { X, PlusCircle, Check, Copy, FileCode, CheckSquare, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const BOILERPLATE_CODE = `// 1. Create file: src/challenges/MyNewChallenge.tsx
import React, { useState } from 'react';
import { useEventLogger } from '../context/EventLoggerContext';

export const MyNewChallenge: React.FC = () => {
  const [value, setValue] = useState('');
  const { logEvent } = useEventLogger();

  const handleAction = () => {
    logEvent('onClick', 'Triggered custom action!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <h4>My React Test Component</h4>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          logEvent('onChange', e.target.value);
        }}
        placeholder="Type here..."
        className="demo-input"
      />
      <button type="button" onClick={handleAction} className="demo-btn">
        Run Test Action
      </button>
    </div>
  );
};

export const myNewChallengeCode = \`// Source code to display in the Code tab
export const MyNewChallenge = () => {
  // your solution here
};\`;
`;

export const NewChallengeGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(BOILERPLATE_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <PlusCircle size={22} color="var(--accent-primary)" />
            <span>How to Add Your Own Tests & Challenges</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ lineHeight: 1.6 }}>
            The app is designed so you can effortlessly drop in small React interview exercises,
            test snippets, or feature prototypes in just <b>two simple steps</b>:
          </p>

          {/* Step 1 */}
          <div className="step-card">
            <div className="step-title">
              <FileCode size={16} color="var(--accent-cyan)" />
              <span>Step 1: Create your component file</span>
            </div>
            <p style={{ fontSize: '0.825rem' }}>
              Create a new TypeScript file inside <code style={{ color: 'var(--accent-primary)' }}>src/challenges/MySnippet.tsx</code>.
              You can use the helper <code style={{ color: 'var(--accent-emerald)' }}>useEventLogger()</code> hook to log live clicks and state updates.
            </p>
          </div>

          {/* Step 2 */}
          <div className="step-card">
            <div className="step-title">
              <CheckSquare size={16} color="var(--accent-emerald)" />
              <span>Step 2: Add 1 entry to the registry</span>
            </div>
            <p style={{ fontSize: '0.825rem' }}>
              Open <code style={{ color: 'var(--accent-primary)' }}>src/challenges/registry.ts</code> and append your challenge to the <code style={{ color: 'var(--accent-cyan)' }}>CHALLENGES</code> array:
            </p>
            <div className="step-code">
{`{
  id: 'my-snippet',
  title: 'My Custom Feature Test',
  category: 'Events', // or 'Forms', 'UI Patterns', 'State & Hooks'
  difficulty: 'Beginner', // 'Beginner' | 'Intermediate' | 'Advanced'
  tags: ['useState', 'events'],
  description: 'Testing my custom React logic and handlers.',
  component: MyNewChallenge,
  code: myNewChallengeCode,
  tips: ['Interview tips here'],
  interviewQuestions: [{ question: '...', answer: '...' }],
  testChecklist: ['Check requirement 1', 'Check requirement 2']
}`}
            </div>
          </div>

          {/* Step 3: Starter Template */}
          <div className="step-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div className="step-title" style={{ margin: 0 }}>
                <Sparkles size={16} color="var(--accent-amber)" />
                <span>Ready-to-use Boilerplate Template</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="copy-btn"
              >
                {copied ? (
                  <>
                    <Check size={12} color="var(--accent-emerald)" />
                    <span style={{ color: 'var(--accent-emerald)' }}>Copied Template!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Boilerplate</span>
                  </>
                )}
              </button>
            </div>
            <div className="step-code" style={{ maxHeight: '160px' }}>
              {BOILERPLATE_CODE}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
