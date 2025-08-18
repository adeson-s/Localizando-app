"use client";
import React, { useState } from "react";
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  Search,
  ArrowLeft,
  Star,
  Clock,
  Users,
  BookOpen,
  Video,
  FileText,
  Shield,
  Settings,
  MessageSquare,
  Headphones,
  Globe,
  Smartphone,
  MapPin,
  User,
  Store,
  CreditCard,
  Bell
} from "lucide-react";

export default function AjudaSuporte() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("faq");

  const faq = [
    {
      pergunta: "Como encontro lojas próximas?",
      resposta: "Basta permitir acesso à sua localização e o app mostrará as lojas mais perto de você no mapa. Você também pode buscar por categoria.",
      categoria: "navegacao"
    },
    {
      pergunta: "Como alterar meus dados de perfil?",
      resposta: "Vá até a aba de Perfil, clique em 'Meu Perfil' e salve as alterações desejadas. Você pode alterar foto, nome, telefone e preferências.",
      categoria: "perfil"
    },
    {
      pergunta: "Posso cadastrar minha loja?",
      resposta: "Sim! Caso seja lojista, vá em 'Cadastrar Loja' no Login e siga o passo a passo. É necessário ter CNPJ ativo.",
      categoria: "lojista"
    },
    
       
  ];

  const guias = [
    { titulo: "Primeiros Passos", icone: Smartphone, descricao: "Configure seu perfil e descubra o app" },
    { titulo: "Encontrar Lojas", icone: MapPin, descricao: "Localize estabelecimentos próximos" },
    { titulo: "Gerenciar Perfil", icone: User, descricao: "Edite suas informações pessoais" },
    { titulo: "Para Lojistas", icone: Store, descricao: "Como cadastrar e gerenciar sua loja" }
  ];

  const recursos = [
    
    { titulo: "Tutoriais em Vídeo", icone: Video, link: "/tutoriais" },
    { titulo: "Comunidade", icone: Users, link: "/comunidade" },
    { titulo: "Status do Sistema", icone: Settings, link: "/status" }
  ];

  const filteredFAQ = faq.filter(item =>
    item.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.resposta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Ajuda & Suporte</h1>
                  <p className="text-sm text-gray-500">Estamos aqui para ajudar você</p>
                </div>
              </div>
            </div>            
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        
        {/* Barra de Pesquisa 
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Pesquisar na central de ajuda..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        */}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-blue-600" />
            Contato Rápido
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a
              href="mailto:suporte@localizando.com"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all group"
            >
              <div className="bg-blue-100 p-2 rounded-full group-hover:bg-blue-200 transition-colors">
                <Mail className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-800">Email</div>
                <div className="text-sm text-gray-500">Resposta em 24h</div>
              </div>
            </a>
            
            <a
              href="https://wa.me/5521999999999"
              target="_blank"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all group"
            >
              <div className="bg-green-100 p-2 rounded-full group-hover:bg-green-200 transition-colors">
                <MessageCircle className="text-green-600 w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-800">WhatsApp</div>
                <div className="text-sm text-gray-500">Online agora</div>
              </div>
            </a>
            
            <a
              href="tel:+5521999999999"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all group"
            >
              <div className="bg-purple-100 p-2 rounded-full group-hover:bg-purple-200 transition-colors">
                <Phone className="text-purple-600 w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-800">Telefone</div>
                <div className="text-sm text-gray-500">Seg-Sex 8h-18h</div>
              </div>
            </a>
          </div>
        </div>

        {/* Guias Rápidos */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Guias Rápidos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guias.map((guia, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="bg-purple-100 p-2 rounded-full mt-1">
                  <guia.icone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{guia.titulo}</h3>
                  <p className="text-sm text-gray-500 mt-1">{guia.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "faq" 
                    ? "border-blue-500 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("faq")}
              >
                Perguntas Frequentes
              </button>
              <button
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "recursos" 
                    ? "border-blue-500 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("recursos")}
              >
                Recursos
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "faq" && (
              <div className="space-y-3">
                {searchTerm && (
                  <div className="mb-4 text-sm text-gray-600">
                    {filteredFAQ.length} resultado(s) encontrado(s) para "{searchTerm}"
                  </div>
                )}
                {filteredFAQ.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="flex justify-between items-center w-full text-left p-4 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800 pr-4">{item.pergunta}</span>
                      {openIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {openIndex === index && (
                      <div className="px-4 pb-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-gray-700">{item.resposta}</p>
                          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                              <Star className="w-4 h-4" />
                              Útil
                            </button>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Atualizado há 2 dias
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "recursos" && (
              <div className="space-y-4">
                {recursos.map((recurso, index) => (
                  <a
                    key={index}
                    href={recurso.link}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <recurso.icone className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{recurso.titulo}</h3>
                      <p className="text-sm text-gray-500">Acesse recursos adicionais de ajuda</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-600" />
            Informações Legais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/termos/politica-privacidade" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <FileText className="w-4 h-4" />
              Política de Privacidade
            </a>
            <a href="/termos/termos-uso" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <FileText className="w-4 h-4" />
              Termos de Uso
            </a>
            <a href="/termos/cookies" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <Settings className="w-4 h-4" />
              Política de Cookies
            </a>            
          </div>
        </div>
        </div>
    </div>
  );
}