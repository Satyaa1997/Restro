import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = ({ currentUser }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/api/orders?userId=${currentUser.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="profile-page">
        <h2>Please log in to view your profile and order history.</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {currentUser.name}</p>
        <p><strong>Mobile:</strong> {currentUser.phone}</p>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Date of Birth:</strong> {currentUser.dob}</p>
      </div>

      <div className="order-history">
        <h3>Previous Orders</h3>
        {loading ? (
          <p>Loading order history...</p>
        ) : orders.length ? (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Total:</strong> ₹{order.total}</p>
                <div className="order-items">
                  {order.items.map((item) => (
                    <p key={item.name}>{item.qty} × {item.name} ({item.price})</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No previous orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
