"use client";
import React, { useState } from "react";
import { 
  FileText, 
  ArrowLeft, 
  Scale, 
  UserCheck, 
  Shield, 
  AlertTriangle, 
  Mail, 
  Calendar,
  CheckCircle,
  Eye,
  Clock,
  Download,
  Share2,
  Smartphone,
  Lock,
  Users,
  Gavel,
  BookOpen,
  HelpCircle,
  Settings,
  Globe,
  Ban,
  RefreshCw
} from "lucide-react";
import { useRouter } from 'next/router';
export default function TermosUso() {
  const [activeSection, setActiveSection] = useState(null);
  const router = useRouter();
  const sections = [
    {
      id: 1,
      icon: UserCheck,
      title: "Aceitação dos Termos",
      content: "Ao acessar e utilizar o aplicativo, você confirma que leu, entendeu e concorda em cumprir estes Termos de Uso e nossa Política de Privacidade.",
      details: [
        "Leitura obrigatória antes do uso",
        "Aceitação integral dos termos",
        "Vinculação à Política de Privacidade",
        "Validade imediata após aceite"
      ],
      importance: "high"
    },
    {
      id: 2,
      icon: Smartphone,
      title: "Uso do Aplicativo",
      content: "O aplicativo deve ser utilizado apenas para fins legais, como localizar lojas próximas e participar das funcionalidades oferecidas. É proibido utilizar o serviço para atividades fraudulentas ou que violem a lei.",
      details: [
        "Uso exclusivamente legal e legítimo",
        "Localização de estabelecimentos comerciais",
        "Participação em funcionalidades disponíveis",
        "Proibição de atividades fraudulentas",
        "Respeito às leis aplicáveis"
      ],
      importance: "high"
    },
    {
      id: 3,
      icon: Lock,
      title: "Cadastro de Usuário",
      content: "Para acessar determinados recursos, pode ser necessário criar uma conta. Você é responsável por manter suas credenciais seguras e não compartilhá-las com terceiros.",
      details: [
        "Criação de conta para recursos específicos",
        "Responsabilidade pela segurança das credenciais",
        "Proibição de compartilhamento de senhas",
        "Atualização de dados quando necessário",
        "Notificação de uso não autorizado"
      ],
      importance: "medium"
    },
    {
      id: 4,
      icon: Shield,
      title: "Responsabilidades do Usuário",
      content: "Você é responsável pelas informações fornecidas no aplicativo e pelo uso adequado da plataforma. Qualquer uso indevido poderá resultar em suspensão ou exclusão da conta.",
      details: [
        "Veracidade das informações fornecidas",
        "Uso adequado da plataforma",
        "Respeito aos outros usuários",
        "Consequências por uso indevido",
        "Possibilidade de suspensão da conta"
      ],
      importance: "high"
    },
    {
      id: 5,
      icon: RefreshCw,
      title: "Alterações nos Termos",
      content: "Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento. Recomendamos que revise esta página regularmente para se manter atualizado.",
      details: [
        "Direito de alteração dos termos",
        "Notificação sobre mudanças importantes",
        "Recomendação de revisão periódica",
        "Entrada em vigor das alterações",
        "Histórico de versões disponível"
      ],
      importance: "medium"
    },
    {
      id: 6,
      icon: Mail,
      title: "Contato",
      content: "Em caso de dúvidas sobre estes Termos de Uso, entre em contato conosco.",
      details: [
        "E-mail: suporte@localizando.com",
        "Telefone: (21) 99999-9999",
        "Horário de atendimento: Seg-Sex 8h-18h",
        "Resposta em até 24 horas úteis",
        "Suporte técnico e jurídico disponível"
      ],
      importance: "low"
    }
  ];

  const highlights = [
    { icon: Scale, title: "Termos Justos", description: "Condições equilibradas para todos os usuários" },
    { icon: Shield, title: "Proteção Legal", description: "Seus direitos e deveres claramente definidos" },
    { icon: Globe, title: "Conformidade", description: "Seguimos as leis brasileiras e internacionais" },
    { icon: Users, title: "Transparência", description: "Linguagem clara e acessível para todos" }
  ];

  const prohibitions = [
    "Usar o app para atividades ilegais ou fraudulentas",
    "Compartilhar informações falsas ou enganosas",
    "Tentar hackear ou comprometer a segurança",
    "Criar múltiplas contas para o mesmo usuário",
    "Usar bots ou automações não autorizadas",
    "Violar direitos autorais ou propriedade intelectual"
  ];

  const userRights = [
    "Acessar suas informações pessoais a qualquer momento",
    "Solicitar correção de dados incorretos",
    "Excluir sua conta e dados associados",
    "Receber notificação sobre mudanças importantes",
    "Suporte técnico quando necessário",
    "Uso gratuito das funcionalidades básicas"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
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
                <div className="bg-purple-100 p-3 rounded-full">
                  <FileText className="text-purple-600 w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Termos de Uso</h1>
                  <p className="text-sm text-gray-500">Regras claras para uso do aplicativo</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Vigente desde 15/08/2025</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        
        {/* Resumo Executivo */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Gavel className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Bem-vindo aos Termos de Uso</h2>
              <p className="text-purple-100 mb-4">
                Bem-vindo ao aplicativo <strong>Localizando</strong>. Estes Termos de Uso estabelecem 
                as regras para utilização de nossos serviços. Ao usar o aplicativo, você concorda com estas condições.
              </p>
              <div className="flex items-center gap-2 text-sm bg-white bg-opacity-20 rounded-lg px-3 py-2 w-fit">
                <Clock className="w-4 h-4" />
                <span>Tempo de leitura: ~6 minutos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Princípios */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Scale className="w-6 h-6 text-purple-600" />
            Nossos Princípios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlights.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="bg-purple-100 p-2 rounded-full mt-1">
                  <item.icon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direitos e Deveres */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Seus Direitos */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Seus Direitos
            </h2>
            <div className="space-y-3">
              {userRights.map((right, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{right}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Proibições */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-700">
              <Ban className="w-5 h-5" />
              Não é Permitido
            </h2>
            <div className="space-y-3">
              {prohibitions.map((prohibition, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Ban className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{prohibition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Índice de Navegação */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Índice dos Termos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => document.getElementById(`section-${section.id}`).scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-between p-3 text-left hover:bg-blue-50 rounded-lg transition-colors border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <section.icon className="w-5 h-5 text-blue-600" />
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
                  <div className="bg-purple-100 p-3 rounded-full">
                    <section.icon className="w-6 h-6 text-purple-600" />
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
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    {activeSection === section.id ? 'Ocultar detalhes' : 'Ver detalhes específicos'}
                  </button>
                  
                  {activeSection === section.id && (
                    <div className="mt-4 bg-purple-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Detalhes específicos:</h3>
                      <ul className="space-y-2">
                        {section.details.map((detail, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Ação especial para seção de contato */}
                {section.id === 6 && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Precisa de esclarecimentos?</h3>
                        <p className="text-gray-600 mb-3">
                          Nossa equipe jurídica está pronta para esclarecer qualquer dúvida sobre os termos.
                        </p>
                        <a
                          href="mailto:suporte@localizando.com"
                          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          Contatar Suporte Jurídico
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Aviso especial para seções importantes */}
                {section.importance === 'high' && (
                  <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <span className="font-medium text-red-800">Atenção Especial:</span>
                        <span className="text-red-700 ml-2">Esta seção contém informações críticas para o uso do aplicativo.</span>
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
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all">
              <Download className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <div className="font-medium">Baixar Termos</div>
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
            
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all">
              <HelpCircle className="w-5 h-5 text-orange-600" />
              <div className="text-left">
                <div className="font-medium">Dúvidas Legais</div>
                <div className="text-sm text-gray-500">Consultoria jurídica</div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer Legal */}
        <div className="bg-gray-800 rounded-2xl p-6 text-white">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Scale className="w-6 h-6" />
              <span className="text-xl font-bold">Localizando - Termos Legais</span>
            </div>
            <p className="text-gray-300 mb-4">
              Estes termos estão em vigor desde 15 de agosto de 2025 e são válidos para todas as versões do aplicativo Localizando.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span>Versão 2.1</span>
              <span>•</span>
              <span>Marco Civil da Internet</span>
              <span>•</span>
              <span>CDC Compliant</span>
              <span>•</span>
              <span>Lei 13.709/2018</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}