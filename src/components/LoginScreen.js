import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Building } from 'lucide-react';
import './LoginScreen.css';

const LoginScreen = ({ onLogin }) => {
  const [cred, setCred] = useState({ user: '', pass: '' });
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState('');

  const update = (k, v) => {
    setCred(o => ({ ...o, [k]: v }));
    if (error) setError('');
  };

  const submit = e => {
    e.preventDefault(); setLoad(true);

    setTimeout(() => {
      if (cred.user === 'taha.shah' && cred.pass === '12345') {
        onLogin({
          username: 'taha.shah',
          name: 'Taha Shah',
          loginTime: Date.now()
        });
      } else {
        setError('Invalid username or password');
      }
      setLoad(false);
    }, 1200);
  };

  return (
    <div className="login-screen">
      {/* Motive logo link — top-right */}
      <a
        href="https://gomotive.com/"
        className="logo-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://i.ibb.co/ynWK9yh3/motive-logo-png-seeklogo-439337-removebg-preview.webp"
          alt="Motive"
          className="logo-img"
        />
      </a>

      <form className="card" onSubmit={submit}>
        <header className="header">
          <Building size={24} className="hdr-icon" />
          <h1>Annotations</h1>
          <h2>Performance Dashboard</h2>
          <p>Sign in to access your QA insights</p>
        </header>

        <div className="field">
          <User className="icon" size={18} />
          <input
            placeholder=" "
            required
            value={cred.user}
            onChange={e => update('user', e.target.value)}
          />
          <label>Username</label>
        </div>

        <div className="field">
          <Lock className="icon" size={18} />
          <input
            type={show ? 'text' : 'password'}
            placeholder=" "
            required
            value={cred.pass}
            onChange={e => update('pass', e.target.value)}
          />
          <label>Password</label>
          <button
            type="button"
            className="eye"
            onClick={() => setShow(!show)}
            aria-label="Toggle password visibility"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <div className="alert">{error}</div>}

        <button className="btn" disabled={load}>
          {load ? <span className="spin" /> : 'Sign In'}
        </button>

        <footer className="foot">© 2025 Motive Technologies</footer>
      </form>
    </div>
  );
};

export default LoginScreen;
