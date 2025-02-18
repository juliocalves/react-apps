import React from "react";

/**
 * Footer component that displays the brand name, slogan, and copyright information.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.brandName - The name of the brand to display.
 * @param {string} props.slogan - The slogan of the brand to display.
 * @returns {JSX.Element} The rendered footer component.
 */
const Footer = ({brandName,slogan}) => {
  return (
    <footer className="cms-footer fixed-bottom bg-dark">
      <p>{brandName} - {slogan}</p>
      <p>&copy; {new Date().getFullYear()} {brandName || "Seu Nome de Empresa"}. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;
