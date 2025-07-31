"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Search, Star, Clock, Phone, Navigation, Heart, Zap, ArrowRight, CheckCircle } from "lucide-react";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header Hero */}
      <header className="relative px-6 pt-12 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-40 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
        </div>
        
        <div className={`relative z-10 text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/15 backdrop-blur-sm rounded-3xl mb-6 shadow-lg">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Localizando
          </h1>
          <p className="text-xl opacity-90 max-w-lg mx-auto leading-relaxed mb-8">
            Encontre estabelecimentos próximos, horários atualizados e avaliações confiáveis
          </p>
          
          {/* Quick Stats */}
          <div className="flex justify-center space-x-8 text-sm opacity-80">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>2.500+ lojas</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-current" />
              <span>4.7 estrelas</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Features */}
      <section className="relative -mt-12 px-6 mb-16">
        <div className={`bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Descubra, avalie e chegue aos melhores estabelecimentos da sua região com facilidade
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard 
              icon={<Navigation className="w-7 h-7" />} 
              title="Navegação Inteligente" 
              description="Encontra o melhor lugar perto de você, sem complicação."
              color="blue"
              delay="delay-500"
            />
            <FeatureCard 
              icon={<Search className="w-7 h-7" />} 
              title="Busca Avançada" 
              description="Filtre por categoria, distância, horário de funcionamento e avaliações"
              color="green"
              delay="delay-700"
            />
            <FeatureCard 
              icon={<Clock className="w-7 h-7" />} 
              title="Status em Tempo Real" 
              description="Saiba se está aberto, fechado ou com horário especial antes de sair de casa"
              color="orange"
              delay="delay-900"
            />
            <FeatureCard 
              icon={<Phone className="w-7 h-7" />} 
              title="Contato Direto" 
              description="Ligue, acesse o site ou veja redes sociais com apenas um toque"
              color="purple"
              delay="delay-1100"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 mb-16">
        <div className={`text-center mb-10 transform transition-all duration-1000 delay-1300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Por que escolher o Localizando?</h3>
          <p className="text-gray-600">Facilidade e praticidade para o seu dia a dia</p>
        </div>

        <div className="space-y-4">
          <BenefitItem 
            icon={<Zap className="w-5 h-5" />}
            title="Rápido e Eficiente"
            description="Encontre o que precisa em segundos."
            delay="delay-1500"
          />
          <BenefitItem 
            icon={<Heart className="w-5 h-5" />}
            title="Favoritos Personalizados"
            description="Salve seus lugares preferidos para acesso rápido."
            delay="delay-1700"
          />
          <BenefitItem 
            icon={<Star className="w-5 h-5" />}
            title="Avaliações Verificadas"
description="Opiniões reais de usuários para ajudar você a fazer escolhas mais seguras."

            delay="delay-1900"
          />
        </div>
      </section>

      {/* How it Works */}
      <section className="px-6 mb-16">
        <div className={`bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 transform transition-all duration-1000 delay-2100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Como funciona</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Step 
              number="1"
              title="Busque"
              description="Digite o que procura ou navegue por categorias"
            />
            <Step 
              number="2"
              title="Escolha"
              description="Compare opções, veja avaliações e horários"
            />
            <Step 
              number="3"
              title="Vá até lá"
              description="Use nossa navegação integrada para chegar"
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <footer className="px-6 pb-10">
        <div className={`text-center transform transition-all duration-1000 delay-2300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Pronto para começar?</h3>
          <p className="text-gray-600 mb-8">Descubra sua cidade de uma forma totalmente nova</p>
          
          <Link
            href="/buscar"
            className="group inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-12 py-4 rounded-2xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <span>Explorar agora</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <p className="text-xs text-gray-500 mt-6">
            100% gratuito • Disponível em toda região
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, delay }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600"
  };

  return (
    <div className={`group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${delay} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className={`inline-flex p-3 rounded-xl ${colorClasses[color]} mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h4 className="text-xl font-bold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function BenefitItem({ icon, title, description, delay }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors ${delay} ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
      <div className="flex-shrink-0 p-2 bg-blue-100 text-blue-600 rounded-lg">
        {icon}
      </div>
      <div>
        <h5 className="font-semibold text-gray-800 mb-1">{title}</h5>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white font-bold rounded-full mb-4">
        {number}
      </div>
      <h4 className="text-lg font-bold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}