import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/stylleadmin.scss";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth } from "../services/firebase";
import SideBar from "../components/SideBar";
import { getIdentity } from "../services/firestore";

/**
 * Layout component that provides the main structure for the application.
 * It includes a sidebar, header, and footer, and manages theme and user authentication state.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @param {Array} props.menuItens - The menu items to be displayed in the sidebar.
 *
 * @returns {JSX.Element} The rendered Layout component.
 */
const Layout = ({ children, menuItens }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  // Estado para controlar o tema atual (light ou dark)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  // Estado para armazenar a configuração de identidade carregada do Firestore
  const [identityConfig, setIdentityConfig] = useState(null);

  // Carrega a configuração de identidade (que contém os temas) do Firestore
  useEffect(() => {
    const fetchIdentity = async () => {
      const data = await getIdentity();
      if (data) {
        setIdentityConfig(data);
      }
    };
    fetchIdentity();
  }, []);

  useEffect(() => {
  if (identityConfig) {

    const themeConfig = theme === "light" ? identityConfig.lightTheme : identityConfig.darkTheme;

    if (themeConfig) {
      Object.entries(themeConfig).forEach(([key, value]) => {
        if (value) {
          document.documentElement.style.setProperty(`--${camelToKebabCase(key)}`, value);
        }
      });
    }

    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }
  }, [theme, identityConfig]);

  // Função para converter nomes de variáveis de camelCase para kebab-case
  const camelToKebabCase = (str) => {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  };

  // Função para alternar o tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/auth");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleActiveTab = location.pathname.split("/")[2];


  const handleTabChange = (tabId) => {
    const basePath = location.pathname.startsWith("/produtos") ? "/produtos" : 
                     location.pathname.startsWith("/cms") ? "/cms" :
                     location.pathname.startsWith("/clientes") ? "/clientes" : "/equipe"; // Add other base paths

    navigate(`${basePath}/${tabId}`); // Correct: Absolute path from base
  };

  return (
    <div className="admin-main">
      <div className="admin-container">
        <SideBar
          onTabChange={handleTabChange}
          activeTab={handleActiveTab}
          logoUrl={identityConfig?.logoUrl}
          brandName={identityConfig?.brandName.toUpperCase()}
          menuItems={menuItens}
        />
        <main className="admin-content">
          <header className="admin-header">
            <Header user={user} theme={theme} toggleTheme={toggleTheme} />
          </header>
          {children}
        </main>
      </div>
      <Footer brandName={identityConfig?.brandName} slogan={identityConfig?.brandSlogan}/>
    </div>
  );
};

export default Layout;
