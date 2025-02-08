import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createReservation, getConfirmedReservations } from '../services/firestore';
import PublicLayout from '../layouts/PublicLayout';
const ClientPage = () => {
  const [reservation, setReservation] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: null,
    endDate: null,
  });

  const [blockedDates, setBlockedDates] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // 📌 Controle de envio
  const [showModal, setShowModal] = useState(false); // 📌 Controle do modal

  // 📌 Buscar datas bloqueadas ao carregar a página
  useEffect(() => {
    const fetchBlockedDates = async () => {
      const confirmedDates = await getConfirmedReservations();
      setBlockedDates(confirmedDates);
    };
    fetchBlockedDates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reservation.name || !reservation.email || !reservation.phone) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!reservation.startDate || !reservation.endDate) {
      setErrorMessage('Por favor, selecione um período válido.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true); // Desativa o botão enquanto a reserva é enviada

    try {
      await createReservation(reservation);

      // 📌 Exibir modal de sucesso
      setShowModal(true);

      // 📌 Limpar os campos após o sucesso
      setReservation({
        name: '',
        email: '',
        phone: '',
        startDate: null,
        endDate: null,
      });
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      setErrorMessage('Ocorreu um erro ao criar sua reserva. Tente novamente.');
    }

    setIsSubmitting(false);
  };

  return (
    <PublicLayout>
      <div className='client-page'>
        <h1 className='client-title'>Página do Cliente</h1>
        <form className='form-reservation' onSubmit={handleSubmit}>
          <input
            className='input-field'
            type="text"
            placeholder="Nome"
            value={reservation.name}
            onChange={(e) => setReservation({ ...reservation, name: e.target.value })}
            required
          />
          <input
            className='input-field'
            type="email"
            placeholder="Email"
            value={reservation.email}
            onChange={(e) => setReservation({ ...reservation, email: e.target.value })}
            required
          />
          <input
            className='input-field'
            type="tel"
            placeholder="Telefone / WhatsApp"
            value={reservation.phone}
            onChange={(e) => setReservation({ ...reservation, phone: e.target.value })}
            required
          />

          {/* 📌 DatePicker para selecionar um período */}
          <DatePicker
            className='date-picker'
            selectsRange
            startDate={reservation.startDate}
            endDate={reservation.endDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setReservation({ ...reservation, startDate: start, endDate: end });
            }}
            minDate={new Date()}
            filterDate={(date) =>
              !blockedDates.some((blocked) => blocked.toDateString() === date.toDateString())
            }
            dateFormat="dd/MM/yyyy"
          />

          {errorMessage && <p className='error-message'>{errorMessage}</p>}

          <button className='submit-button' type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Reservar'}
          </button>
        </form>

        {/* 📌 Modal de sucesso */}
        {showModal && (
          <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
              <h2>Reserva realizada com sucesso!</h2>
              <p>Em breve entraremos em contato para confirmar os detalhes.</p>
              <button onClick={() => setShowModal(false)}>Fechar</button>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

// 📌 Estilos para o modal
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

export default ClientPage;
