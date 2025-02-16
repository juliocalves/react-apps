import { useState, useEffect } from "react";

const ColaboradorModal = ({ show, onClose, onSave, colaborador }) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cargo: "",
    funcao: "",
    data: new Date().toISOString().split("T")[0], // Data atual
    ativo: true,
  });

  useEffect(() => {
    if (colaborador) {
      setFormData(colaborador);
    } else {
      setFormData({
        nome: "",
        email: "",
        cargo: "",
        funcao: "",
        data: new Date().toISOString().split("T")[0],
        ativo: true,
      });
    }
  }, [colaborador]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{colaborador ? "Editar Colaborador" : "Novo Colaborador"}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Cargo</label>
              <input
                type="text"
                className="form-control"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Função</label>
              <input
                type="text"
                className="form-control"
                name="funcao"
                value={formData.funcao}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Data de Criação</label>
              <input
                type="date"
                className="form-control"
                name="data"
                value={formData.data}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="ativo"
                checked={formData.ativo}
                onChange={handleChange}
              />
              <label className="form-check-label">Ativo</label>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColaboradorModal;
