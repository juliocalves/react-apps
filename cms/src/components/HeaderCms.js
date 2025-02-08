import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaHome, FaCalendarAlt, FaPalette } from "react-icons/fa";

const HeaderCms = ({ user,theme, toggleTheme  }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef(null);
  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNavOpen && navRef.current && !navRef.current.contains(event.target)) {
        setIsNavOpen(false);
        document.querySelector(".navbar-toggler").click(); // Fecha o menu do Bootstrap
      }
    };

    if (isNavOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isNavOpen]);


  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark navbarcms">
      <div className="container-fluid" ref={navRef}>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={isNavOpen ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav" style={isNavOpen ? { display: "flex" } : { display: "" }}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/cms" className="nav-link">
                <FaHome className="nav-icon me-2" />
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/cms/reservations" className="nav-link">
                <FaCalendarAlt className="nav-icon me-2" />
                Reservas
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/cms/appearance" className="nav-link">
                <FaPalette className="nav-icon me-2" />
                Aparência do Site
              </Link>
            </li>
          </ul>
         
          <div className="d-flex user-info">
            {user && <img src={user.photoURL} alt="User" className="user-photo" />}
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt className="logout-icon" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderCms;
