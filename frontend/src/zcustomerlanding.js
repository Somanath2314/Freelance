import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './zcustomerlanding.css';
import landingVideo from './landing.mp4';

const CustomerLanding = () => {
    const [trackingId, setTrackingId] = useState('');
    const [status, setStatus] = useState('');
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    // Fetch previous orders on mount
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/orders/userOrders', { withCredentials: true });
                setOrders(res.data);
            } catch (err) {
                console.error('Failed to fetch previous orders', err);
            }
        };
        fetchOrders();
    }, []);

    const handleTrack = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/v1/order/getOrderByTrackingNumber/${trackingId}`);
            setStatus(res.data.status);
        } catch (err) {
            setStatus('Tracking ID not found');
            console.error(err);
        }
    };

    return (
        <div className="landing-container">
            <video className="background-video" autoPlay muted loop>
                <source src={landingVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <h1>Track My Shipment</h1>
            <div className="tracking-section">
                <input 
                    type="text" 
                    placeholder="Enter Tracking ID" 
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="tracking-input" 
                />
                <button onClick={handleTrack} className="track-button">Track</button>
            </div>

            {status && <p className="status-display">Status: {status}</p>}

            <div className="card-container">
                <div className="action-card" onClick={() => navigate('/shipnow')}>
                    <h2>Ship Now</h2>
                    <p>Click here to ship your package.</p>
                </div>
                <div className="action-card">
                    <h2>Previous Orders</h2>
                    {orders.length === 0 ? (
                        <p>No previous orders found.</p>
                    ) : (
                        <ul>
                            {orders.map((order) => (
                                <li key={order._id}>
                                    <strong>{order.category}</strong> - {order.weight} - {order.status}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerLanding;
