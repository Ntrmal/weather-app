
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Favorites from "./components/FavoritePage";
import About from './About';
import './app.css';
import { HashRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <Router basename="/weather-app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
