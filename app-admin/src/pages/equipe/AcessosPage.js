import { useState, useEffect } from "react";
import AcessoModal from "../../components/equipe/AcessoModal";
import { MdEdit } from "react-icons/md";
import HeaderActions from "../../components/HeaderActions";
import Table from "../../components/Table";
import { getAcessos,updateColaborador,createColaboradorWithAuth } from "../../services/firestore";
import { toast,ToastContainer } from "react-toastify";
const AcessosPage = () => {
   const [colaboradores, setColaboradores] = useState([]);
  const [modalAcessoAberto, setModalAcessoAberto] = useState(false);
  const [colaboradorEditando, setColaboradorEditando] = useState(null);
  
   const handleSalvarColaborador = async (colaborador) => {
      // if (
      //   !colaborador.nome ||
      //   !colaborador.email ||
      //   !colaborador.cargo ||
      //   !colaborador.funcao ||
      //   !colaborador.data ||
      //   colaborador.ativo === undefined
      // ) {
      //   toast.error("Preencha todos os campos obrigatórios.");
      //   return;
      // }
  
      try {
        if (colaborador.idColaborador) {
          await updateColaborador(colaborador.idColaborador, colaborador);
          setColaboradores(
            colaboradores.map((colab) => (colab.idColaborador === colaborador.idColaborador ? colaborador : colab))
          );
          toast.success("Acesso colaborador atualizado com sucesso!");
        } else {
          const senhaPadrao = "Supervisor123!"
          const id = await createColaboradorWithAuth(colaborador,senhaPadrao);
          colaborador.id = id.id;
          setColaboradores([...colaboradores, colaborador]);
          toast.success("Colaborador e acesso criado com sucesso!");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setColaboradorEditando(null);
        setModalAcessoAberto(false);
      }
    };
  
  useEffect(() => {
    const fetchAcessos = async () => {
      const dados = await getAcessos();
      setColaboradores(dados);
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
    ? colaboradores.filter(
        (acesso) =>
          acesso.nome.toLowerCase().includes(searchTerm) ||
          acesso.email.toLowerCase().includes(searchTerm) ||
          acesso.permissoes.some((perm) =>
            perm.pagina.toLowerCase().includes(searchTerm)
          )
      )
    : colaboradores;
  return (
    <>
     <HeaderActions
        onNew={() => setModalAcessoAberto(true) }
        onSearch={handleSearchAcesso}
        showSearch={true}
        showAdd={true}
      />
      <ToastContainer />
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
                  <button className="btn btn-primary me-2" onClick={() => {
                      setColaboradorEditando(acesso);
                      setModalAcessoAberto(true);
                    }}>
                  <MdEdit/>            
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

export default AcessosPage;
