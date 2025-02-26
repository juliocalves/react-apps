import React from "react";

const Contact = () => {
  return (
    <div className="container">
      <h2>Entre em Contato</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input type="text" className="form-control" placeholder="Seu nome" />
        </div>
        <div className="mb-3">
          <label className="form-label">Mensagem</label>
          <textarea className="form-control" rows="3" placeholder="Sua mensagem"></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Enviar</button>
      </form>
    </div>
  );
};

export default Contact;
