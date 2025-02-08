import React, { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import DashboardPage from "./DashboardPage";
import ReservationsPage from "./ReservationsPage";
import AppearancePage from "./AppearancePage";
import SidebarCMS from "../components/SideBarCms";
import HeaderCms from "../components/HeaderCms";
import FooterCMS from "../components/FooterCms";
import MessagePage from "./MessagePage";
import { getIdentity } from "../services/firestore";
const CmsPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  //Renderiza o conteúdo de acordo com a aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'reservations':
        return <ReservationsPage />;
      case 'appearance':
        return <AppearancePage />;
      case 'messages':
        return <MessagePage />;
      default:
        return <DashboardPage />;
    }
  };
  
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

  const getCurrentPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'dashboard';
      case 'reservations':
        return 'Reservas';
      case 'appearance':
        return 'Aparência do Site';
      case 'messages':
        return 'Mensagens';
      default:
        return 'dashboard';
    }

  };

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
    <AdminLayout>
      <div className="admin-container">
        {/* Sidebar */}
        
        <SidebarCMS onTabChange={setActiveTab} activeTab={activeTab}  logoUrl={identityConfig?.logoUrl}/>
        
        <main className="admin-content">
          <header className="admin-header">
          <HeaderCms user={user} theme={theme} toggleTheme={toggleTheme} />
            <h1>CMS - {getCurrentPage().toUpperCase()}</h1>
          </header>
          {renderTabContent()}
        </main>
      </div>
      <FooterCMS />
    </AdminLayout>
  );
};

export default CmsPage;
