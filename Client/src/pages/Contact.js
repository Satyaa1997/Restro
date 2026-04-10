import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [form, setForm] = useState({ name: '', phone: '', date: '', guests: '' });
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/inquiry', form);
      setSuccess(res.data.details || form);
      setForm({ name: '', phone: '', date: '', guests: '' });
    } catch (err) {
      setSuccess({ error: 'Submission failed. Please try again.' });
    }
  };

  return (
    <div className="contact-page">
      <h2>Table Inquiry</h2>
      {!success ? (
        <form onSubmit={handleSubmit} className="inquiry-form">
          <input type="text" placeholder="Your Name" onChange={(e) => setForm({...form, name: e.target.value})} required />
          <input type="text" placeholder="Phone Number" onChange={(e) => setForm({...form, phone: e.target.value})} required />
          <input type="date" onChange={(e) => setForm({...form, date: e.target.value})} required />
          <input type="number" placeholder="Guests" onChange={(e) => setForm({...form, guests: e.target.value})} required />
          <button type="submit">Submit Inquiry</button>
        </form>
      ) : (
        <div className="success-msg">
          <h3>✅ Booking Confirmed!</h3>
          <p>Name: {success.name} | Guests: {success.guests} | Date: {success.date}</p>
        </div>
      )}
    </div>
  );
};
export default Contact;