import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './zcustomer.css';
import cuslog from './cuslog.mp4';

const Customerlogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const baseurl = "http://localhost:8080/api/v1/auth";

  // Check if user is already logged in when component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${baseurl}/getProfile`, {
          withCredentials: true,
          headers: {
            "Content-Type": 'application/json'
          },
        });
        console.log("Auth check response:", response.data);
        
        if (response.data && response.data.data && response.data.data.user) {
          setIsAuthenticated(true);
          redirectBasedOnRole(response.data.data.user.role);
        }
      } catch (error) {
        // User is not authenticated, do nothing
        console.log("User not authenticated, showing login form");
      }
    };

    checkAuthStatus();
  }, []);

  const redirectBasedOnRole = (role) => {
    if (role === "admin") {
      navigate("/admindashboard");
    } else if (role === "user") {
      navigate("/customer-dashboard");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!username.trim() || !password.trim()) {
      setMessage({ type: "error", text: "Username and password are required" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(`${baseurl}/login`, 
        { username, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": 'application/json'
          },
        }
      );

      setIsLoading(false);
      
      if (response.data && response.data.success) {
        setMessage({ type: "success", text: "Login successful!" });
        setIsAuthenticated(true);
        
        // Fetch user profile to determine role
        getUserProfile();
      } else {
        setMessage({ type: "error", text: response.data.message || "Login failed" });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Login error:", error);
      
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      setMessage({ type: "error", text: errorMessage });
    }
  };

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
      
      if (response.data && response.data.data && response.data.data.user) {
        const userRole = response.data.data.user.role;
        redirectBasedOnRole(userRole);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setMessage({
        type: "error",
        text: "Failed to fetch user profile"
      });
    }
  };

  // If already authenticated, don't render the login form (will redirect in useEffect)
  if (isAuthenticated) {
    return (
      <div className="login-container">
        <video autoPlay muted loop className="video-background">
          <source src={cuslog} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="login-form loading">
          <h2>Redirecting...</h2>
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      {/* Background Video */}
      <video autoPlay muted loop playsInline className="video-background">
        <source src={cuslog} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Login Form */}
      <form 
        className={`login-form ${message.type} ${isLoading ? 'loading' : ''}`} 
        onSubmit={handleLogin}
      >
        <h2>Customer Login</h2>

        {message.text && (
          <p className={`message ${message.type}`}>{message.text}</p>
        )}

        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
            disabled={isLoading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            disabled={isLoading}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Logging in...
            </>
          ) : "Login"}
        </button>

        <div className="links">
          <a href="/register">Create an account</a>
          <a href="/forgot-password">Forgot password?</a>
        </div>
      </form>
    </div>
  );
};

export default Customerlogin;