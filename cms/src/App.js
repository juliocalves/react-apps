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

const menuItemsCms = [
  { id: "", label: "Dashboard", icon: "home" },
  { id: "aparencia", label: "Aparência do Site", icon: "palette" },
];

const menuItemsProdutos = [
  { id: "", label: "Dashboard", icon: "home" },
  { id: "catalogo", label: "Catálogo", icon: "book" },
];
const menuItemsClientes = [
  { id: "", label: "Dashboard", icon: "home" },
  { id: "pedidos", label: "Pedidos",icon: "book"},
  { id: "reservas", label: "Reservas",icon: "calendar"},
  { id: "mensagens", label: "Mensagens", icon: "messages" },
];

const menuItemsEquipe = [
  { id: "", label: "Dashboard", icon: "home" },
  { id: "acessos", label: "Acessos", icon: "acess"},
  { id: "colaboradores", label: "Colaboradores", icon: "person"},
];


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
              <Layout menuItens={menuItemsCms}>
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
              <Layout menuItens={menuItemsProdutos}>
                <Routes>
                  <Route index element={<ProdutoPage />} />
                  <Route path="catalogo" element={<CatalogoPage />} />
                  <Route path="produto-detail/:produtoId" element={<ProdutoDetailPage />} />
                </Routes>
              </Layout>
            }
          />

          <Route path="/clientes/*" element={
            <Layout menuItens={menuItemsClientes}>
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
              <Layout menuItens={menuItemsEquipe}>
                <Routes>
                  <Route index element={<EquipePage />} />
                  <Route path="acessos" element={<AcessosPage/>}/>
                  <Route path="colaboradores" element={<ColaboradorPage/>}/>
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
