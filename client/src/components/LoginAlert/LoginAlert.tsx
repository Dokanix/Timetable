import React, { useState } from 'react';
import styles from './LoginAlert.module.css';

interface LoginAlertProps {
  onLogin: () => void;
  onLogout: () => void;
  isLogged: boolean;
}

export default function LoginAlert(props: LoginAlertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then(() => props.onLogin())
      .catch((err) => setError(err.message));
  };

  const handleLogout = () => {
    fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(() => props.onLogout())
      .catch((err) => setError(err.message));
  };

  return (
    <div className={styles.container}>
      {props.isLogged ? (
        <button onClick={handleLogout} className={styles.button}>
          Sign Out
        </button>
      ) : (
        <button onClick={() => setIsOpen(true)} className={styles.button}>
          Sign In
        </button>
      )}
      {isOpen && !props.isLogged && (
        <div className={styles.modal}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <button className={styles.close} onClick={() => setIsOpen(false)}>
              x
            </button>
            <h2 className={styles.heading}>Sign In</h2>
            <label className={styles.label} htmlFor='username'>
              Username
            </label>
            <input
              className={styles.input}
              type='text'
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className={styles.label} htmlFor='password'>
              Password
            </label>
            <input
              className={styles.input}
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className={styles.error}>{error}</div>
            <button type='submit' className={styles.submit}>
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
