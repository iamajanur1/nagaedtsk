import { useEffect, useState } from 'react';
import { getUser } from './api';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const id = sessionStorage.getItem('userId');
    let active = true;

    if (!token || !id) {
      setCheckingSession(false);
      return;
    }

    getUser(id, token)
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401 || error.status === 403 || error.status === 404) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('userId');
          setNotice('Your session has ended. Please sign in again.');
        } else {
          setNotice('Unable to restore your session. Please sign in again.');
        }
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });

    return () => { active = false; };
  }, []);

  function handleLoggedIn(data) {
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('userId', String(data.user.id));
    setNotice('');
    setUser(data.user);
  }

  function handleLogout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    setUser(null);
    setView('login');
    setNotice('You have signed out.');
  }

  function showRegister() {
    setNotice('');
    setView('register');
  }

  function showLogin() {
    setNotice('');
    setView('login');
  }

  return (
    <main className="page">
      <header className="brand">
        <span className="brand-mark" aria-hidden="true">A</span>
        <span>Account <span className="brand-light">Portal</span></span>
      </header>

      {checkingSession ? (
        <div className="auth-card loading-card" role="status">Checking your session...</div>
      ) : user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : view === 'register' ? (
        <Register onRegistered={(message) => {
          setNotice(message);
          setView('login');
        }} onLogin={showLogin} />
      ) : (
        <Login onLoggedIn={handleLoggedIn} onRegister={showRegister} notice={notice} />
      )}

    </main>
  );
}
