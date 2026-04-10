import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [inquiries, setInquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [iqRes, userRes, orderRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/inquiries'),
          axios.get('http://localhost:5000/api/admin/users'),
          axios.get('http://localhost:5000/api/admin/orders'),
        ]);
        setInquiries(iqRes.data);
        setUsers(userRes.data);
        setOrders(orderRes.data);
      } catch (err) {
        console.error('Admin load error', err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      <section className="admin-section">
        <h3>All Inquiries</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Phone</th><th>Date</th><th>Guests</th></tr>
          </thead>
          <tbody>
            {inquiries.map((iq, i) => (
              <tr key={i}><td>{iq.name}</td><td>{iq.phone}</td><td>{iq.date}</td><td>{iq.guests}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="admin-section">
        <h3>Registered Users</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Phone</th><th>Email</th><th>DOB</th></tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}><td>{user.name}</td><td>{user.phone}</td><td>{user.email}</td><td>{user.dob}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="admin-section">
        <h3>All Orders</h3>
        <table>
          <thead>
            <tr><th>Order ID</th><th>User</th><th>Total</th><th>Date</th></tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.name || order.loginId}</td>
                <td>₹{order.total}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};
export default Admin;