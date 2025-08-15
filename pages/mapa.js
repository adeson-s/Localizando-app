"use client";

import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
  MarkerClustererF,
} from "@react-google-maps/api";
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { SlidersHorizontal, X, Clock, MapPin, Star, Navigation, Phone } from "lucide-react";

import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

/* ------------------ Ícones por categoria ------------------ */

const CATEGORY_COLORS = {
  "Pet Shop": "#ff69b4",
  Academia: "#8b5cf6",
  Supermercado: "#22c55e",
  Restaurante: "#f97316",
  Padaria: "#fbbf24",
  default: "#3b82f6",
};

const CATEGORY_EMOJIS = {
  "Pet Shop": "🐶",
  Academia: "🏋️",
  Supermercado: "🛒",
  Restaurante: "🍽️",
  Padaria: "🥐",
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

function getMarkerIcon(type, zoom = 14) {
  const color = CATEGORY_COLORS[type] || CATEGORY_COLORS.default;
  const emoji = CATEGORY_EMOJIS[type] || CATEGORY_EMOJIS.default;
  const url = makeSvgPin(color, emoji);

  // Define o tamanho dinamicamente com base no zoom
  const baseSize = Math.max(30, Math.min(zoom * 4, 64)); // entre 30 e 64 px

  if (typeof window === "undefined" || !window.google?.maps) {
    return { url };
  }

  return {
    url,
    scaledSize: new window.google.maps.Size(baseSize, baseSize),
    origin: new window.google.maps.Point(0, 0),
    anchor: new window.google.maps.Point(baseSize / 2, baseSize),
  };
}


/* ------------------ Utils ------------------ */

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

/**
 * Retorna se a loja está aberta agora.
 * Trata strings tipo "09:00 - 18:00" e objetos {abre: "09:00", fecha:"18:00", enabled: true}
 */
function estaAberto(loja) {
  if (!loja?.horario) return false;

  const hoje = new Date();
  const dias = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  const diaAtual = dias[hoje.getDay()];
  let horarioDia = loja.horario[diaAtual];

  if (!horarioDia) return false;

  // Se for objeto do tipo {abre, fecha, enabled}
  if (typeof horarioDia === "object" && horarioDia !== null) {
    if (horarioDia.enabled === false) return false;
    if (horarioDia.abre && horarioDia.fecha) {
      horarioDia = `${horarioDia.abre} - ${horarioDia.fecha}`;
    } else {
      return false;
    }
  }

  if (typeof horarioDia !== "string") return false;

  if (!horarioDia || horarioDia.toLowerCase() === "fechado") return false;

  const [abertura, fechamento] = horarioDia.split(" - ");
  if (!abertura || !fechamento) return false;

  const horaAtual = hoje.getHours() + hoje.getMinutes() / 60;
  const horaAbertura =
    parseInt(abertura.split(":")[0], 10) +
    parseInt(abertura.split(":")[1], 10) / 60;
  const horaFechamento =
    parseInt(fechamento.split(":")[0], 10) +
    parseInt(fechamento.split(":")[1], 10) / 60;

  return horaAtual >= horaAbertura && horaAtual <= horaFechamento;
}

/**
 * Retorna horário do dia em string legível para exibir.
 * Aceita string ou objeto {abre, fecha, enabled}
 */
function horarioHoje(loja) {
  const dias = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  const diaAtual = dias[new Date().getDay()];
  let horarioDia = loja?.horario?.[diaAtual];

  if (!horarioDia) return "Fechado";

  if (typeof horarioDia === "object" && horarioDia !== null) {
    if (horarioDia.enabled === false) return "Fechado";
    if (horarioDia.abre && horarioDia.fecha) {
      return `${horarioDia.abre} - ${horarioDia.fecha}`;
    }
    return "Fechado";
  }

  if (typeof horarioDia === "string") return horarioDia;

  return "Fechado";
}

function generateStarRating(rating = 4.2) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400/50 text-yellow-400" />);
    } else {
      stars.push(<Star key={i} className="w-3 h-3 text-gray-300" />);
    }
  }

  return stars;
}

/* ------------------ Componente ------------------ */

