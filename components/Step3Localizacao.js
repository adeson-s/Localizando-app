"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useLoadScript,
} from "@react-google-maps/api";
import {
  MapPin,
  Info,
  Navigation,
  Keyboard,
  MousePointer2,
} from "lucide-react";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "16px",
};
const defaultCenter = { lat: -23.55052, lng: -46.633308 }; // fallback SP

export default function Step3Localizacao({ form, setForm }) {
  const [mode, setMode] = useState("typing"); // 'typing' | 'map'
  const [marker, setMarker] = useState(() => {
    if (form.lat && form.lng) {
      return { lat: Number(form.lat), lng: Number(form.lng) };
    }
    return defaultCenter;
  });
  const [fetchingGeo, setFetchingGeo] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const autoRef = useRef(null);

  const center = useMemo(() => {
    if (form.lat && form.lng) {
      return { lat: Number(form.lat), lng: Number(form.lng) };
    }
    return marker;
  }, [form.lat, form.lng, marker]);

  const getComponent = (components, type) =>
    components.find((c) => c.types.includes(type))?.long_name || "";

  const fillAddressFromPlace = (place) => {
    if (!place || !place.geometry) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    const components = place.address_components || [];
    const address = [
      getComponent(components, "route"),
      getComponent(components, "street_number"),
    ]
      .filter(Boolean)
      .join(", ");

    const neighborhood =
      getComponent(components, "sublocality") ||
      getComponent(components, "political");
    const city = getComponent(components, "administrative_area_level_2");
    const state = getComponent(components, "administrative_area_level_1");
    const zipCode = getComponent(components, "postal_code");

    setMarker({ lat, lng });
    setForm((f) => ({
      ...f,
      address,
      neighborhood,
      city,
      state,
      zipCode,
      lat,
      lng,
    }));
  };

  const onPlaceChanged = () => {
    const place = autoRef.current?.getPlace();
    fillAddressFromPlace(place);
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      setFetchingGeo(true);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&language=pt-BR`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.status === "OK" && json.results?.length) {
        fillAddressFromPlace(json.results[0]);
      } else {
        setForm((f) => ({ ...f, lat, lng }));
      }
    } catch (e) {
      console.error(e);
      setForm((f) => ({ ...f, lat, lng }));
    } finally {
      setFetchingGeo(false);
    }
  };

  const onMapClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });
      reverseGeocode(lat, lng);
    },
    [reverseGeocode]
  );

  const centerOnUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMarker({ lat, lng });
        reverseGeocode(lat, lng);
      },
      () => alert("Não foi possível obter sua localização."),
      { enableHighAccuracy: true }
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <MapPin className="w-6 h-6 mr-3 text-orange-500" />
        Localização
      </h2>

      {/* Toggle */}
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode("typing")}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            mode === "typing"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Keyboard className="w-4 h-4" />
          Digitar manualmente
        </button>
        <button
          type="button"
          onClick={() => setMode("map")}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            mode === "map"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <MousePointer2 className="w-4 h-4" />
          Selecionar no mapa
        </button>
      </div>

      {/* Autocomplete */}
      {isLoaded && (
        <div className="mb-4">
          <Autocomplete
            onLoad={(ref) => (autoRef.current = ref)}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Pesquisar endereço (Google Places)"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
            />
          </Autocomplete>
        </div>
      )}

      {/* MAP MODE */}
      {mode === "map" && (
        <div className="space-y-4">
          {!isLoaded ? (
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-600">
              Carregando mapa...
            </div>
          ) : (
            <div className="relative">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={form.lat && form.lng ? 16 : 13}
                center={center}
                onClick={onMapClick}
              >
                <Marker position={marker} />
              </GoogleMap>

              <button
                type="button"
                onClick={centerOnUser}
                className="absolute top-3 right-3 bg-white text-gray-600 shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
                title="Minha localização"
              >
                <Navigation className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="md:col-span-2 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="flex items-center space-x-2 text-blue-700 mb-2">
            <Info className="w-5 h-5" />
            <span className="font-medium text-sm">Dica:</span>
          </div>
          <p className="text-sm text-blue-600">
            Clique no mapa para posicionar o marcador. O endereço será preenchido automaticamente (você pode editar depois).
          </p>
        </div>
        </div>
      )}

      {/* Campos */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Endereço completo *
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rua, número, complemento"
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Bairro *</label>
          <input
            type="text"
            placeholder="Nome do bairro"
            value={form.neighborhood}
            onChange={(e) =>
              setForm((f) => ({ ...f, neighborhood: e.target.value }))
            }
            className="w-full px-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Cidade *</label>
          <input
            type="text"
            placeholder="Nome da cidade"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            className="w-full px-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Estado *</label>
          <input
            type="text"
            placeholder="UF"
            value={form.state}
            onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
            className="w-full px-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">CEP</label>
          <input
            type="text"
            placeholder="00000-000"
            value={form.zipCode}
            onChange={(e) => setForm((f) => ({ ...f, zipCode: e.target.value }))}
            className="w-full px-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Latitude</label>
          <input
            type="text"
            placeholder="-23.550520"
            value={form.lat}
            onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
            className="w-full px-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Longitude</label>
          <input
            type="text"
            placeholder="-46.633308"
            value={form.lng}
            onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
            className="w-full px-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
          />
        </div>
      </div>

      {fetchingGeo && (
        <div className="mt-4 text-sm text-gray-500">
          Buscando endereço para as coordenadas…
        </div>
      )}

      
    </div>
  );
}
