import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import 'react-toastify/dist/ReactToastify.css';
import './home.css';

function Home() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [forecast, setForecast] = useState([]);
  const [isCelsius, setIsCelsius] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const apiKey = 'af8b797b130528f45ed83ad3702dc908';

  // Firebase 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

 
  const searchLocation = async (event) => {
    if (event.key === 'Enter' && location.trim() !== '') {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`
        );
        setData(response.data);
        setErrorMessage('');
        fetchForecast(location);
      } catch (error) {
        setData({});
        setForecast([]);
        setErrorMessage('Location not found.');
      }
      setLocation('');
    }
  };

  
  const fetchForecast = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
      );
      const dailyData = filterDailyForecast(response.data.list);
      setForecast(dailyData);
    } catch (error) {
      console.error('Error fetching forecast:', error);
    }
  };

  
  const filterDailyForecast = (list) => {
    const dailyForecast = {};
    list.forEach((item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyForecast[date]) {
        dailyForecast[date] = item;
      }
    });
    return Object.values(dailyForecast).slice(0, 5);
  };

  
  const convertTemp = (tempF) => {
    return isCelsius ? ((tempF - 32) * 5 / 9).toFixed(2) : tempF.toFixed(2);
  };

 
  const toggleTempUnit = () => {
    setIsCelsius(!isCelsius);
  };

  
  const saveFavorite = () => {
    if (data.name && !favorites.includes(data.name)) {
      const updatedFavorites = [...favorites, data.name];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

      toast.success(`${data.name} added to Favorites!`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: darkMode ? 'dark' : 'light',
      });
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <ToastContainer />
      
     
      <div className="user-info-header">
        {user && <span className="user-info">👤 Welcome  :{user.email}</span>}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="header">
        <Link  to="/about" className="about-link">
          <i className="fa fa-info-circle"></i> About
        </Link>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <Link to="/favorites" className="favorites-link">⭐ Favorites</Link>
      </div>

      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter a Location"
          type="text"
        />
      </div>

      <div className="container">
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {data.name && (
          <>
            <div className="top">
              <div className="location">
                <p>{data.name}</p>
              </div>
              <div className="temp">
                <h1>
                  {convertTemp(data.main.temp)}°{isCelsius ? 'C' : 'F'}
                </h1>
              </div>
              <div className="description">
                <p>{data.weather[0].main}</p>
              </div>
            </div>

            <div className="buttons">
              <button className="unit-toggle" onClick={toggleTempUnit}>
                Convert to {isCelsius ? '°F' : '°C'}
              </button>
              <button className="save-favorite" onClick={saveFavorite}>
                ⭐ Save to Favorites
              </button>
            </div>

            <div className="bottom">
              <div className="feels">
                <p className="bold">{convertTemp(data.main.feels_like)}°{isCelsius ? 'C' : 'F'}</p>
                <p>Feels Like</p>
              </div>
              <div className="humidity">
                <p className="bold">{data.main.humidity}%</p>
                <p>Humidity</p>
              </div>
              <div className="wind">
                <p className="bold">{data.wind.speed.toFixed()} MPH</p>
                <p>Wind Speed</p>
              </div>
            </div>

            <div className="forecast">
              <h2>Forecast</h2>
              <div className="forecast-container">
                {forecast.map((day, index) => (
                  <div key={index} className="forecast-day">
                    <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
                    <p>🌡 {convertTemp(day.main.temp)}°{isCelsius ? 'C' : 'F'}</p>
                    <p>{day.weather[0].description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
