import React from "react";
import { Link } from "react-router-dom";
import "./About.css"; 

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
      
        <h1>About</h1>
        <p>
          Welcome to our Weather App! This application provides real-time weather updates and a 5-day forecast for any city worldwide. It features:
        </p>
        <ul>
          <li>🌎 Search by City</li>
          <li>⏳ 5-Day Forecast</li>
          <li>🌙 Dark & Light Mode</li>
          <li>💾 Save Favorite Cities</li>
          <li>🌡️ Unit Conversion (°C / °F)</li>
          <li>📱 Fully Responsive Design</li>
        </ul>
        <p>
          Built using **React JS** with the **OpenWeather API**, this app offers a smooth user experience with modern UI features.
        </p>
        <footer>
  <p>&copy; 2025 Your Nirmal Thambi. All rights reserved. | <a href="/terms">Terms of Service</a> | <a href="/privacy">Privacy Policy</a></p>
</footer>

        <Link to="/" className="back-button">⬅ Back to Home</Link>
      </div>
    </div>
  );
};

export default About;
