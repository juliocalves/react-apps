import React, { useEffect, useState } from "react";
import { getAllReservations, updateReservation, deleteReservation } from "../../services/firestore";
import { FaCheck, FaTrash } from "react-icons/fa";
import HeaderActions from "../../components/HeaderActions";
import Table from "../../components/Table";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const reservationsData = await getAllReservations();
      setReservations(reservationsData);
    };
    fetchReservations();
  }, []);

  const handleConfirm = async (id) => {
    await updateReservation(id, { confirmed: true });
    setReservations((prev) =>
      prev.map((res) => (res.id === id ? { ...res, confirmed: true } : res))
    );
  };

  const handleDelete = async (id) => {
    await deleteReservation(id);
    setReservations((prev) => prev.filter((res) => res.id !== id));
  };

  return (
    <>
      <HeaderActions
          showSearch={true}
          showFilter={false}
          showAdd={false}
          showChangeView={false}
        />
    
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
            <>
              {reservations.map((res) => {
                if (!res.name || !res.email || !res.phone) {
                  return null;
                }
                const startDate = res.startDate?.toDate
                  ? res.startDate.toDate().toLocaleDateString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit" })
                  : "Data inválida";
                const endDate = res.endDate?.toDate
                  ? res.endDate.toDate().toLocaleDateString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit" })
                  : "Data inválida";
                return (
                  <tr key={res.id}>
                    <td>{res.name}</td>
                    <td>{res.email}</td>
                    <td>{res.phone}</td>
                    <td>{startDate}</td>
                    <td>{endDate}</td>
                    <td>
                      <span className={`badge ${res.confirmed ? "bg-success" : "bg-warning"}`}>
                        {res.confirmed ? "Confirmado" : "Pendente"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        {!res.confirmed && (
                          <button
                            onClick={() => handleConfirm(res.id)}
                            className="btn btn-sm btn-success"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(res.id)}
                          className="btn btn-sm btn-danger"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </>
          }
        />
    </>
  );
};

export default ReservationsPage;