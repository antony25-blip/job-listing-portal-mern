import { useState, useEffect } from "react";
import "../styles/profile.css";

export default function Profile() {
  const [seeker, setSeeker] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("jobSeekerProfile"));
    if (saved) setSeeker(saved);
  }, []);

  const handleChange = (e) => {
    setSeeker({ ...seeker, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setSeeker({ ...seeker, resume: e.target.files[0]?.name });
  };

  const handleSave = (e) => {
    e.preventDefault(); // 🔥 IMPORTANT
    localStorage.setItem("jobSeekerProfile", JSON.stringify(seeker));
    alert("Profile saved successfully ✅");
  };

  return (
    <div className="profile-page">
      <h2>Profile Management</h2>

      <div className="profile-grid">
        <form className="card" onSubmit={handleSave}>
          <h3>Job Seeker Profile</h3>

          <input name="name" value={seeker.name} onChange={handleChange} placeholder="Name" />
          <input name="email" value={seeker.email} onChange={handleChange} placeholder="Email" />
          <input name="phone" value={seeker.phone} onChange={handleChange} placeholder="Phone" />
          <input type="file" onChange={handleFile} />

          <button className="primary-btn">Save Profile</button>
        </form>
      </div>
    </div>
  );
}
