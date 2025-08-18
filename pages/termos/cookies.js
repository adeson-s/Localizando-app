"use client";
import React, { useState } from "react";
import { 
  Cookie, 
  ArrowLeft, 
  Layers, 
  Settings, 
  BarChart, 
  Target, 
  Mail, 
  Calendar,
  CheckCircle,
  Eye,
  Clock,
  Download,
  Share2,
  Smartphone,
  Shield,
  Users,
  Globe,
  BookOpen,
  HelpCircle,
  Zap,
  Sliders,
  Activity,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Info,
  Trash2,
  RefreshCw
} from "lucide-react";
import { useRouter } from 'next/router';

export default function PoliticaCookies() {
  const [activeSection, setActiveSection] = useState(null);
  const [cookieSettings, setCookieSettings] = useState({
    essential: true, // sempre ativo
    performance: true,
    functionality: true,
    advertising: false
  });
  const router = useRouter();
  const sections = [
    {
      id: 1,
      icon: Info,
      title: "O que são Cookies?",
      content: "Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site ou utiliza um aplicativo. Eles ajudam a reconhecer seu dispositivo e a melhorar a experiência de navegação.",
      details: [
        "Arquivos de texto pequenos e seguros",
        "Armazenados localmente no seu dispositivo",
        "Não contêm informações pessoais sensíveis",
        "Facilitam o funcionamento do aplicativo",
        "Podem ser gerenciados pelo usuário"
      ],
      importance: "high"
    },
    {
      id: 2,
      icon: Layers,
      title: "Como utilizamos Cookies",
      content: "Utilizamos cookies para lembrar suas preferências, melhorar o desempenho do aplicativo, analisar métricas de uso e oferecer conteúdo personalizado.",
      details: [
        "Memorização de preferências do usuário",
        "Otimização de performance do app",
        "Análise de padrões de uso",
        "Personalização de conteúdo",
        "Melhoria contínua da experiência"
      ],
      importance: "medium"
    },
    {
      id: 3,
      icon: Cookie,
      title: "Tipos de Cookies que usamos",
      content: "Utilizamos diferentes tipos de cookies para várias finalidades, cada um com sua função específica na melhoria da sua experiência.",
      details: [
        "Cookies Essenciais: funcionamento básico",
        "Cookies de Desempenho: análise de uso",
        "Cookies de Funcionalidade: suas preferências",
        "Cookies de Publicidade: anúncios relevantes"
      ],
      importance: "high"
    },
    {
      id: 4,
      icon: Sliders,
      title: "Como gerenciar Cookies",
      content: "Você pode configurar seu navegador ou dispositivo para recusar ou excluir cookies. No entanto, isso pode afetar algumas funcionalidades do aplicativo.",
      details: [
        "Configurações do navegador",
        "Painel de controle do app",
        "Exclusão manual de cookies",
        "Configuração por categoria",
        "Impacto nas funcionalidades"
      ],
      importance: "medium"
    },
    {
      id: 5,
      icon: RefreshCw,
      title: "Alterações nesta Política",
      content: "Podemos atualizar esta Política de Cookies periodicamente. Recomendamos que você revise esta página regularmente para se manter informado.",
      details: [
        "Atualizações periódicas da política",
        "Notificação sobre mudanças importantes",
        "Histórico de versões disponível",
        "Transparência total sobre alterações",
        "Período de adaptação para mudanças"
      ],
      importance: "low"
    },
    {
      id: 6,
      icon: Mail,
      title: "Contato",
      content: "Em caso de dúvidas sobre esta Política de Cookies, entre em contato conosco.",
      details: [
        "E-mail: suporte@localizando.com",
        "Telefone: (21) 99999-9999",
        "Chat online disponível",
        "Suporte especializado em privacidade",
        "Resposta em até 24 horas"
      ],
      importance: "low"
    }
  ];

  const cookieTypes = [
    {
      name: "Cookies Essenciais",
      icon: Zap,
      description: "Necessários para o funcionamento básico do aplicativo",
      examples: ["Login de usuário", "Carrinho de compras", "Preferências de idioma", "Segurança da sessão"],
      required: true,
      color: "green"
    },
    {
      name: "Cookies de Performance",
      icon: BarChart,
      description: "Ajudam a entender como os usuários interagem com o app",
      examples: ["Google Analytics", "Tempo de carregamento", "Páginas mais visitadas", "Erros de navegação"],
      required: false,
      color: "blue"
    },
    {
      name: "Cookies de Funcionalidade",
      icon: Settings,
      description: "Lembram suas preferências e configurações pessoais",
      examples: ["Tema escuro/claro", "Localização preferida", "Configurações de notificação", "Histórico de buscas"],
      required: false,
      color: "purple"
    },
    {
      name: "Cookies de Publicidade",
      icon: Target,
      description: "Podem ser usados para exibir anúncios mais relevantes",
      examples: ["Anúncios personalizados", "Remarketing", "Análise de conversão", "Segmentação de público"],
      required: false,
      color: "orange"
    }
  ];

  const highlights = [
    { icon: Shield, title: "Controle Total", description: "Você decide quais cookies aceitar" },
    { icon: Globe, title: "Transparência", description: "Explicação clara sobre cada tipo de cookie" },
    { icon: Users, title: "Experiência Personalizada", description: "Cookies melhoram sua experiência no app" },
    { icon: CheckCircle, title: "Conformidade", description: "Seguimos LGPD e regulamentações internacionais" }
  ];

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getImportanceText = (importance) => {
    switch (importance) {
      case 'high': return 'Muito Importante';
      case 'medium': return 'Importante';
      case 'low': return 'Informativo';
      default: return 'Normal';
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-700 border-green-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return colors[color] || colors.blue;
  };

  const toggleCookieSetting = (type) => {
    if (type === 'essential') return; // Não pode desativar essenciais
    setCookieSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      onClick={() => router.back()}
    >
      <ArrowLeft className="w-5 h-5 text-gray-600" />
    </button>
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Cookie className="text-yellow-600 w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Política de Cookies</h1>
                  <p className="text-sm text-gray-500">Como usamos cookies para melhorar sua experiência</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Atualizado em 15/08/2025</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        
        {/* Resumo Executivo */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Cookie className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Sobre Nossa Política de Cookies</h2>
              <p className="text-yellow-100 mb-4">
                Esta Política de Cookies explica como o aplicativo <strong>Localizando</strong> utiliza cookies 
                e tecnologias semelhantes para melhorar sua experiência de navegação.
              </p>
              <div className="flex items-center gap-2 text-sm bg-white bg-opacity-20 rounded-lg px-3 py-2 w-fit">
                <Clock className="w-4 h-4" />
                <span>Tempo de leitura: ~4 minutos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Configurações de Cookies 
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-yellow-600" />
            Configurar Cookies
          </h2>
          <p className="text-gray-600 mb-6">
            Controle quais tipos de cookies você deseja aceitar. Os cookies essenciais não podem ser desabilitados.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">Essenciais</div>
                    <div className="text-sm text-gray-600">Sempre ativos</div>
                  </div>
                </div>
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Obrigatório
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <BarChart className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Performance</div>
                    <div className="text-sm text-gray-600">Métricas de uso</div>
                  </div>
                </div>
                <button onClick={() => toggleCookieSetting('performance')}>
                  {cookieSettings.performance ? 
                    <ToggleRight className="w-8 h-8 text-blue-600" /> : 
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                  }
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Funcionalidade</div>
                    <div className="text-sm text-gray-600">Suas preferências</div>
                  </div>
                </div>
                <button onClick={() => toggleCookieSetting('functionality')}>
                  {cookieSettings.functionality ? 
                    <ToggleRight className="w-8 h-8 text-purple-600" /> : 
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                  }
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium">Publicidade</div>
                    <div className="text-sm text-gray-600">Anúncios relevantes</div>
                  </div>
                </div>
                <button onClick={() => toggleCookieSetting('advertising')}>
                  {cookieSettings.advertising ? 
                    <ToggleRight className="w-8 h-8 text-orange-600" /> : 
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                  }
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
              Salvar Preferências
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Limpar Todos os Cookies
            </button>
          </div>
        </div> 
        
        */}

        {/* Destaques */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-yellow-600" />
            Por que Usamos Cookies?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlights.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="bg-yellow-100 p-2 rounded-full mt-1">
                  <item.icon className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tipos de Cookies Detalhados 
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Layers className="w-6 h-6 text-yellow-600" />
            Tipos de Cookies - Detalhado
          </h2>
          <div className="space-y-6">
            {cookieTypes.map((type, index) => (
              <div key={index} className={`p-6 rounded-xl border-2 ${getColorClasses(type.color)}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${type.color === 'green' ? 'bg-green-200' : 
                    type.color === 'blue' ? 'bg-blue-200' : 
                    type.color === 'purple' ? 'bg-purple-200' : 'bg-orange-200'}`}>
                    <type.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold">{type.name}</h3>
                      {type.required && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                          Obrigatório
                        </span>
                      )}
                    </div>
                    <p className="mb-4">{type.description}</p>
                    <div>
                      <h4 className="font-semibold mb-2">Exemplos de uso:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {type.examples.map((example, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">{example}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
*/}

        {/* Índice de Navegação */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Navegação Rápida
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => document.getElementById(`section-${section.id}`).scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-between p-3 text-left hover:bg-yellow-50 rounded-lg transition-colors border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <section.icon className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-gray-700">{section.id}. {section.title}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(section.importance)}`}>
                  {getImportanceText(section.importance)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Seções Principais */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <section.icon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-bold text-gray-800">
                        {section.id}. {section.title}
                      </h2>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(section.importance)}`}>
                        {getImportanceText(section.importance)}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>

                {/* Detalhes expandíveis */}
                <div className="border-t border-gray-100 pt-4">
                  <button
                    onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                    className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    {activeSection === section.id ? 'Ocultar detalhes' : 'Ver detalhes específicos'}
                  </button>
                  
                  {activeSection === section.id && (
                    <div className="mt-4 bg-yellow-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Detalhes específicos:</h3>
                      <ul className="space-y-2">
                        {section.details.map((detail, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Ação especial para seção de contato */}
                {section.id === 6 && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-yellow-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Dúvidas sobre Cookies?</h3>
                        <p className="text-gray-600 mb-3">
                          Nossa equipe está pronta para esclarecer como utilizamos cookies.
                        </p>
                        <a
                          href="mailto:suporte@localizando.com"
                          className="inline-flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          Falar sobre Cookies
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Aviso especial para seções importantes */}
                {section.importance === 'high' && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <span className="font-medium text-amber-800">Informação Importante:</span>
                        <span className="text-amber-700 ml-2">Esta seção contém informações essenciais sobre o uso de cookies.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Ações Disponíveis */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Ações Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-yellow-50 hover:border-yellow-300 transition-all">
              <Download className="w-5 h-5 text-yellow-600" />
              <div className="text-left">
                <div className="font-medium">Baixar Política</div>
                <div className="text-sm text-gray-500">Para leitura offline</div>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all">
              <Share2 className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Compartilhar</div>
                <div className="text-sm text-gray-500">Enviar para alguém</div>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all">
              <Activity className="w-5 h-5 text-red-600" />
              <div className="text-left">
                <div className="font-medium">Ver Atividade</div>
                <div className="text-sm text-gray-500">Cookies ativos</div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer da Política */}
        <div className="bg-gray-800 rounded-2xl p-6 text-white">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Cookie className="w-6 h-6" />
              <span className="text-xl font-bold">Localizando - Cookies</span>
            </div>
            <p className="text-gray-300 mb-4">
              Esta política de cookies está em vigor desde 15 de agosto de 2025 e se aplica a todas as versões do aplicativo.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span>Versão 2.1</span>
              <span>•</span>
              <span>GDPR Compliant</span>
              <span>•</span>
              <span>LGPD Compliant</span>
              <span>•</span>
              <span>ePrivacy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}