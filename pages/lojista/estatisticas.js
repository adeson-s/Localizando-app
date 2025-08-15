"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  Bar,
  Line
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar componentes do Chart.js
ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function EstatisticasLojista() {
  const [storeId, setStoreId] = useState(null);
  const [visualizacoes, setVisualizacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewsPorDia, setViewsPorDia] = useState({});
  const [filtroData, setFiltroData] = useState("7dias");
  const [chartType, setChartType] = useState("bar");
  const [searchTerm, setSearchTerm] = useState("");
  const [storeName, setStoreName] = useState("");


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const lojaId = userData.storeId;

            if (!lojaId) {
              setLoading(false);
              return;
            }

            setStoreId(lojaId);

            const lojaDocRef = doc(db, "lojas", lojaId);
const lojaDocSnap = await getDoc(lojaDocRef);

if (lojaDocSnap.exists()) {
  const lojaData = lojaDocSnap.data();
  setStoreName(lojaData.storeName || "Sua Loja");
}


            const viewsRef = collection(db, "lojas", lojaId, "views");
            const q = query(viewsRef, orderBy("timestamp", "desc"));
            const snapshot = await getDocs(q);

            const views = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                timestamp: data.timestamp?.toDate(),
                userAgent: data.userAgent || "Desconhecido",
              };
            });

            setVisualizacoes(views);
            processarDados(views, filtroData);
          }
        } catch (error) {
          console.error("Erro ao carregar estatísticas:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (visualizacoes.length > 0) {
      processarDados(visualizacoes, filtroData);
    }
  }, [filtroData, visualizacoes]);

  const processarDados = (views, filtro) => {
    const hoje = new Date();
    let diasFiltro;

    switch (filtro) {
      case "7dias":
        diasFiltro = 7;
        break;
      case "30dias":
        diasFiltro = 30;
        break;
      case "90dias":
        diasFiltro = 90;
        break;
      default:
        diasFiltro = null;
    }

    const viewsFiltradas = diasFiltro
      ? views.filter((v) => {
          if (!v.timestamp) return false;
          const diffTime = hoje - v.timestamp;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= diasFiltro;
        })
      : views;

    // Agrupar por data
    const porDia = {};
    viewsFiltradas.forEach((v) => {
      if (!v.timestamp) return;
      const dataFormatada = v.timestamp.toLocaleDateString("pt-BR");
      porDia[dataFormatada] = (porDia[dataFormatada] || 0) + 1;
    });

    setViewsPorDia(porDia);
  };

  const filteredVisualizacoes = visualizacoes.filter((view) => {
    if (!searchTerm) return true;
    return (
      view.userAgent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      view.timestamp?.toLocaleString("pt-BR").includes(searchTerm)
    );
  });

  // Dados para o gráfico
  const chartData = {
    labels: Object.keys(viewsPorDia).reverse(),
    datasets: [
      {
        label: "Visualizações",
        data: Object.values(viewsPorDia).reverse(),
        backgroundColor: chartType === "bar" 
          ? "rgba(59, 130, 246, 0.8)" 
          : "rgba(99, 102, 241, 0.1)",
        borderColor: chartType === "line" ? "#6366f1" : "rgba(59, 130, 246, 0.8)",
        borderWidth: chartType === "line" ? 3 : 0,
        fill: chartType === "line" ? true : undefined,
        tension: chartType === "line" ? 0.4 : undefined,
        pointBackgroundColor: chartType === "line" ? "#6366f1" : undefined,
        pointBorderColor: chartType === "line" ? "#ffffff" : undefined,
        pointBorderWidth: chartType === "line" ? 2 : undefined,
        pointRadius: chartType === "line" ? 6 : undefined,
        pointHoverRadius: chartType === "line" ? 8 : undefined,
        borderRadius: chartType === "bar" ? 8 : undefined,
        borderSkipped: false,
      },
    ],
  };
  

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        cornerRadius: 12,
        padding: 12,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: function(context) {
            return `📅 ${context[0].label}`;
          },
          label: function(context) {
            return `👁️ ${context.parsed.y} visualizações`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "#9ca3af",
          font: {
            size: 12,
            weight: '500',
          },
          padding: 8,
          callback: function(value) {
            return value + (value === 1 ? ' view' : ' views');
          }
        },
        grid: {
          color: "rgba(229, 231, 235, 0.8)",
          lineWidth: 1,
        },
        border: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: "#9ca3af",
          font: {
            size: 11,
            weight: '500',
          },
          padding: 8,
          maxTicksLimit: 10,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 8,
      },
      point: {
        hoverBorderWidth: 3,
      }
    },
  };

  const totalViews = Object.values(viewsPorDia).reduce((a, b) => a + b, 0);
  const mediaDiaria = totalViews / Object.keys(viewsPorDia).length || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
  <h1 className="text-3xl font-bold text-gray-900">🛍️ Quem passou pela {storeName || "sua loja"}?</h1>
  <p className="text-gray-600 mt-1">Confira quantas visitas sua loja recebeu.</p>
