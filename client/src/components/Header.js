// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import brand from '../logo.svg'
const Header = () => {
  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark navbarcms"> {/* Bootstrap navbar */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav"> {/* Fluid container for responsiveness */}
        <div className="container">
          <a className="navbar-brand" href="/">
            <img className='brand-icon' src={brand} alt="" width="30" height="24"/>
             Sua Empresa
          </a>
        </div>
        <ul className="navbar-nav me-auto"> 
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/sobre" className="nav-link">Sobre</Link>
          </li>
          <li className="nav-item">
            <Link to="/contato" className="nav-link">Contato</Link>
          </li>
          <li className="nav-item">
            <Link to="/reserva"className="nav-link">Reserva</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;