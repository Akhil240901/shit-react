import type { Challenge } from './types';
import { ShowHidePasswordChallenge, showHidePasswordCode } from './ShowHidePassword';
import { ThemeSwitcherChallenge, themeSwitcherCode } from './ThemeSwitcherChallenge';
import { OnClickMasteryChallenge, onClickMasteryCode } from './OnClickMastery';
import { DebouncedSearchChallenge, debouncedSearchCode } from './DebouncedSearch';
import { AccordionChallenge, accordionCode } from './AccordionChallenge';
import { FormValidationChallenge, formValidationCode } from './FormValidation';

export const CHALLENGES: Challenge[] = [
  {
    id: 'onclick-mastery',
    title: 'OnClick Function Mastery & Traps',
    category: 'Events',
    difficulty: 'Intermediate',
    tags: ['onClick', 'event-bubbling', 'functional-updater', 'batching'],
    description: 'Master onClick event handlers, passing parameters, stopping event bubbling with e.stopPropagation(), and solving the classic React stale state batching trap.',
    component: OnClickMasteryChallenge,
    code: onClickMasteryCode,
    tips: [
      'Avoid calling functions directly like onClick={handleClick()} as that invokes them immediately on render instead of on click.',
      'Use functional updater setCount(prev => prev + 1) when new state depends on prior state or when multiple updates occur synchronously.',
      'Always consider e.stopPropagation() if a button is nested inside a clickable row or card.',
      'For heavy lists, avoid creating anonymous arrow functions inside JSX loops; use event delegation or memoized handlers.'
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between onClick={handleClick} and onClick={() => handleClick()}?',
        answer: 'onClick={handleClick} passes the function reference directly, receiving the React SyntheticEvent as the first parameter. onClick={() => handleClick()} creates an anonymous wrapper function on every render, which is useful when passing custom arguments (e.g. ID), but may cause unnecessary re-renders in memoized children.'
      },
      {
        question: 'Why does setCount(count + 1) called 3 times in a single event handler only increment by 1?',
        answer: 'In React, state updates inside event handlers are batched, and the "count" variable in that render closure remains constant. Each call executes setCount(0 + 1). To queue updates correctly, use functional updaters: setCount(prev => prev + 1).'
      },
      {
        question: 'How do you prevent a button click from triggering the parent card click?',
        answer: 'Call e.stopPropagation() inside the child button click handler to halt event bubbling up the DOM tree.'
      }
    ],
    testChecklist: [
      'Direct onClick increments count by current step',
      'Step selector updates increment amount',
      'Tested stale closure trap: setCount(count + 1) vs functional updater',
      'Verified e.stopPropagation() blocks parent container event'
    ]
  },
  {
    id: 'show-hide-password',
    title: 'Show / Hide Password Toggle',
    category: 'Forms',
    difficulty: 'Beginner',
    tags: ['useState', 'forms', 'accessibility', 'input-type'],
    description: 'Implement a password input with a toggleable eye icon to switch between type="password" and type="text", password strength indicator, and copy to clipboard.',
    component: ShowHidePasswordChallenge,
    code: showHidePasswordCode,
    tips: [
      'Toggle the input `type` attribute dynamically between "text" and "password".',
      'Always include aria-label on the toggle icon button for screen reader accessibility.',
      'Ensure the button has type="button" to prevent accidentally submitting forms.',
      'Clean up any clipboard feedback timers if the component unmounts.'
    ],
    interviewQuestions: [
      {
        question: 'How do you toggle input visibility in React without manipulating the DOM directly?',
        answer: 'Declare a boolean state with useState (e.g., const [show, setShow] = useState(false)) and conditionally assign type={show ? "text" : "password"} to the input element.'
      },
      {
        question: 'Why must the toggle button have type="button" inside forms?',
        answer: 'By default in HTML, buttons inside a <form> default to type="submit". Without type="button", clicking the eye icon will submit the form and trigger validation or page reload.'
      },
      {
        question: 'How do you ensure password toggle buttons are accessible (a11y)?',
        answer: 'Provide an aria-label like aria-label={show ? "Hide password" : "Show password"} and optionally aria-controls pointing to the input id.'
      }
    ],
    testChecklist: [
      'Clicking eye button toggles input between type="password" and type="text"',
      'Button icon switches between Eye and EyeOff',
      'Copy button writes password to clipboard',
      'Password strength bar updates dynamically as text is typed'
    ]
  },
  {
    id: 'theme-change',
    title: 'Theme Switcher & Dynamic Token Engine',
    category: 'UI Patterns',
    difficulty: 'Intermediate',
    tags: ['useContext', 'CSS-variables', 'theme', 'localStorage'],
    description: 'Toggle between Dark and Light modes using React Context, CSS Custom Properties, and localStorage persistence, plus dynamic brand accent colors.',
    component: ThemeSwitcherChallenge,
    code: themeSwitcherCode,
    tips: [
      'Use CSS variables on document.documentElement (root) instead of inline styles for performant, cascade-wide theme switching.',
      'Persist the user preference in localStorage and fall back to window.matchMedia("(prefers-color-scheme: dark)").',
      'Wrap your app with a ThemeProvider and custom useTheme() hook.'
    ],
    interviewQuestions: [
      {
        question: 'What are the pros and cons of Context API vs CSS Custom Properties for theme switching?',
        answer: 'Context API is great for reactive React state and conditionally rendering different assets/icons. CSS Custom Properties are much faster for stylesheet switching because changing a root CSS variable does not trigger widespread React re-renders.'
      },
      {
        question: 'How do you prevent a theme flash (FOUC) on initial page load in SSR/Next.js/React?',
        answer: 'Inject an inline script in the <head> before the DOM renders that checks localStorage or prefers-color-scheme and applies the data-theme attribute directly to the <html> tag.'
      }
    ],
    testChecklist: [
      'Clicking theme button switches between Light and Dark',
      'Selecting brand accent updates CSS variable tokens in real time',
      'Active theme persists in browser localStorage'
    ]
  },
  {
    id: 'debounced-search',
    title: 'Debounced Search & Effect Cleanup',
    category: 'State & Hooks',
    difficulty: 'Intermediate',
    tags: ['useEffect', 'setTimeout', 'useDebounce', 'cleanup'],
    description: 'Implement an instant search filter that debounces queries by 500ms using useEffect cleanup to avoid firing excessive API requests on every single keystroke.',
    component: DebouncedSearchChallenge,
    code: debouncedSearchCode,
    tips: [
      'Always return a cleanup function from useEffect that invokes clearTimeout(timer).',
      'Separate the immediate user input state from the debounced query state so the input remains snappy.',
      'Abstract the debounce logic into a reusable custom hook: useDebounce(value, delay).'
    ],
    interviewQuestions: [
      {
        question: 'What is debouncing and how does it differ from throttling?',
        answer: 'Debouncing delays function execution until a certain amount of time has elapsed since the last event (e.g. search keystroke). Throttling limits function execution to at most once per specified time interval (e.g. scroll or resize events).'
      },
      {
        question: 'Why is the cleanup function in useEffect essential for debouncing?',
        answer: 'Every time the user types a new character, the component re-renders. The cleanup function clears the previous pending setTimeout timer before scheduling the new one, ensuring only the final paused input triggers the action.'
      }
    ],
    testChecklist: [
      'Input updates immediately without input lag',
      'Debounce indicator shows countdown delay',
      'API query triggers only after 500ms pause in typing',
      'Filter list updates correctly with matching hooks'
    ]
  },
  {
    id: 'accordion-expand',
    title: 'Accordion (Single vs Multi-Expand)',
    category: 'UI Patterns',
    difficulty: 'Beginner',
    tags: ['useState', 'accordion', 'conditional-rendering', 'aria'],
    description: 'Build an accessible FAQ accordion with smooth chevron rotation, support for single-open vs multi-open modes, and state-driven collapsible content.',
    component: AccordionChallenge,
    code: accordionCode,
    tips: [
      'For single-item accordion, store activeId: string | null.',
      'For multi-item accordion, store openIds: string[] or a Set.',
      'Set aria-expanded={isOpen} and aria-controls on the trigger button for accessibility.'
    ],
    interviewQuestions: [
      {
        question: 'How should you structure state when an accordion can switch between single and multi-select?',
        answer: 'Using an array of IDs (e.g., string[]) is flexible because single-expand mode can simply clamp the array to at most 1 item, while multi-expand allows toggling any item in and out of the array.'
      },
      {
        question: 'What ARIA attributes are required for accessible disclosure widgets/accordions?',
        answer: 'The button should have aria-expanded="true|false" and aria-controls="content-id". The content region should have id="content-id" and role="region".'
      }
    ],
    testChecklist: [
      'Clicking header expands / collapses item',
      'Switching between Single and Multi mode preserves consistency',
      'Chevron rotates 180 degrees smoothly',
      'ARIA expanded attributes reflect open state'
    ]
  },
  {
    id: 'form-validation',
    title: 'Form Validation with Touched State',
    category: 'Forms',
    difficulty: 'Intermediate',
    tags: ['forms', 'validation', 'touched', 'errors'],
    description: 'Build a form with instant validation, touched/blur state tracking to prevent premature errors, regex format checking, and disabled submit states.',
    component: FormValidationChallenge,
    code: formValidationCode,
    tips: [
      'Do not display error messages before a user has touched or blurred an input, as it creates poor UX.',
      'Compute errors as derived state from formData rather than storing duplicate state variables.',
      'Always prevent default form submission via e.preventDefault().'
    ],
    interviewQuestions: [
      {
        question: 'What is the "touched" state pattern in forms and why is it used?',
        answer: 'The touched pattern tracks which fields the user has visited (via onBlur). Errors are only shown if a field is touched, avoiding showing red validation errors on empty fields before the user even begins typing.'
      },
      {
        question: 'What is the difference between Controlled and Uncontrolled components?',
        answer: 'Controlled components have their value managed by React state via value and onChange. Uncontrolled components keep their own internal state in the DOM, accessed via React refs (useRef).'
      }
    ],
    testChecklist: [
      'Errors only show after field is touched/blurred or submitted',
      'Email regex validates valid formats',
      'Submit button disables when errors are present',
      'Successful submission displays confirmation banner'
    ]
  }
];

export const CATEGORIES = [
  'All',
  'Events',
  'Forms',
  'UI Patterns',
  'State & Hooks'
] as const;
