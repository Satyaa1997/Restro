import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUser }) => {
  const [form, setForm] = useState({ loginId: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/login', form);
      const userData = { ...res.data.user };
      localStorage.setItem('urbanspoonUser', JSON.stringify(userData));
      setUser(userData);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    }
  };

  return (
    <div className="auth-page">
      <h2>User Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input value={form.loginId} onChange={(e) => setForm({ ...form, loginId: e.target.value })} placeholder="Login ID" required />
        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password" required />
        <button type="submit">Login</button>
      </form>
      {error && <div className="alert alert-error">{error}</div>}
    </div>
  );
};

export default Login;
