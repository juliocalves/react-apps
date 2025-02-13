import { useState, useEffect } from "react";
import {FaTrash } from "react-icons/fa";
import AcessoModal from "../../components/equipe/AcessoModal";
import { MdEdit } from "react-icons/md";
import HeaderActions from "../../components/HeaderActions";
import Table from "../../components/Table";
import { getAcessos } from "../../services/firestore";

const AcessosPage = () => {
  const [acessos, setAcessos] = useState([]);

  const [modalShow, setModalShow] = useState(false);
  const [editingAcesso, setEditingAcesso] = useState(null);
  
  const handleSave = (acesso) => {
    // Garante que permissões seja sempre um array
    const novoAcesso = {
      ...acesso,
      permissoes: Array.isArray(acesso.permissoes) ? acesso.permissoes : [],
    };

    if (acesso.id) {
      setAcessos(acessos.map((a) => (a.id === acesso.id ? novoAcesso : a)));
    } else {
      setAcessos([...acessos, { ...novoAcesso, id: acessos.length + 1 }]);
    }
  };

  const handleEdit = (acesso) => {
    setEditingAcesso(acesso);
    setModalShow(true);
  };

  const handleDelete = (id) => {
    setAcessos(acessos.filter((acesso) => acesso.id !== id));
  };
  useEffect(() => {
    const fetchAcessos = async () => {
      const dados = await getAcessos();
      setAcessos(dados);
    };
    fetchAcessos();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchAcesso = (search) => {
    let term = "";
    if (search && typeof search === "object" && search.target) {
      term = search.target.value;
    } else if (typeof search === "string") {
      term = search;
    }
    setSearchTerm(term.toLowerCase());
  };
  const displayedAcessos = searchTerm
    ? acessos.filter(
        (acesso) =>
          acesso.nome.toLowerCase().includes(searchTerm) ||
          acesso.email.toLowerCase().includes(searchTerm) ||
          acesso.permissoes.some((perm) =>
            perm.pagina.toLowerCase().includes(searchTerm)
          )
      )
    : acessos;
  return (
    <>
     <HeaderActions
        onNew={() => { setEditingAcesso(null); setModalShow(true); }}
        onSearch={handleSearchAcesso}
        showSearch={true}
        showFilter={false}
        showAdd={true}
        showChangeView={false}
       
      />
      <Table
         tableHead={
           <>
              <th scope="col">#</th>
              <th scope="col">Nome</th>
              <th scope="col">Email</th>
              <th scope="col">Data de Criação</th>
              <th scope="col">Permissões</th>
              <th scope="col">Ações</th>
            </>
          }
         tableBody={
          displayedAcessos.length > 0 ? (
            displayedAcessos.map((acesso, index) => (
              <tr key={acesso.id}>
                <td>{index + 1}</td>
                <td>{acesso.nome}</td>
                <td>{acesso.email}</td>
                <td>{acesso.data}</td>
                <td>
                  {(acesso.permissoes || []).map((perm, idx) => (
                    <div key={idx}>
                      <strong>{perm.pagina}:</strong>{" "}
                      {perm.leitura && "Leitura "} 
                      {perm.escrita && "Escrita "} 
                      {perm.delete && "Delete"}
                    </div>
                  ))}
                </td>
                <td>
                  <button className="btn btn-primary me-2" onClick={() => handleEdit(acesso)}>
                  <MdEdit/>            
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(acesso.id)}>
                    <FaTrash  />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
                <td colSpan="7" className="text-center">Nenhum acesso adicionado.</td>
            </tr>
          )}
      />

      <AcessoModal show={modalShow} onClose={() => setModalShow(false)} onSave={handleSave} acesso={editingAcesso} />
    </>
  );
};

export default AcessosPage;