export default function Mapa() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [mapZoom, setMapZoom] = useState(14);
const mapRef = useRef(null);

  // filtros
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);

  const [userLocation, setUserLocation] = useState(null);

  // busca localização do usuário
  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Erro ao pegar localização", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // busca lojas do Firebase
  useEffect(() => {
    async function fetchLojas() {
      try {
        const querySnapshot = await getDocs(collection(db, "lojas"));
        const lista = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || data.storeName || "Sem nome",
            type: data.category || "Outros",
            lat: data.lat,
            lng: data.lng,
            logo: data.logoUrl,
            horario: data.horario || data.schedule || {},
            rating: data.rating || (4 + Math.random() * 1), // Mock rating
            phone: data.whatsapp || data.telefone,
            address: data.address || data.endereco || "Endereço não informado",
          };
        });
        setLojas(lista);
      } catch (error) {
        console.error("Erro ao buscar lojas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLojas();
  }, []);

  const categorias = useMemo(() => {
    const set = new Set(lojas.map((l) => l.type).filter(Boolean));
    return Array.from(set).sort();
  }, [lojas]);

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

  const lojasFiltradas = useMemo(() => {
    let list = [...lojas];

    if (selectedCategories.length > 0) {
      list = list.filter((l) => selectedCategories.includes(l.type));
    }

    if (openNowOnly) {
      list = list.filter(estaAberto);
    }

    if (userLocation) {
      list = list
        .map((l) => ({
          ...l,
          distanceValue: calcDistance(userLocation.lat, userLocation.lng, l.lat, l.lng),
        }))
        .filter((l) => l.distanceValue <= maxDistanceKm)
        .sort((a, b) => a.distanceValue - b.distanceValue);
    }

    return list;
  }, [selectedCategories, openNowOnly, maxDistanceKm, userLocation, lojas]);

  const center = useMemo(() => {
    if (userLocation) return userLocation;
    if (lojas.length > 0) return { lat: lojas[0].lat, lng: lojas[0].lng };
    return { lat: 0, lng: 0 };
  }, [userLocation, lojas]);

  const openDirections = (loja) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${loja.lat},${loja.lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${loja.lat},${loja.lng}`;
      window.open(url, '_blank');
    }
  };

  if (!isLoaded) return <div>Carregando mapa...</div>;
  if (loading) return <div>Carregando lojas...</div>;

  const hasActiveFilters = selectedCategories.length > 0 || openNowOnly || maxDistanceKm !== 10;

  return (
    <div className="relative w-full h-screen pb-20">
      {/* Botão filtro */}
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
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Botão para centralizar no usuário */}
      {userLocation && (
        <button
          onClick={() => window.location.reload()}
          className="absolute top-4 left-4 z-20 bg-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <MapPin className="w-5 h-5 text-blue-600" />
        </button>
      )}

      <GoogleMap
  center={center}
  zoom={mapZoom}
  onZoomChanged={() => {
    if (mapRef.current) {
      setMapZoom(mapRef.current.getZoom());
    }
  }}
  onLoad={(map) => (mapRef.current = map)}
  mapContainerClassName="w-full h-full"
>
        <MarkerClustererF>
  {(clusterer) =>
    lojasFiltradas.map((loja) => (
      <Marker
        key={loja.id}
        position={{ lat: loja.lat, lng: loja.lng }}
        icon={getMarkerIcon(loja.type, mapZoom)} // <- aqui
        clusterer={clusterer}
        onClick={() => setSelected(loja)}
      />
    ))
  }
</MarkerClustererF>


        {userLocation && (
          <Marker
            position={userLocation}
            icon={{ url: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png" }}
          />
        )}

        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
            options={{
              pixelOffset: new window.google.maps.Size(0, -10),
              disableAutoPan: false,
            }}
          >
            <div className="w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border-0 p-0 m-0">
              {/* Header com gradiente */}
              <div 
                className="h-24 relative"
                style={{
                  background: `linear-gradient(135deg, ${CATEGORY_COLORS[selected.type] || CATEGORY_COLORS.default}40, ${CATEGORY_COLORS[selected.type] || CATEGORY_COLORS.default}20)`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                {selected.logo && (
                  <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                    <img
                      src={selected.logo}
                      alt={selected.name}
                      className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Conteúdo principal */}
              <div className="p-4 pt-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h2 className="font-bold text-xl text-gray-900 leading-tight">{selected.name}</h2>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs font-medium px-2 py-1 rounded-full" 
                            style={{ 
                              backgroundColor: `${CATEGORY_COLORS[selected.type] || CATEGORY_COLORS.default}15`,
                              color: CATEGORY_COLORS[selected.type] || CATEGORY_COLORS.default
                            }}>
                        {CATEGORY_EMOJIS[selected.type] || CATEGORY_EMOJIS.default} {selected.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                    {generateStarRating(selected.rating)}
                    <span className="text-xs font-medium text-gray-600 ml-1">
                      {selected.rating?.toFixed(1) || "4.2"}
                    </span>
                  </div>
                </div>

                {/* Status e horário */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    estaAberto(selected) 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    <Clock className="w-3 h-3" />
                    {estaAberto(selected) ? "Aberto agora" : "Fechado"}
                  </div>
                  <span className="text-xs text-gray-500">
                    Hoje: {horarioHoje(selected)}
                  </span>
                </div>

                {/* Distância */}
                {userLocation && selected.distanceValue !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{selected.distanceValue.toFixed(1)} km de você</span>
                  </div>
                )}

                {/* Endereço */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {selected.address}
                </p>

              {/* Botões de ação */}
<div className="flex gap-2">
  {selected.phone ? (
    <button
      onClick={() => window.open(`https://wa.me/${selected.phone.replace(/\D/g, '')}`, "_blank")}
      className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
      title="WhatsApp"
    >
      <Phone className="w-4 h-4" />
      WhatsApp
    </button>
  ) : (
    <button
      disabled
      className="flex-1 flex items-center justify-center gap-2 bg-gray-300 text-gray-500 px-4 py-2.5 rounded-xl font-medium text-sm cursor-not-allowed"
      title="Telefone não disponível"
    >
      <Phone className="w-4 h-4" />
      Sem telefone
    </button>
  )}

  <Link 
    href={`/loja/${selected.id}`}
    className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
  >
    Detalhes
  </Link>
</div>


              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Filtros */}
      {isFilterOpen && (
        <>
          <div onClick={() => setIsFilterOpen(false)} className="fixed inset-0 bg-black bg-opacity-40 z-30"></div>
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-40 max-h-[60vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Filtros</h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Categorias</h4>
              <div className="flex flex-wrap gap-2">
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-2 rounded-full border text-sm ${
                      selectedCategories.includes(cat)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={openNowOnly} onChange={(e) => setOpenNowOnly(e.target.checked)} />
                <span className="text-gray-700 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-green-500" /> Aberto agora
                </span>
              </label>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Distância máxima</h4>
                <span className="text-sm text-blue-600 font-medium">{maxDistanceKm} km</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-2">
                  Limpar
                </button>
              )}
              <button onClick={() => setIsFilterOpen(false)} className="flex-1 bg-blue-500 text-white rounded-xl py-2">
                Aplicar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}