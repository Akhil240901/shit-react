# ⚛️ ReactLab — React Interview & Coding Test Workbench

A modern, extensible React + TypeScript workbench designed specifically for testing React concepts, practicing frontend interview coding challenges (e.g. `onClick` handlers, theme switcher, show/hide password, debouncing), and building custom interactive snippets.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production (TypeScript check & bundle)
npm run build
```

Your app runs at: **`http://localhost:5173/`**

---

## 🛠️ Project Structure

```
dont_React/
├── src/
│   ├── challenges/                 # 📂 All individual test/interview challenges
│   │   ├── types.ts                # TypeScript interfaces (Challenge, InterviewQA)
│   │   ├── registry.ts             # ⭐️ Central Registry: all challenges are listed here
│   │   ├── OnClickMastery.tsx      # onClick function edge cases & traps
│   │   ├── ShowHidePassword.tsx    # Password visibility toggle & strength meter
│   │   ├── ThemeSwitcherChallenge.tsx # Light/Dark theme switch & dynamic CSS tokens
│   │   ├── DebouncedSearch.tsx     # Debounced search & useEffect cleanup
│   │   ├── AccordionChallenge.tsx  # Single vs Multi expand accordion
│   │   └── FormValidation.tsx      # Form validation with touched & blur state
│   ├── components/                 # 🧩 Workbench UI components
│   │   ├── Header.tsx              # Navbar with theme toggle & guide modal button
│   │   ├── Sidebar.tsx             # Search, category filters & challenge cards
│   │   ├── ChallengeView.tsx       # Tabbed workspace (Playground, Code, Notes)
│   │   ├── CodeBlock.tsx           # Formatted code view with copy button
│   │   ├── EventLogger.tsx         # Live real-time event stream viewer
│   │   └── NewChallengeGuideModal.tsx # Interactive guide on how to add files
│   ├── context/
│   │   ├── ThemeContext.tsx        # Light/Dark mode state & localStorage persistence
│   │   └── EventLoggerContext.tsx  # Event logging stream for testing handlers
│   ├── App.tsx                     # Main layout coordinator
│   ├── App.css                     # Modern layout & component styling
│   ├── index.css                   # Theme engine & CSS variable tokens
│   └── main.tsx                    # Root React 19 entrypoint
```

---

## ➕ How to Add Your Own Test File in 2 Simple Steps

Whenever you want to test a new React concept or add a new interview coding problem:

### Step 1: Create your component file
Create a new file in `src/challenges/`, for example: `src/challenges/CounterTest.tsx`:

```tsx
import React, { useState } from 'react';
import { useEventLogger } from '../context/EventLoggerContext';

export const CounterTest: React.FC = () => {
  const [count, setCount] = useState(0);
  const { logEvent } = useEventLogger();

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    logEvent('onClick', `Incremented count to ${count + 1}`);
  };

  return (
    <div>
      <h3>Count: {count}</h3>
      <button onClick={handleIncrement} className="demo-btn">
        Increment
      </button>
    </div>
  );
};

export const counterTestCode = `// Code to display in the code viewer tab`;
```

### Step 2: Register it in `src/challenges/registry.ts`
Import your component and add it to the `CHALLENGES` array:

```ts
import { CounterTest, counterTestCode } from './CounterTest';

export const CHALLENGES: Challenge[] = [
  // ... existing challenges
  {
    id: 'my-counter-test',
    title: 'Custom Counter Test',
    category: 'State & Hooks', // 'Events' | 'Forms' | 'UI Patterns' | 'State & Hooks'
    difficulty: 'Beginner',    // 'Beginner' | 'Intermediate' | 'Advanced'
    tags: ['useState', 'onClick'],
    description: 'Testing increment handlers with event logging.',
    component: CounterTest,
    code: counterTestCode,
    tips: ['Use functional updater when depending on previous state.'],
    interviewQuestions: [
      { question: 'Why use setCount(prev => prev + 1)?', answer: 'Prevents stale state closure bugs.' }
    ],
    testChecklist: ['Click increments value by 1', 'Event is captured in event stream']
  }
];
```

That's it! Your new challenge automatically appears in the sidebar with full search, category filtering, live playground execution, syntax-highlighted code tab, and checklist tracking.

---

## ✨ Features Included

- ⚡ **Interactive Live Playground**: Run each component in isolation with a "Reset Canvas" button.
- 📡 **Real-Time Event Stream**: Live inspect `onClick`, `onChange`, `onBlur`, timers, and state transitions as they happen.
- 🎨 **Theme Engine**: Built-in Light and Dark mode with smooth transitions and dynamic accent colors.
- 🔍 **Instant Search & Category Filters**: Quickly find challenges by title, tag, or category.
- 📋 **Interview QA & Interactive Checklist**: Senior frontend questions, gotchas, and actionable test checklists.
- 🛡️ **Strict TypeScript & Vite**: Type-safe code structure with zero build warnings.
