"use client";

import React, { useState, useEffect, useMemo } from "react";
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

import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { gcategories } from '../lib/categorias';

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

// Verifica se a loja está aberta agora, considerando formato por dia ou simples
function estaAberto(loja) {
  const now = new Date();
  const horaAtual = now.getHours() + now.getMinutes() / 60;

  if (!loja?.horario) return false;

  // Caso simples (abre/fecha)
  if (loja.horario.abre && loja.horario.fecha) {
    const abre = parseHora(loja.horario.abre);
    const fecha = parseHora(loja.horario.fecha);
    if (abre == null || fecha == null) return false;
    return horaAtual >= abre && horaAtual < fecha;
  }

  // Caso por dia (segunda, terca, ...)
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
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);

  // filtros
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [sortBy, setSortBy] = useState("distance");
  const [userLocation, setUserLocation] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // busca localização do usuário
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

  // busca lojas no Firestore
  useEffect(() => {
    async function carregarLojas() {
      try {
        const snapshot = await getDocs(collection(db, "lojas"));
        const lista = [];
        snapshot.forEach((doc) => {
          lista.push({ id: doc.id, ...doc.data() });
        });
        setLojas(lista);
      } catch (err) {
        console.error("Erro ao buscar lojas:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarLojas();
  }, []);

  // Categorias rápidas para o carrossel (fixas)
  const categories  = gcategories.map(category => ({
  name: category.name,
  icon: category.icon,
  color: category.color,
  textColor: category.textColor,
  bgLight: category.bgLight,
}));

  // Categorias dinâmicas para filtro
  const categorias = useMemo(() => {
    if (!Array.isArray(lojas)) return [];
    const set = new Set(lojas.map((l) => l.category).filter(Boolean));
    return Array.from(set).sort();
  }, [lojas]);

  function toggleCategory(cat) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  const filteredBusinesses = useMemo(() => {
    if (!Array.isArray(lojas)) return [];

    let list = [...lojas];

    // Busca texto
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
    lojas,
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

  if (loading) {
    return (
      <div className="max-w-sm mx-auto p-6 text-center">
        <p className="text-gray-700">Carregando lojas...</p>
      </div>
    );
  }

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
                    {business.logoUrl ? (
                      <img
                        src={business.logoUrl}
                        alt={business.name}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      getBusinessIcon(business.category)
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-gray-900 text-lg truncate pr-2">
                        {business.storeName}
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

                    <p className="text-gray-600 text-sm mb-1">{business.category}</p>

                   {Array.isArray(business.tags) && business.tags.length > 0 && (
  <div className="flex flex-wrap gap-1 mb-2">
    {business.tags.slice(0, 3).map((tag, i) => (
      <span
        key={i}
        className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px] font-medium"
      >
        {tag}
      </span>
    ))}

    {business.tags.length > 4 && (
      <span className="text-gray-400 text-[10px] font-medium">
        +{business.tags.length - 4}
      </span>
    )}
  </div>
)}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {business.rating && (
                          <div className="flex items-center">
                            <div className="flex mr-1">{renderStars(business.rating)}</div>
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
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
          ></div>
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl p-6 z-50 max-w-sm mx-auto max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Filtros</h3>
              <button onClick={() => setIsFilterOpen(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">Categorias</label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-auto scrollbar-hide">
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1 rounded-full border ${
                      selectedCategories.includes(cat)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">Distância máxima (km)</label>
              <input
                type="range"
                min={1}
                max={30}
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-right text-sm text-gray-600">{maxDistanceKm} km</div>
            </div>

            <div className="mb-4 flex items-center space-x-2">
              <input
                type="checkbox"
                id="openNowOnly"
                checked={openNowOnly}
                onChange={() => setOpenNowOnly((v) => !v)}
                className="cursor-pointer"
              />
              <label htmlFor="openNowOnly" className="cursor-pointer select-none">
                Mostrar apenas abertas agora
              </label>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="distance">Distância</option>
                <option value="rating">Avaliação</option>
                <option value="name">Nome</option>
              </select>
            </div>

            <button
              onClick={() => {
                clearFilters();
                setIsFilterOpen(false);
              }}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        </>
      )}
    </div>
  );
}
