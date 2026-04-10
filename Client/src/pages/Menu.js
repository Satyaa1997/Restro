import React, { useState } from 'react';
import axios from 'axios';

const menuData = [
  { name: "Paneer Tikka", price: "₹250", category: "Starters" },
  { name: "Spring Rolls", price: "₹180", category: "Starters" },
  { name: "Butter Chicken", price: "₹450", category: "Main Course" },
  { name: "Dal Makhani", price: "₹300", category: "Main Course" },
  { name: "Cold Coffee", price: "₹120", category: "Beverages" }
];

const parsePrice = price => Number(price.replace(/[^0-9]/g, ''));

const Menu = ({ currentUser }) => {
  const [filter, setFilter] = useState('All');
  const [cartItems, setCartItems] = useState([]);
  const [orderMessage, setOrderMessage] = useState('');

  const filteredItems = filter === 'All' ? menuData : menuData.filter(item => item.category === filter);

  const [likedItems, setLikedItems] = useState([]);

  const addToCart = item => {
    setCartItems(prev => {
      const existing = prev.find(entry => entry.name === item.name);
      if (existing) {
        return prev.map(entry => entry.name === item.name ? { ...entry, qty: entry.qty + 1 } : entry);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const toggleLike = item => {
    setLikedItems(prev => prev.includes(item.name) ? prev.filter(name => name !== item.name) : [...prev, item.name]);
  };

  const removeFromCart = name => {
    setCartItems(prev => prev.filter(entry => entry.name !== name));
  };

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);

  const handleBuyNow = async () => {
    if (!cartItems.length) {
      setOrderMessage('Add items to your bucket before placing an order.');
      return;
    }

    if (!currentUser) {
      setOrderMessage('Please log in first to place your order.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/order', {
        userId: currentUser.id,
        items: cartItems,
        total: cartTotal,
      });
      setOrderMessage(`${res.data.message} Total amount is ₹${cartTotal}.`);
      setCartItems([]);
    } catch (err) {
      setOrderMessage('Order failed. Please try again.');
    }
  };

  return (
    <div className="menu-container">
      <h2>Our Menu</h2>
      <div className="filters">
        {['All', 'Starters', 'Main Course', 'Beverages'].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={filter === cat ? 'active' : ''}>{cat}</button>
        ))}
      </div>

      <div className="menu-layout">
        <div className="menu-grid">
          {filteredItems.map((item, index) => {
            const liked = likedItems.includes(item.name);
            return (
              <div key={index} className="menu-card">
                <div className="menu-card-top">
                  <h3>{item.name}</h3>
                  <button className={`like-button ${liked ? 'liked' : ''}`} onClick={() => toggleLike(item)}>
                    {liked ? '♥ Liked' : '♡ Like'}
                  </button>
                </div>
                <p>{item.price}</p>
                <span>{item.category}</span>
                <button className="buy-button" onClick={() => addToCart(item)}>Add to Bucket</button>
              </div>
            );
          })}
        </div>

        <aside className="cart-sidebar">
          <div className="cart-header">
            <h3>Your Bucket</h3>
            <p>{totalItemCount ? `${totalItemCount} item${totalItemCount > 1 ? 's' : ''}` : 'No items yet'}</p>
          </div>

          {orderMessage && (
            <div className="order-message">
              {orderMessage}
            </div>
          )}

          {cartItems.length ? (
            <div className="cart-list">
              {cartItems.map(item => (
                <div key={item.name} className="cart-item">
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.qty} × {item.price}</p>
                  </div>
                  <button className="remove-button" onClick={() => removeFromCart(item.name)}>Remove</button>
                </div>
              ))}
              <div className="cart-total">
                <span>Total</span>
                <strong>₹{cartTotal}</strong>
              </div>
              <button className="checkout-button" onClick={handleBuyNow}>Buy Now</button>
            </div>
          ) : (
            <div className="empty-cart">
              <p>Choose dishes and click "Add to Bucket" to create your order.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Menu;