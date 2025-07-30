"use client";

import React from 'react';
import { useRouter } from "next/router";
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
  Heart
} from 'lucide-react';
import { lojas } from "../lojas"; // Ajuste o caminho se necessário

export default function LojaDetalhes() {
  const router = useRouter();
  const { id } = router.query;

  // Procura a loja com base no ID
  const loja = lojas.find((l) => l.id === Number(id));

  if (!loja) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loja não encontrada</h2>
          <p className="text-gray-600 mb-4">A loja que você procura não existe.</p>
          <Link href="/" className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  // Funções utilitárias
  const handleWhatsApp = () => {
    const phone = loja.phone?.replace(/\D/g, ''); // Remove caracteres não numéricos
    const message = `Olá! Encontrei vocês através do app e gostaria de mais informações sobre ${loja.name}.`;
    const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleWebsite = () => {
    if (loja.website) {
      window.open(loja.website, '_blank');
    }
  };

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${loja.lat},${loja.lng}`;
    window.open(url, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: loja.name,
          text: `Confira ${loja.name} - ${loja.desc}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      {/* Header com foto da loja */}
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
        
        {/* Botões de ação no header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button 
            onClick={() => router.back()}
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

        {/* Logo da loja */}
        <div className="absolute -bottom-8 left-4">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
            {loja.logo ? (
              <img 
                src={loja.logo} 
                alt={`${loja.name} logo`}
                className="w-12 h-12 rounded-xl object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-blue-500">
                {loja.name.charAt(0)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="pt-12 px-4 pb-24">
        {/* Informações básicas */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900 flex-1 mr-2">{loja.name}</h1>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Aberto
            </span>
          </div>
          
          <p className="text-gray-600 mb-2">{loja.desc}</p>
          <p className="text-blue-600 font-medium mb-2">{loja.type}</p>
          
          {/* Avaliação */}
          <div className="flex items-center mb-3">
            <div className="flex mr-2">
              {renderStars(loja.rating || 4)}
            </div>
            <span className="text-sm text-gray-600">
              {loja.rating || 4}.0 • {loja.reviews || 127} avaliações
            </span>
          </div>

          {/* Distância */}
          <div className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{loja.distance}</span>
          </div>
        </div>

        {/* Botões de ação principais */}
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

        {/* Informações de contato */}
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
            <span className="text-gray-700">{loja.hours || 'Seg-Sex: 9h-18h'}</span>
          </div>
        </div>

        {/* Localização */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Localização</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{loja.address || 'Endereço não informado'}</p>
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

        {/* Descrição adicional */}
        {loja.description && (
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-bold text-gray-900 mb-3">Sobre</h3>
            <p className="text-gray-700 leading-relaxed">{loja.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}