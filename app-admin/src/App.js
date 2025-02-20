import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./layouts/Layout";
import AuthPage from "./pages/auth/AuthPage";
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
import ComandasPage from "./pages/ComandasPage";
import { menuItems } from "./menuItems";

/**
 * The main application component that sets up the routing for the app.
 * It uses React Router for navigation and an AuthProvider for authentication context.
 * 
 * Routes:
 * - "/" and "/auth": AuthPage
 * - "/cms/*": Layout with CmsPage and AppearancePage
 * - "/produtos/*": Layout with ProdutoPage, CatalogoPage, and ProdutoDetailPage
 * - "/clientes/*": Layout with ClientePage, ReservationsPage, and MessagePage
 * - "/equipe/*": Layout with EquipePage, AcessosPage, ColaboradorPage, and ColaboradorDetailPage
 * 
 * @returns {JSX.Element} The main application component with routing.
 */
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
          <Route path="/comandas/*" element={
              <Layout hideSideMenu={true}>
                <Routes>
                  <Route index element={<ComandasPage />} />
                </Routes>
              </Layout>
          }/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
