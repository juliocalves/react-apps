import React, { useEffect, useState } from "react";
import ColaboradorModal from "../../components/equipe/ColaboradorModal";
import AcessoModal from "../../components/equipe/AcessoModal";
import { GrDocumentConfig } from "react-icons/gr";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import HeaderActions from "../../components/HeaderActions";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import {createColaboradorWithAuth, getColaboradores, updateColaborador, deleteColaborador } from "../../services/firestore";
import { toast,ToastContainer } from "react-toastify";

/**
 * ColaboradorPage component renders a page for managing collaborators.
 * It includes functionalities to fetch, create, update, delete, and search collaborators.
 * 
 * @component
 * @returns {JSX.Element} The rendered component.
 * 
 * @example
 * <ColaboradorPage />
 * 
 * @function
 * @name ColaboradorPage
 * 
 * @description
 * This component handles the following functionalities:
 * - Fetching the list of collaborators from the server.
 * - Creating a new collaborator with default authentication.
 * - Updating an existing collaborator.
 * - Deleting a collaborator.
 * - Searching for collaborators by name, email, position, or function.
 * - Displaying a modal for adding/editing a collaborator.
 * - Displaying a modal for configuring access for a collaborator.
 * 
 * @property {Array} colaboradores - The list of collaborators.
 * @property {Function} setColaboradores - Function to update the list of collaborators.
 * @property {boolean} modalColaboradorAberto - State to control the visibility of the collaborator modal.
 * @property {Function} setModalColaboradorAberto - Function to update the state of the collaborator modal.
 * @property {boolean} modalAcessoAberto - State to control the visibility of the access modal.
 * @property {Function} setModalAcessoAberto - Function to update the state of the access modal.
 * @property {Object|null} colaboradorEditando - The collaborator being edited.
 * @property {Function} setColaboradorEditando - Function to update the collaborator being edited.
 * @property {string} searchTerm - The search term for filtering collaborators.
 * @property {Function} setSearchTerm - Function to update the search term.
 * 
 * @function handleSalvarColaborador
 * @description Handles saving a collaborator (create or update).
 * @param {Object} colaborador - The collaborator object to be saved.
 * 
 * @function handleColaborador
 * @description Navigates to the collaborator detail page.
 * @param {string} colaboradorId - The ID of the collaborator.
 * 
 * @function handleExcluirColaborador
 * @description Handles deleting a collaborator.
 * @param {string} colaboradorId - The ID of the collaborator to be deleted.
 * 
 * @function handleSearchColaborador
 * @description Handles searching for collaborators.
 * @param {string|Object} search - The search term or event object containing the search term.
 */
