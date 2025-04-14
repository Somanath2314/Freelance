import React from "react";
import { Link } from "react-router-dom"; // ✅ import Link for routing
import "./Header.css";
import logo from "./main logo.png";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="DHL logo" />
      </div>
      <nav>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li> 
          <li><Link to="/customer-login">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
