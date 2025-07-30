"use client";

import React, { useState, useEffect } from "react";
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
  Bookmark
} from "lucide-react";

// Simulação de login
const isLoggedIn = true; // Mude para false para testar
const currentUserId = 1; // ID do usuário logado

export default function EventosPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todos"); // todos, hoje, semana, mes
  const [eventos, setEventos] = useState([
    {
      id: 1,
      usuario: { 
        id: 2,
        nome: "João Silva", 
        foto: "/user1.jpg",
        verificado: true 
      },
      fotoEvento: "/evento1.jpg",
      descricao: "Festival de Comida de Rua com música ao vivo! Venha experimentar pratos deliciosos de diversos restaurantes locais. Haverá apresentações musicais durante todo o evento.",
      dataEvento: "2025-08-10 15:00",
      local: "Praça Central, Maricá",
      lat: -22.918,
      lng: -42.819,
      dataPost: "2025-07-25 12:00",
      categoria: "Gastronomia",
      preco: "Gratuito",
      participantes: 45,
      interessados: 128,
      curtidas: 23,
      comentarios: 8,
      compartilhamentos: 5,
      isLiked: false,
      isSaved: false,
      isInterested: false
    },
    {
      id: 2,
      usuario: { 
        id: 3,
        nome: "Maria Souza", 
        foto: "/user2.jpg",
        verificado: false 
      },
      fotoEvento: "/evento2.jpg",
      descricao: "Feira de Artesanato e Produtos Locais. Encontre peças únicas feitas por artesãos da região!",
      dataEvento: "2025-08-15 09:00",
      local: "Orla da Praia, Maricá",
      lat: -22.921,
      lng: -42.827,
      dataPost: "2025-07-20 10:00",
      categoria: "Cultura",
      preco: "R$ 10,00",
      participantes: 32,
      interessados: 89,
      curtidas: 18,
      comentarios: 12,
      compartilhamentos: 3,
      isLiked: true,
      isSaved: true,
      isInterested: true
    },
    {
      id: 3,
      usuario: { 
        id: 4,
        nome: "Pedro Costa", 
        foto: "/user3.jpg",
        verificado: true 
      },
      fotoEvento: "/evento3.jpg",
      descricao: "Corrida pela Saúde - 5km e 10km. Inscrições abertas! Todos os níveis são bem-vindos.",
      dataEvento: "2025-07-28 07:00",
      local: "Parque da Cidade, Maricá",
      lat: -22.915,
      lng: -42.825,
      dataPost: "2025-07-26 14:00",
      categoria: "Esporte",
      preco: "R$ 25,00",
      participantes: 78,
      interessados: 156,
      curtidas: 34,
      comentarios: 15,
      compartilhamentos: 9,
      isLiked: false,
      isSaved: false,
      isInterested: false
    }
  ]);

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
    // Filtro de busca
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      if (!evento.descricao.toLowerCase().includes(searchLower) &&
          !evento.categoria.toLowerCase().includes(searchLower) &&
          !evento.local.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Filtro de data
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
          {isLoggedIn && (
            <Link
              href="/eventos/novo"
              className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5 text-white" />
            </Link>
          )}
        </div>

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
            {isLoggedIn && (
              <Link
                href="/eventos/novo"
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                Criar primeiro evento
              </Link>
            )}
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

                  {/* Botões de ação */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleLike(evento.id)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-colors ${
                          evento.isLiked 
                            ? 'bg-red-50 text-red-500' 
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${evento.isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">Curtir</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-2 rounded-full hover:bg-gray-50 text-gray-600 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Comentar</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleInterested(evento.id)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                          evento.isInterested
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        {evento.isInterested ? 'Interessado' : 'Tenho interesse'}
                      </button>
                      <button
                        onClick={() => handleSave(evento.id)}
                        className={`p-2 rounded-full transition-colors ${
                          evento.isSaved 
                            ? 'bg-yellow-50 text-yellow-600' 
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
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