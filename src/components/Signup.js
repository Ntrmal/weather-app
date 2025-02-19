import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./auth.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => {
      document.body.classList.remove("auth-page");
    };
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      
      // Show success message
      toast.success("Signup successful! Redirecting...", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });

      // Redirect after 2 seconds
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      // Show error message
      toast.error(`Error: ${error.message}`, {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">Sign Up</button>
        </div>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>

      {/* Toast Container for Popups */}
      <ToastContainer />
    </div>
  );
}

export default Signup;
