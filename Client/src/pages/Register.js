import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', dob: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      const res = await axios.post('http://localhost:5000/api/register', form);
      setResult(res.data);
      setForm({ name: '', phone: '', email: '', dob: '' });
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Registration failed. Please start the backend server and try again.';
      setError(message);
    }
  };

  return (
    <div className="auth-page">
      <h2>Register New User</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name" required />
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Mobile Number" required />
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" required />
        <input value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} type="date" required />
        <button type="submit">Register</button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}
      {result && (
        <div className="alert alert-success">
          <h4>Registration successful!</h4>
          <p>Your login credentials:</p>
          <p><strong>Login ID:</strong> {result.loginId}</p>
          <p><strong>Password:</strong> {result.password}</p>
          <p>Use these credentials on the login page to view your order history.</p>
        </div>
      )}
    </div>
  );
};

export default Register;
