import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './EditProfile.css';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNum: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const baseurl = 'http://localhost:8080/api/v1/auth';

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/getProfile`, {
          withCredentials: true,
          headers: {
            "Content-Type": 'application/json'
          },
        });
        
        const user = response.data.data.user;
        setUserData(user);
        
        // Populate form with current user data (excluding password)
        setFormData({
          username: user.username || '',
          email: user.email || '',
          phoneNum: user.phoneNum || '',
          password: '',
          confirmPassword: ''
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({ type: 'error', text: 'Failed to load user profile' });
        setLoading(false);
        // Redirect to login if not authenticated
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match if being updated
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    // Create update payload (only include fields that have values)
    const updatePayload = {};
    if (formData.username) updatePayload.username = formData.username;
    if (formData.email) updatePayload.email = formData.email;
    if (formData.phoneNum) updatePayload.phoneNum = formData.phoneNum;
    if (formData.password) updatePayload.password = formData.password;

    try {
      setLoading(true);
      const response = await axios.post(`${baseurl}/updateUser`, updatePayload, {
        withCredentials: true,
        headers: {
          "Content-Type": 'application/json'
        }
      });

      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setLoading(false);
      
      // Clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      
      // Optional: update the user data state with new values
      setUserData(response.data.user);
      
      // Redirect after successful update (optional)
      setTimeout(() => {
        if (userData?.role === 'admin') {
          navigate('/admindashboard');
        } else {
          navigate('/customer-dashboard');
        }
      }, 2000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (userData?.role === 'admin') {
      navigate('/admindashboard');
    } else {
      navigate('/customer-dashboard');
    }
  };

  return (
    <div className="edit-profile-container">
      <motion.div 
        className="edit-profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Edit Profile</h1>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        {loading && !userData ? (
          <div className="loading-spinner">
            <motion.div
              className="spinner"
              animate={{ rotate: [0, 360] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear"
              }}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNum">Phone Number</label>
              <input
                type="text"
                id="phoneNum"
                name="phoneNum"
                value={formData.phoneNum}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password (optional)"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
            </div>
            
            <div className="form-actions">
              <motion.button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              
              <motion.button
                type="submit"
                className="submit-btn"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <div className="button-spinner">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear"
                      }}
                    />
                  </div>
                ) : 'Update Profile'}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default EditProfile;