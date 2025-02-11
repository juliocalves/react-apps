import { useState, useEffect } from "react";

const AcessoModal = ({ show, onClose, onSave, acesso }) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    data: new Date().toISOString().split("T")[0], // Data atual
    ativo: true,
    permissoes: [],
  });

  useEffect(() => {
    if (acesso) {
      setFormData({
        ...acesso,
        permissoes: Array.isArray(acesso.permissoes) ? acesso.permissoes : [],
      });
    }
  }, [acesso]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePermissaoChange = (index, field, value) => {
    const novasPermissoes = [...formData.permissoes];
    novasPermissoes[index][field] = value;
    setFormData({ ...formData, permissoes: novasPermissoes });
  };

  const adicionarPermissao = () => {
    setFormData({
      ...formData,
      permissoes: [...formData.permissoes, { pagina: "", leitura: false, escrita: false, delete: false }],
    });
  };

  const removerPermissao = (index) => {
    const novasPermissoes = formData.permissoes.filter((_, i) => i !== index);
    setFormData({ ...formData, permissoes: novasPermissoes });
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
            <h5 className="modal-title">{acesso ? "Editar Acesso" : "Adicionar Acesso"}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input type="text" className="form-control" name="nome" value={formData.nome} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Data de Criação</label>
              <input type="date" className="form-control" name="data" value={formData.data} onChange={handleChange} />
            </div>

            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" name="ativo" checked={formData.ativo} onChange={handleChange} />
              <label className="form-check-label">Ativo</label>
            </div>

            <div className="mb-3">
              <h6>Permissões</h6>
              {formData.permissoes.map((permissao, index) => (
                <div key={index} className="border p-2 mb-2">
                  <label className="form-label">Página</label>
                  <input type="text" className="form-control mb-2" value={permissao.pagina} onChange={(e) => handlePermissaoChange(index, "pagina", e.target.value)} />

                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={permissao.leitura} onChange={(e) => handlePermissaoChange(index, "leitura", e.target.checked)} />
                    <label className="form-check-label">Leitura</label>
                  </div>
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={permissao.escrita} onChange={(e) => handlePermissaoChange(index, "escrita", e.target.checked)} />
                    <label className="form-check-label">Escrita</label>
                  </div>
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={permissao.delete} onChange={(e) => handlePermissaoChange(index, "delete", e.target.checked)} />
                    <label className="form-check-label">Delete</label>
                  </div>

                  <button className="btn btn-danger btn-sm mt-2" onClick={() => removerPermissao(index)}>
                    Remover Permissão
                  </button>
                </div>
              ))}

              <button className="btn btn-success btn-sm" onClick={adicionarPermissao}>
                Adicionar Permissão
              </button>
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

export default AcessoModal;
