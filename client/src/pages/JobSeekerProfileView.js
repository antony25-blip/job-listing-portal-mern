import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";

const API = process.env.REACT_APP_API_URL;

export default function JobSeekerProfileView() {
    const [profile, setProfile] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API}/api/profile/jobseeker`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(res.data.profile);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };
        fetchProfile();
    }, [token]);

    if (!profile) return <p style={{ padding: "20px" }}>Loading profile...</p>;

    return (
        <div className="auth-box" style={{ maxWidth: "600px", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2>My Profile</h2>
                <Link to="/profile/jobseeker" className="btn-primary" style={{ textDecoration: "none", width: "auto", display: "inline-block" }}>
                    Edit
                </Link>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <strong>Name:</strong>
                <p>{profile.name}</p>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <strong>Email:</strong>
                <p>{profile.email}</p>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <strong>Phone:</strong>
                <p>{profile.phone || "N/A"}</p>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <strong>Skills:</strong>
                <p>{profile.skills ? profile.skills.join(", ") : "N/A"}</p>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <strong>Experience:</strong>
                <p>{profile.experience || "N/A"}</p>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <strong>Resume:</strong>
                <p>{profile.resume ? <a href={profile.resume} target="_blank" rel="noopener noreferrer">View Resume</a> : "N/A"}</p>
            </div>
        </div>
    );
}
