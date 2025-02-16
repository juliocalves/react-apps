import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBell } from "react-icons/fa";
import { SiCraftcms } from "react-icons/si";
import { IoFastFoodSharp } from "react-icons/io5";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";
import UserCanvas from "./UserCanvas";
const Header = ({ user,theme, toggleTheme  }) => {
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

  // useEffect(() => {
  //   const handleClickLink = () => {
  //     setIsNavOpen(false);
  //     document.querySelector(".navbar-toggler").click(); // Fecha o menu no Bootstrap
  //   };

  //   const links = document.querySelectorAll(".header-link");
  //   links.forEach((link) => link.addEventListener("click", handleClickLink));
  //   // Seleciona os botões adicionais (ajuste os seletores conforme necessário)
  //   const themeBtn = document.querySelector(".theme-toggle");
  //   const alertBtn = document.querySelector(".alert-btn");

  //   if (themeBtn) themeBtn.addEventListener("click", handleClickLink);
  //   if (alertBtn) alertBtn.addEventListener("click", handleClickLink);
  //   return () => {
  //     links.forEach((link) => link.removeEventListener("click", handleClickLink));
  //     if (themeBtn) themeBtn.removeEventListener("click", handleClickLink);
  //   if (alertBtn) alertBtn.removeEventListener("click", handleClickLink);
  //   };
  // }, []);

  const toggleAlerts = () =>{}


  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark navbarcms">
      <div className="container-fluid" ref={navRef}>
        {/* <button
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
        </button> */}

        {/* <div className="collapse navbar-collapse" id="navbarNav" style={isNavOpen ? { display: "flex" } : { display: "" }}> */}
        <div className="navbarNav collapse navbar-collapse" id="navbarNav" style={isNavOpen ? { display: "flex" } : { display: "" }}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/cms" className="nav-link header-link">
              <SiCraftcms className="nav-icon me-2" />
              <span>
                CMS
              </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/produtos" className="nav-link header-link">
                <IoFastFoodSharp className="nav-icon me-2"/>
                <span >
                  PRODUTOS
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/clientes" className="nav-link header-link" >
                <BsFillPersonVcardFill className="nav-icon me-2" />
                <span>
                  CLIENTES
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/equipe" className="nav-link header-link" >
                <RiTeamFill className="nav-icon me-2" />
                <span>
                  EQUIPE
                </span>
              </Link>
            </li>
           
          </ul>
         
          <div className="d-flex user-info">
            <button className="user-toglgle" data-bs-toggle="offcanvas"
                data-bs-target="#userCanvas" >
              {user && <img src={user.photoURL} alt="User" className="user-photo" />}
            </button>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button className="alert-btn" onClick={toggleAlerts} >
              <FaBell className="alert-icon" />
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt className="logout-icon" />
            </button>
          </div>
        </div>
      </div>
      <UserCanvas user={user || { displayName: "", email: "" }} onEditProfile={() => {}} onLogout={handleLogout} />
    </nav>
  );
};

export default Header;
