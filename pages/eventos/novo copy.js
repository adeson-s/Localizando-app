// pages/eventos/novo.js
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Camera,
  Save,
} from "lucide-react";
import { useJsApiLoader } from "@react-google-maps/api";

// Lazy load do seletor de mapa – ele deve chamar onSelect(lat, lng, address)
const MapSelector = dynamic(
  () => import("./MapSelector").then((mod) => mod.default),
  { ssr: false }
);

// Simulação de login (troque pela sua lógica real)
const isLoggedIn = true;
const currentUser = {
  id: 1,
  nome: "Você",
  foto: "/user-default.jpg",
  verificado: true,
};

const categorias = [
  "Gastronomia",
  "Cultura",
  "Esporte",
  "Música",
  "Arte",
  "Tecnologia",
  "Outros",
];

const libraries = ["places"];

export default function NovoEventoPage() {
  const router = useRouter();

  // carrega a API do Google aqui também para usarmos o Geocoder no botão "Minha localização"
  const { isLoaded: isGoogleLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [preview, setPreview] = useState(null);
  const [coordsFetching, setCoordsFetching] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [form, setForm] = useState({
    descricao: "",
    dataEvento: "",
    horaEvento: "",
    local: "",
    lat: "",
    lng: "",
    categoria: "",
    preco: "Gratuito",
    fotoEventoUrl: "",
    fotoEventoFile: null,
  });

  // Se não estiver logado, redireciona
  useEffect(() => {
    if (!isLoggedIn) router.replace("/eventos");
  }, [router]);

  // Preview da imagem (file ou URL)
  useEffect(() => {
    if (!form.fotoEventoFile) {
      setPreview(form.fotoEventoUrl || null);
      return;
    }
    const url = URL.createObjectURL(form.fotoEventoFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [form.fotoEventoFile, form.fotoEventoUrl]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    setForm((f) => ({ ...f, fotoEventoFile: file, fotoEventoUrl: "" }));
  };

  const reverseGeocodeGoogle = useCallback(async (lat, lng) => {
    return new Promise((resolve, reject) => {
      if (!window.google?.maps) {
        reject(new Error("Google Maps não carregado"));
        return;
      }
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat: Number(lat), lng: Number(lng) } }, (results, status) => {
        if (status === "OK" && results?.length) {
          resolve(results[0].formatted_address);
        } else {
          reject(new Error("Falha no geocoder: " + status));
        }
      });
    });
  }, []);

  const reverseGeocodeOSM = useCallback(async (lat, lng) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=pt-BR`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "localizando-app/1.0 (dev@example.com)",
        },
      });
      if (!res.ok) throw new Error("Erro no Nominatim");
      const data = await res.json();
      return data.display_name || "";
    } catch (e) {
      return "";
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.descricao || !form.dataEvento || !form.horaEvento || !form.local) {
      alert("Preencha descrição, data, hora e local.");
      return;
    }

    const dataCompleta = `${form.dataEvento} ${form.horaEvento}`;
    const fotoEvento = form.fotoEventoUrl || preview || "/default-event.jpg";

    const novo = {
      id: Date.now(),
      usuario: {
        id: currentUser.id,
        nome: currentUser.nome,
        foto: currentUser.foto,
        verificado: currentUser.verificado,
      },
      fotoEvento,
      descricao: form.descricao,
      dataEvento: dataCompleta,
      local: form.local,
      lat: form.lat ? Number(form.lat) : undefined,
      lng: form.lng ? Number(form.lng) : undefined,
      dataPost: new Date().toISOString(),
      categoria: form.categoria || "Outros",
      preco: form.preco || "Gratuito",
      participantes: 0,
      interessados: 0,
      curtidas: 0,
      comentarios: 0,
      compartilhamentos: 0,
      isLiked: false,
      isSaved: false,
      isInterested: false,
    };

    // Guarda no localStorage para o feed ler
    const saved = JSON.parse(localStorage.getItem("newEvents") || "[]");
    localStorage.setItem("newEvents", JSON.stringify([novo, ...saved]));

    alert("Evento criado com sucesso!");
    router.push("/eventos");
  };

  const pegarMinhaLocalizacao = async () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada.");
      return;
    }
    setCoordsFetching(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        let address = "";
        // Tenta Google primeiro
        if (isGoogleLoaded && window.google?.maps) {
          try {
            address = await reverseGeocodeGoogle(lat, lng);
          } catch (e) {
            console.log("Google Geocoder falhou, tentando OSM…", e);
          }
        }
        // Fallback OSM
        if (!address) {
          address = await reverseGeocodeOSM(lat, lng);
        }

        setForm((f) => ({
          ...f,
          lat: String(lat),
          lng: String(lng),
          local: address || f.local,
        }));
        setCoordsFetching(false);
      },
      () => {
        alert("Não foi possível obter sua localização.");
        setCoordsFetching(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const abrirMapaPreview = () => {
    if (!form.lat || !form.lng) {
      alert("Preencha lat/lng ou use 'Escolher no mapa'.");
      return;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${form.lat},${form.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Novo Evento</h1>
        <div className="w-9" />
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Foto */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-2 flex items-center">
            <ImageIcon className="w-4 h-4 mr-2 text-blue-500" /> Foto do Evento
          </h2>

          {preview ? (
            <div className="relative mb-3">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, fotoEventoFile: null, fotoEventoUrl: "" }))
                }
                className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full px-2 py-1 text-xs hover:bg-opacity-100"
              >
                Trocar
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-36 bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <Camera className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-gray-500 text-sm">Clique para enviar imagem</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          )}

          <div className="mt-2">
            <input
              type="url"
              placeholder="... ou cole a URL da imagem"
              value={form.fotoEventoUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, fotoEventoUrl: e.target.value, fotoEventoFile: null }))
              }
              className="w-full border rounded-md p-2 text-sm"
            />
          </div>
        </div>

        {/* Descrição */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-2">Descrição</h2>
        <textarea
          placeholder="Conte sobre o evento..."
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-2 h-24"
          required
        />
        </div>

        {/* Data e Hora separados */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" /> Data e Hora
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={form.dataEvento}
              onChange={(e) => setForm({ ...form, dataEvento: e.target.value })}
              className="border rounded-md p-2"
              required
            />
            <input
              type="time"
              value={form.horaEvento}
              onChange={(e) => setForm({ ...form, horaEvento: e.target.value })}
              className="border rounded-md p-2"
              required
            />
          </div>
        </div>

        {/* Local + pegar localização + escolher no mapa */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-red-500" /> Local do evento
          </h2>
          <input
            type="text"
            placeholder="Ex.: Praça Central, Maricá"
            value={form.local}
            onChange={(e) => setForm({ ...form, local: e.target.value })}
            className="w-full border rounded-md p-2 mb-2"
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Latitude"
              value={form.lat}
              onChange={(e) => setForm({ ...form, lat: e.target.value })}
              className="border rounded-md p-2"
            />
            <input
              type="text"
              placeholder="Longitude"
              value={form.lng}
              onChange={(e) => setForm({ ...form, lng: e.target.value })}
              className="border rounded-md p-2"
            />
          </div>

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={pegarMinhaLocalizacao}
              className="flex-1 bg-blue-50 text-blue-600 rounded-lg py-2 text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
              disabled={coordsFetching}
            >
              {coordsFetching ? "Carregando..." : "Minha localização"}
            </button>
            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="flex-1 bg-gray-50 text-gray-600 rounded-lg py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Escolher no mapa
            </button>
          </div>
        </div>

        {/* Categoria / Preço */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Detalhes</h2>

          <label className="text-sm text-gray-700 font-medium mb-1 flex items-center">
            <Tag className="w-4 h-4 mr-1 text-purple-500" /> Categoria
          </label>
          <select
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            className="w-full border rounded-md p-2 mb-3"
          >
            <option value="">Selecione...</option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label className="text-sm text-gray-700 font-medium mb-1 flex items-center">
            <DollarSign className="w-4 h-4 mr-1 text-green-500" /> Preço
          </label>
          <input
            type="text"
            placeholder="Gratuito, R$ 20,00, etc."
            value={form.preco}
            onChange={(e) => setForm({ ...form, preco: e.target.value })}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Enviar */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Publicar evento
        </button>
      </form>

      {/* Modal do seletor de mapa */}
      {showMap && (
        <MapSelector
          onClose={() => setShowMap(false)}
          onSelect={(lat, lng, address) => {
            setForm((f) => ({ ...f, lat, lng, local: address || f.local }));
            setShowMap(false);
          }}
          initialLat={form.lat ? Number(form.lat) : undefined}
          initialLng={form.lng ? Number(form.lng) : undefined}
        />
      )}
    </div>
  );
}
