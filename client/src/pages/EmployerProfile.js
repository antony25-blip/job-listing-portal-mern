import { useState, useEffect } from "react";
import axios from "axios";

import "../styles/auth.css";

const API = process.env.REACT_APP_API_URL;

export default function EmployerProfile() {
  const [profile, setProfile] = useState({
    companyName: "",
    companyEmail: "",
    phone: "",
    website: "",
    description: "",
    location: ""
  });

  const token = localStorage.getItem("token");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/api/profile/employer`, {
          headers: { Authorization: token }
        });

        setProfile(res.data.profile);
      } catch (err) {
        console.log("No employer profile yet");
      }
    };

    fetchProfile();
  }, [token]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  /* ================= SAVE PROFILE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/api/profile/employer`, profile, {
        headers: { Authorization: token }
      });

      alert("Employer profile saved successfully");
    } catch (err) {
      alert("Failed to save employer profile");
    }
  };

  return (
    <div className="auth-box">
      <h2>Employer Profile</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="companyName"
          placeholder="Company Name"
          value={profile.companyName || ""}
          onChange={handleChange}
          required
        />

        <input
          name="companyEmail"
          placeholder="Company Email"
          value={profile.companyEmail || ""}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={profile.phone || ""}
          onChange={handleChange}
        />

        <input
          name="website"
          placeholder="Website"
          value={profile.website || ""}
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          value={profile.location || ""}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Company Description"
          value={profile.description || ""}
          onChange={handleChange}
        />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}
