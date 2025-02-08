import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/stylleadmin.scss";
import HeaderCms from "../components/HeaderCms";
import FooterCMS from "../components/FooterCms";
import { auth } from "../services/firebase";
const Layout = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/auth"); // Redireciona para login se não estiver autenticado
      }
    });

    return () => unsubscribe();
  }, [navigate]);

    return (
        <div className="admin-main">
            <main className="admin-content">
                <header className="admin-header">
                    <HeaderCms user={user}  />
                </header>
                {children}
            </main>
        <FooterCMS />
        </div>
  );
};

export default Layout;