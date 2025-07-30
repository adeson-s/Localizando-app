"use client";

import React from "react";
import { useAuth } from "../hooks/useAuth";
import {
  User, MapPin, Heart, Settings, Store, Edit3, BarChart3, Package, Star,
  Bell, HelpCircle, LogOut, Camera, ChevronRight, Shield, CreditCard, Globe,
  Users, Calendar, Eye
} from 'lucide-react';

export default function Perfil() {
  const {
    user,
    isGuest,
    isLojista,
    isAuthenticated,
    logout,
    loginUser,
    loginLojista,
    loginGuest,
  } = useAuth();

  // Exemplo de dados (traga do backend depois)
  const profileData = {
    name: user?.name || "Convidado",
    email: user?.email || "",
    avatar: null,
    favoriteCount: 12,
    reviewCount: 8,
    storeName: "Loja do João",
    storeCategory: "Restaurante",
    storeRating: 4.5,
    storeViews: 1250,
    storeProducts: 25
  };

  const menuItemsUsuario = [
    { id: 'profile', title: 'Meu Perfil', subtitle: 'Informações pessoais', icon: User, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 'address', title: 'Meu Endereço', subtitle: 'Localização e entrega', icon: MapPin, color: 'text-green-500', bgColor: 'bg-green-50' },
    { id: 'favorites', title: 'Meus Favoritos', subtitle: `${profileData.favoriteCount} lojas favoritadas`, icon: Heart, color: 'text-red-500', bgColor: 'bg-red-50' },
    { id: 'reviews', title: 'Minhas Avaliações', subtitle: `${profileData.reviewCount} avaliações feitas`, icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    { id: 'notifications', title: 'Notificações', subtitle: 'Preferências de notificação', icon: Bell, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { id: 'settings', title: 'Configurações', subtitle: 'Privacidade e conta', icon: Settings, color: 'text-gray-500', bgColor: 'bg-gray-50' }
  ];

  const menuItemsLojista = [
    { id: 'store-profile', title: 'Meu Cadastro', subtitle: 'Informações da loja', icon: Store, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 'edit-store', title: 'Editar Loja', subtitle: 'Fotos, descrição, horários', icon: Edit3, color: 'text-green-500', bgColor: 'bg-green-50' },
    { id: 'analytics', title: 'Estatísticas', subtitle: `${profileData.storeViews} visualizações`, icon: BarChart3, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { id: 'products', title: 'Produtos/Serviços', subtitle: `${profileData.storeProducts} itens cadastrados`, icon: Package, color: 'text-orange-500', bgColor: 'bg-orange-50' },
    { id: 'customers', title: 'Clientes', subtitle: 'Avaliações e feedback', icon: Users, color: 'text-pink-500', bgColor: 'bg-pink-50' },
    { id: 'schedule', title: 'Horário de Funcionamento', subtitle: 'Definir disponibilidade', icon: Calendar, color: 'text-indigo-500', bgColor: 'bg-indigo-50' },
    { id: 'website', title: 'Site e Redes Sociais', subtitle: 'Links externos', icon: Globe, color: 'text-cyan-500', bgColor: 'bg-cyan-50' },
    { id: 'payment', title: 'Pagamento', subtitle: 'Formas de pagamento aceitas', icon: CreditCard, color: 'text-emerald-500', bgColor: 'bg-emerald-50' }
  ];

  const bottomMenuItems = [
    { id: 'help', title: 'Ajuda e Suporte', icon: HelpCircle, color: 'text-gray-500' },
    { id: 'privacy', title: 'Privacidade', icon: Shield, color: 'text-gray-500' },
    { id: 'logout', title: 'Sair', icon: LogOut, color: 'text-red-500' }
  ];

  const currentMenuItems = isLojista ? menuItemsLojista : menuItemsUsuario;

  const handleMenuClick = (itemId) => {
    if (itemId === 'logout') return logout();
    console.log("click:", itemId);
  };

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Perfil</h1>

        {!isAuthenticated && !isLojista ? (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
              G
            </div>
            <p className="mt-2 text-lg">Convidado</p>
            <button
              onClick={loginGuest}
              className="mt-4 w-full bg-white text-gray-700 py-2 rounded-lg font-medium"
            >
              Continuar como Convidado
            </button>
            <a
              href="/auth/login"
              className="mt-2 block w-full bg-white text-blue-600 py-2 rounded-lg font-medium"
            >
              Entrar / Cadastrar
            </a>
            <a
              href="/auth/lojista-login"
              className="mt-2 block w-full bg-white text-green-600 py-2 rounded-lg font-medium"
            >
              Sou Lojista
            </a>
          </div>
        ) : (
          <>
            {/* Foto + info */}
            <div className="flex items-center">
              <div className="relative">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    profileData.name.charAt(0)
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold">{profileData.name}</h2>
                {profileData.email && <p className="text-blue-100">{profileData.email}</p>}
                {isLojista && (
                  <div className="flex items-center">
                    <Store className="w-4 h-4 mr-1" />
                    <span className="text-sm">{profileData.storeName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* stats lojista */}
            {isLojista && (
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white border-opacity-20">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="font-bold">{profileData.storeRating}</span>
                  </div>
                  <p className="text-xs text-blue-100">Avaliação</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="font-bold">{profileData.storeViews}</span>
                  </div>
                  <p className="text-xs text-blue-100">Visualizações</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Package className="w-4 h-4 mr-1" />
                    <span className="font-bold">{profileData.storeProducts}</span>
                  </div>
                  <p className="text-xs text-blue-100">Produtos</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Conteúdo principal */}
      {isAuthenticated || isLojista ? (
        <div className="p-4">
          {/* menu */}
          <div className="space-y-3">
            {currentMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className="w-full flex items-center p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center mr-4`}>
                    <IconComponent className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.subtitle}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              );
            })}
          </div>

          {/* rodapé */}
          <div className="mt-8 pt-6 border-t border-gray-100">
          {bottomMenuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className="w-full flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <IconComponent className={`w-5 h-5 ${item.color} mr-3`} />
                <span className="text-gray-700 font-medium">{item.title}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </button>
            );
          })}
          </div>

          <div className="mt-6">
            <button
              onClick={logout}
              className="w-full bg-red-500 text-white py-2 rounded-lg font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-600">
          Faça login ou cadastre-se para ver mais recursos.
        </div>
      )}
    </div>
  );
}
