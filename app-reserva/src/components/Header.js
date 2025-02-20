

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ImHome } from "react-icons/im";
import { FaPhone,FaCalendar } from "react-icons/fa";
import { BsFillInfoSquareFill } from "react-icons/bs";
const Header = ({theme, toggleTheme,logoUrl,brand  }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef(null);

 
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
        
          {logoUrl &&
            <a className="navbar-brand" href="/">
                <img className='brand-icon' src={logoUrl} alt="" width="30" height="24"/>
              {brand}
            </a>
          }
        <div className="navbarNav collapse navbar-collapse" id="navbarNav" style={isNavOpen ? { display: "flex" } : { display: "" }}>
          <ul className="navbar-nav me-auto">
          <li className="nav-item">
              <Link to="/" className="nav-link">
                <ImHome className="nav-icon me-2" />
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/sobre" className="nav-link">
              <BsFillInfoSquareFill  className="nav-icon me-2" />
                Sobre
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contato" className="nav-link">
                <FaPhone className="nav-icon me-2" />
                Contato
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/reserva"className="nav-link">
                <FaCalendar className="nav-icon me-2"/>
                Reserva
              </Link>
            </li>
          
          </ul>
        
          <div className="d-flex user-info">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
    </div>
  </nav>
  );
};

export default Header;





 
