import React, { useEffect, useState } from "react";
import { getAllMessages, updateMessages, deleteMessages } from "../../services/firestore";
import { FaCheck, FaTrash } from "react-icons/fa";
import HeaderActions from "../../components/HeaderActions";
import Table from "../../components/Table";
import { toast, ToastContainer } from "react-toastify";

/**
 * MessagePage component that displays a list of messages with options to confirm or delete them.
 * It includes a search functionality to filter messages by name, email, or message content.
 *
 * @component
 * @example
 * return (
 *   <MessagePage />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @function
 * @name MessagePage
 *
 * @description
 * This component fetches messages from an API on mount and allows users to confirm or delete messages.
 * It also provides a search input to filter messages by name, email, or message content.
 *
 * @typedef {Object} Message
 * @property {string} id - The unique identifier of the message.
 * @property {string} name - The name of the client who sent the message.
 * @property {string} email - The email of the client who sent the message.
 * @property {string} message - The content of the message.
 * @property {boolean} confirmed - The confirmation status of the message.
 * @property {Date} createdAt - The date when the message was created.
 *
 * @typedef {Object} Event
 * @property {Object} target - The target element of the event.
 * @property {string} target.value - The value of the target element.
 *
 * @function
 * @name handleConfirm
 * @description Confirms a message by its ID.
 * @param {string} id - The ID of the message to confirm.
 *
 * @function
 * @name handleDelete
 * @description Deletes a message by its ID.
 * @param {string} id - The ID of the message to delete.
 *
 * @function
 * @name handleSearchCliente
 * @description Handles the search input to filter messages.
 * @param {string|Event} search - The search term or event object containing the search term.
 */
const MessagePage = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesData = await getAllMessages();
        setMessages(messagesData);
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        toast.error("Erro ao buscar mensagens!");
      }
    };
    fetchMessages();
  }, []);

  const handleConfirm = async (id) => {
    try {
      await updateMessages(id, { confirmed: true });
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, confirmed: true } : msg))
      );
      toast.success("Mensagem confirmada com sucesso!");
    } catch (error) {
      console.error("Erro ao confirmar mensagem:", error);
      toast.error("Erro ao confirmar mensagem!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessages(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      toast.success("Mensagem deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar mensagem:", error);
      toast.error("Erro ao deletar mensagem!");
    }
  };
  const handleSearchCliente = (search) => {
    let term = "";
    if (search && typeof search === "object" && search.target) {
      term = search.target.value;
    } else if (typeof search === "string") {
      term = search;
    }
    setSearchTerm(term.toLowerCase());
  };

  const displayedClientes = searchTerm
    ? messages.filter(
        (cliente) =>
          cliente.name.toLowerCase().includes(searchTerm) ||
          cliente.email.toLowerCase().includes(searchTerm) ||
          cliente.message.toLowerCase().includes(searchTerm) 
      )
    : messages;
  return (
    <>
      <HeaderActions
      onSearch={handleSearchCliente}
        showSearch={true}
      />

      <Table
        tableHead={
          <>
            <th scope="col">Status</th>
            <th scope="col">Nome</th>
            <th scope="col">Email</th>
            <th scope="col">Mensagem</th>
            <th scope="col">Data</th>
            <th scope="col">Ações</th>
          </>
        }
        tableBody={
          displayedClientes.length > 0 ? (
            displayedClientes.map((cliente) => {
              if (!cliente.name || !cliente.email || !cliente.message) return null;

              const date = cliente.createdAt?.toDate
                ? cliente.createdAt
                    .toDate()
                    .toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                : "Data inválida";

              return (
                <tr key={cliente.id}>
                  <td>
                    <span className={`badge ${cliente.confirmed ? "bg-success" : "bg-warning"}`}>
                      {cliente.confirmed ? "Confirmado" : "Pendente"}
                    </span>
                  </td>
                  <td>{cliente.name}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.message}</td>
                  <td>{date}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      {!cliente.confirmed && (
                        <button
                          onClick={() => handleConfirm(cliente.id)}
                          className="btn btn-sm btn-success"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(cliente.id)}
                        className="btn btn-sm btn-danger"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Nenhuma mensagem adicionada.
                </td>
              </tr>
            )
        }
      />

      {/* Componente que renderiza as mensagens do toast */}
      <ToastContainer />
    </>
  );
};

export default MessagePage;
