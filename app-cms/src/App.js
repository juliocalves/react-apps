import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import AuthPage from "./pages/AuthPage";
import Cms from "./pages/Cms";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cms/*" element={
                <Routes>
                  <Route index element={<Cms />} />
                </Routes>
          }/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
