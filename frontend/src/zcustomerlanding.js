// CustomerLanding.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Truck,
  Scale,
  Clock,
  Search,
  Settings,
  LogOut,
  User,
  DollarSign,
  X
} from 'lucide-react';
import './zcustomerlanding.css';
import landingVideo from './landing.mp4';

const baseurl = "http://localhost:8080/api/v1/auth";

const CustomerLanding = () => {
    // tracking + orders + settings + video states (unchanged)
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

    // quotation states (front‑end only)
    const [showQuotationForm, setShowQuotationForm] = useState(false);
    const [quotationCategory, setQuotationCategory] = useState('');
    const [quotationWeight, setQuotationWeight] = useState('');
    const [quotationMode, setQuotationMode] = useState('');
    const [quotationDistance, setQuotationDistance] = useState('');
    const [quotationResult, setQuotationResult] = useState(null);

    // ←— NEW: orders‑modal state
    const [showOrdersModal, setShowOrdersModal] = useState(false);

    // fetch profile
    const getUserProfile = async () => {
        try {
            const resp = await axios.get(`${baseurl}/getProfile`, {
                withCredentials: true,
                headers: { "Content-Type": 'application/json' },
            });
            if (resp.data.data.user.role === "admin") {
                navigate("/admindashboard");
            }
        } catch {
            setMessage({ type: "error", text: "Failed to fetch user profile" });
            navigate("/login");
        }
    };

    useEffect(() => { getUserProfile(); }, [navigate]);

    // click outside settings
    useEffect(() => {
        const handler = e => {
            if (settingsRef.current && !settingsRef.current.contains(e.target)) {
                setShowSettings(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // autoplay video
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, []);

    // parallax
    useEffect(() => {
        const move = e => {
            setMousePosition({
                x: e.clientX / window.innerWidth - 0.5,
                y: e.clientY / window.innerHeight - 0.5
            });
        };
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, []);

    // fetch orders
    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(
                    'http://localhost:8080/api/v1/order/ordersByUser',
                    { withCredentials: true, headers: { "Content-Type": 'application/json' } }
                );
                setOrders(res.data);
                setError(null);
            } catch {
                setError('Failed to load your previous orders.');
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, []);

    // track handler
    const handleTrack = async () => {
        if (!trackingId.trim()) {
            setTrackingStatus('Please enter a tracking ID');
            return;
        }
        try {
            const res = await axios.get(
                `http://localhost:8080/api/v1/order/getOrderByTrackingNumber/${trackingId}`
            );
            setTrackingStatus(res.data.status);
        } catch {
            setTrackingStatus('Tracking ID not found');
        }
    };

    // logout / edit
    const handleLogout = async () => {
        try {
            await axios.get('http://localhost:8080/api/v1/auth/logout', { withCredentials: true });
            navigate('/');
        } catch {
            setMessage({ type: "error", text: "Failed to logout" });
        }
    };
    const handleEditProfile = () => {
        navigate('/editProfile');
        setShowSettings(false);
    };

    // status icons + classes
    const getStatusIcon = s => {
        switch (s) {
            case 'Delivered':  return <Package size={18} className="status-icon delivered" />;
            case 'In Transit': return <Truck size={18} className="status-icon in-transit" />;
            case 'Processing': return <Clock size={18} className="status-icon processing" />;
            default:           return <Clock size={18} className="status-icon pending" />;
        }
    };
    const getStatusClass = s => {
        switch (s) {
            case 'Delivered':  return 'status-delivered';
            case 'In Transit': return 'status-transit';
            case 'Processing': return 'status-processing';
            default:           return 'status-pending';
        }
    };

    // format date
    const formatDate = d => {
        const dt = new Date(d);
        return dt.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
    };

    // quotation calc
    const handleQuotationSubmit = e => {
        e.preventDefault();
        if (!quotationCategory || !quotationWeight || !quotationMode || !quotationDistance) {
            setMessage({ type: 'error', text: 'Please fill out all fields' });
            return;
        }
        const weightRate = 20;
        const modeRates = { Road:5, Air:15, Sea:2 };
        const w = parseFloat(quotationWeight), d = parseFloat(quotationDistance);
        const raw = w * weightRate + d * (modeRates[quotationMode]||0);
        const cost = Math.round(raw);
        const inr = cost.toLocaleString('en-IN', {
            style: 'currency', currency: 'INR', maximumFractionDigits: 0
        });
        setQuotationResult(inr);
        setMessage({ type: 'success', text: 'Approximate quotation ready!' });
    };

    return (
        <div className="customer-landing">
          {/* HEADER */}
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
                      initial={{ opacity:0, y:-10 }}
                      animate={{ opacity:1, y:0 }}
                      exit={{ opacity:0, y:-10 }}
                      transition={{ duration:0.2 }}
                    >
                      <button onClick={handleEditProfile}><User/> Edit Profile</button>
                      <button onClick={handleLogout}><LogOut/> Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* VIDEO BG */}
          <div className="video-container">
            <video
              ref={videoRef}
              autoPlay loop muted playsInline
              className="background-video"
              style={{
                transform: videoLoaded
                  ? `scale(1.05) translate(${mousePosition.x*10}px, ${mousePosition.y*10}px)`
                  : 'scale(1.05)'
              }}
              onLoadedData={() => setVideoLoaded(true)}
            >
              <source src={landingVideo} type="video/mp4" />
            </video>

            {/* LOADER */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  className="loading-overlay"
                  initial={{ opacity:1 }}
                  exit={{ opacity:0 }}
                  transition={{ duration:0.5 }}
                >
                  <motion.div
                    className="spinner"
                    animate={{ rotate:[0,360] }}
                    transition={{ repeat: Infinity, duration:1.5, ease:"linear" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* TOAST */}
            <AnimatePresence>
              {message.text && (
                <motion.div
                  className={`message-toast ${message.type}`}
                  initial={{ opacity:0, y:-20 }}
                  animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-20 }}
                  transition={{ duration:0.3 }}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* CONTENT */}
            <motion.div
              className="content-wrapper"
              initial="hidden"
              animate="visible"
              variants={{
                hidden:{ opacity:0 },
                visible:{
                  opacity:1,
                  transition:{ duration:0.5, when:"beforeChildren", staggerChildren:0.1 }
                }
              }}
            >
              {/* TRACK SECTION */}
              <motion.div
                className="tracking-section"
                variants={{
                  hidden:{ y:20, opacity:0 },
                  visible:{ y:0, opacity:1, transition:{ duration:0.4 } }
                }}
              >
                <motion.h1 className="section-title">Track My Shipment</motion.h1>
                <div className="tracking-input-container">
                  <input
                    type="text"
                    placeholder="Enter Tracking ID"
                    value={trackingId}
                    onChange={e => setTrackingId(e.target.value)}
                    className="tracking-input"
                  />
                  <motion.button
                    onClick={handleTrack}
                    className="track-button"
                    whileHover={{ scale:1.05 }}
                    whileTap={{ scale:0.95 }}
                  >
                    <Search size={18}/> Track
                  </motion.button>
                </div>
                {trackingStatus && (
                  <motion.div
                    className="tracking-result"
                    initial={{ opacity:0, y:10 }}
                    animate={{ opacity:1, y:0 }}
                  >
                    Status: <span className={getStatusClass(trackingStatus)}>
                      {trackingStatus}
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* CARDS */}
              <div className="card-container">
                {/* Ship Now */}
                <motion.div
                  className="dashboard-card ship-now-card"
                  whileHover={{ scale:1.05 }}
                  onClick={() => navigate('/shipnow')}
                >
                  <div className="card-header">
                    <Package className="card-icon" size={24}/>
                    <h2>Ship Now</h2>
                  </div>
                  <p className="card-description">
                    Create a new shipment quickly and easily with our streamlined process.
                  </p>
                  <motion.button className="card-button"
                    whileHover={{ scale:1.05 }}
                    whileTap={{ scale:0.95 }}
                  >
                    Create Shipment
                  </motion.button>
                </motion.div>

                {/* ←— PREVIOUS ORDERS CARD (now modal trigger) */}
                <motion.div
                  className="dashboard-card orders-card"
                  whileHover={{ scale:1.05 }}
                  onClick={() => setShowOrdersModal(true)}
                >
                  <div className="card-header">
                    <Truck className="card-icon" size={24}/>
                    <h2>Previous Orders</h2>
                  </div>
                  <p className="card-description">
                    View your shipment history and statuses.
                  </p>
                  <motion.button className="card-button">
                    View Orders
                  </motion.button>
                </motion.div>

                {/* Get Quotation */}
                <motion.div
                  className="dashboard-card quotation-card"
                  whileHover={{ scale:1.05 }}
                  onClick={() => {
                    setQuotationResult(null);
                    setShowQuotationForm(true);
                  }}
                >
                  <div className="card-header">
                    <DollarSign className="card-icon" size={24}/>
                    <h2>Get Quotation</h2>
                  </div>
                  <p className="card-description">
                    Estimate your shipment cost by weight & distance.
                  </p>
                  <motion.button className="card-button">
                    Get Quotation
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* QUOTATION MODAL */}
          <AnimatePresence>
            {showQuotationForm && (
              <motion.div
                className="quotation-modal-overlay"
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              >
                <motion.div
                  className="quotation-modal"
                  initial={{ scale:0.8 }} animate={{ scale:1 }} exit={{ scale:0.8 }}
                >
                  <h2>Get Quotation</h2>
                  <form onSubmit={handleQuotationSubmit}>
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={quotationCategory}
                        onChange={e => setQuotationCategory(e.target.value)}
                      >
                        <option value="">Select Category</option>
                        <option>Cloth</option>
                        <option>Electronics</option>
                        <option>Books</option>
                        <option>Furniture</option>
                        <option>Vehicle</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Weight (kg)</label>
                      <input
                        type="number" min="0" step="0.1"
                        value={quotationWeight}
                        onChange={e => setQuotationWeight(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Mode of Transport</label>
                      <select
                        value={quotationMode}
                        onChange={e => setQuotationMode(e.target.value)}
                      >
                        <option value="">Select Mode</option>
                        <option>Road</option>
                        <option>Air</option>
                        <option>Sea</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Approx. Distance (km)</label>
                      <input
                        type="number" min="0" step="1"
                        placeholder="e.g. 250"
                        value={quotationDistance}
                        onChange={e => setQuotationDistance(e.target.value)}
                      />
                    </div>
                    <div className="modal-actions">
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => setShowQuotationForm(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-submit">
                        Calculate
                      </button>
                    </div>
                  </form>
                  {quotationResult && (
                    <div className="quotation-result">
                      Estimated Cost: <strong>{quotationResult}</strong>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ORDERS MODAL */}
          <AnimatePresence>
            {showOrdersModal && (
              <motion.div
                className="orders-modal-overlay"
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              >
                <motion.div
                  className="orders-modal"
                  initial={{ scale:0.8 }} animate={{ scale:1 }} exit={{ scale:0.8 }}
                >
                  <button
                    className="modal-close"
                    onClick={() => setShowOrdersModal(false)}
                  >
                    <X size={20}/>
                  </button>
                  <h2>Previous Orders</h2>
                  {isLoading ? (
                    <div className="loading-spinner">
                      <span className="spinner"></span>
                      <p>Loading your orders...</p>
                    </div>
                  ) : error ? (
                    <div className="error-message"><p>{error}</p></div>
                  ) : orders.length === 0 ? (
                    <div className="no-orders">
                      <p>No previous orders found.</p>
                      <motion.button
                        className="card-button"
                        onClick={() => {
                          setShowOrdersModal(false);
                          navigate('/shipnow');
                        }}
                        whileHover={{ scale:1.05 }}
                        whileTap={{ scale:0.95 }}
                      >
                        Create Your First Shipment
                      </motion.button>
                    </div>
                  ) : (
                    <div className="orders-list-modal">
                      {orders.map(o => (
                        <div key={o._id} className="order-item">
                          <div className="order-header">
                            <div className="tracking-number">
                              <span className="label">Tracking #:</span>
                              <span className="value">{o.trackingNumber}</span>
                            </div>
                            <div className={`order-status ${getStatusClass(o.status)}`}>
                              {getStatusIcon(o.status)} {o.status}
                            </div>
                          </div>
                          <div className="order-details">
                            <div className="detail-item"><Package size={16}/><span>{o.category}</span></div>
                            <div className="detail-item"><Scale size={16}/><span>{o.weight}</span></div>
                            <div className="detail-item"><Truck size={16}/><span>{o.modeOfTransport}</span></div>
                          </div>
                          <div className="order-date">Created: {formatDate(o.createdAt)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    );
};

export default CustomerLanding;
