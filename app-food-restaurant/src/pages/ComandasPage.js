import React from "react";
import MesaCards from "../components/MesaCards";

const ComandasPage = () => {
    /// essa variavel será setada em config
  const totalMesas = 40; 

  return (
    <div>
      <MesaCards quantidadeMesas={totalMesas} />
    </div>
  );
};

export default ComandasPage;
