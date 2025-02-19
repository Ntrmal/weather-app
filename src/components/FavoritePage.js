import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import './Favorites.css';

const API_KEY = 'af8b797b130528f45ed83ad3702dc908';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login'); 
      } else {
        setUser(currentUser);
        loadFavorites();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadFavorites = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
    fetchWeatherData(savedFavorites);
  };

  const fetchWeatherData = async (cities) => {
    if (cities.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const requests = cities.map(city =>
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
          .then(res => res.json())
          .then(data => ({
            city,
            temp: data.main?.temp,
            feelsLike: data.main?.feels_like,
            wind: data.wind?.speed,
            icon: data.weather?.[0]?.icon || '',
          }))
      );

      const results = await Promise.all(requests);
      const validData = results.reduce((acc, item) => {
        if (item.temp !== undefined) acc[item.city] = item;
        return acc;
      }, {});

      setWeatherData(validData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
    setLoading(false);
  };

  const removeFavorite = (city) => {
    const updatedFavorites = favorites.filter((fav) => fav !== city);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    setWeatherData((prevData) => {
      const newData = { ...prevData };
      delete newData[city];
      return newData;
    });
  };

  return (
    <div className="favorites-container">
      <h2 className="favorites-header">⭐ Favorite Cities</h2>

      {loading ? (
        <p>Loading weather data...</p>
      ) : favorites.length === 0 ? (
        <p>No favorite cities yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((city) => (
            <div key={city} className="favorite-card">
              <h3>{city}</h3>
              {weatherData[city] ? (
                <>
                  <img 
                    src={`https://openweathermap.org/img/wn/${weatherData[city].icon}@2x.png`} 
                    alt="Weather Icon"
                    className="weather-icon"
                  />
                  <p>🌡️ Temp: {weatherData[city].temp}°C</p>
                  <p>🏷️ Feels like: {weatherData[city].feelsLike}°C</p>
                  <p>💨 Wind: {weatherData[city].wind} m/s</p>
                </>
              ) : (
                <p>Weather data unavailable.</p>
              )}
              <button className="remove-btn" onClick={() => removeFavorite(city)}>❌ Remove</button>
            </div>
          ))}
        </div>
      )}

      <Link to="/" className="back-home">⬅️ Back to Home</Link>
    </div>
  );
}

export default Favorites;
