import { useState, useEffect } from "react";
import { paginas } from "../../menuItems";
import { getColaboradores } from "../../services/firestore";
/**
 * AcessoModal component renders a modal for adding or editing access permissions for a collaborator.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.show - Determines whether the modal is visible.
 * @param {Function} props.onClose - Function to call when the modal is closed.
 * @param {Function} props.onSave - Function to call when the form is submitted.
 * @param {Object} [props.acesso] - The access data to edit, if any.
 * @param {string} [props.acesso.nome] - The name of the collaborator.
 * @param {string} [props.acesso.email] - The email of the collaborator.
 * @param {string} [props.acesso.idColaborador] - The ID of the collaborator.
 * @param {string} [props.acesso.data] - The creation date of the access.
 * @param {boolean} [props.acesso.ativo] - Whether the access is active.
 * @param {Array} [props.acesso.permissoes] - The list of permissions.
 * @param {string} [props.acesso.permissoes[].pagina] - The page for the permission.
 * @param {boolean} [props.acesso.permissoes[].leitura] - Whether read access is granted.
 * @param {boolean} [props.acesso.permissoes[].escrita] - Whether write access is granted.
 * @param {boolean} [props.acesso.permissoes[].delete] - Whether delete access is granted.
 *
 * @returns {JSX.Element|null} The rendered modal component or null if not visible.
 */
const AcessoModal = ({ show, onClose, onSave, acesso }) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    idColaborador: "",
    data: new Date().toISOString().split("T")[0], // Data atual
    ativo: true,
    permissoes: [],
  });

  const [colaboradores, setColaboradores] = useState([]);
  const [selectedColaborador, setSelectedColaborador] = useState("");

  useEffect(() => {
    const fetchColaboradores = async () => {
      const data = await getColaboradores();
      setColaboradores(Array.isArray(data) ? data : []);
    };
    fetchColaboradores();
  }, []);

  useEffect(() => {
    if (acesso) {
      setFormData({
        ...acesso,
        permissoes: Array.isArray(acesso.permissoes) ? acesso.permissoes : [],
      });
      setSelectedColaborador(acesso.idColaborador || "");
    }
  }, [acesso]);

  const handleColaboradorSelect = (e) => {
    const colab = colaboradores.find((c) => c.id === e.target.value);
    if (colab) {
      setFormData({
        ...formData,
        nome: colab.nome,
        email: colab.email,
        idColaborador: colab.id,
      });
      setSelectedColaborador(colab.id);
    }
  };

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

  const handleSubmit = async () => {
    
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
            {!acesso && colaboradores.length > 0 && (
              <div className="mb-3">
                <label className="form-label">Selecionar Colaborador</label>
                <select className="form-select" value={selectedColaborador} onChange={handleColaboradorSelect}>
                  <option value="">Escolha um colaborador</option>
                  {colaboradores.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                  <select className="form-select mb-2" value={permissao.pagina} onChange={(e) => handlePermissaoChange(index, "pagina", e.target.value)}>
                    <option value="">Selecione uma página</option>
                    {paginas.map((pagina, i) => (
                      <option key={i} value={pagina}>
                        {pagina}
                      </option>
                    ))}
                  </select>

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
