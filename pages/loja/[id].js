"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Globe,
  MessageCircle,
  Clock,
  Star,
  Navigation,
  Share2,
  Heart,
} from "lucide-react";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Função para formatar horários
function formatSchedule(schedule) {
  if (!schedule) return "Horário não informado";

  const dias = {
    domingo: "Dom",
    segunda: "Seg",
    terca: "Ter",
    quarta: "Qua",
    quinta: "Qui",
    sexta: "Sex",
    sabado: "Sáb",
  };

  return Object.entries(schedule)
    .filter(([_, val]) => val.enabled)
    .map(([dia, val]) => `${dias[dia]}: ${val.open} - ${val.close}`)
    .join(" • ");
}

export default function LojaDetalhes() {
  const params = useParams();
  const id = params?.id;
  const [loja, setLoja] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca no Firebase
  useEffect(() => {
    async function fetchLoja() {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, "lojas", id.toString());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // Mapeia para o formato que o layout usa
          const lojaFormatada = {
            name: data.storeName || "",
            desc: data.desc || "",
            description: data.description || "",
            phone: data.phone || data.whatsapp || "",
            website: data.website || "",
            lat: data.lat || "",
            lng: data.lng || "",
            logoUrl: data.logoUrl || data.logoPreview || "",
  image: data.imageURL || data.logoUrl || data.logoPreview || "",
            type: data.category || "",
            address: `${data.address || ""}, ${data.neighborhood || ""}, ${data.city || ""} - ${data.state || ""}`,
            hours: formatSchedule(data.schedule),
            rating: data.rating || 4,
            reviews: data.reviews || 0,
            distance: "", // Pode calcular depois
          };

          setLoja(lojaFormatada);

          // REGISTRA VISUALIZAÇÃO
        await fetch("../api/track-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lojaId: id }),
        });
        
        } else {
          setLoja(null);
        }
      } catch (error) {
        console.error("Erro ao buscar loja:", error);
        setLoja(null);
      } finally {
        setLoading(false);
      }
    }

    fetchLoja();
  }, [id]);

  const handleWhatsApp = () => {
    if (!loja?.phone) return;
    const phone = loja.phone.replace(/\D/g, "");
    const message = `Olá! Encontrei vocês através do app e gostaria de mais informações sobre ${loja.name}.`;
    const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleWebsite = () => {
    if (loja?.website) {
      window.open(loja.website, "_blank");
    }
  };

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${loja.lat},${loja.lng}`;
    window.open(url, "_blank");
  };

  const handleShare = async () => {
    if (!loja) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: loja.name,
          text: `Confira ${loja.name} - ${loja.desc}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Erro ao compartilhar:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="max-w-sm mx-auto min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!loja) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Loja não encontrada
          </h2>
          <p className="text-gray-600 mb-4">
            A loja que você procura não existe.
          </p>
          <Link
            href="/"
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      {/* Header com imagem */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
          {loja.image ? (
            <img
              src={loja.image}
              alt={loja.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-6xl">
              {loja.name.charAt(0)}
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Botões */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-100 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-100 transition-all"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
            <button className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-100 transition-all">
              <Heart className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Logo */}
        <div className="absolute -bottom-8 left-4">
          <div className="w-20 h-30 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
            {loja.logoUrl ? (
              <img
                src={loja.logoUrl}
                alt={`${loja.name} logo`}
                className="w-30 h-20 rounded-xl object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-blue-500">
                {loja.name.charAt(0)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="pt-12 px-4 pb-24">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900 flex-1 mr-2">
              {loja.name}
            </h1>

          </div>

          <p className="text-blue-600 font-medium mb-2">{loja.type}</p>

          {/* Avaliação
          <div className="flex items-center mb-3">
            <div className="flex mr-2">
              {renderStars(loja.rating || 4)}
            </div>
            <span className="text-sm text-gray-600">
              {loja.rating || 4}.0 • {loja.reviews || 0} avaliações
            </span>
          </div>  */}

          {/* Distância */}
          {loja.distance && (
            <div className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{loja.distance}</span>
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleWhatsApp}
            className="bg-green-500 text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">WhatsApp</span>
          </button>

          <button
            onClick={handleDirections}
            className="bg-blue-500 text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors"
          >
            <Navigation className="w-5 h-5" />
            <span className="font-medium">Direções</span>
          </button>
        </div>

        {/* Contato */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Contato</h3>

          {loja.phone && (
            <div className="flex items-center mb-3">
              <Phone className="w-5 h-5 text-blue-500 mr-3" />
              <span className="text-gray-700">{loja.phone}</span>
            </div>
          )}

          {loja.website && (
            <button
              onClick={handleWebsite}
              className="flex items-center mb-3 hover:text-blue-600 transition-colors"
            >
              <Globe className="w-5 h-5 text-blue-500 mr-3" />
              <span className="text-gray-700">Visitar site</span>
            </button>
          )}

          <div className="flex items-center">
            <Clock className="w-5 h-5 text-blue-500 mr-3" />
            <span className="text-gray-700">{loja.hours}</span>
          </div>
        </div>

        {/* Localização */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Localização</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{loja.address || "Endereço não informado"}</p>
            <p>Lat: {loja.lat}</p>
            <p>Lng: {loja.lng}</p>
          </div>

          <Link
            href="/mapa"
            className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <MapPin className="w-4 h-4 mr-1" />
            Ver no mapa
          </Link>
        </div>

        {/* Sobre */}
        {loja.desc && (
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-bold text-gray-900 mb-3">Sobre</h3>
            <p className="text-gray-700 leading-relaxed">
              {loja.desc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
