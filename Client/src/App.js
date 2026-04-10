import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('urbanspoonUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('urbanspoonUser');
    setCurrentUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <nav className="navbar">
        <h1 className="logo">Urban Spoon</h1>
        <div className="links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}>Home</NavLink>
          <NavLink to="/menu" className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}>Menu</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}>Contact</NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link admin-link active-link' : 'nav-link admin-link'}>Admin</NavLink>
          {currentUser ? (
            <>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}>Profile</NavLink>
              <button className="nav-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}>Login</NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}>Register</NavLink>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu currentUser={currentUser} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setCurrentUser} />} />
        <Route path="/profile" element={<Profile currentUser={currentUser} />} />
      </Routes>

      <footer className="footer">
        <p>📍 123 Foodie Street, India | 🕒 10:00 AM - 11:00 PM</p>
      </footer>
    </Router>
  );
}

export default App;