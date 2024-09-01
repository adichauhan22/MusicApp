// src/components/Home.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the CSS file for styling
import backgroundVideo from './videos/background_video.mp4';

const HomePage = () => {
  const [showForm, setShowForm] = useState(null); // 'login' or 'signup'

  const handleFormOpen = (formType) => {
    setShowForm(formType);
  };

  const handleCloseForm = () => {
    setShowForm(null);
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Mood Tunes</div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><button onClick={() => handleFormOpen('login')} className="nav-link">Login</button></li>
          <li><button onClick={() => handleFormOpen('signup')} className="nav-link">Sign Up</button></li>
        </ul>
      </nav>

      {/* Hero Section with Video Background */}
      <div className="hero">
        <video autoPlay muted loop className="hero-video">
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content">
          <h1>Welcome to Mood Tunes</h1>
          <p>Discover music that matches your mood.</p>
        
            <button onClick={() => handleFormOpen('login')} className="hero-btn">Get Started</button>
        
        </div>
      </div>

      {/* Conditional Login/Signup Forms */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <button className="close-btn" onClick={handleCloseForm}>×</button>
            {showForm === 'login' && (
              <div className="form">
                <h2>Login</h2>
                <form>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Enter your email" required />
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" placeholder="Enter your password" required />
                 
                </form>
                <button type="submit" className="form-btn">Login</button>
                <p id="txt" >Don't have an account? <span id="l_s" onClick={() => handleFormOpen('signup')}>Sign Up</span></p>
              </div>
            )}
            {showForm === 'signup' && (
              <div className="form">
                <h2>Sign Up</h2>
                <form>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Enter your email" required />
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" placeholder="Enter your password" required />
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <input type="password" id="confirm-password" placeholder="Confirm your password" required />
              
                </form>
                <button type="submit" className="form-btn">Sign Up</button>
                <p id="txt">Already have an account? <span id="l_s" onClick={() => handleFormOpen('login')}>Login</span></p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 Mood Tunes. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
 
