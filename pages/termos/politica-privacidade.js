"use client";
import React, { useState } from "react";
import { 
  ShieldCheck, 
  ArrowLeft, 
  Eye, 
  Lock, 
  Users, 
  Settings, 
  Mail, 
  Calendar,
  FileText,
  Globe,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Share2,
  Database
} from "lucide-react";
import { useRouter } from 'next/router';
export default function PoliticaPrivacidade() {
  const [activeSection, setActiveSection] = useState(null);
const router = useRouter();
  const sections = [
    {
      id: 1,
      icon: Database,
      title: "Coleta de Dados",
      content: "Coletamos informações fornecidas por você, como nome, e-mail e dados de localização, quando utiliza nossos serviços para encontrar lojas próximas ou interagir com recursos do aplicativo.",
      details: [
        "Informações de cadastro (nome, e-mail, telefone)",
        "Dados de localização (quando autorizado)",
        "Histórico de buscas e preferências",
        "Informações do dispositivo e navegador"
      ]
    },
    {
      id: 2,
      icon: Settings,
      title: "Uso das Informações",
      content: "Utilizamos seus dados para oferecer uma experiência personalizada, exibir lojas próximas, permitir contato com lojistas e enviar atualizações relevantes sobre o aplicativo.",
      details: [
        "Personalizar sua experiência no app",
        "Mostrar lojas e serviços próximos",
        "Facilitar comunicação com lojistas",
        "Enviar notificações relevantes",
        "Melhorar nossos serviços"
      ]
    },
    {
      id: 3,
      icon: Share2,
      title: "Compartilhamento de Dados",
      content: "Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para o funcionamento do serviço ou mediante sua autorização.",
      details: [
        "Nunca vendemos seus dados pessoais",
        "Compartilhamento apenas com sua autorização",
        "Parceiros técnicos (com proteção de dados)",
        "Cumprimento de obrigações legais"
      ]
    },
    {
      id: 4,
      icon: Lock,
      title: "Segurança",
      content: "Adotamos medidas de segurança para proteger suas informações, mas lembramos que nenhum sistema é 100% seguro. Recomendamos que você proteja suas credenciais de acesso.",
      details: [
        "Criptografia de dados sensíveis",
        "Servidores seguros e certificados",
        "Monitoramento de segurança 24/7",
        "Backups regulares e seguros",
        "Acesso restrito às informações"
      ]
    },
    {
      id: 5,
      icon: FileText,
      title: "Alterações nesta Política",
      content: "Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos que você revise esta página regularmente para se manter informado.",
      details: [
        "Notificação por e-mail sobre mudanças importantes",
        "Histórico de versões disponível",
        "Período de adaptação para novas políticas",
        "Transparência total sobre alterações"
      ]
    },
    {
      id: 6,
      icon: Mail,
      title: "Contato",
      content: "Caso tenha dúvidas sobre esta Política de Privacidade, entre em contato conosco.",
      details: [
        "E-mail: suporte@localizando.com",
        "Telefone: (21) 99999-9999",
        "WhatsApp disponível",
        "Resposta em até 24 horas"
      ]
    }
  ];

  const highlights = [
    { icon: CheckCircle, title: "Transparência Total", description: "Você sabe exatamente quais dados coletamos" },
    { icon: Lock, title: "Dados Protegidos", description: "Criptografia e segurança de nível empresarial" },
    { icon: Users, title: "Controle Total", description: "Você decide como seus dados são usados" },
    { icon: Globe, title: "Conformidade Legal", description: "Seguimos LGPD e melhores práticas internacionais" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
                <div className="bg-blue-100 p-3 rounded-full">
                  <ShieldCheck className="text-blue-600 w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Política de Privacidade</h1>
                  <p className="text-sm text-gray-500">Sua privacidade é nossa prioridade</p>
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Resumo da Política</h2>
              <p className="text-blue-100 mb-4">
                Sua privacidade é importante para nós. Esta Política de Privacidade descreve como coletamos, 
                usamos e protegemos suas informações ao usar nosso aplicativo <strong>Localizando</strong>.
              </p>
              <div className="flex items-center gap-2 text-sm bg-white bg-opacity-20 rounded-lg px-3 py-2 w-fit">
                <Clock className="w-4 h-4" />
                <span>Tempo de leitura: ~5 minutos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Destaques */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Nossos Compromissos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlights.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="bg-green-100 p-2 rounded-full mt-1">
                  <item.icon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Índice de Navegação */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Índice</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => document.getElementById(`section-${section.id}`).scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-3 p-3 text-left hover:bg-blue-50 rounded-lg transition-colors"
              >
                <section.icon className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">{section.id}. {section.title}</span>
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
                  <div className="bg-blue-100 p-3 rounded-full">
                    <section.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {section.id}. {section.title}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>

                {/* Detalhes expandíveis */}
                <div className="border-t border-gray-100 pt-4">
                  <button
                    onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    {activeSection === section.id ? 'Ocultar detalhes' : 'Ver detalhes'}
                  </button>
                  
                  {activeSection === section.id && (
                    <div className="mt-4 bg-blue-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Detalhes específicos:</h3>
                      <ul className="space-y-2">
                        {section.details.map((detail, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Ação especial para seção de contato */}
                {section.id === 6 && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Entre em contato</h3>
                        <p className="text-gray-600 mb-3">
                          Nossa equipe está pronta para esclarecer suas dúvidas sobre privacidade.
                        </p>
                        <a
                          href="mailto:suporte@localizando.com"
                          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          Enviar E-mail
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Ações Finais */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Ações Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all">
              <Download className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Baixar PDF</div>
                <div className="text-sm text-gray-500">Para leitura offline</div>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all">
              <Share2 className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Compartilhar</div>
                <div className="text-sm text-gray-500">Enviar para alguém</div>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all">
              <AlertCircle className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <div className="font-medium">Reportar Problema</div>
                <div className="text-sm text-gray-500">Algo não está claro?</div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer da Política */}
        <div className="bg-gray-800 rounded-2xl p-6 text-white">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Smartphone className="w-6 h-6" />
              <span className="text-xl font-bold">Localizando</span>
            </div>
            <p className="text-gray-300 mb-4">
              Esta política está em vigor desde 15 de agosto de 2025 e se aplica a todas as versões do aplicativo Localizando.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span>Versão 2.1</span>
              <span>•</span>
              <span>LGPD Compliant</span>
              <span>•</span>
              <span>ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}