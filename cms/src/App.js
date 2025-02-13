import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./layouts/Layout";
import AuthPage from "./pages/AuthPage";
import CmsPage from "./pages/CmsPage";
import ReservationsPage from "./pages/clientes/ReservationsPage";
import AppearancePage from "./pages/cms/AppearancePage";
import MessagePage from "./pages/clientes/MessagePage";
import CatalogoPage from "./pages/produtos/CatalogoPage";
import ProdutoPage from "./pages/ProdutoPage";
import ClientePage from "./pages/ClientePage";
import EquipePage from "./pages/EquipePage";
import ProdutoDetailPage from "./pages/produtos/ProdutoDetailPage";
import AcessosPage from "./pages/equipe/AcessosPage";
import ColaboradorPage from "./pages/equipe/ColaboradorPage";
import ColaboradorDetailPage from "./pages/equipe/ColaboradorDetail";
import { menuItems } from "./menuItems";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />

          <Route
            path="/cms/*"
            element={
              <Layout menuItens={menuItems.cms}>
                <Routes>
                  <Route index element={<CmsPage />} />
                  <Route path="aparencia" element={<AppearancePage />} />
                 
                </Routes>
              </Layout>
            }
          />

          <Route
            path="/produtos/*"
            element={
              <Layout menuItens={menuItems.produtos}>
                <Routes>
                  <Route index element={<ProdutoPage />} />
                  <Route path="catalogo" element={<CatalogoPage />} />
                  <Route path="produto-detail/:produtoId" element={<ProdutoDetailPage />} />
                </Routes>
              </Layout>
            }
          />

          <Route path="/clientes/*" element={
            <Layout menuItens={menuItems.clientes}>
              <Routes>
                <Route index element={<ClientePage />} />
                <Route path="reservas" element={<ReservationsPage />} />
                <Route path="mensagens" element={<MessagePage />} />
              </Routes>
            </Layout>
          }/>
          <Route 
            path="/equipe/*" 
            element={
              <Layout menuItens={menuItems.equipe}>
                <Routes>
                  <Route index element={<EquipePage />} />
                  <Route path="acessos" element={<AcessosPage/>}/>
                  <Route path="colaboradores" element={<ColaboradorPage/>}/>
                  <Route path="colaborador/:colaboradorId" element={<ColaboradorDetailPage />} />
                </Routes>
              </Layout>
              } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
