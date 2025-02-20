import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaArrowLeft, FaTrash, FaSave } from "react-icons/fa";
import { MdEdit, MdOutlineCancel } from "react-icons/md";
import { getColaboradorById, updateColaborador, deleteColaborador } from "../../services/firestore";

const ColaboradorDetailPage = () => {
  const { colaboradorId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [colaborador, setColaborador] = useState(null);
  const [editedColaborador, setEditedColaborador] = useState({
    nome: "",
    email: "",
    cargo: "",
    funcao: "",
    data: "",
    ativo: false,
  });

  useEffect(() => {
    const fetchColaborador = async () => {
      try {
        const data = await getColaboradorById(colaboradorId);
        if (data) {
          setColaborador(data);
          setEditedColaborador(data);
        } else {
          toast.error("Colaborador não encontrado!");
          navigate("/equipe/colaboradores");
        }
      } catch (error) {
        toast.error("Erro ao carregar o colaborador.");
      } finally {
        setLoading(false);
      }
    };

    fetchColaborador();
  }, [colaboradorId, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este colaborador?")) {
      try {
        await deleteColaborador(colaboradorId);
        toast.success("Colaborador excluído com sucesso!");
        navigate("/equipe/colaboradores");
      } catch (error) {
        toast.error("Erro ao excluir o colaborador.");
      }
    }
  };

  const handleChange = (field, value) => {
    setEditedColaborador((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!editedColaborador.nome || !editedColaborador.email || !editedColaborador.cargo) {
      toast.error("Preencha todos os campos antes de salvar.");
      return;
    }
    try {
      await updateColaborador(colaboradorId, editedColaborador);
      setColaborador(editedColaborador);
      setEditing(false);
      toast.success("Colaborador atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar o colaborador.");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedColaborador(colaborador);
  };

  if (loading) return <p>Carregando...</p>;
  if (!colaborador) return <p>Colaborador não encontrado.</p>;

  return (
    <div className="container card">
      <ToastContainer />
      <div className="card-header">
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/equipe/colaboradores")}> 
          <FaArrowLeft /> Voltar
        </button>
      </div>

      <div className="card-body">
        <div className="form-group">
          <label>Nome</label>
          <input type="text" value={editedColaborador.nome} onChange={(e) => handleChange("nome", e.target.value)} disabled={!editing} className="form-control" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={editedColaborador.email} onChange={(e) => handleChange("email", e.target.value)} disabled={!editing} className="form-control" />
        </div>
        <div className="form-group">
          <label>Cargo</label>
          <input type="text" value={editedColaborador.cargo} onChange={(e) => handleChange("cargo", e.target.value)} disabled={!editing} className="form-control" />
        </div>
        <div className="form-group">
          <label>Função</label>
          <input type="text" value={editedColaborador.funcao} onChange={(e) => handleChange("funcao", e.target.value)} disabled={!editing} className="form-control" />
        </div>
        <div className="form-group">
          <label>Data de Criação</label>
          <input type="text" value={editedColaborador.data} disabled className="form-control" />
        </div>
        <div className="form-group">
          <label>Ativo</label>
          <input type="checkbox" checked={editedColaborador.ativo} onChange={(e) => handleChange("ativo", e.target.checked)} disabled={!editing} />
        </div>
      </div>

      <div className="card-footer d-flex justify-content-between">
        {editing ? (
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            <FaSave /> Salvar
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>
            <MdEdit /> Editar
          </button>
        )}
        {editing ? (
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            <MdOutlineCancel /> Cancelar
          </button>
        ) : (
          <button type="button" className="btn btn-danger" onClick={handleDelete}>
            <FaTrash /> Excluir
          </button>
        )}
      </div>
    </div>
  );
};

export default ColaboradorDetailPage;