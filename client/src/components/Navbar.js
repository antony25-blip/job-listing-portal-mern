import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const [logo, setLogo] = useState(null);
  const dropdownRef = useRef(null);

  const API = process.env.REACT_APP_API_URL;

  // Click Outside to Close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (user?.role === "employer") {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${API}/api/profile/employer`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.success && res.data.profile.logo) {
            setLogo(res.data.profile.logo);
          }
        } catch (err) {
          console.error("Failed to fetch navbar logo", err);
        }
      };
      fetchProfile();
    }
  }, [user, API]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
      <h2 className="logo" onClick={() => navigate("/")}>
        JobPortal
      </h2>

      {/* CENTER */}
      <div className="nav-center">
        {user?.role === "employer" ? (
          <>
            <Link to="/my-jobs">My Jobs</Link>
            <Link to="/jobs/create">Create Job</Link>
            <Link to="/profile/employer/view">Profile</Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/career-advice">Career Advice</Link>
          </>
        )}
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        {!user ? (
          <>
            <Link className="btn-outline" to="/login">
              Login
            </Link>
            <Link className="btn-fill" to="/signup">
              Sign Up
            </Link>
          </>
        ) : (
          <div className="profile-wrapper" ref={dropdownRef}>
            <span
              className="profile-icon"
              role="button"
              tabIndex={0}
              onClick={() => setOpen(!open)}
              style={{
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: logo ? "transparent" : "#6b8e6f"
              }}
            >
              {logo ? (
                <img
                  src={logo}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                "👤"
              )}
            </span>

            {open && (
              <div className="profile-dropdown">
                <span style={{ fontWeight: 600 }}>
                  {user?.name || "User"}
                </span>

                <hr />

                {/* Role-based links */}
                {user?.role === "employer" ? (
                  <>
                    <Link to="/jobs/create" onClick={() => setOpen(false)}>
                      Post a Job
                    </Link>
                    <Link
                      to="/profile/employer/view"
                      onClick={() => setOpen(false)}
                    >
                      Company Profile
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/profile/jobseeker/view"
                    onClick={() => setOpen(false)}
                  >
                    My Profile
                  </Link>
                )}



                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
