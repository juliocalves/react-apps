import React, { useEffect, useState } from "react";
import { getAllMessages, updateMessages, deleteMessages } from "../services/firestore";
import { FaCheck, FaTrash } from "react-icons/fa";

const MessagePage = () => {
  const [messages, setmessages] = useState([]);

  useEffect(() => {
    const fetchmessages = async () => {
      const messagesData = await getAllMessages();
      setmessages(messagesData);
    };
    fetchmessages();
  }, []);

  const handleConfirm = async (id) => {
    await updateMessages(id, { confirmed: true });
    setmessages((prev) =>
      prev.map((res) => (res.id === id ? { ...res, confirmed: true } : res))
    );
  };

  const handleDelete = async (id) => {
    await deleteMessages(id);
    setmessages((prev) => prev.filter((res) => res.id !== id));
  };

  return (
    <div className="cms-table-container">
      <div className="table-responsive-sm"> {/* Bootstrap container and margin top */}
        <table className="table table-hover cms-table"> 
          <thead className="cms-table-header">
            <tr>
              <th scope="col">Status</th>
              <th scope="col">Nome</th> 
              <th scope="col">Email</th>
              <th scope="col">Mensagem</th>
              <th scope="col">Data</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody className="cms-table-body">
            {messages.map((res) => {
              if (!res.name || !res.email || !res.message) {
                return null;
              }

              const date = res.createdAt?.toDate ? res.createdAt.toDate().toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }) : "Data inválida";
              return (
                <tr key={res.id}>
                  <td>
                    <span
                      className={`badge ${res.confirmed ? "bg-success" : "bg-warning"}`} // Bootstrap badge classes
                    >
                      {res.confirmed ? "Confirmado" : "Pendente"}
                    </span>
                  </td>
                  <td>{res.name}</td>
                  <td>{res.email}</td>
                  <td>{res.message}</td>
                  <td>{date}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center"> {/* Flexbox for actions */}
                      {!res.confirmed && (
                        <button
                          onClick={() => handleConfirm(res.id)}
                          className="btn btn-sm btn-success" // Bootstrap button classes
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="btn btn-sm btn-danger" // Bootstrap button classes
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    
  );
};

export default MessagePage;