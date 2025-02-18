import React, { useState,useEffect } from "react";
import { MdTableBar } from "react-icons/md";
import PedidoModal from "./produtos/PedidoModal";
import { getMesasComComandasAbertas,getPedidoByMesaPagamento } from "../services/firestore";

/**
 * Componente MesaCards
 * 
 * Este componente exibe uma lista de cartões representando mesas. Cada mesa pode ter um status de comanda aberta ou aguardando pagamento.
 * 
 * @param {Object} props - Propriedades do componente.
 * @param {number} props.quantidadeMesas - Número total de mesas a serem exibidas.
 * 
 * @returns {JSX.Element} O componente MesaCards.
 * 
 * @component
 * 
 * @example
 * // Exemplo de uso:
 * // <MesaCards quantidadeMesas={10} />
 * 
 * @description
 * O componente utiliza os seguintes estados:
 * - `selectedMesa`: Armazena a mesa selecionada.
 * - `showModal`: Controla a exibição do modal.
 * - `openComandas`: Rastreia quais mesas possuem comandas abertas.
 * - `awaitPayment`: Rastreia quais mesas estão aguardando pagamento.
 * 
 * O componente utiliza dois hooks `useEffect` para buscar as mesas com comandas abertas e as mesas aguardando pagamento ao montar o componente.
 * 
 * @function handleClickMesa
 * @description Abre o modal ao clicar em uma mesa.
 * @param {number} mesaNumero - Número da mesa clicada.
 * 
 * @function handleClose
 * @description Fecha o modal.
 * 
 * @function handleOrderStatusChange
 * @description Atualiza o status da comanda para a mesa selecionada.
 * @param {number} mesaNumero - Número da mesa.
 * @param {boolean} isOpen - Status da comanda (aberta ou fechada).
 */
const MesaCards = ({ quantidadeMesas }) => {
  // Estado para controlar a mesa selecionada e a exibição do modal
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // Estado para rastrear quais mesas possuem a comanda aberta (mesaNumber: true/false)
  const [openComandas, setOpenComandas] = useState({});
  const [awaitPayment,setAwaitPayment] = useState({});

  // Cria um array de números de 1 até a quantidade de mesas
  const mesas = Array.from({ length: quantidadeMesas }, (_, index) => index + 1);

  // Abre o modal ao clicar na mesa
  const handleClickMesa = (mesaNumero) => {
    setSelectedMesa(mesaNumero);
    setShowModal(true);
  };
// useEffect para buscar as mesas com comandas abertas ao montar o componente
    useEffect(() => {
    const fetchMesasAbertas = async () => {
      try {
        // Chama o método que retorna um array com os números das mesas com comandas abertas
        const mesasAbertas = await getMesasComComandasAbertas();
        // Converte o array em um objeto onde a chave é o número da mesa e o valor é true
        const comandasStatus = {};
        mesasAbertas.forEach(mesa => {
          comandasStatus[mesa] = true;
        });
        setOpenComandas(comandasStatus);
      } catch (error) {
        console.error("Erro ao buscar mesas com comandas abertas:", error);
      }
    };

    fetchMesasAbertas();
  }, []);
  useEffect(() => {
    const fetchMesasPag = async () => {
      try {
        // Chama o método que retorna um array com os números das mesas com comandas abertas
        const mesasAbertas = await getPedidoByMesaPagamento();
        // Converte o array em um objeto onde a chave é o número da mesa e o valor é true
        const comandasStatus = {};
        mesasAbertas.forEach(mesa => {
          comandasStatus[mesa] = true;
        });
        setAwaitPayment(comandasStatus);
      } catch (error) {
        console.error("Erro ao buscar mesas com comandas abertas:", error);
      }
    };

    fetchMesasPag();
  }, []);
  // Fecha o modal
  const handleClose = () => {
    setShowModal(false);
    setSelectedMesa(null);
  };

  // Atualiza o status da comanda para a mesa selecionada
  const handleOrderStatusChange = (mesaNumero, isOpen) => {
    setOpenComandas((prev) => ({
      ...prev,
      [mesaNumero]: isOpen,
    }));
  };

  return (
    <>
      <div className="d-flex flex-wrap mesa-container">
        {mesas.map((numeroMesa) => (
          <div
            key={numeroMesa}
            className={`card text-center mesa-card ${
              openComandas[numeroMesa] ? "mesa-open" : awaitPayment[numeroMesa] ? "mesa-pagamento" : ""
            }`}
            onClick={() => handleClickMesa(numeroMesa)}
          >
            <div className="card-body mesa-content">
              {/* Ícone grande representando a mesa */}
              <div className={`mesa-icon ${openComandas[numeroMesa] ? "mesa-open-icon" : 
                    awaitPayment[numeroMesa] ? "mesa-pagamento-icon" : ""}`}>
                <MdTableBar />
              </div>
              {/* Número da mesa abaixo do ícone */}
              <h5 className="card-title">Mesa {numeroMesa}</h5>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para montar pedido */}
      <PedidoModal
        showModal={showModal}
        selectedMesa={selectedMesa}
        handleClose={handleClose}
        onOrderStatusChange={handleOrderStatusChange}
      />
    </>
  );
};

export default MesaCards;
