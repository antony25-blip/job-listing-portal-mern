import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";

const API = process.env.REACT_APP_API_URL;

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/api/auth/signup`, {
        name,
        email,
        password
      });

      alert(res.data.message || "Signup successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-box">
      <h2>Create Account</h2>

      <form onSubmit={handleSignup}>
        <input
          placeholder="Name"
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          autoComplete="email"
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
