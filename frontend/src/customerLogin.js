import React, { useState } from "react";
import './zcustomer.css'; // linking CSS file
import cuslog from './cuslog.mp4'; // video inside src folder

const Customerlogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    setError("");
    setSuccess(true);
  };

  return (
    <div className="login-container">
      
      {/* Background Video */}
      <video autoPlay muted loop className="video-background">
        <source src={cuslog} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Login Form */}
      <form className={`login-form ${success ? 'success' : ''}`} onSubmit={handleSubmit}>
        <h2>Customer Login</h2>

        {success && <p className="success-message">Login successful!</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Customerlogin;
