import React, { useState, useEffect } from 'react';
import { FaHome, FaCalendarAlt, FaPalette,FaMoneyBillWave } from 'react-icons/fa';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight, MdMenuBook,MdTableRestaurant } from 'react-icons/md';
import { BsFileEarmarkPersonFill } from "react-icons/bs";
import { FaMessage } from "react-icons/fa6";
import { GrDocumentConfig } from "react-icons/gr";

const iconMap = {
  home: FaHome,
  calendar: FaCalendarAlt,
  palette: FaPalette,
  messages: FaMessage,
  book: MdMenuBook,
  acess: GrDocumentConfig,
  person: BsFileEarmarkPersonFill,
  table: MdTableRestaurant,
  money: FaMoneyBillWave
};

/**
 * Sidebar component that renders a collapsible sidebar with navigation items.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onTabChange - Callback function to handle tab change.
 * @param {string} props.activeTab - The currently active tab identifier.
 * @param {string} props.logoUrl - URL of the logo image.
 * @param {string} props.brandName - Name of the brand to display.
 * @param {Array} props.menuItems - Array of menu items to display in the sidebar.
 * @param {string} props.menuItems[].id - Unique identifier for the menu item.
 * @param {string} props.menuItems[].label - Label for the menu item.
 * @param {string} props.menuItems[].icon - Icon name for the menu item.
 *
 * @returns {JSX.Element} The rendered Sidebar component.
 */
const Sidebar = ({ onTabChange, activeTab, logoUrl, brandName, menuItems }) => {
  // ⚡ Estado inicial corretamente convertido em booleano
  const [isMinimized, setIsMinimized] = useState(() => {
    return localStorage.getItem("menuMinimized") === "true";
  });

  // Alterna a minimização do menu
  const toggleSidebar = () => {
    setIsMinimized((prev) => {
      const newState = !prev;
      localStorage.setItem("menuMinimized", newState.toString());
      return newState;
    });
  };

  // ⚡ Lógica corrigida para manter o estado corretamente
  useEffect(() => {
    const checkButtonVisibility = () => {
      const button = document.querySelector(".toggle-btn");
      if (button) {
        const isHidden = window.getComputedStyle(button).display === "none";

        // Só atualiza o estado se não for uma mudança forçada pelo usuário
        setIsMinimized((prev) => {
          if (localStorage.getItem("menuMinimized") !== null) {
            return prev; // Mantém o estado salvo pelo usuário
          }
          return isHidden;
        });
      }
    };

    checkButtonVisibility();
    window.addEventListener("resize", checkButtonVisibility);

    return () => {
      window.removeEventListener("resize", checkButtonVisibility);
    };
  }, []);

  return (
    <aside className={`sidebar-cms bg-dark ${isMinimized ? 'minimized' : ''}`}>
      <div className='d-flex justify-content-between align-items-center brand'>
        {logoUrl && <img className='brand-icon' src={logoUrl} alt="" width="30" height="24" />}
        <h1 className='brand-name'>{!isMinimized ? brandName || 'Admin Panel' : null}</h1>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isMinimized ? <MdKeyboardDoubleArrowRight /> : <MdKeyboardDoubleArrowLeft />}
        </button>
      </div>
      <nav className="d-flex flex-column flex-shrink-0 p-3">
        <ul className="nav nav-pills flex-column mb-auto">
          {menuItems.map(({ id, label, icon }) => {
            const IconComponent = iconMap[icon] || FaHome;
            return (
              <li className="nav-item" key={id}>
                <button
                  className={`nav-link text-white ${activeTab === id ? 'active' : ''}`}
                  onClick={() => onTabChange(id)}
                >
                  <IconComponent className="side-icon me-2" />
                  {!isMinimized && label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
