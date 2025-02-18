import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getProdutos, getPedidos } from "../services/firestore"; // Ajuste o caminho conforme sua estrutura

// Registra os componentes do Chart.js
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * ProdutoPage component that displays a dashboard with various charts
 * representing product sales data, stock data, and sales over time.
 *
 * @component
 * @example
 * return (
 *   <ProdutoPage />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @description
 * This component fetches product and order data from Firestore on mount,
 * and uses this data to generate three charts:
 * - A bar chart showing the top 5 best-selling products.
 * - A pie chart showing the stock levels of all products.
 * - A line chart showing the total sales over time.
 *
 * @function
 * @name ProdutoPage
 */
const ProdutoPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Busca os produtos do Firestore
    const fetchProdutos = async () => {
      try {
        const prods = await getProdutos();
        setProdutos(prods);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    // Busca os pedidos do Firestore
    const fetchPedidos = async () => {
      try {
        const orders = await getPedidos();
        setPedidos(orders);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    };

    fetchProdutos();
    fetchPedidos();
  }, []);

  // ----------------------------
  // Produtos Mais Vendidos (Bar Chart)
  // ----------------------------
  const getBestSellingData = () => {
    const salesMap = {};
    pedidos.forEach((pedido) => {
      if (pedido.products) {
        pedido.products.forEach((item) => {
          // item deve conter { id, nome, quantidade }
          if (!salesMap[item.id]) {
            salesMap[item.id] = { nome: item.nome, quantidade: 0 };
          }
          salesMap[item.id].quantidade += item.quantidade;
        });
      }
    });
    // Ordena os produtos por quantidade vendida e pega os top 5
    const bestSelling = Object.values(salesMap)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    return {
      labels: bestSelling.map((item) => item.nome),
      datasets: [
        {
          label: "Quantidade Vendida",
          data: bestSelling.map((item) => item.quantidade),
          backgroundColor: "rgba(75,192,192,0.6)",
        },
      ],
    };
  };

  // ----------------------------
  // Estoque de Produtos (Pie Chart)
  // ----------------------------
  const getStockData = () => {
    return {
      labels: produtos.map((prod) => prod.nome),
      datasets: [
        {
          label: "Estoque Disponível",
          data: produtos.map((prod) => prod.quantidadeEstoque),
          backgroundColor: produtos.map(
            (_, idx) =>
              `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                Math.random() * 255
              )}, ${Math.floor(Math.random() * 255)}, 0.6)`
          ),
        },
      ],
    };
  };

  // ----------------------------
  // Total de Vendas ao Longo do Tempo (Line Chart)
  // ----------------------------
  const getSalesOverTimeData = () => {
    const salesByDate = {};
    pedidos.forEach((pedido) => {
      // Convertendo Firestore Timestamp para data
      const dateObj = new Date(pedido.createdAt.seconds * 1000);
      const dateStr = dateObj.toLocaleDateString();
      if (!salesByDate[dateStr]) {
        salesByDate[dateStr] = 0;
      }
      // Acumula o total de vendas (supondo que pedido.total seja um número)
      salesByDate[dateStr] += pedido.total;
    });

    // Ordena as datas
    const dates = Object.keys(salesByDate).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    return {
      labels: dates,
      datasets: [
        {
          label: "Total de Vendas (R$)",
          data: dates.map((date) => salesByDate[date]),
          fill: false,
          borderColor: "rgba(255,99,132,1)",
          tension: 0.1,
        },
      ],
    };
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="charts-grid">
        <div className="chart-container">
          <h2>Produtos Mais Vendidos</h2>
          <Bar
            data={getBestSellingData()}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Top 5 Produtos Mais Vendidos",
                },
              },
            }}
          />
        </div>

        <div className="chart-container">
          <h2>Estoque de Produtos</h2>
          <Pie
            data={getStockData()}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Estoque Disponível",
                },
              },
            }}
          />
        </div>
      </div>

      <div className="chart-container full-width-chart">
        <h2>Total de Vendas por Data</h2>
        <Line
          data={getSalesOverTimeData()}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" },
              title: {
                display: true,
                text: "Vendas ao Longo do Tempo",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ProdutoPage;
