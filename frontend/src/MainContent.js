import React from "react";
import './MainContent.css';
import backgroundVideo from './airr.mp4'; // Import your video
import { useNavigate } from "react-router-dom";


function MainContent() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login"); // Navigate to the login page
  };
  return (
    <main className="main-content">
      <div className="image-container">
        <video
          autoPlay
          loop
          muted
          className="home-video"
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="overlay">
          
          <h1>Welcome to DHL</h1>
          <p>Delivering excellence worldwide.</p>
          <div className="button-tile">
            <button onClick={handleLogin} className="cta-button">Get Quote</button>
            <button onClick={handleLogin} className="cta-button">Request Business Account</button>
            <button className="cta-button">Learn More</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MainContent;
