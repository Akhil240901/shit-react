import React, { useState } from 'react';
import { Mail, User, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { useEventLogger } from '../context/EventLoggerContext';

interface FormState {
  username: string;
  email: string;
  terms: boolean;
}

interface FormErrors {
  username?: string;
  email?: string;
  terms?: string;
}

export const FormValidationChallenge: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    username: '',
    email: '',
    terms: false
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { logEvent } = useEventLogger();

  // Real-time validation logic
  const getErrors = (values: FormState): FormErrors => {
    const errs: FormErrors = {};

    if (!values.username.trim()) {
      errs.username = 'Username is required';
    } else if (values.username.length < 3) {
      errs.username = 'Must be at least 3 characters';
    }

    if (!values.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errs.email = 'Invalid email address format';
    }

    if (!values.terms) {
      errs.terms = 'You must accept the terms';
    }

    return errs;
  };

  const errors = getErrors(formData);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    logEvent('onChange', `Field [${name}] changed`);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    logEvent('onBlur', `Field [${field}] blurred`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, email: true, terms: true });

    if (isValid) {
      setIsSubmitted(true);
      logEvent('onSubmit:Success', `Form submitted with: ${JSON.stringify(formData)}`);
      setTimeout(() => setIsSubmitted(false), 3000);
    } else {
      logEvent('onSubmit:Failed', `Form invalid with errors: ${Object.keys(errors).join(', ')}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {isSubmitted && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 14px',
          borderRadius: '8px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: 'var(--accent-emerald)',
          fontSize: '0.85rem'
        }}>
          <CheckCircle size={18} />
          <span>Form successfully validated and submitted!</span>
        </div>
      )}

      {/* Username Field */}
      <div>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
          Username
        </label>
        <div style={{ position: 'relative' }}>
          <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={() => handleBlur('username')}
            placeholder="e.g. alexdev"
            className="demo-input"
            style={{
              paddingLeft: '38px',
              borderColor: touched.username && errors.username ? 'var(--accent-rose)' : undefined
            }}
          />
        </div>
        {touched.username && errors.username && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-rose)', fontSize: '0.75rem', marginTop: '4px' }}>
            <AlertCircle size={12} />
            <span>{errors.username}</span>
          </div>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
          Email Address
        </label>
        <div style={{ position: 'relative' }}>
          <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            placeholder="e.g. alex@example.com"
            className="demo-input"
            style={{
              paddingLeft: '38px',
              borderColor: touched.email && errors.email ? 'var(--accent-rose)' : undefined
            }}
          />
        </div>
        {touched.email && errors.email && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-rose)', fontSize: '0.75rem', marginTop: '4px' }}>
            <AlertCircle size={12} />
            <span>{errors.email}</span>
          </div>
        )}
      </div>

      {/* Terms Checkbox */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="checkbox"
          name="terms"
          id="terms-check"
          checked={formData.terms}
          onChange={handleChange}
          onBlur={() => handleBlur('terms')}
          style={{ cursor: 'pointer', accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
        />
        <label htmlFor="terms-check" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          I agree to the interview sandbox guidelines
        </label>
      </div>
      {touched.terms && errors.terms && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-rose)', fontSize: '0.75rem', marginTop: '-8px' }}>
          <AlertCircle size={12} />
          <span>{errors.terms}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isValid && Object.keys(touched).length > 0}
        className="demo-btn"
        style={{ marginTop: '8px' }}
      >
        <Send size={14} />
        Submit Form
      </button>
    </form>
  );
};

export const formValidationCode = `import React, { useState } from 'react';

export const ValidatedForm = () => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (formValues = values) => {
    const errs: Record<string, string> = {};
    if (!formValues.email) {
      errs.email = 'Email required';
    } else if (!/\\S+@\\S+\\.\\S+/.test(formValues.email)) {
      errs.email = 'Invalid email';
    }
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    if (touched[name]) {
      setErrors(validate(nextValues));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log('Submitted successfully!', values);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.email && errors.email && <span>{errors.email}</span>}
      <button type="submit">Submit</button>
    </form>
  );
};`;
