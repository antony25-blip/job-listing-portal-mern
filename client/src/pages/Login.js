import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const API = process.env.REACT_APP_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  /* ================= REDIRECT BASED ON ROLE ================= */
  const redirectByRole = (role) => {
    if (role === "employer") {
      navigate("/profile/employer");
    } else {
      navigate("/profile/jobseeker");
    }
  };

  /* ================= MANUAL LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });

      const user = {
        name: res.data.name,
        email: res.data.email,
        role: res.data.role || "jobseeker", // fallback
      };

      localStorage.setItem("token", res.data.jwtToken);
      localStorage.setItem("user", JSON.stringify(user));
      login(user);

      alert("Login successful");
      redirectByRole(user.role);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(`${API}/api/auth/google-login`, {
        token: credentialResponse.credential,
      });

      const user = {
        name: res.data.name,
        email: res.data.email,
        role: res.data.role || "jobseeker", // fallback
      };

      localStorage.setItem("token", res.data.jwtToken);
      localStorage.setItem("user", JSON.stringify(user));
      login(user);

      alert("Google login successful");
      redirectByRole(user.role);
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
          type="email"
          placeholder="Email"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
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
