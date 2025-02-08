// src/layouts/PublicLayout.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer'; // Criaremos o Footer no próximo passo
import '../styles/style.scss';
const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout">
      {/* Navbar */}
      <Header />

      {/* Conteúdo da página */}
      <main className="main-content">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;