</div>

            
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!storeId ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma loja encontrada
            </h3>
            <p className="text-gray-600">
              Você precisa ter uma loja cadastrada para visualizar as estatísticas.
            </p>
          </div>
        ) : (
          <>
            {/* Cards de métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total de Visualizações</p>
                    <p className="text-3xl font-bold text-gray-900">{visualizacoes.length.toLocaleString()}</p>
                    <p className="text-xs text-blue-600 mt-1">📈 Desde o início</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-2xl shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Período Selecionado</p>
                    <p className="text-3xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">📊 {filtroData === "todos" ? "Todos os dados" : filtroData.replace("dias", " dias")}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-2xl shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Média Diária</p>
                    <p className="text-3xl font-bold text-gray-900">{mediaDiaria.toLocaleString(undefined, {maximumFractionDigits: 1})}</p>
                    <p className="text-xs text-purple-600 mt-1">⚡ Views por dia</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-4 rounded-2xl shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M21.75 12H19.5m-.166 5.834l-1.591-1.591M12 19.5V21.75m-5.834-.166l1.591-1.591M2.25 12H4.5m.166-5.834l1.591 1.591" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles de filtro */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                      </svg>
                    </div>
                    <label className="text-sm font-semibold text-gray-700">Período:</label>
                    <select
                      value={filtroData}
                      onChange={(e) => setFiltroData(e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors duration-200"
                    >
                      <option value="7dias">📅 Últimos 7 dias</option>
                      <option value="30dias">📅 Últimos 30 dias</option>
                      <option value="90dias">📅 Últimos 90 dias</option>
                      <option value="todos">📅 Todos os períodos</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l-1-3m1 3l-1-3m-16.5 0h16.5" />
                      </svg>
                    </div>
                    <label className="text-sm font-semibold text-gray-700">Gráfico:</label>
                    <select
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white transition-colors duration-200"
                    >
                      <option value="bar">📊 Barras</option>
                      <option value="line">📈 Linha</option>
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar visualizações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-72 bg-gray-50 hover:bg-white transition-colors duration-200"
                  />
                  <div className="absolute left-4 top-3.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.94" />
                  </svg>
                  Visualizações por Dia
                </h2>
                <p className="text-indigo-100 text-sm mt-1">
                  {chartType === "bar" ? "Gráfico de Barras" : "Gráfico de Linha"} • {Object.keys(viewsPorDia).length} dias
                </p>
              </div>
              <div className="p-6">
                <div className="h-80 relative">
                  {Object.keys(viewsPorDia).length > 0 ? (
                    chartType === "bar" ? (
                      <Bar data={chartData} options={chartOptions} />
                    ) : (
                      <Line data={chartData} options={chartOptions} />
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-gray-500">Nenhum dado disponível para o período selecionado</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lista detalhada */}
            
          </>
        )}
      </div>
    </div>
  );
}