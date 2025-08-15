"use client";

import React, { useState, useEffect } from "react";
import mockEventos from "../lib/lojas";
import { useAuth } from "../hooks/useAuth";
import Link from "next/link";
import { 
  MapPin, 
  Calendar, 
  Plus, 
  Heart, 
  MessageCircle, 
  Share2, 
  User, 
  Clock,
  Users,
  Filter,
  Search,
  Home,
  Play,
  MoreHorizontal,
  ChevronDown,
  Navigation,
  Bookmark,
  LogIn,
  UserPlus,
  X
} from "lucide-react";



export default function EventosPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [eventos, setEventos] = useState(mockEventos);
  const { user, loading } = useAuth();
const isLoggedIn = !!user; 
const currentUserId = 1;

  // Pegar localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Erro ao pegar localização", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const calcDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return 'agora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const formatEventDate = (dateString) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((eventDate - now) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Amanhã';
    if (diffInDays < 7) return `Em ${diffInDays} dias`;
    
    return eventDate.toLocaleDateString("pt-BR", {
      day: 'numeric',
      month: 'short',
      year: eventDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Função para lidar com criação de evento (com verificação de login)
  const handleCreateEvent = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    // Se estiver logado, redireciona para criar evento
    window.location.href = '/eventos/novo';
  };

  // Função para ações que requerem login
  const handleAuthRequired = (action, eventoId) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    // Executa a ação se estiver logado
    action(eventoId);
  };

  const handleLike = (eventoId) => {
    setEventos(eventos.map(evento => 
      evento.id === eventoId 
        ? { 
            ...evento, 
            isLiked: !evento.isLiked,
            curtidas: evento.isLiked ? evento.curtidas - 1 : evento.curtidas + 1
          }
        : evento
    ));
  };

  const handleSave = (eventoId) => {
    setEventos(eventos.map(evento => 
      evento.id === eventoId 
        ? { ...evento, isSaved: !evento.isSaved }
        : evento
    ));
  };

  const handleInterested = (eventoId) => {
    setEventos(eventos.map(evento => 
      evento.id === eventoId 
        ? { 
            ...evento, 
            isInterested: !evento.isInterested,
            interessados: evento.isInterested ? evento.interessados - 1 : evento.interessados + 1
          }
        : evento
    ));
  };

  const handleShare = async (evento) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: evento.descricao,
          text: `Confira este evento: ${evento.descricao}`,
          url: window.location.href,
        });
        setEventos(eventos.map(e => 
          e.id === evento.id 
            ? { ...e, compartilhamentos: e.compartilhamentos + 1 }
            : e
        ));
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    }
  };

  const abrirNoMapa = (evento) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${evento.lat},${evento.lng}`;
    window.open(url, "_blank");
  };

  const getCategoryColor = (categoria) => {
    const colors = {
      'Gastronomia': 'bg-orange-100 text-orange-800',
      'Cultura': 'bg-purple-100 text-purple-800',
      'Esporte': 'bg-green-100 text-green-800',
      'Música': 'bg-blue-100 text-blue-800',
      'Arte': 'bg-pink-100 text-pink-800'
    };
    return colors[categoria] || 'bg-gray-100 text-gray-800';
  };

  const filteredEventos = eventos.filter(evento => {
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      if (!evento.descricao.toLowerCase().includes(searchLower) &&
          !evento.categoria.toLowerCase().includes(searchLower) &&
          !evento.local.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    const eventDate = new Date(evento.dataEvento);
    const now = new Date();
    const diffInDays = Math.floor((eventDate - now) / (1000 * 60 * 60 * 24));

    switch (selectedFilter) {
      case 'hoje':
        return diffInDays === 0;
      case 'semana':
        return diffInDays >= 0 && diffInDays <= 7;
      case 'mes':
        return diffInDays >= 0 && diffInDays <= 30;
      default:
        return diffInDays >= 0;
    }
  });

  return (
    <div className="max-w-sm mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
          
          {/* Botão de criar evento com verificação de login */}
          <div className="relative">
            <button
              onClick={handleCreateEvent}
              className={`w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform ${
                !isLoggedIn ? 'relative' : ''
              }`}
              title={!isLoggedIn ? "Faça login para criar eventos" : "Criar novo evento"}
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
            
            {/* Indicador visual quando não logado */}
            {!isLoggedIn && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Aviso para usuário não logado */}
        {!isLoggedIn && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-amber-800 font-medium">Entre na sua conta</p>
                <p className="text-xs text-amber-600">Para criar eventos e interagir</p>
              </div>
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                Entrar
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-3">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar eventos..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
          />
        </div>

        {/* Filtros */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {[
            { key: 'todos', label: 'Todos' },
            { key: 'hoje', label: 'Hoje' },
            { key: 'semana', label: 'Esta semana' },
            { key: 'mes', label: 'Este mês' }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === filter.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de eventos */}
      <div className="p-4 pb-24">
        {filteredEventos.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-600 mb-4">Tente ajustar seus filtros de busca</p>
            <button
              onClick={handleCreateEvent}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              {isLoggedIn ? 'Criar primeiro evento' : 'Entrar para criar eventos'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEventos.map((evento) => (
              <div key={evento.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Header do post */}
                <div className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {evento.usuario.foto ? (
                            <img
                              src={evento.usuario.foto}
                              alt={evento.usuario.nome}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            evento.usuario.nome.charAt(0)
                          )}
                        </div>
                        {evento.usuario.verificado && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-bold text-gray-900 text-sm">{evento.usuario.nome}</h3>
                        <p className="text-xs text-gray-500">{formatTimeAgo(evento.dataPost)}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Imagem do evento */}
                {evento.fotoEvento && (
                  <div className="relative">
                    <img
                      src={evento.fotoEvento}
                      alt="Evento"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(evento.categoria)}`}>
                        {evento.categoria}
                      </span>
                    </div>
                    {userLocation && (
                      <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                        {calcDistance(userLocation.lat, userLocation.lng, evento.lat, evento.lng).toFixed(1)} km
                      </div>
                    )}
                  </div>
                )}

                {/* Conteúdo do evento */}
                <div className="p-4">
                  <p className="text-gray-800 mb-3 leading-relaxed">{evento.descricao}</p>

                  {/* Informações do evento */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-3">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-700 font-medium">
                        {formatEventDate(evento.dataEvento)} • {new Date(evento.dataEvento).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-sm text-gray-700 flex-1">{evento.local}</span>
                      <button
                        onClick={() => abrirNoMapa(evento)}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <Navigation className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm text-gray-600">{evento.participantes}</span>
                        </div>
                        <span className="text-sm font-medium text-blue-600">{evento.preco}</span>
                      </div>
                    </div>
                  </div>

                  {/* Estatísticas */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{evento.curtidas} curtidas</span>
                    <span>{evento.comentarios} comentários • {evento.compartilhamentos} compartilhamentos</span>
                  </div>

                  {/* Botões de ação com verificação de login */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleAuthRequired(handleLike, evento.id)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-colors ${
                          evento.isLiked 
                            ? 'bg-red-50 text-red-500' 
                            : 'hover:bg-gray-50 text-gray-600'
                        } ${!isLoggedIn ? 'opacity-75' : ''}`}
                        title={!isLoggedIn ? "Faça login para curtir" : ""}
                      >
                        <Heart className={`w-4 h-4 ${evento.isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">Curtir</span>
                      </button>
                      <button 
                        onClick={() => !isLoggedIn && setShowAuthModal(true)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-full hover:bg-gray-50 text-gray-600 transition-colors ${!isLoggedIn ? 'opacity-75' : ''}`}
                        title={!isLoggedIn ? "Faça login para comentar" : ""}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Comentar</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleAuthRequired(handleInterested, evento.id)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                          evento.isInterested
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        } ${!isLoggedIn ? 'opacity-75' : ''}`}
                        title={!isLoggedIn ? "Faça login para mostrar interesse" : ""}
                      >
                        {evento.isInterested ? 'Interessado' : 'Tenho interesse'}
                      </button>
                      <button
                        onClick={() => handleAuthRequired(handleSave, evento.id)}
                        className={`p-2 rounded-full transition-colors ${
                          evento.isSaved 
                            ? 'bg-yellow-50 text-yellow-600' 
                            : 'hover:bg-gray-50 text-gray-600'
                        } ${!isLoggedIn ? 'opacity-75' : ''}`}
                        title={!isLoggedIn ? "Faça login para salvar" : ""}
                      >
                        <Bookmark className={`w-4 h-4 ${evento.isSaved ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleShare(evento)}
                        className="p-2 rounded-full hover:bg-gray-50 text-gray-600 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Autenticação */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Entre na sua conta</h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600">
                Você precisa estar logado para criar eventos e interagir com outros usuários
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="../auth/login"
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-full font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
                onClick={() => setShowAuthModal(false)}
              >
                <LogIn className="w-5 h-5 mr-2" />
                Fazer Login
              </Link>
              <Link
                href="../auth/register"
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                onClick={() => setShowAuthModal(false)}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Criar Conta
              </Link>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Ao continuar, você concorda com nossos Termos de Uso
            </p>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200">
        <div className="flex justify-around py-3">
          <button className="flex flex-col items-center p-2">
            <Search className="w-6 h-6 text-gray-400" />
          </button>
          <button className="flex flex-col items-center p-2">
            <Home className="w-6 h-6 text-gray-400" />
          </button>
          <button className="flex flex-col items-center p-2">
            <Play className="w-6 h-6 text-blue-500" />
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
      `}</style>
    </div>
  );
}