import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, Scale, Clock, Search, Settings, LogOut, User } from 'lucide-react';
import './zcustomerlanding.css';
import landingVideo from './landing.mp4';

const baseurl = "http://localhost:8080/api/v1/auth";

const CustomerLanding = () => {
    const [trackingId, setTrackingId] = useState('');
    const [trackingStatus, setTrackingStatus] = useState('');
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [videoLoaded, setVideoLoaded] = useState(false);
    const settingsRef = useRef(null);
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const getUserProfile = async () => {
        try {
            console.log("Fetching user profile...");
            const response = await axios.get(`${baseurl}/getProfile`, {
                withCredentials: true,
                headers: {
                    "Content-Type": 'application/json'
                },
            });
            console.log("Profile data:", response.data);
            const userRole = response.data.data.user.role;

            if (userRole === "admin") {
                navigate("/admindashboard");
            }
            // If user is already on customer landing page, no need to navigate
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setMessage({
                type: "error",
                text: "Failed to fetch user profile"
            });
            navigate("/customer-login");
        }
    };

    // Check if user is logged in
    useEffect(() => {
        getUserProfile();
    }, [navigate]);

    // Close settings dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setShowSettings(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Attempt to play video automatically
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error =>
                console.log("Autoplay issue:", error)
            );
        }
    }, []);

    // Parallax: update mouse position for background video
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX / window.innerWidth - 0.5,
                y: e.clientY / window.innerHeight - 0.5
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

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

    // Handle logout
    const handleLogout = async () => {
        try {
            await axios.get('http://localhost:8080/api/v1/auth/logout', {
                withCredentials: true
            });
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
            setMessage({
                type: "error",
                text: "Failed to logout"
            });
        }
    };

    // Handle navigation to edit profile
    const handleEditProfile = () => {
        navigate('/editProfile');
        setShowSettings(false);
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

    // Settings dropdown animation
    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    const handleVideoLoaded = () => {
        setVideoLoaded(true);
    };

    return (
        <div className="customer-landing">
            {/* Fixed Header with Settings */}
            <header className="dashboard-header">
                <div className="header-container">
                    <h2>Customer Portal</h2>
                    <div className="settings-container" ref={settingsRef}>
                        <button 
                            className="settings-button"
                            onClick={() => setShowSettings(!showSettings)} 
                            aria-label="Settings"
                        >
                            <Settings className="settings-icon" />
                        </button>
                        
                        <AnimatePresence>
                            {showSettings && (
                                <motion.div 
                                    className="settings-dropdown"
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={dropdownVariants}
                                >
                                    <button onClick={handleEditProfile}>
                                        <User /> Edit Profile
                                    </button>
                                    <button onClick={handleLogout}>
                                        <LogOut /> Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            <div className="video-container">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="background-video"
                    style={{
                        transform: videoLoaded 
                            ? `scale(1.05) translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)` 
                            : 'scale(1.05)'
                    }}
                    onLoadedData={handleVideoLoaded}
                >
                    <source src={landingVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Loading Overlay */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            className="loading-overlay"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                className="spinner"
                                animate={{ rotate: [0, 360] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1.5,
                                    ease: "linear"
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error Message Display */}
                <AnimatePresence>
                    {message.text && (
                        <motion.div 
                            className={`message-toast ${message.type}`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div 
                    className="content-wrapper"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.div className="tracking-section" variants={itemVariants}>
                        <motion.h1 className="section-title" variants={itemVariants}>Track My Shipment</motion.h1>
                        
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
                            className="dashboard-card ship-now-card" 
                            custom={0}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => navigate('/shipnow')}
                        >
                            <div className="card-header">
                                <Package className="card-icon" size={24} />
                                <h2>Ship Now</h2>
                            </div>
                            <p className="card-description">Create a new shipment quickly and easily with our streamlined process.</p>
                            <motion.button 
                                className="card-button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Create Shipment
                            </motion.button>
                        </motion.div>

                        <motion.div 
                            className="dashboard-card orders-card"
                            custom={1}
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
                                    <motion.button 
                                        className="card-button"
                                        onClick={() => navigate('/shipnow')}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Create Your First Shipment
                                    </motion.button>
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
        </div>
    );
};

export default CustomerLanding;