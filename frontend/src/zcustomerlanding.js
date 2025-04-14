import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Package, Truck, Scale, Clock, Search } from 'lucide-react';
import './zcustomerlanding.css';
import landingVideo from './landing.mp4';

const CustomerLanding = () => {
    const [trackingId, setTrackingId] = useState('');
    const [trackingStatus, setTrackingStatus] = useState('');
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch previous orders on mount
    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get('http://localhost:8080/api/v1/order/ordersByUser',
                    {
                        withCredentials: true,
                        headers: {
                          "Content-Type": 'application/json'
                        },
                    }
                );
                setOrders(res.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch previous orders', err);
                setError('Failed to load your previous orders. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleTrack = async () => {
        if (!trackingId.trim()) {
            setTrackingStatus('Please enter a tracking ID');
            return;
        }
        
        try {
            const res = await axios.get(`http://localhost:8080/api/v1/order/getOrderByTrackingNumber/${trackingId}`);
            setTrackingStatus(res.data.status);
        } catch (err) {
            setTrackingStatus('Tracking ID not found');
            console.error(err);
        }
    };

    // Get appropriate icon for status
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered':
                return <Package size={18} className="status-icon delivered" />;
            case 'In Transit':
                return <Truck size={18} className="status-icon in-transit" />;
            case 'Processing':
                return <Clock size={18} className="status-icon processing" />;
            default:
                return <Clock size={18} className="status-icon pending" />;
        }
    };

    // Get appropriate class for status
    const getStatusClass = (status) => {
        switch (status) {
            case 'Delivered':
                return 'status-delivered';
            case 'In Transit':
                return 'status-transit';
            case 'Processing':
                return 'status-processing';
            default:
                return 'status-pending';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.5,
                when: "beforeChildren", 
                staggerChildren: 0.1 
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.4 }
        }
    };

    return (
        <div className="landing-container">
            <video className="background-video" autoPlay muted loop playsInline>
                <source src={landingVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <motion.div 
                className="content-wrapper"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.h1 className="landing-title" variants={itemVariants}>Track My Shipment</motion.h1>
                
                <motion.div className="tracking-section" variants={itemVariants}>
                    <div className="tracking-input-container">
                        <input 
                            type="text" 
                            placeholder="Enter Tracking ID" 
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            className="tracking-input" 
                        />
                        <motion.button 
                            onClick={handleTrack} 
                            className="track-button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Search size={18} />
                            Track
                        </motion.button>
                    </div>
                    
                    {trackingStatus && (
                        <motion.div 
                            className="tracking-result"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            Status: <span className={getStatusClass(trackingStatus)}>{trackingStatus}</span>
                        </motion.div>
                    )}
                </motion.div>

                <div className="card-container">
                    <motion.div 
                        className="action-card ship-now-card" 
                        onClick={() => navigate('/shipnow')}
                        variants={itemVariants}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <div className="card-header">
                            <Package className="card-icon" size={24} />
                            <h2>Ship Now</h2>
                        </div>
                        <p className="card-description">Click here to ship your package quickly and easily.</p>
                        <button className="card-button">Create Shipment</button>
                    </motion.div>

                    <motion.div 
                        className="action-card orders-card"
                        variants={itemVariants}
                    >
                        <div className="card-header">
                            <Truck className="card-icon" size={24} />
                            <h2>Previous Orders</h2>
                        </div>
                        
                        {isLoading ? (
                            <div className="loading-spinner">
                                <span className="spinner"></span>
                                <p>Loading your orders...</p>
                            </div>
                        ) : error ? (
                            <div className="error-message">
                                <p>{error}</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="no-orders">
                                <p>No previous orders found.</p>
                                <button 
                                    className="card-button"
                                    onClick={() => navigate('/shipnow')}
                                >
                                    Create Your First Shipment
                                </button>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map((order) => (
                                    <motion.div 
                                        key={order._id} 
                                        className="order-item"
                                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                    >
                                        <div className="order-header">
                                            <div className="tracking-number">
                                                <span className="label">Tracking #:</span>
                                                <span className="value">{order.trackingNumber}</span>
                                            </div>
                                            <div className={`order-status ${getStatusClass(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </div>
                                        </div>
                                        
                                        <div className="order-details">
                                            <div className="detail-item">
                                                <Package size={16} />
                                                <span>{order.category}</span>
                                            </div>
                                            <div className="detail-item">
                                                <Scale size={16} />
                                                <span>{order.weight}</span>
                                            </div>
                                            <div className="detail-item">
                                                <Truck size={16} />
                                                <span>{order.modeOfTransport}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="order-date">
                                            Created: {formatDate(order.createdAt)}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default CustomerLanding;