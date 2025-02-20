import React, { useEffect, useState } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer'; 
import { getIdentity } from "../services/firestore";
const PublicLayout = ({ children }) => {
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
  return (
    <div className="admin-main">
      <div className="admin-container">
      <header className="admin-header">
        <Header theme={theme} toggleTheme={toggleTheme}/>
      </header>
        <main className="main-content">
          {children}
        </main>
      </div>
      <Footer brandName={identityConfig?.brandName} slogan={identityConfig?.brandSlogan}/>
    </div>
  );
};

export default PublicLayout;