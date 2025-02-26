import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center">
      <h1>Bem-vindo ao Restaurante</h1>
      <p>Os melhores pratos com entrega rápida e segura.</p>
      <img 
        src="https://source.unsplash.com/800x400/?restaurant,food" 
        alt="Restaurante"
        className="img-fluid rounded my-3"
      />
      <Link to="/menu" className="btn btn-primary">Ver Cardápio</Link>
    </div>
  );
};

export default Home;
