import React, { useState } from 'react';
import { Copy, Check, Code } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  fileName?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, fileName = 'Solution.tsx' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="code-viewer-container">
      <div className="code-viewer-header">
        <div className="code-file-name">
          <Code size={16} color="var(--accent-primary)" />
          <span>{fileName}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="copy-btn"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={14} color="var(--accent-emerald)" />
              <span style={{ color: 'var(--accent-emerald)' }}>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>
      <pre className="code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
};
