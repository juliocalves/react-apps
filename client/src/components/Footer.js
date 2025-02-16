const Footer = ({brandName,slogan}) => {
  return (
    <footer className="cms-footer fixed-bottom bg-dark">
      <p>{brandName} - {slogan}</p>
      <p>&copy; {new Date().getFullYear()} {brandName || "Seu Nome de Empresa"}. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;
