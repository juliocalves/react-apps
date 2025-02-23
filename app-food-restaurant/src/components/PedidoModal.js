import React, { useState, useEffect } from "react";
import { Modal, Button, Nav, Tab, ListGroup } from "react-bootstrap";
import {
  getProdutos,
  savePedido,
  getPedidoByMesa,
  decrementProductStock,
  incrementProductStock,
  updatePedido,
  getPedidoPagarByMesa
} from "../services/firestore";
import { toast, ToastContainer } from "react-toastify";

/**
 * PedidoModal component handles the display and management of orders for a selected table.
 * It allows opening, closing, and saving orders, as well as adding products to the order.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {boolean} props.showModal - Flag to show or hide the modal
 * @param {string} props.selectedMesa - The selected table identifier
 * @param {function} props.handleClose - Function to handle closing the modal
 * @param {function} props.onOrderStatusChange - Callback function to handle order status changes
 * 
 * @returns {JSX.Element} The rendered component
 * 
 * @example
 * <PedidoModal
 *   showModal={true}
 *   selectedMesa="1"
 *   handleClose={() => setShowModal(false)}
 *   onOrderStatusChange={(mesa, status) => console.log(`Mesa ${mesa} status: ${status}`)}
 * />
 */
const PedidoModal = ({ showModal, selectedMesa, handleClose, onOrderStatusChange }) => {
  const [orderOpen, setOrderOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [productCategories, setProductCategories] = useState([]);

   /* ===============================
     Efeitos para buscar produtos e comanda
     =============================== */
     useEffect(() => {
        const fetchProducts = async () => {
          try {
            const produtos = await getProdutos();
            const grouped = produtos.reduce((acc, product) => {
              const categoria = product.categoria || "sem-categoria";
              if (!acc[categoria]) {
                acc[categoria] = [];
              }
              acc[categoria].push(product);
              return acc;
            }, {});
            const categories = Object.keys(grouped).map((categoria) => ({
              id: categoria,
              label: categoria.charAt(0).toUpperCase() + categoria.slice(1),
              products: grouped[categoria],
            }));
            setProductCategories(categories);
            if (categories.length > 0 && !activeCategory) {
              setActiveCategory(categories[0].id);
            }
          } catch (error) {
            console.error("Erro ao buscar produtos:", error);
          }
        };
        fetchProducts();
      }, [activeCategory]);
    
      // Verifica se há comanda aberta para a mesa
      useEffect(() => {
        const checkMesaOpen = async () => {
          if (selectedMesa) {
            try {
              let pedidoExistente = await getPedidoByMesa(selectedMesa);
              if (!pedidoExistente) {
                // Se não houver comanda aberta, tenta verificar se há comanda aguardando pagamento
                pedidoExistente = await getPedidoPagarByMesa(selectedMesa);
              }
              if (pedidoExistente) {
                // Atualiza estado com os dados da comanda
                setCurrentOrder(pedidoExistente);
                setOrderOpen(pedidoExistente.orderOpen);
                if (pedidoExistente.products) {
                  setOrderItems(
                    pedidoExistente.products.map(prod => ({
                      product: {
                        id: prod.id,
                        nome: prod.nome,
                        preco: prod.preco,
                        usaEstoque: prod.usaEstoque,
                        quantidadeEstoque: prod.quantidadeEstoque,
                        precoPromocional: prod.precoPromocional || 0,
                      },
                      quantity: prod.quantidade,
                    }))
                  );
                  toast.info("Itens carregados da comanda salva.");
                }
              } else {
                setOrderOpen(false);
                setOrderItems([]);
                setCurrentOrder(null);
              }
            } catch (error) {
              console.error("Erro ao verificar o status da comanda:", error);
              toast.error("Erro ao verificar o status da comanda.");
            }
          }
        };
        checkMesaOpen();
      }, [selectedMesa]);
  

  /* ===============================
     Funções Auxiliares
     =============================== */

  // Compara se houve alterações entre a comanda salva e os itens atuais
  const hasOrderChanged = (savedOrder, newOrder) => {
    if (!savedOrder || !savedOrder.products) return true;
    if (savedOrder.products.length !== newOrder.products.length) return true;
    const sortedSaved = savedOrder.products
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id));
    const sortedNew = newOrder.products
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id));
    return sortedSaved.some((prod, index) => prod.quantidade !== sortedNew[index].quantidade);
  };

  // Monta o objeto do pedido com base nos itens atuais
  const buildOrderObject = () => ({
    mesa: selectedMesa,
    products: orderItems.map(item => ({
      id: item.product.id,
      nome: item.product.nome,
      preco: item.product.preco,
      precoPromocional: item.product.precoPromocional || 0,
      quantidade: item.quantity,
      usaEstoque: item.product.usaEstoque,
    })),
    total: calculateTotal(),
    orderOpen,
    createdAt: new Date(),
  });

    //  // Função para imprimir a comanda utilizando comandos ESC/POS
    // const printComanda = () => {
    //     // Monta os comandos ESC/POS para a impressora de bobina (Bematech, por exemplo)
    //     let escPosCommands = "";
    //     escPosCommands += "\x1B\x40"; // Inicializa/Reseta a impressora
    //     escPosCommands += "\x1B\x21\x30"; // Ativa modo enfatizado e duplo tamanho
    //     escPosCommands += "***** COMANDA *****\n";
    //     escPosCommands += "\x1B\x21\x00"; // Retorna ao modo normal
    //     escPosCommands += "Mesa: " + selectedMesa + "\n";
    //     escPosCommands += "-----------------------------\n";
    
    //     // Adiciona cada item do pedido
    //     orderItems.forEach(item => {
    //     const totalItem = (item.product.preco * item.quantity).toFixed(2);
    //     const line = `${item.product.nome} x ${item.quantity} = R$ ${totalItem}\n`;
    //     escPosCommands += line;
    //     });
        
    //     escPosCommands += "-----------------------------\n";
    //     escPosCommands += "Total: R$ " + calculateTotal().toFixed(2) + "\n";
    //     escPosCommands += "\n\n";
    //     escPosCommands += "\x1D\x56\x41"; // Comando para cortar o papel (varia conforme o modelo)
    
    //     // Envia os comandos para a impressora via WebSocket
    //     sendToBematechPrinter(escPosCommands);
    //     toast.info("Imprimindo comanda...");
    // };
    
    // // Função que envia os comandos ESC/POS para a impressora Bematech usando WebSocket
    // const sendToBematechPrinter = (commands) => {
    //     // Ajuste o endereço/porta conforme sua infraestrutura de impressão
    //     const socket = new WebSocket('ws://localhost:8080');
    
    //     socket.onopen = () => {
    //     socket.send(commands);
    //     socket.close();
    //     };
    
    //     socket.onerror = (error) => {
    //     console.error("Erro ao enviar comando para a impressora:", error);
    //     toast.error("Erro ao se conectar com a impressora");
    //     };
    // };
    const sendToBematechPrinterSimulado = (commands) => {
        // Abre uma nova janela para exibir os comandos de impressão
        const printWindow = window.open('', '', 'height=400,width=600');
        printWindow.document.write('<html><head><title>Simulação de Impressão</title>');
        printWindow.document.write('<style>body { font-family: monospace; white-space: pre; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(commands);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        
        // Opcional: aciona a função de impressão da janela para simular o comportamento real
        // printWindow.print();
      };
      
      // Função para imprimir a comanda utilizando a simulação
      const printComanda = () => {
        let escPosCommands = "";
        // escPosCommands += "\x1B\x40"; // Inicializa/Reseta a impressora
        // escPosCommands += "\x1B\x21\x30"; // Modo enfatizado/duplo tamanho
        escPosCommands += "***** COMANDA *****\n";
        // escPosCommands += "\x1B\x21\x00"; // Modo normal
        escPosCommands += "Mesa: " + selectedMesa + "\n";
        escPosCommands += "-----------------------------\n";
        
        orderItems.forEach(item => {
          const totalItem = (item.product.preco * item.quantity).toFixed(2);
          escPosCommands += `${item.product.nome} x ${item.quantity} = R$ ${totalItem}\n`;
        });
        
        escPosCommands += "-----------------------------\n";
        escPosCommands += "Total: R$ " + calculateTotal().toFixed(2) + "\n\n\n";
        // escPosCommands += "\x1D\x56\x41"; // Comando para cortar o papel
        
        // Em vez de enviar para a impressora, simulamos a impressão abrindo uma nova janela
        sendToBematechPrinterSimulado(escPosCommands);
        toast.info("Simulando impressão da comanda...");
      };
      

  // Função para confirmar o pagamento da comanda
  const confirmPayment = async () => {
    try {
      const updatedOrder = {
        ...currentOrder,
        paymentStatus: "Pago", // Atualiza para o status desejado
        total: calculateTotal(),
      };
      await updatePedido(updatedOrder);
      toast.success("Pagamento confirmado!");
      // Você pode também atualizar o estado ou chamar callbacks para refletir a mudança
      onOrderStatusChange(selectedMesa, false);
      setCurrentOrder(updatedOrder);
    } catch (error) {
      toast.error("Erro ao confirmar pagamento", error);
    }
  };

  /* ===============================
     Abertura/Fechamento da Comanda
     =============================== */

  const openOrder = async () => {
    try {
      const order = { ...buildOrderObject(), orderOpen: true };
      if (!currentOrder) {
        const savedOrder = await savePedido(order);
        setCurrentOrder(savedOrder);
        toast.success("Comanda aberta e salva com sucesso!");
      } else {
        toast.info("Comanda já aberta!");
      }
      setOrderOpen(true);
      onOrderStatusChange(selectedMesa, true);
    } catch (error) {
      toast.error("Erro ao abrir comanda", error);
    }
  };

  const closeOrder = async () => {
    try {
      const updatedOrder = {
        ...currentOrder,
        orderOpen: false,
        paymentStatus: "Aguardando pagamento",
        total: calculateTotal(),
      };
      await updatePedido(updatedOrder);
      toast.success("Comanda fechada com sucesso!");
      setOrderOpen(false);
      onOrderStatusChange(selectedMesa, false);
      setCurrentOrder(updatedOrder);
    } catch (error) {
      toast.error("Erro ao fechar comanda", error);
    }
  };

  const toggleOrderStatus = async () => {
    if (!orderOpen) {
      await openOrder();
    } else {
      await closeOrder();
    }
  };

  /* ===============================
     Manipulação de Itens do Pedido
     =============================== */

  const addProductToOrder = (product) => {
    if (!orderOpen) {
      toast.error("Abra a comanda para adicionar produtos.");
      return;
    }
    const effectivePrice = (product.precoPromocional && product.precoPromocional > 0)
      ? product.precoPromocional
      : product.preco;
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        if (product.usaEstoque && existingItem.quantity + 1 > product.quantidadeEstoque) {
          toast.error("Não há produtos em estoque para esse item.");
          return prevItems;
        }
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        if (product.usaEstoque && product.quantidadeEstoque < 1) {
          toast.error("Não há produtos em estoque para esse item.");
          return prevItems;
        }
        const productWithEffectivePrice = { ...product, preco: effectivePrice };
        return [...prevItems, { product: productWithEffectivePrice, quantity: 1 }];
      }
    });
  };

  const increaseQuantity = (productId) => {
    if (!orderOpen) {
      toast.error("Abra a comanda para alterar produtos.");
      return;
    }
    setOrderItems((prevItems) =>
      prevItems.map(item => {
        if (item.product.id === productId) {
          if (item.product.usaEstoque && item.quantity + 1 > item.product.quantidadeEstoque) {
            toast.error("Não há produtos em estoque suficientes.");
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const decreaseQuantity = (productId) => {
    if (!orderOpen) {
      toast.error("Abra a comanda para alterar produtos.");
      return;
    }
    setOrderItems((prevItems) =>
      prevItems
        .map(item => {
          if (item.product.id === productId) {
            if (item.quantity > 1) {
              return { ...item, quantity: item.quantity - 1 };
            }
            return null;
          }
          return item;
        })
        .filter(item => item !== null)
    );
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.product.preco * item.quantity, 0);
  };

  /* ===============================
     Salvamento do Pedido (ajuste de estoque)
     =============================== */

  const handleSavePedido = async () => {
    // Ajusta o estoque se houver pedido anterior
    if (currentOrder && currentOrder.products) {
      const oldOrderMap = {};
      currentOrder.products.forEach(prod => {
        if (prod.usaEstoque) {
          oldOrderMap[prod.id] = prod;
        }
      });
      // Incrementa estoque para itens reduzidos
      for (const productId in oldOrderMap) {
        const oldItem = oldOrderMap[productId];
        const newItem = orderItems.find(item => item.product.id === productId);
        const newQuantity = newItem ? newItem.quantity : 0;
        if (oldItem.quantidade > newQuantity) {
          const diff = oldItem.quantidade - newQuantity;
          try {
            await incrementProductStock(productId, diff);
          } catch (error) {
            toast.error(`Erro ao incrementar estoque para ${oldItem.nome}`);
            return;
          }
        }
      }
      // Decrementa estoque para itens aumentados
      for (const item of orderItems) {
        if (item.product.usaEstoque) {
          const oldQty = oldOrderMap[item.product.id] ? oldOrderMap[item.product.id].quantidade : 0;
          if (item.quantity > oldQty) {
            const diff = item.quantity - oldQty;
            try {
              await decrementProductStock(item.product.id, diff);
            } catch (error) {
              toast.error(`Erro ao decrementar estoque para ${item.product.nome}`);
              return;
            }
          }
        }
      }
    } else {
      // Novo pedido: decrementa estoque para cada item
      for (const item of orderItems) {
        if (item.product.usaEstoque) {
          try {
            await decrementProductStock(item.product.id, item.quantity);
          } catch (error) {
            toast.error(`Erro ao decrementar estoque para ${item.product.nome}`);
            return;
          }
        }
      }
    }

    const order = buildOrderObject();

    try {
      if (currentOrder && currentOrder.id) {
        await updatePedido({ ...order, id: currentOrder.id });
        toast.success("Pedido atualizado com sucesso!");
      } else {
        await savePedido(order);
        toast.success("Pedido salvo com sucesso!");
      }
      // Limpa os estados e fecha o modal
      setOrderItems([]);
      setCurrentOrder(null);
      handleClose();
    } catch (error) {
      toast.error("Erro ao salvar pedido:", error);
    }
  };

  /* ===============================
   Fechamento do Modal (salva apenas se houve alterações)
   =============================== */
    const handleModalClose = async () => {
    // Se não houver comanda aberta, simplesmente fecha o modal sem salvar
    if (!currentOrder || !orderOpen) {
      handleClose();
      return;
    }
    
    const newOrder = buildOrderObject();
    if (hasOrderChanged(currentOrder, newOrder)) {
      await handleSavePedido();
    } else {
      handleClose();
    }
  };
  

  /* ===============================
     Renderização do Componente
     =============================== */
  return (
    <>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Pedido da Mesa {selectedMesa}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Button variant={orderOpen ? "success" : "secondary"} onClick={toggleOrderStatus}>
              {orderOpen ? "Fechar Comanda" 
              : currentOrder && !orderOpen && currentOrder.paymentStatus === "Aguardando pagamento" ? "Reabrir Comanda": "Abrir Comanda"}
            </Button>
          </div>
          <hr />
          {productCategories.length > 0 ? (
            <Tab.Container activeKey={activeCategory}>
              <Nav variant="tabs" onSelect={(selectedKey) => setActiveCategory(selectedKey)}>
                {productCategories.map((category) => (
                  <Nav.Item key={category.id}>
                    <Nav.Link eventKey={category.id}>{category.label}</Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
              <Tab.Content className="mt-3">
                {productCategories.map((category) => (
                  <Tab.Pane key={category.id} eventKey={category.id}>
                    <ListGroup>
                      {category.products.map((product) => (
                        <ListGroup.Item
                          key={product.id}
                          action
                          onClick={() => addProductToOrder(product)}
                        >
                          {product.nome} -{" "}
                          {product.precoPromocional > 0 
                            ? `R$ ${product.precoPromocional.toFixed(2)}` 
                            : `R$ ${product.preco.toFixed(2)}`}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Tab.Container>
          ) : (
            <p>Carregando produtos...</p>
          )}
          <hr />
          <h5>Itens do Pedido:</h5>
          {orderItems.length > 0 ? (
            <ListGroup>
              {orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>
                      {item.product.nome} - R$ {item.product.preco.toFixed(2)}
                    </span>
                    <div>
                      <Button variant="light" size="sm" onClick={() => decreaseQuantity(item.product.id)}>
                        -
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button variant="light" size="sm" onClick={() => increaseQuantity(item.product.id)}>
                        +
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>Nenhum item adicionado.</p>
          )}
          <hr />
          <h5>Total: R$ {calculateTotal().toFixed(2)}</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Fechar
          </Button>
          {/** Se a comanda estiver fechada e aguardando pagamento, mostra os botões de impressão e confirmação */}
          {currentOrder && !orderOpen && currentOrder.paymentStatus === "Aguardando pagamento" ? (
            <>
              <Button variant="warning" onClick={printComanda}>
                Imprimir Comanda
              </Button>
              <Button variant="success" onClick={confirmPayment}>
                Confirmar Pagamento
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleSavePedido}>
              Salvar Pedido
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default PedidoModal;
