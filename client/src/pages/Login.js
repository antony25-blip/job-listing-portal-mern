import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "../styles/auth.css";

const API = process.env.REACT_APP_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password
      });

      localStorage.setItem("token", res.data.jwtToken);
      localStorage.setItem("user", JSON.stringify({
        name: res.data.name,
        email: res.data.email
      }));

      alert("Login successful");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${API}/api/auth/google-login`,
        { token: credentialResponse.credential }
      );

      localStorage.setItem("token", res.data.jwtToken);
      localStorage.setItem("user", JSON.stringify({
        name: res.data.name,
        email: res.data.email
      }));

      alert("Google login successful");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };


  return (
    <div className="auth-box">
      <h2>Welcome Back</h2>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          autoComplete="email"
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <hr />

      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => alert("Google login failed")}
      />
    </div>
  );
}
