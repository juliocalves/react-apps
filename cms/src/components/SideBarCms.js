import React, { useState,useEffect } from 'react';
import { FaHome, FaCalendarAlt, FaPalette } from 'react-icons/fa';
import { FaMessage } from "react-icons/fa6";
import { MdKeyboardDoubleArrowLeft,MdKeyboardDoubleArrowRight } from "react-icons/md";
const SidebarCMS = ({ onTabChange, activeTab,logoUrl}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  

  useEffect(() => {
    const checkButtonVisibility = () => {
      const button = document.querySelector(".toggle-btn");
      if (button) {
        const isHidden = window.getComputedStyle(button).display === "none";
        if (isHidden) {
          setIsMinimized(true);
        }
      }
    };
    
    checkButtonVisibility(); // Verifica ao carregar a página
    window.addEventListener("resize", checkButtonVisibility);

    return () => window.removeEventListener("resize", checkButtonVisibility);
  }, []);
  return (
    <aside className={`sidebar-cms bg-dark ${isMinimized ? 'minimized' : ''}`}>
      <div className='d-flex justify-content-between align-items-center brand'>
        { logoUrl&&
          <img className='brand-icon' src={logoUrl} alt="" width="30" height="24"/>
        }
        <h1 className='brand-name'> {!isMinimized && 'Admin Panel'}</h1>
        <button className="toggle-btn" onClick={toggleSidebar}>
        {isMinimized ? <MdKeyboardDoubleArrowRight /> : <MdKeyboardDoubleArrowLeft />}
        </button>
      </div>
      <nav className="d-flex flex-column flex-shrink-0 p-3 ">
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <button
              className={`nav-link text-white ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => onTabChange('dashboard')}
            >
              <FaHome className="side-icon me-2" />
              {!isMinimized && 'Dashboard'}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link text-white ${activeTab === 'reservations' ? 'active' : ''}`}
              onClick={() => onTabChange('reservations')}
            >
              <FaCalendarAlt className="side-icon me-2" />
              {!isMinimized && 'Reservas'}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link text-white ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => onTabChange('appearance')}
            >
              <FaPalette className="side-icon me-2" />
              {!isMinimized && 'Aparência do Site'}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link text-white ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => onTabChange('messages')}
            >
              <FaMessage className="side-icon me-2" />
              {!isMinimized && 'Mensagens'}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarCMS;