const ColaboradorPage = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [modalColaboradorAberto, setModalColaboradorAberto] = useState(false);
  const [modalAcessoAberto, setModalAcessoAberto] = useState(false);
  const [colaboradorEditando, setColaboradorEditando] = useState(null);

  useEffect(() => {
    const fetchColaboradores = async () => {
      const data = await getColaboradores();
      setColaboradores(Array.isArray(data) ? data : []);
    };
    fetchColaboradores();
  }, []);

  const handleSalvarColaborador = async (colaborador) => {
    if (
      !colaborador.nome ||
      !colaborador.email ||
      !colaborador.cargo ||
      !colaborador.funcao ||
      !colaborador.data ||
      colaborador.ativo === undefined
    ) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      if (colaborador.id) {
        await updateColaborador(colaborador.id, colaborador);
        setColaboradores(
          colaboradores.map((colab) => (colab.id === colaborador.id ? colaborador : colab))
        );
        toast.success("Colaborador atualizado com sucesso!");
      } else {
        const senhaPadrao = "Supervisor123!"
        const id = await createColaboradorWithAuth(colaborador,senhaPadrao);
        colaborador.id = id.id;
        setColaboradores([...colaboradores, colaborador]);
        toast.success("Colaborador criado com sucesso!");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setColaboradorEditando(null);
      setModalColaboradorAberto(false);
    }
  };
  
  const navigate = useNavigate();
  const handleColaborador = (colaboradorId) => {
    navigate(`/equipe/colaborador/${colaboradorId}`);
  };
  const handleExcluirColaborador = async (colaboradorId) => {
    console.log("Tentando excluir colaborador com ID:", colaboradorId);
    if (!colaboradorId) {
      toast.error("ID do colaborador inválido.");
      return;
    }
  
    const confirmacao = window.confirm("Tem certeza que deseja excluir este colaborador?");
    if (!confirmacao) return;
  
    try {
      const response = await deleteColaborador(colaboradorId);
      if (response.success) {
        setColaboradores(colaboradores.filter((colab) => colab.id !== colaboradorId));
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Erro ao excluir colaborador:", error);
      toast.error(`Erro ao excluir colaborador: ${error.message}`);
    }
  };
  
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearchColaborador = (search) => {
    let term = "";
    if (search && typeof search === "object" && search.target) {
      term = search.target.value;
    } else if (typeof search === "string") {
      term = search;
    }
    setSearchTerm(term.toLowerCase());
  };
  const displayedColaboradores = searchTerm
    ? colaboradores.filter(
        (colaborador) =>
          colaborador.nome.toLowerCase().includes(searchTerm) ||
          colaborador.cargo.toLowerCase().includes(searchTerm) ||
          colaborador.funcao.toLowerCase().includes(searchTerm)||
          colaborador.email.toLowerCase().includes(searchTerm)
      )
    : colaboradores;
  
  return (
    <>
      <HeaderActions onNew={() => setModalColaboradorAberto(true)} 
        onSearch={handleSearchColaborador} 
        showSearch={true}  showAdd={true}  />
      <ToastContainer />
      <Table
        tableHead={
          <>
           <th scope="col">#</th>
            <th scope="col">Nome</th>
            <th scope="col">Email</th>
            <th scope="col">Cargo</th>
            <th scope="col">Função</th>
            <th scope="col">Data de Criação</th>
            <th scope="col">Ativo</th>
            <th scope="col">Ações</th>
          </>
        }
        tableBody={
          displayedColaboradores.length > 0 ? ( 
            displayedColaboradores.map((colaborador, index) => (
                <tr key={index} onDoubleClick={() => handleColaborador(colaborador.id)}>
                  <td>{index + 1}</td>
                  <td>{colaborador.nome}</td>
                  <td>{colaborador.email}</td>
                  <td>{colaborador.cargo}</td>
                  <td>{colaborador.funcao}</td>
                  <td>{colaborador.data}</td>
                  <td>{colaborador.ativo ? "Sim" : "Não"}</td>
                  <td>
                    <button className="btn btn-primary btn-sm me-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar" onClick={() => {
                      setColaboradorEditando(colaborador);
                      setModalColaboradorAberto(true);
                    }}>
                      <MdEdit />
                    </button>
                    <button className="btn btn-secondary btn-sm me-2" data-bs-toggle="tooltip" data-bs-placement="top" 
                    title="Configurar Acessos" onClick={() => {
                      setColaboradorEditando(colaborador);
                      setModalAcessoAberto(true);
                    }}>
                      <GrDocumentConfig />
                    </button>
                    <button className="btn btn-danger btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" title="Deletar" onClick={() => handleExcluirColaborador(colaborador.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ):(
              <tr>
                <td colSpan="7" className="text-center">Nenhum colaborador adicionado.</td>
              </tr>
            )
          }
      />

      <ColaboradorModal
        show={modalColaboradorAberto}
        onClose={() => {
          setModalColaboradorAberto(false);
          setColaboradorEditando(null);
        }}
        onSave={handleSalvarColaborador}
        colaborador={colaboradorEditando}
      />

      <AcessoModal
        show={modalAcessoAberto}
        onClose={() => {
          setModalAcessoAberto(false);
          setColaboradorEditando(null);
        }}
        onSave={handleSalvarColaborador}
        acesso={colaboradorEditando}
      />
    </>
  );
};

export default ColaboradorPage;
