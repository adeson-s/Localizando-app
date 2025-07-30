"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  ShoppingBag,
  Utensils,
  ShoppingCart,
  Dumbbell,
  X,
  User,
  Home as HomeIcon,
  Play,
  Star,
  Clock,
  SlidersHorizontal
} from "lucide-react";
import { lojas } from "./lojas";

/* ------------------ Utils ------------------ */

// Haversine – distância em KM
function calcDistance(lat1, lon1, lat2, lon2) {
  if (
    typeof lat1 !== "number" ||
    typeof lon1 !== "number" ||
    typeof lat2 !== "number" ||
    typeof lon2 !== "number"
  )
    return undefined;

  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Parse "HH:mm" -> número (ex.: "09:30" => 9.5)
function parseHora(hstr) {
  if (!hstr) return null;
  const [h, m] = hstr.split(":").map(Number);
  if (isNaN(h)) return null;
  return h + (m || 0) / 60;
}

// Versão robusta: aceita dois formatos de horário:
// 1) { abre: "09:00", fecha: "18:00" }
// 2) { segunda: "09:00 - 18:00", ... }
function estaAberto(loja) {
  const now = new Date();
  const horaAtual = now.getHours() + now.getMinutes() / 60;

  if (!loja?.horario) return false;

  // Caso 1: formato simples (abre/fecha)
  if (loja.horario.abre && loja.horario.fecha) {
    const abre = parseHora(loja.horario.abre);
    const fecha = parseHora(loja.horario.fecha);
    if (abre == null || fecha == null) return false;
    return horaAtual >= abre && horaAtual < fecha;
  }

  // Caso 2: formato por dia ("segunda": "09:00 - 18:00")
  const dias = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];
  const diaAtual = dias[now.getDay()];
  const horarioDia = loja.horario[diaAtual];

  if (!horarioDia || horarioDia.toLowerCase() === "fechado") return false;

  const [abertura, fechamento] = horarioDia.split(" - ").map((s) => s?.trim());
  const abre = parseHora(abertura);
  const fecha = parseHora(fechamento);
  if (abre == null || fecha == null) return false;

  return horaAtual >= abre && horaAtual <= fecha;
}

