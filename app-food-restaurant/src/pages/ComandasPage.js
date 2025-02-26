import React from "react";
import MesaCards from "../components/MesaCards";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt} from "react-icons/fa";
const ComandasPage = () => {
    /// essa variavel será setada em config
  const totalMesas = 40; 

  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };
 
  return (
    <div>
        <div className="header-container-mesas">
          <div></div>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" />
          </button>
        </div>
      <MesaCards quantidadeMesas={totalMesas} />
    </div>
  );
};

export default ComandasPage;
