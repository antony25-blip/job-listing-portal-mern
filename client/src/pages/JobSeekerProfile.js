import { useState, useEffect } from "react";
import axios from "axios";

import "../styles/auth.css";

const API = process.env.REACT_APP_API_URL;

export default function JobSeekerProfile() {
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    skills: "",
    experience: "",
    location: ""
  });

  const [resume, setResume] = useState(null);
  const token = localStorage.getItem("token");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/api/profile/jobseeker`, {
          headers: { Authorization: token }
        });

        const data = res.data.profile;
        setProfile({
          fullName: data.fullName || "",
          phone: data.phone || "",
          skills: data.skills ? data.skills.join(", ") : "",
          experience: data.experience || "",
          location: data.location || ""
        });
      } catch (err) {
        console.log("No existing profile");
      }
    };

    fetchProfile();
  }, [token]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT PROFILE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(profile).forEach(key => {
      formData.append(key, profile[key]);
    });

    if (resume) {
      formData.append("resume", resume);
    }

    try {
      await axios.post(`${API}/api/profile/jobseeker`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Profile saved successfully");
    } catch (err) {
      alert("Failed to save profile");
    }
  };

  return (
    <div className="auth-box">
      <h2>Job Seeker Profile</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={profile.fullName}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={profile.phone}
          onChange={handleChange}
          required
        />

        <input
          name="skills"
          placeholder="Skills (comma separated)"
          value={profile.skills}
          onChange={handleChange}
        />

        <select
          name="experience"
          value={profile.experience}
          onChange={handleChange}
        >
          <option value="">Select Experience</option>
          <option value="Fresher">Fresher</option>
          <option value="1-3 years">1-3 years</option>
          <option value="3-5 years">3-5 years</option>
          <option value="5+ years">5+ years</option>
        </select>

        <input
          name="location"
          placeholder="Location"
          value={profile.location}
          onChange={handleChange}
        />

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResume(e.target.files[0])}
        />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}
