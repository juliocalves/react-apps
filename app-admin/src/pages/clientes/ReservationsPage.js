import React, { useEffect, useState } from "react";
import { getAllReservations, updateReservation, deleteReservation } from "../../services/firestore";
import { FaCheck, FaTrash } from "react-icons/fa";
import HeaderActions from "../../components/HeaderActions";
import Table from "../../components/Table";
import { toast, ToastContainer } from "react-toastify";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservationsData = await getAllReservations();
        setReservations(reservationsData);
      } catch (error) {
        console.error("Erro ao buscar reservas:", error);
        toast.error("Erro ao buscar reservas");
      }
    };
    fetchReservations();
  }, []);

  const handleConfirm = async (id) => {
    try {
      await updateReservation(id, { confirmed: true });
      setReservations((prev) =>
        prev.map((res) => (res.id === id ? { ...res, confirmed: true } : res))
      );
      toast.success("Reserva confirmada com sucesso!");
    } catch (error) {
      console.error("Erro ao confirmar reserva:", error);
      toast.error("Erro ao confirmar reserva!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReservation(id);
      setReservations((prev) => prev.filter((res) => res.id !== id));
      toast.success("Reserva deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar reserva:", error);
      toast.error("Erro ao deletar reserva!");
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
    ? reservations.filter(
        (cliente) =>
          cliente.name.toLowerCase().includes(searchTerm) ||
          cliente.email.toLowerCase().includes(searchTerm) ||
          cliente.phone.toLowerCase().includes(searchTerm) 
      )
    : reservations;

  return (
    <>
      <HeaderActions onSearch={handleSearchCliente} showSearch={true} />

      <Table
        tableHead={
          <>
            <th scope="col">Nome</th>
            <th scope="col">Email</th>
            <th scope="col">Telefone</th>
            <th scope="col">Data de Início</th>
            <th scope="col">Data de Fim</th>
            <th scope="col">Status</th>
            <th scope="col">Ações</th>
          </>
        }
        tableBody={
          displayedClientes.length > 0 ? (
            displayedClientes.map((cliente) => {
              const startDate = cliente.startDate?.toDate
                ? cliente.startDate
                    .toDate()
                    .toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                : "Data inválida";

              const endDate = cliente.endDate?.toDate
                ? cliente.endDate
                    .toDate()
                    .toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                : "Data inválida";

              return (
                <tr key={cliente.id}>
                  <td>{cliente.name}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.phone}</td>
                  <td>{startDate}</td>
                  <td>{endDate}</td>
                  <td>
                    <span className={`badge ${cliente.confirmed ? "bg-success" : "bg-warning"}`}>
                      {cliente.confirmed ? "Confirmado" : "Pendente"}
                    </span>
                  </td>
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
                Nenhum cliente adicionado.
              </td>
            </tr>
          )
        }
      />

      {/* ToastContainer para exibir as mensagens do toast */}
      <ToastContainer />
    </>
  );
};

export default ReservationsPage;
