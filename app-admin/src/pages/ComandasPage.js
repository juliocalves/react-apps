import React from "react";
import MesaCards from "../components/MesaCards";

const Dashboard = () => {
    /// essa variavel será setada em config
  const totalMesas = 40; 

  return (
    <div>
      <h1>Dashboard de Mesas</h1>
      <MesaCards quantidadeMesas={totalMesas} />
    </div>
  );
};

export default Dashboard;
