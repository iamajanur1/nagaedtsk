import { useState } from 'react';
import { registerUser } from '../api';
import { suggestUsernames } from '../ai';

const initialForm = { username: '', email: '', password: '', address: '' };

export default function Register({ onRegistered, onLogin }) {
  const [form, setForm] = useState(initialForm);
  const [interests, setInterests] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [error, setError] = useState('');
  const [suggestionError, setSuggestionError] = useState('');

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSuggest() {
    const values = interests.split(',').map(value => value.trim()).filter(Boolean);

    if (!values.length || values.length > 5) {
      setSuggestionError('Enter 1 to 5 interests, separated by commas.');
      return;
    }

    setSuggestionError('');
    setSuggestions([]);
    setSuggesting(true);

    try {
      setSuggestions(await suggestUsernames(values));
    } catch (err) {
      setSuggestionError(err.message);
    } finally {
      setSuggesting(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(form);
      onRegistered('Account created successfully. Sign in to continue.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card" aria-labelledby="register-title">
      <div className="card-heading">
        <span className="eyebrow">Create account</span>
        <h1 id="register-title">Get started</h1>
        <p>Enter your details to create an account.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="register-username">Username</label>
          <input
            id="register-username"
            name="username"
            value={form.username}
            onChange={updateField}
            autoComplete="username"
            pattern="[a-zA-Z0-9_]{3,40}"
            title="3–40 characters: letters, numbers or underscores"
            placeholder="e.g. john_dev"
            required
          />
        </div>

        <div className="suggestion-panel">
          <label htmlFor="register-interests">Need a username?</label>
          <p>Enter a few interests to get three AI suggestions.</p>
          <input
            id="register-interests"
            value={interests}
            onChange={event => setInterests(event.target.value)}
            placeholder="e.g. music, gaming, travel"
            maxLength={200}
          />
          <button type="button" className="secondary-button suggestion-button" onClick={handleSuggest} disabled={suggesting || loading}>
            {suggesting ? 'Generating...' : 'Suggest usernames'}
          </button>
          {suggestionError && <p className="suggestion-error" role="alert">{suggestionError}</p>}
          {suggestions.length > 0 && (
            <div className="suggestion-results" aria-label="Suggested usernames">
              {suggestions.map(name => (
                <button key={name} className="suggestion-choice" type="button" onClick={() => setForm({ ...form, username: name })}>
                  {name}
                </button>
              ))}
              <p>Click a suggestion to use it.</p>
            </div>
          )}
        </div>

        <div className="field">
          <label htmlFor="register-email">Email address</label>
          <input id="register-email" name="email" type="email" value={form.email} onChange={updateField}
            autoComplete="email" maxLength={254} placeholder="you@example.com" required />
        </div>
        <div className="field">
          <label htmlFor="register-password">Password</label>
          <input id="register-password" name="password" type="password" value={form.password} onChange={updateField}
            autoComplete="new-password" minLength={8} placeholder="At least 8 characters" required />
          <small>Use at least 8 characters.</small>
        </div>
        <div className="field">
          <label htmlFor="register-address">Address</label>
          <input id="register-address" name="address" value={form.address} onChange={updateField}
            autoComplete="street-address" minLength={5} maxLength={255} placeholder="Your city and state" required />
        </div>

        {error && <p className="alert error" role="alert">{error}</p>}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="switch-view">
        Already have an account?{' '}
        <button type="button" className="text-button" onClick={onLogin}>Sign in</button>
      </p>
    </section>
  );
}
