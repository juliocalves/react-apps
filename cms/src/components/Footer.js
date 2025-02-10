import React from "react";

const Footer = ({brandName,slogan}) => {
  return (
    <footer className="cms-footer fixed-bottom bg-dark">
      <p>&copy; {new Date().getFullYear()} {brandName || "Seu Nome de Empresa"}. Todos os direitos reservados.</p>
      <p>{slogan}</p>
    </footer>
  );
};

export default Footer;
