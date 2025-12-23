import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
      <h2 className="logo">JobPortal</h2>

      {/* CENTER */}
      <div className="nav-center">
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/career-advice">Career Advice</Link>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        {!isLoggedIn ? (
          <>
            <Link className="btn-outline" to="/login">Login</Link>
            <Link className="btn-fill" to="/signup">Sign Up</Link>
          </>
        ) : (
          <div className="profile-wrapper">
            <span
              className="profile-icon"
              onClick={() => setOpen(!open)}
            >
              👤
            </span>

            {open && (
              <div className="profile-dropdown">
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
