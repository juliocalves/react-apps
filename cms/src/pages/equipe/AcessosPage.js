import { useState } from "react";
import {FaTrash } from "react-icons/fa";
import AcessoModal from "../../components/equipe/AcessoModal";
import { MdEdit } from "react-icons/md";
import HeaderActions from "../../components/HeaderActions";
import Table from "../../components/Table";


const AcessosPage = () => {
  const [acessos, setAcessos] = useState([
    {
      id: 1,
      nome: "João Silva",
      email: "joao@email.com",
      data: "10/02/2025",
      ativo: true,
      permissoes: [
        { pagina: "Dashboard", leitura: true, escrita: false, delete: false },
        { pagina: "Configurações", leitura: true, escrita: true, delete: true },
      ],
    },
    {
      id: 2,
      nome: "Maria Souza",
      email: "maria@email.com",
      data: "09/02/2025",
      ativo: false,
      permissoes: [
        { pagina: "Configurações", leitura: true, escrita: true, delete: true },
      ],
    },
  ]);

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

  return (
    <>
     <HeaderActions
        onNew={() => { setEditingAcesso(null); setModalShow(true); }}
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
          <>
            {acessos.map((acesso, index) => (
              <tr key={acesso.id}>
                <td>{index + 1}</td>
                <td>{acesso.nome}</td>
                <td>{acesso.email}</td>
                <td>{acesso.data}</td>
                <td>
                  {acesso.permissoes.map((perm, idx) => (
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
            ))}
          </>
         }
      />

      <AcessoModal show={modalShow} onClose={() => setModalShow(false)} onSave={handleSave} acesso={editingAcesso} />
    </>
  );
};

export default AcessosPage;
