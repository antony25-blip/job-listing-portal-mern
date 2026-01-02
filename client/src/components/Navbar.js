import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

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
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/career-advice">Career Advice</Link>
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
          <div className="profile-wrapper">
            <span
              className="profile-icon"
              role="button"
              tabIndex={0}
              onClick={() => setOpen(!open)}
            >
              👤
            </span>

            {open && (
              <div className="profile-dropdown">
                <span style={{ fontWeight: 600 }}>
                  {user?.name || "User"}
                </span>

                <hr />

                {/* Role-based links */}
                {user?.role === "employer" ? (
                  <Link
                    to="/profile/employer"
                    onClick={() => setOpen(false)}
                  >
                    Company Profile
                  </Link>
                ) : (
                  <Link
                    to="/profile/jobseeker"
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
