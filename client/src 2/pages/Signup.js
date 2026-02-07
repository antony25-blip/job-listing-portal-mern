import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const API = process.env.REACT_APP_API_URL;

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("jobseeker"); // 👈 NEW
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

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/api/auth/signup`, {
        name,
        email,
        password,
        role // 👈 SEND ROLE
      });

      alert(res.data.message || "Signup successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  /* ================= GOOGLE SIGNUP ================= */
  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const res = await axios.post(`${API}/api/auth/google-login`, {
        token: credentialResponse.credential,
        role: role // 👈 SEND SELECTED ROLE
      });

      const user = {
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      };

      localStorage.setItem("token", res.data.jwtToken);
      localStorage.setItem("user", JSON.stringify(user));
      login(user);

      alert("Google signup successful");
      redirectByRole(user.role);
    } catch (err) {
      console.error(err);
      alert("Google signup failed");
    }
  };

  return (
    <div className="auth-box">
      <h2>Create Account</h2>

      <form onSubmit={handleSignup}>
        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Email"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* 👇 ROLE SELECT */}
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="jobseeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>

        <button type="submit">Sign Up</button>
      </form>

      <hr />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
          Or sign up with Google as a {role}
        </p>
        <GoogleLogin
          onSuccess={handleGoogleSignup}
          onError={() => alert("Google signup failed")}
        />
      </div>
    </div>
  );
}
