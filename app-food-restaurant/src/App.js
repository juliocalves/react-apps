import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import ComandasPage from "./pages/ComandasPage";

function App() {
  return (
    <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/comandas/*" element={
              <Routes>
                <Route index element={<ComandasPage />} />
              </Routes>
        }/>
      </Routes>
    </AuthProvider>
  </Router>
  );
}

export default App;
