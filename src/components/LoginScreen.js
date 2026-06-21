import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Building, Users } from 'lucide-react';
import './LoginScreen.css';

const MANAGER_ACCOUNTS = {
  'ahmed.daniyal': { name: 'Ahmed Daniyal', title: 'Operations Manager' }
};

const LoginScreen = ({ onLogin }) => {
  const [role, setRole] = useState('annotator');
  const [cred, setCred] = useState({ user: '', pass: '' });
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState('');

  const update = (k, v) => {
    setCred(o => ({ ...o, [k]: v }));
    if (error) setError('');
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    setCred({ user: '', pass: '' });
    setError('');
  };

  const submit = e => {
    e.preventDefault(); setLoad(true);

    setTimeout(() => {
      if (role === 'annotator') {
        if (cred.user === 'taha.shah' && cred.pass === '12345') {
          onLogin({
            username: 'taha.shah',
            name: 'Taha Shah',
            pod: 'Pod A - Road Safety',
            role: 'annotator',
            loginTime: Date.now()
          });
        } else {
          setError('Invalid username or password');
        }
      } else {
        const manager = MANAGER_ACCOUNTS[cred.user];
        if (manager && cred.pass === 'manager123') {
          onLogin({
            username: cred.user,
            name: manager.name,
            title: manager.title,
            role: 'manager',
            loginTime: Date.now()
          });
        } else {
          setError('Invalid username or password');
        }
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
        <div className="role-switch">
          <button
            type="button"
            className={`role-btn ${role === 'annotator' ? 'active' : ''}`}
            onClick={() => switchRole('annotator')}
          >
            <User size={16} /> Annotator
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'manager' ? 'active' : ''}`}
            onClick={() => switchRole('manager')}
          >
            <Users size={16} /> Manager
          </button>
        </div>

        <header className="header">
          <Building size={24} className="hdr-icon" />
          {role === 'annotator' ? (
            <>
              <h1>Annotations</h1>
              <h2>Performance Dashboard</h2>
              <p>Sign in to access your QA insights and KPIs</p>
            </>
          ) : (
            <>
              <h1>Manager</h1>
              <h2>Team Performance Console</h2>
              <p>Sign in to review coordinator and annotator performance</p>
            </>
          )}
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

        <p className="demo-hint">
          {role === 'annotator'
            ? 'Demo: taha.shah / 12345'
            : 'Demo: ahmed.daniyal / manager123'}
        </p>

        <footer className="foot">© 2025 Motive Technologies</footer>
      </form>
    </div>
  );
};

export default LoginScreen;
