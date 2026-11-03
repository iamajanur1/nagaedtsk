import { useState } from 'react';
import { loginUser } from '../api';

export default function Login({ onLoggedIn, onRegister, notice }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(form);
      onLoggedIn(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card" aria-labelledby="login-title">
      <div className="card-heading">
        <span className="eyebrow">Welcome back</span>
        <h1 id="login-title">Sign in</h1>
        <p>Use your account credentials to continue.</p>
      </div>

      {notice && <p className="alert success" role="status">{notice}</p>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p className="alert error" role="alert">{error}</p>}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="switch-view">
        New here?{' '}
        <button type="button" className="text-button" onClick={onRegister}>Create an account</button>
      </p>
    </section>
  );
}
