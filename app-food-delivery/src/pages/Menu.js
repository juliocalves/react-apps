import React, { useState } from "react";

const Menu = () => {
  const [menuItems] = useState([
    { id: 1, name: "Pizza", price: 25.99, img: "https://source.unsplash.com/200x150/?pizza" },
    { id: 2, name: "Hambúrguer", price: 19.99, img: "https://source.unsplash.com/200x150/?burger" },
    { id: 3, name: "Sushi", price: 32.99, img: "https://source.unsplash.com/200x150/?sushi" },
  ]);

  return (
    <div className="container">
      <h2 className="mb-4">Cardápio</h2>
      <div className="row">
        {menuItems.map((item) => (
          <div key={item.id} className="col-md-4">
            <div className="card mb-3">
              <img src={item.img} className="card-img-top" alt={item.name} />
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">R$ {item.price.toFixed(2)}</p>
                <button className="btn btn-success">Adicionar ao Pedido</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
