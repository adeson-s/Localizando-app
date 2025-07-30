"use client";

import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
  MarkerClustererF,
} from "@react-google-maps/api";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { lojas } from "../lib/lojas";
import { SlidersHorizontal, X, Clock, MapPin } from "lucide-react";

/* ------------------ Ícones por categoria (SVG dinâmico) ------------------ */

const CATEGORY_COLORS = {
  "Pet Shop": "#ff69b4",
  "Academia": "#8b5cf6",
  "Supermercado": "#22c55e",
  "Restaurante": "#f97316",
  "Padaria": "#fbbf24",
  default: "#3b82f6",
};

const CATEGORY_EMOJIS = {
  "Pet Shop": "🐶",
  "Academia": "🏋️",
  "Supermercado": "🛒",
  "Restaurante": "🍽️",
  "Padaria": "🥐",
  default: "🏪",
};

function makeSvgPin(color, emoji) {
  const svg = `
    <svg width="64" height="64" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
      <text x="12" y="13.5" font-size="8" text-anchor="middle" alignment-baseline="middle">${emoji}</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getMarkerIcon(type) {
  const color = CATEGORY_COLORS[type] || CATEGORY_COLORS.default;
  const emoji = CATEGORY_EMOJIS[type] || CATEGORY_EMOJIS.default;
  const url = makeSvgPin(color, emoji);

  if (typeof window === "undefined" || !window.google?.maps) {
    return { url };
  }

  return {
    url,
    scaledSize: new window.google.maps.Size(40, 40),
    origin: new window.google.maps.Point(0, 0),
    anchor: new window.google.maps.Point(20, 40),
  };
}

/* ------------------ Utils ------------------ */

// Haversine – distância em KM
function calcDistance(lat1, lon1, lat2, lon2) {
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

// Está aberto agora? (usando strings tipo "09:00 - 18:00")
function estaAberto(loja) {
  if (!loja?.horario) return false;

  const hoje = new Date();
  const dias = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  const diaAtual = dias[hoje.getDay()];
  const horarioDia = loja.horario[diaAtual];

  if (!horarioDia || horarioDia.toLowerCase() === "fechado") return false;

  const [abertura, fechamento] = horarioDia.split(" - ");
  const horaAtual = hoje.getHours() + hoje.getMinutes() / 60;
  const horaAbertura =
    parseInt(abertura.split(":")[0], 10) +
    parseInt(abertura.split(":")[1], 10) / 60;
  const horaFechamento =
    parseInt(fechamento.split(":")[0], 10) +
    parseInt(fechamento.split(":")[1], 10) / 60;

  return horaAtual >= horaAbertura && horaAtual <= horaFechamento;
}

// Horário do dia (string)
function horarioHoje(loja) {
  const dias = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  const diaAtual = dias[new Date().getDay()];
  return loja?.horario?.[diaAtual] || "Fechado";
}

/* ------------------ Componente ------------------ */

export default function Mapa() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [selected, setSelected] = useState(null);

  // Filtros
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);

  // Localização do usuário
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.log("Erro ao pegar localização", err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Categorias dinâmicas vindas das lojas
  const categorias = useMemo(() => {
    const set = new Set(lojas.map((l) => l.type).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  function toggleCategory(cat) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function clearFilters() {
    setSelectedCategories([]);
    setOpenNowOnly(false);
    setMaxDistanceKm(10);
  }

  // Aplica filtros às lojas
  const lojasFiltradas = useMemo(() => {
    let list = [...lojas];

    if (selectedCategories.length > 0) {
      list = list.filter((l) => selectedCategories.includes(l.type));
    }

    if (openNowOnly) {
      list = list.filter((l) => estaAberto(l));
    }

    if (userLocation) {
      list = list
        .map((l) => ({
          ...l,
          distanceValue: calcDistance(
            userLocation.lat,
            userLocation.lng,
            l.lat,
            l.lng
          ),
        }))
        .filter((l) => l.distanceValue <= maxDistanceKm)
        .sort((a, b) => a.distanceValue - b.distanceValue);
    }

    return list;
  }, [selectedCategories, openNowOnly, maxDistanceKm, userLocation]);

  // Centro do mapa: se tiver localização do usuário, usa ela; senão, primeira loja
  const center = useMemo(() => {
    if (userLocation) return userLocation;
    if (lojas.length > 0) return { lat: lojas[0].lat, lng: lojas[0].lng };
    return { lat: 0, lng: 0 };
  }, [userLocation]);

  if (!isLoaded) return <div>Carregando mapa...</div>;

  const hasActiveFilters =
    selectedCategories.length > 0 || openNowOnly || maxDistanceKm !== 10;

  return (
    <div className="relative w-full h-screen pb-20">
      {/* Botão filtro (topo direito) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="bg-white text-gray-700 text-xs px-3 py-1 rounded-full shadow-md hover:bg-gray-100"
          >
            Limpar filtros
          </button>
        )}

        <button
          onClick={() => setIsFilterOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-sm font-medium hover:scale-105 transition-transform ${
            hasActiveFilters ? "bg-blue-500 text-white" : "bg-white text-gray-700"
          }`}
          aria-label="Abrir filtros"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Botão para centralizar no usuário (opcional) */}
      {userLocation && (
        <button
          onClick={() => window.location.reload()} // simples: recarrega para recentralizar
          className="absolute top-4 left-4 z-20 bg-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
          aria-label="Centralizar em mim"
        >
          <MapPin className="w-5 h-5 text-blue-600" />
        </button>
      )}

      {/* Google Map */}
      <GoogleMap center={center} zoom={14} mapContainerClassName="w-full h-full">
        {/* Clusterizador para os marcadores filtrados */}
        <MarkerClustererF>
          {(clusterer) =>
            lojasFiltradas.map((loja) => (
              <Marker
                key={loja.id}
                position={{ lat: loja.lat, lng: loja.lng }}
                icon={getMarkerIcon(loja.type)}
                clusterer={clusterer}
                onClick={() => setSelected(loja)}
              />
            ))
          }
        </MarkerClustererF>

        {/* Pino do usuário */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{ url: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png" }}
          />
        )}

        {/* InfoWindow */}
        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
          >
            <div className="w-64 p-2 bg-white rounded-md">
              <div className="flex items-center gap-2">
                {selected.logo && (
                  <img
                    src={selected.logo}
                    alt={selected.name}
                    className="w-12 h-12 rounded-full border"
                  />
                )}
                <div>
                  <h2 className="font-bold text-lg">{selected.name}</h2>
                  <p
                    className={`text-sm ${
                      estaAberto(selected) ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {estaAberto(selected) ? "Aberto Agora" : "Fechado"}
                  </p>
                </div>
              </div>

              <p className="mt-2 text-gray-700 text-sm">
                Horário de hoje: <strong>{horarioHoje(selected)}</strong>
              </p>

              {userLocation && selected.distanceValue && (
                <p className="mt-1 text-xs text-gray-500">
                  {selected.distanceValue.toFixed(1)} km de você
                </p>
              )}

              <Link
                href={`/loja/${selected.id}`}
                className="block mt-2 text-blue-500 underline text-sm"
              >
                Ver Detalhes
              </Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Bottom Sheet de Filtros */}
      {isFilterOpen && (
        <>
          <div
            onClick={() => setIsFilterOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-40 z-30"
          ></div>

          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-40 max-h-[60vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Filtros</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Categorias */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Categorias</h4>
              <div className="flex flex-wrap gap-2">
                {categorias.map((cat) => {
                  const active = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-4 py-2 rounded-full border text-sm ${
                        active
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aberto agora */}
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={openNowOnly}
                  onChange={(e) => setOpenNowOnly(e.target.checked)}
                />
                <span className="text-gray-700 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-green-500" /> Aberto agora
                </span>
              </label>
            </div>

            {/* Raio */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Distância máxima</h4>
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
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 km</span>
                <span>30 km</span>
              </div>
            </div>

            <div className="flex gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-2"
                >
                  Limpar
                </button>
              )}
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 bg-blue-500 text-white rounded-xl py-2"
              >
                Aplicar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
