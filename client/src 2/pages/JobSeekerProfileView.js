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
        <div className="auth-box" style={{ maxWidth: "800px", textAlign: "left", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px", borderBottom: "1px solid #eee", paddingBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "#6b8e6f",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "32px",
                        fontWeight: "bold"
                    }}>
                        {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                        <h2 style={{ margin: "0 0 5px 0", fontSize: "24px", color: "#333" }}>{profile.fullName || "Your Name"}</h2>
                        <p style={{ margin: 0, color: "#666" }}>{profile.experience || "Fresher"}</p>
                    </div>
                </div>
                <Link to="/profile/jobseeker" className="btn-primary" style={{ textDecoration: "none", padding: "10px 20px", borderRadius: "6px" }}>
                    Edit Profile
                </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
                <div>
                    <h4 style={{ color: "#6b8e6f", textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px", marginBottom: "15px" }}>Contact Information</h4>
                    <div style={{ marginBottom: "15px" }}>
                        <strong style={{ display: "block", fontSize: "14px", color: "#888", marginBottom: "4px" }}>Email</strong>
                        <p style={{ margin: 0, color: "#333" }}>{profile.email}</p>
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <strong style={{ display: "block", fontSize: "14px", color: "#888", marginBottom: "4px" }}>Phone</strong>
                        <p style={{ margin: 0, color: "#333" }}>{profile.phone || "N/A"}</p>
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <strong style={{ display: "block", fontSize: "14px", color: "#888", marginBottom: "4px" }}>Location</strong>
                        <p style={{ margin: 0, color: "#333" }}>{profile.location || "N/A"}</p>
                    </div>
                </div>

                <div>
                    <h4 style={{ color: "#6b8e6f", textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px", marginBottom: "15px" }}>Professional Details</h4>
                    <div style={{ marginBottom: "20px" }}>
                        <strong style={{ display: "block", fontSize: "14px", color: "#888", marginBottom: "8px" }}>Skills</strong>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {profile.skills && profile.skills.length > 0 ? (
                                profile.skills.map((skill, index) => (
                                    <span key={index} style={{ background: "#f0f0f0", padding: "6px 12px", borderRadius: "20px", fontSize: "14px", color: "#555" }}>
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p style={{ margin: 0, color: "#999" }}>No skills added</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <strong style={{ display: "block", fontSize: "14px", color: "#888", marginBottom: "4px" }}>Resume</strong>
                        {profile.resume ? (
                            <a
                                href={profile.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#6b8e6f", textDecoration: "underline", fontWeight: "500" }}
                            >
                                View Resume
                            </a>
                        ) : (
                            <p style={{ margin: 0, color: "#999" }}>No resume uploaded</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