export default function HomePage() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [sortBy, setSortBy] = useState("distance");
  const [userLocation, setUserLocation] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        (err) => console.log("Erro ao pegar localização", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Categorias "rápidas" (fixas, só para o carrossel)
  const categories = [
    {
      name: "Roupas",
      icon: ShoppingBag,
      color: "bg-blue-500",
      textColor: "text-blue-500",
      bgLight: "bg-blue-50",
    },
    {
      name: "Restaurantes",
      icon: Utensils,
      color: "bg-orange-400",
      textColor: "text-orange-400",
      bgLight: "bg-orange-50",
    },
    {
      name: "Supermercados",
      icon: ShoppingCart,
      color: "bg-green-500",
      textColor: "text-green-500",
      bgLight: "bg-green-50",
    },
    {
      name: "Academias",
      icon: Dumbbell,
      color: "bg-purple-400",
      textColor: "text-purple-400",
      bgLight: "bg-purple-50",
    },
  ];

  // Categorias dinâmicas para o modal de filtros
  const categorias = useMemo(() => {
    if (!Array.isArray(lojas)) return [];
    const set = new Set(lojas.map((l) => l.type).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  function toggleCategory(cat) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  const filteredBusinesses = useMemo(() => {
    if (!Array.isArray(lojas)) return [];

    let list = [...lojas];

    // Busca
    const text = searchText.trim().toLowerCase();
    if (text) {
      list = list.filter((l) => {
        const name = (l.name || "").toLowerCase();
        const type = (l.type || "").toLowerCase();
        const desc = (l.desc || "").toLowerCase();
        return name.includes(text) || type.includes(text) || desc.includes(text);
      });
    }

    // Categorias
    if (selectedCategories.length > 0) {
      list = list.filter((l) => selectedCategories.includes(l.type));
    }

    // Distância
    if (userLocation) {
      list = list
        .filter((l) => typeof l.lat === "number" && typeof l.lng === "number")
        .map((l) => ({
          ...l,
          distanceValue: calcDistance(
            userLocation.lat,
            userLocation.lng,
            l.lat,
            l.lng
          ),
        }))
        .filter((l) => l.distanceValue !== undefined && l.distanceValue <= maxDistanceKm);
    }

    // Aberto agora
    if (openNowOnly) {
      list = list.filter(estaAberto);
    }

    // Ordenação
    switch (sortBy) {
      case "rating":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      default: // distance
        if (userLocation) {
          list.sort(
            (a, b) => (a.distanceValue || Infinity) - (b.distanceValue || Infinity)
          );
        }
    }

    return list;
  }, [
    searchText,
    selectedCategories,
    maxDistanceKm,
    openNowOnly,
    sortBy,
    userLocation,
  ]);

  function clearFilters() {
    setSelectedCategories([]);
    setMaxDistanceKm(10);
    setOpenNowOnly(false);
    setSortBy("distance");
  }

  const getBusinessIcon = (type) => {
    const iconMap = {
      Roupas: "👔",
      Restaurantes: "🍕",
      Supermercados: "🛒",
      Academias: "🏋️",
      "Loja de roupas": "👔",
      Restaurante: "🍕",
      Supermercado: "🛒",
      Academia: "🏋️",
    };
    return iconMap[type] || "🏢";
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    openNowOnly ||
    maxDistanceKm !== 10 ||
    sortBy !== "distance";

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      {/* Header com Search */}
      <div className="p-4 bg-gray-50">
        <div className="flex items-center bg-white rounded-full px-4 py-3 shadow-sm border">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Pesquisar empresas"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 outline-none text-gray-700"
          />
          <div className="flex items-center space-x-2 ml-2">
          <button
              onClick={() => setIsFilterOpen(true)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                hasActiveFilters
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600"
              } hover:scale-105 transition-transform`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <Link
              href="/mapa"
              className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              <MapPin className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      </div>

      {/* Categorias de Acesso Rápido */}
      <div className="px-4 pb-2">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategories.includes(category.name);
            return (
              <button
                key={index}
                onClick={() => toggleCategory(category.name)}
                className={`flex-shrink-0 flex flex-col items-center p-3 rounded-2xl min-w-[80px] transition-all hover:scale-105 ${
                  isSelected
                    ? `${category.color} text-white shadow-lg`
                    : `${category.bgLight} ${category.textColor} hover:shadow-md`
                }`}
              >
                <IconComponent className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium text-center leading-tight">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtros Ativos */}
      {hasActiveFilters && (
        <div className="px-4 pb-2">
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
            {selectedCategories.map((cat) => (
              <div
                key={cat}
                className="flex-shrink-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center space-x-1"
              >
                <span className="text-xs">{cat}</span>
                <button onClick={() => toggleCategory(cat)}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {openNowOnly && (
              <div className="flex-shrink-0 bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span className="text-xs">Aberto</span>
                <button onClick={() => setOpenNowOnly(false)}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {(maxDistanceKm !== 10 || sortBy !== "distance") && (
              <button
                onClick={clearFilters}
                className="flex-shrink-0 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs hover:bg-gray-200 transition-colors"
              >
                Limpar tudo
              </button>
            )}
          </div>
        </div>
      )}

      {/* Lista de Empresas */}
      <div className="px-4 pb-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {selectedCategories.length > 0
            ? `${selectedCategories.join(", ")} perto de você`
            : "Empresas perto de você"}
        </h2>

        {filteredBusinesses.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Nenhuma empresa encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              Tente ajustar seus filtros de busca
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}

        <div className="space-y-4">
          {filteredBusinesses.map((business) => {
          const isOpen = estaAberto(business);
          return (
            <Link
              key={business.id}
              href={`/loja/${business.id}`}
              className="block bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl mr-4 shadow-md">
                  {business.logo ? (
                    <img
                      src={business.logo}
                      alt={business.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    getBusinessIcon(business.type)
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-gray-900 text-lg truncate pr-2">
                      {business.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                        isOpen
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isOpen ? "Aberto" : "Fechado"}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-1">
                    {business.type}
                  </p>

                  {business.desc && (
                    <p className="text-gray-500 text-xs mb-2 truncate">
                      {business.desc}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {business.rating && (
                        <div className="flex items-center">
                          <div className="flex mr-1">
                            {renderStars(business.rating)}
                          </div>
                          <span className="text-xs text-gray-600">
                            {Number(business.rating).toFixed(1)}
                          </span>
                        </div>
                      )}

                      {userLocation && business.distanceValue !== undefined && (
                        <div className="flex items-center text-blue-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="text-xs font-medium">
                            {business.distanceValue.toFixed(1)} km
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        </div>
      </div>

      {/* Bottom Sheet Filtros */}
      {isFilterOpen && (
        <>
          <div
            onClick={() => setIsFilterOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          ></div>
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white rounded-t-3xl shadow-2xl p-6 z-50 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Filtros</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Todas as Categorias */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Categorias</h4>
              <div className="flex flex-wrap gap-2">
                {categorias.map((cat) => {
                  const active = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                        active
                          ? "bg-blue-500 text-white border-blue-500 shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:shadow-sm"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Distância */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-900">Distância</h4>
                <span className="text-sm text-blue-600 font-medium">
                  {maxDistanceKm} km
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 km</span>
                <span>30 km</span>
              </div>
            </div>

            {/* Aberto agora */}
            <div className="mb-6">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-green-500 mr-3" />
                  <span className="font-medium text-gray-900">Aberto agora</span>
                </div>
                <input
                  type="checkbox"
                  checked={openNowOnly}
                  onChange={(e) => setOpenNowOnly(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
            </div>

            {/* Ordenação */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Ordenar por</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="distance">Mais perto</option>
                <option value="rating">Melhor avaliação</option>
                <option value="name">A-Z</option>
              </select>
            </div>

            {/* Botões de ação */}
            <div className="flex space-x-3">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex-1 bg-gray-100 text-gray-700 font-medium rounded-xl py-3 hover:bg-gray-200 transition-colors"
                >
                  Limpar filtros
                </button>
              )}
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 bg-blue-500 text-white font-medium rounded-xl py-3 hover:bg-blue-600 transition-colors"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200">
        <div className="flex justify-around py-3">
          <button className="flex flex-col items-center p-2">
            <Search className="w-6 h-6 text-blue-500" />
          </button>
          <button className="flex flex-col items-center p-2">
            <HomeIcon className="w-6 h-6 text-gray-400" />
          </button>
          <button className="flex flex-col items-center p-2">
            <Play className="w-6 h-6 text-gray-400" />
          </button>
          <button className="flex flex-col items-center p-2">
            <User className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <div className="h-1 w-32 bg-black rounded-full mx-auto mb-2"></div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
