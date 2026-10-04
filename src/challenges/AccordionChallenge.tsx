import React, { useState } from 'react';
import { ChevronDown, Sliders, Layers } from 'lucide-react';
import { useEventLogger } from '../context/EventLoggerContext';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

const FAQS: AccordionItem[] = [
  {
    id: 'virtual-dom',
    title: 'What is the Virtual DOM and how does React reconciliation work?',
    content: 'The Virtual DOM is a lightweight in-memory representation of the real DOM tree. When state changes, React creates a new VDOM tree, computes differences with the previous one (Diffing algorithm), and applies only the minimal necessary updates to the actual DOM in a batch.'
  },
  {
    id: 'pure-components',
    title: 'When should you use useMemo and useCallback?',
    content: 'useMemo caches expensive calculations between re-renders, while useCallback caches function references so child components wrapped in React.memo do not unnecessarily re-render on parent render.'
  },
  {
    id: 'keys-importance',
    title: 'Why should you never use index as key for dynamic lists?',
    content: 'Using array index as keys causes subtle bugs when items are reordered, inserted, or deleted. React relies on persistent keys to associate DOM elements with internal fiber node state.'
  }
];

export const AccordionChallenge: React.FC = () => {
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [expandedIds, setExpandedIds] = useState<string[]>(['virtual-dom']);
  const { logEvent } = useEventLogger();

  const handleToggle = (id: string, title: string) => {
    if (allowMultiple) {
      setExpandedIds((prev) => {
        const isCurrentlyOpen = prev.includes(id);
        const next = isCurrentlyOpen ? prev.filter((item) => item !== id) : [...prev, id];
        logEvent('onClick', `Multi Accordion [${title}]: ${isCurrentlyOpen ? 'Collapsed' : 'Expanded'}`);
        return next;
      });
    } else {
      setExpandedIds((prev) => {
        const isCurrentlyOpen = prev.includes(id);
        const next = isCurrentlyOpen ? [] : [id];
        logEvent('onClick', `Single Accordion [${title}]: ${isCurrentlyOpen ? 'Collapsed' : 'Expanded'}`);
        return next;
      });
    }
  };

  const handleModeSwitch = () => {
    const nextMode = !allowMultiple;
    setAllowMultiple(nextMode);
    // If switching to single mode, retain only the first expanded item
    if (!nextMode && expandedIds.length > 1) {
      setExpandedIds([expandedIds[0]]);
    }
    logEvent('ModeSwitch', `Accordion mode switched to: ${nextMode ? 'ALLOW MULTIPLE' : 'SINGLE ITEM ONLY'}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Control Switch */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        borderRadius: '8px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
          <Sliders size={16} color="var(--accent-primary)" />
          <span>Multi-Expand Mode</span>
        </div>

        <button
          type="button"
          onClick={handleModeSwitch}
          style={{
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: allowMultiple ? 'var(--accent-primary)' : 'var(--bg-card)',
            color: allowMultiple ? '#fff' : 'var(--text-secondary)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Layers size={12} />
          {allowMultiple ? 'Multi-Expand: ON' : 'Single Expand: ON'}
        </button>
      </div>

      {/* Accordion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {FAQS.map((faq) => {
          const isOpen = expandedIds.includes(faq.id);

          return (
            <div
              key={faq.id}
              style={{
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: isOpen ? 'var(--bg-active)' : 'var(--bg-card)',
                transition: 'all var(--transition-fast)',
                overflow: 'hidden'
              }}
            >
              <button
                type="button"
                onClick={() => handleToggle(faq.id, faq.title)}
                aria-expanded={isOpen}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  background: 'transparent',
                  color: isOpen ? 'var(--accent-primary)' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                <span>{faq.title}</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                    flexShrink: 0,
                    marginLeft: '12px'
                  }}
                />
              </button>

              {isOpen && (
                <div style={{
                  padding: '0 16px 16px 16px',
                  fontSize: '0.825rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '12px',
                  animation: 'fadeIn 0.2s ease-in-out'
                }}>
                  {faq.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const accordionCode = `import React, { useState } from 'react';

interface Item {
  id: string;
  title: string;
  content: string;
}

export const Accordion = ({ items, allowMultiple = false }: { items: Item[]; allowMultiple?: boolean }) => {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className="accordion">
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="accordion-item">
            <button onClick={() => toggleItem(item.id)} aria-expanded={isOpen}>
              {item.title}
              <span>{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && <div className="accordion-content">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
};`;
