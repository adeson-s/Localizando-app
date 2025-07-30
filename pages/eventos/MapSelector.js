"use client";

import { useEffect, useState, useMemo } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { X, MapPin, Navigation } from "lucide-react";

const libraries = ["places"];

export default function MapSelector({ onClose, onSelect, initialLat, initialLng }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [position, setPosition] = useState(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );
  const [mapCenter, setMapCenter] = useState(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : { lat: -22.9129, lng: -43.2003 }
  );
  const [locating, setLocating] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    if (initialLat && initialLng) {
      reverseGeocode(initialLat, initialLng);
      return;
    }
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMapCenter(coords);
        setPosition(coords);
        reverseGeocode(coords.lat, coords.lng);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true }
    );
  }, [isLoaded, initialLat, initialLng]);

  const reverseGeocode = (lat, lng) => {
    if (!window.google?.maps) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        setAddress("");
      }
    });
  };

  const handleUsePoint = () => {
    if (!position) {
      alert("Selecione um ponto no mapa.");
      return;
    }
    onSelect(position.lat, position.lng, address);
  };

  const centerToUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMapCenter(coords);
        setPosition(coords);
        reverseGeocode(coords.lat, coords.lng);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true }
    );
  };

  if (!isLoaded) return <div className="p-4 text-center">Carregando mapa...</div>;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-lg font-bold text-gray-900">Escolher no mapa</h2>
        <div className="w-9" />
      </div>

      {/* Mapa */}
      <div className="relative flex-1">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={mapCenter}
          zoom={15}
          onClick={(e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setPosition({ lat, lng });
            reverseGeocode(lat, lng);
          }}
        >
          {position && <Marker position={position} />}
        </GoogleMap>

        {/* Botão Minha Localização */}
        <button
          onClick={centerToUser}
          disabled={locating}
          className="absolute top-4 right-4 bg-white shadow-lg rounded-full p-2 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          title="Minha localização"
        >
          <Navigation className="w-5 h-5" />
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-white text-sm">
        <div className="mb-2 flex items-center text-gray-700">
          <MapPin className="w-4 h-4 text-red-500 mr-1" />
          {address || "Nenhum endereço selecionado"}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-3 font-medium hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleUsePoint}
            className="flex-1 bg-blue-500 text-white rounded-xl py-3 font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={!position}
          >
            Usar este ponto
          </button>
        </div>
      </div>
    </div>
  );
}
