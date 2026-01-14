import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";

const API = process.env.REACT_APP_API_URL;

export default function EmployerProfileView() {
    const [profile, setProfile] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API}/api/profile/employer`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(res.data.profile);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };
        fetchProfile();
    }, [token]);

    if (!profile) return <div style={{ textAlign: "center", padding: "50px" }}>Loading profile...</div>;

    return (
        <div className="auth-box" style={{ maxWidth: "800px", textAlign: "left", padding: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid #eee", paddingBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    {profile.logo && (
                        <img
                            src={profile.logo}
                            alt={`${profile.companyName} Logo`}
                            style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "50%",
                                border: "1px solid #eee",
                                padding: "2px",
                                background: "white"
                            }}
                        />
                    )}
                    <div>
                        <h1 style={{ margin: 0, color: "#2c3e50", fontSize: "28px" }}>{profile.companyName}</h1>
                        <p style={{ margin: "5px 0 0", color: "#666" }}>{profile.location || "Location not set"}</p>
                    </div>
                </div>
                <Link to="/profile/employer" className="btn-primary">
                    Edit Profile
                </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px" }}>
                <div>
                    <h3 style={{ color: "#6b8e6f", borderBottom: "2px solid #6b8e6f", display: "inline-block", paddingBottom: "5px", marginBottom: "15px" }}>Contact Info</h3>
                    <div style={{ marginBottom: "10px" }}>
                        <strong style={{ color: "#444" }}>Email:</strong>
                        <p style={{ margin: "5px 0", color: "#555" }}>{profile.email}</p>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <strong style={{ color: "#444" }}>Phone:</strong>
                        <p style={{ margin: "5px 0", color: "#555" }}>{profile.phone || "N/A"}</p>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <strong style={{ color: "#444" }}>Website:</strong>
                        <p style={{ margin: "5px 0", color: "#555" }}>
                            {profile.website ? <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: "#6b8e6f" }}>{profile.website}</a> : "N/A"}
                        </p>
                    </div>
                </div>

                <div>
                    <h3 style={{ color: "#6b8e6f", borderBottom: "2px solid #6b8e6f", display: "inline-block", paddingBottom: "5px", marginBottom: "15px" }}>About Company</h3>
                    <p style={{ lineHeight: "1.6", color: "#555" }}>
                        {profile.description || "No description provided."}
                    </p>
                </div>
            </div>
        </div>
    );
}
