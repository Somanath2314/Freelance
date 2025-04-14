import React, { useState } from 'react';
import './zshipnow.css'; 
import zshipVideo from './zship.mp4'; // ✅ IMPORT the video

const ShipNow = () => {
    const [category, setCategory] = useState('');
    const [weight, setWeight] = useState('');
    const [modeOfTransport, setModeOfTransport] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ category, weight, modeOfTransport });
    };

    return (
        <div className="shipnow-container">
            {/* Background Video */}
            <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="background-video"
            >
                <source src={zshipVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Form Content */}
            <div className="form-overlay">
                <h1>Product Details</h1>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Category" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        className="input-field" 
                    />
                    <input 
                        type="text" 
                        placeholder="Weight" 
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)} 
                        className="input-field" 
                    />
                    <input 
                        type="text" 
                        placeholder="Mode of Transport" 
                        value={modeOfTransport} 
                        onChange={(e) => setModeOfTransport(e.target.value)} 
                        className="input-field" 
                    />
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default ShipNow;
