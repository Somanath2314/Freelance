// AdminDashboard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import EmployeeTable from './EmployeeTable';
import backgroundVideo from './airr2.mp4';
import './AdminDashboard.css';
// Import settings icon
import { FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [orderCount, setOrderCount] = useState(0);
  const [shipmentCount, setShipmentCount] = useState(0);
  const [pendingStatusCount, setPendingStatusCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const settingsRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const baseurl = 'http://localhost:8080/api/v1/auth';

  // Load custom font
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Check if user is logged in
  useEffect(() => {
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
          // Already on admin dashboard, no need to navigate
        } else if (userRole === "user") {
          navigate("/customer-dashboard");
        }
      } catch (error) { 
        console.error("Error fetching user profile:", error);
        setMessage({
          type: "error",
          text: "Failed to fetch user profile"
        });
        // Redirect to login if not authenticated
        navigate("/customer-login");
      }
    };

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

  // Data fetching simulation with staggered loading
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        setTimeout(async () => {
          try {
            const ordersRes = await axios.get('http://localhost:8080/api/v1/order/getOrderCount');
            setOrderCount(ordersRes.data.orderCount);
          } catch (error) {
            console.error("Error fetching order count:", error);
            setOrderCount(47); // demo fallback
          }
        }, 300);

        setTimeout(async () => {
          try {
            const shipmentsRes = await axios.get('http://localhost:8080/api/v1/order/ordersToBeShippedToday');
            setShipmentCount(shipmentsRes.data);
          } catch (error) {
            console.error("Error fetching shipments:", error);
            setShipmentCount(12); // demo fallback
          }
        }, 600);

        setTimeout(async () => {
          try {
            const pendingRes = await axios.get('/api/orders/pending');
            setPendingStatusCount(pendingRes.data.count);
          } catch (error) {
            console.error("Error fetching pending status:", error);
            setPendingStatusCount(8); // demo fallback
          }
          setIsLoading(false);
        }, 900);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setIsLoading(false);
        setOrderCount(47);
        setShipmentCount(12);
        setPendingStatusCount(8);
      }
    };

    fetchStats();
  }, []);

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
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

  // Card animation variants with Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }
    })
  };

  // Settings dropdown animation
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <div className="admin-dashboard">
      {/* Fixed Header with Settings */}
      <header className="dashboard-header">
        <div className="header-container">
          <h2>Admin Portal</h2>
          <div className="settings-container" ref={settingsRef}>
            <button 
              className="settings-button"
              onClick={() => setShowSettings(!showSettings)} 
              aria-label="Settings"
            >
              <FaCog className="settings-icon" />
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
                    <FaUser /> Edit Profile
                  </button>
                  <button onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
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
          <source src={backgroundVideo} type="video/mp4" />
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

        {activeView === 'dashboard' && (
          <div className="dashboard-container">
            <h1>Admin Dashboard</h1>
            <div
              className="dashboard-cards"
              onWheel={(e) => {
                e.preventDefault();
                e.currentTarget.scrollLeft += e.deltaY;
              }}
            >
              <motion.div
                className="card"
                custom={0}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
              >
                <h2>Total Orders</h2>
                <motion.p
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                >
                  {orderCount} Orders
                </motion.p>
              </motion.div>

              <motion.div
                className="card"
                custom={1}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
              >
                <h2>Customer Status</h2>
                <motion.p
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
                >
                  {pendingStatusCount} pending updates
                </motion.p>
                <motion.button
                  aria-label="Navigate to Update Customer Status"
                  onClick={() => navigate('/customerdetails')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Update Status
                </motion.button>
              </motion.div>

              <motion.div
                className="card"
                custom={2}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
              >
                <h2>Shipments Today</h2>
                <motion.p
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                >
                  {shipmentCount} Shipments
                </motion.p>
              </motion.div>

              <motion.div
                className="card"
                custom={3}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
              >
                <h2>Employee Management</h2>
                <motion.p
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                >
                  Manage employee records
                </motion.p>
                <motion.button
                  aria-label="Navigate to Manage Employees"
                  onClick={() => navigate('/employeetable')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Manage Employees
                </motion.button>
              </motion.div>
            </div>

            <div className="side-dots" role="navigation" aria-label="Dashboard navigation">
              <div className="dot active" aria-label="Current slide"></div>
              <div className="dot" aria-label="Next slide"></div>
              <div className="dot" aria-label="Next slide"></div>
            </div>
          </div>
        )}
      </div>

      {activeView === 'employees' && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <EmployeeTable onBack={() => setActiveView('dashboard')} />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default AdminDashboard;