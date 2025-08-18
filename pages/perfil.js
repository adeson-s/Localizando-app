"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  User, MapPin, Heart, Settings, Store, Edit3, BarChart3, Package, Star,
  Bell, HelpCircle, LogOut, Camera, ChevronRight, Shield, CreditCard, Globe,
  Users, Calendar, Eye, LogIn
} from 'lucide-react';
import Link from 'next/link';


export default function Perfil() {
  const { user, isGuest, isLojista, isAuthenticated, logout, loginGuest } = useAuth();
  const [storeData, setStoreData] = useState(null);

  // Função para formatar horários
  const formatSchedule = (schedule) => {
    if (!schedule) return "";
    return Object.entries(schedule)
      .map(([day, hours]) => `${day}: ${hours}`)
      .join(" | ");
  };

  // Busca a loja do lojista logado
  useEffect(() => {
    const fetchStore = async () => {
      if (!isLojista || !user?.storeId) return;

      try {
        const storeRef = doc(db, "lojas", user.storeId);
        const storeSnap = await getDoc(storeRef);

        if (storeSnap.exists()) {
          const data = storeSnap.data();

          const lojaFormatada = {
            nameLoja: data.storeName || "",
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
            hours: data.schedule ? formatSchedule(data.schedule) : "",
            rating: data.rating || 4,
            reviews: data.reviews || 0,
            distance: "",
          };

          setStoreData(lojaFormatada);
        }
      } catch (error) {
        console.error("Erro ao buscar loja:", error);
      }
    };

    fetchStore();
  }, [isLojista, user?.storeId]);

  // Dados para o perfil
  const profileData = {
    name: user?.name || "Convidado",
    email: user?.email || "",
    avatar: storeData?.logoUrl || null,
    favoriteCount: 12,
    reviewCount: 8,
    nameLoja: storeData?.nameLoja || "",
    storeCategory: storeData?.type || "",
    storeRating: storeData?.rating || 4.5,
    storeViews: "",
    storeProducts: 25
  };

  const menuItemsUsuario = [
    { id: 'profile', title: 'Meu Perfil', subtitle: 'Informações pessoais', icon: User, color: 'text-blue-500', bgColor: 'bg-blue-50' },    
    
    { id: 'favorites', title: 'Meus Favoritos', subtitle: `${profileData.favoriteCount} lojas favoritadas`, icon: Heart, color: 'text-red-500', bgColor: 'bg-red-50' },
    
    { id: 'reviews', title: 'Minhas Avaliações', subtitle: `${profileData.reviewCount} avaliações feitas`, icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    
    //{ id: 'notifications', title: 'Notificações', subtitle: 'Preferências de notificação', icon: Bell, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    
    //{ id: 'settings', title: 'Configurações', subtitle: 'Privacidade e conta', icon: Settings, color: 'text-gray-500', bgColor: 'bg-gray-50' }

  ];

  const menuItemsLojista = [
    { id: 'manage-store', title: 'Gerenciar Loja', subtitle: 'Cadastro, edição e horários', icon: Store, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 'estatisticas', title: 'Estatísticas', subtitle: `${profileData.storeViews} visualizações`, icon: BarChart3, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    //{ id: 'customers', title: 'Clientes', subtitle: 'Avaliações e feedback', icon: Users, color: 'text-pink-500', bgColor: 'bg-pink-50' },
    //{ id: 'website', title: 'Site e Redes Sociais', subtitle: 'Links externos', icon: Globe, color: 'text-cyan-500', bgColor: 'bg-cyan-50' },
  ];

  const bottomMenuItems = [
    { id: 'help', title: 'Ajuda e Suporte', icon: HelpCircle, color: 'text-gray-500' },
    { id: 'politica-privacidade', title: 'Privacidade', icon: Shield, color: 'text-gray-500' },
  ];

  const currentMenuItems = isLojista ? menuItemsLojista : menuItemsUsuario;

  const handleMenuClick = (itemId) => {
    if (itemId === 'logout') return logout();
    console.log("click:", itemId);
  };

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 p-8 text-white relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-white bg-opacity-5 backdrop-blur-sm"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-8 text-center">Meu Perfil</h1>

          {!isAuthenticated && !isLojista ? (
            <div className="text-center max-w-md mx-auto">
              {/* Avatar melhorado */}
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white border-opacity-30 shadow-lg">
                  <User className="w-10 h-10 text-white opacity-80" />
                </div>                
              </div>

              {/* Status do usuário */}
              <div className="mb-6">
                <p className="text-xl font-semibold mb-2">Visitante</p>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Faça login para acessar recursos exclusivos e personalizar sua experiência
                </p>
              </div>

              {/* Botão de ação principal */}
              <a
                href="/auth/login"
                className="inline-flex items-center justify-center gap-3 w-full bg-white text-blue-600 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
              >
                <LogIn className="w-5 h-5" />
                Entrar / Cadastrar
              </a>


<div className="p-4">
          {/* Benefícios */}
          <div className="mt-6 p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20">
  <p className="text-sm font-medium mb-2">Ao fazer login, você poderá:</p>
  <ul className="text-xs space-y-1 text-blue-100">
    <li>✓ Favoritar lojas locais</li>
    <li>✓ Criar e divulgar seus próprios eventos</li>
    <li>____________________________________</li>
    <li>✓ Cadastrar sua loja (para lojistas)</li>
    <li>✓ Acompanhar estatísticas da loja</li>
  </ul>
  <p className="text-xs text-blue-100 mt-5">
    Novos recursos estão a caminho — fique ligado!
  </p>
</div></div>

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
                  {isLojista && profileData && (
                    <div className="flex items-center">
                      <Store className="w-4 h-4 mr-1" />
                      <span className="text-sm">{profileData.nameLoja}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 
              stats lojista
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
              */}

            </>
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      {isAuthenticated || isLojista ? (
        <div className="p-4">
          {/* menu */}
          <div className="space-y-3">

            {currentMenuItems.map((item) => {
              const IconComponent = item.icon;

              // Define a rota com base no tipo de usuário
              const basePath = isLojista ? '/lojista' : '/usuario';
              const href = `${basePath}/${item.id}`;

              return (
                <Link
                  key={item.id}
                  href={href}
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
                </Link>
              );
            })}
          </div>

          {/* rodapé */}
          <div className="mt-8 pt-6 border-t border-gray-100">

 {bottomMenuItems.map((item) => {
              const IconComponent = item.icon;

              // Define a rota com base no tipo de usuário
              const basePath = isLojista ? '/termos' : '/termos';
              const href = `${basePath}/${item.id}`;

              return (
                <Link
                  key={item.id}
                  href={href}
                  className="w-full flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                 
                    <IconComponent className={`w-5 h-5 ${item.color} mr-3`} />
                  <span className="text-gray-700 font-medium">{item.title}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                </Link>
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
        <></>
      )}
    </div>
  );
}
