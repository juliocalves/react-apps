// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CmsPage from './pages/CmsPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cms/*" element={<CmsPage />} />
        </Routes>
        </AuthProvider>
    </Router>
  );
}

export default App;