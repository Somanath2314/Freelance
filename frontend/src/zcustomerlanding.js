import React from 'react';
import './zcustomerlanding.css';

// Import the background video directly from src/ folder
import landingVideo from './landing.mp4';  // Importing video directly from src

const CustomerLanding = () => {
    return (
        <div className="landing-container">
            {/* Background Video */}
            <video className="background-video" autoPlay muted loop>
                <source src={landingVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <h1>Track My Shipment</h1>
            <input type="text" placeholder="Enter Tracking ID" className="tracking-input" />
            <div className="card-container">
                <div className="action-card">
                    <h2>Ship Now</h2>
                    <p>Click here to ship your package.</p>
                </div>
                <div className="action-card">
                    <h2>Previous Order</h2>
                    <p>View your previous orders.</p>
                </div>
            </div>
        </div>
    );
};

export default CustomerLanding;
