import { useState } from "react";
import ColaboradorModal from "../../components/equipe/ColaboradorModal";
import AcessoModal from "../../components/equipe/AcessoModal";
import { GrDocumentConfig } from "react-icons/gr";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import HeaderActions from "../../components/HeaderActions";
import Table from "../../components/Table"
const ColaboradorPage = () => {
  const [colaboradores, setColaboradores] = useState([
    {
        nome: "João da Silva",
        email: "joao.silva@email.com",
        cargo: "Desenvolvedor Front-end",
        funcao: "Desenvolvimento de interfaces",
        data: "2023-01-15",
        ativo: true,
      },
      {
        nome: "Maria Souza",
        email: "maria.souza@email.com",
        cargo: "Designer UX/UI",
        funcao: "Design de experiência e interface",
        data: "2022-05-20",
        ativo: true,
      },
      {
        nome: "Pedro Almeida",
        email: "pedro.almeida@email.com",
        cargo: "Gerente de Projetos",
        funcao: "Gestão de projetos e equipes",
        data: "2021-11-10",
        ativo: false,
      },
      {
        nome: "Ana Paula",
        email: "ana.paula@email.com",
        cargo: "Analista de Dados",
        funcao: "Análise e interpretação de dados",
        data: "2023-03-05",
        ativo: true,
      },
      {
        nome: "Carlos Santos",
        email: "carlos.santos@email.com",
        cargo: "Desenvolvedor Back-end",
        funcao: "Desenvolvimento de lógica de negócios",
        data: "2022-09-25",
        ativo: true,
      },
      {
        nome: "Fernanda Oliveira",
        email: "fernanda.oliveira@email.com",
        cargo: "Especialista em Marketing",
        funcao: "Desenvolvimento de estratégias de marketing",
        data: "2023-06-18",
        ativo: false,
      },
      {
        nome: "Ricardo Pereira",
        email: "ricardo.pereira@email.com",
        cargo: "Consultor de Vendas",
        funcao: "Vendas e relacionamento com clientes",
        data: "2021-07-02",
        ativo: true,
      },
      {
        nome: "Juliana Martins",
        email: "juliana.martins@email.com",
        cargo: "Assistente Administrativo",
        funcao: "Suporte administrativo e financeiro",
        data: "2022-12-12",
        ativo: true,
      },
      {
        nome: "Bruno Rodrigues",
        email: "bruno.rodrigues@email.com",
        cargo: "Estagiário de TI",
        funcao: "Suporte técnico e desenvolvimento",
        data: "2023-04-08",
        ativo: true,
      },
      {
        nome: "Amanda Lima",
        email: "amanda.lima@email.com",
        cargo: "Recepcionista",
        funcao: "Atendimento ao público e organização",
        data: "2022-02-28",
        ativo: false,
      },


  ]);
  const [modalColaboradorAberto, setModalColaboradorAberto] = useState(false);
  const [modalAcessoAberto, setModalAcessoAberto] = useState(false);
  const [colaboradorEditando, setColaboradorEditando] = useState(null);
  const [acessoEditando, setAcessoEditando] = useState(null);

  const handleSalvarColaborador = (novoColaborador) => {
    if (colaboradorEditando) {
      setColaboradores(
        colaboradores.map((colab) =>
          colab.email === colaboradorEditando.email ? novoColaborador : colab
        )
      );
    } else {
      setColaboradores([...colaboradores, novoColaborador]);
    }
    setModalColaboradorAberto(false);
    setColaboradorEditando(null);
  };

  const handleSalvarAcesso = (novoAcesso) => {
    setColaboradores(
      colaboradores.map((colab) =>
        colab.email === acessoEditando.email ? { ...colab, acesso: novoAcesso } : colab
      )
    );
    setModalAcessoAberto(false);
    setAcessoEditando(null);
  };

  return (
    <>
      <HeaderActions
        onNew={() => setModalColaboradorAberto(true)}
      
        showSearch={true}
        showFilter={false}
        showAdd={true}
        showChangeView={false}
      />

      <Table
          tableHead={
              <>
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
            <>
             {colaboradores.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">Nenhum colaborador adicionado.</td>
                </tr>
              ) : (
                colaboradores.map((colaborador, index) => (
                  <tr key={index}>
                    <td>{colaborador.nome}</td>
                    <td>{colaborador.email}</td>
                    <td>{colaborador.cargo}</td>
                    <td>{colaborador.funcao}</td>
                    <td>{colaborador.data}</td>
                    <td>{colaborador.ativo ? "Sim" : "Não"}</td>
                    <td>
                      <button className="btn btn-primary btn-sm me-2" onClick={() => {
                        setColaboradorEditando(colaborador);
                        setModalColaboradorAberto(true);
                      }}>
                        <MdEdit/>
                      </button>
                      <button className="btn btn-secondary btn-sm me-2" onClick={() => {
                        setAcessoEditando(colaborador);
                        setModalAcessoAberto(true);
                      }}>
                        <GrDocumentConfig />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() =>
                        setColaboradores(colaboradores.filter((colab) => colab.email !== colaborador.email))
                      }>
                        <FaTrash/>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </>
          }/>

      {/* Modal para Novo Colaborador */}
      <ColaboradorModal
        show={modalColaboradorAberto}
        onClose={() => {
          setModalColaboradorAberto(false);
          setColaboradorEditando(null);
        }}
        onSave={handleSalvarColaborador}
        colaborador={colaboradorEditando}
      />

      {/* Modal para Gerenciar Acessos */}
      <AcessoModal
        show={modalAcessoAberto}
        onClose={() => {
          setModalAcessoAberto(false);
          setAcessoEditando(null);
        }}
        onSave={handleSalvarAcesso}
        acesso={acessoEditando?.acesso}
      />
    </>
  );
};

export default ColaboradorPage;
