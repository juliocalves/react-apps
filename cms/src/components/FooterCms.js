import React from "react";

const FooterCMS = () => {
  return (
    <footer className="cms-footer fixed-bottom bg-dark">
      <p>&copy; {new Date().getFullYear()} Seu CMS. Todos os direitos reservados.</p>
    </footer>
  );
};

export default FooterCMS;
