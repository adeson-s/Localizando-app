"use client";
import { useState } from "react";
import Step1DadosResponsavel from "../../components/Step1DadosResponsavel";
import Step2DadosLoja from "../../components/Step2DadosLoja";
import Step3Localizacao from "../../components/Step3Localizacao";
import Step4HorarioFuncionamento from "../../components/Step4HorarioFuncionamento";
import { 
  ArrowRight, Store, CheckCircle, AlertCircle, Info
} from "lucide-react";

// Simulando a função de auth
const registerStore = async (form) => {
  await new Promise(resolve => setTimeout(resolve, 2500));
  if (form.email === "error@test.com") throw new Error("Email já cadastrado");
  return { store: form };
};

export default function LojistaCadastroPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);  
  
  const [form, setForm] = useState({
  // Dados do responsável
  ownerName: "",
  email: "",
  password: "",
  phone: "",
  cpf: "",

  // Dados da Loja
  storeName: "",
  storeSlug: "",
  desc: "",
  category: "",
  website: "",
  whatsapp: "",
  instagram: "",
  facebook: "",
  logoFile: null,
  logoPreview: "",

  // Endereço
  address: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
  lat: "",
  lng: "",

  // Horários
  schedule: {
    domingo:   { enabled: false, open: "09:00", close: "18:00" },
    segunda:   { enabled: true,  open: "09:00", close: "18:00" },
    terca:     { enabled: true,  open: "09:00", close: "18:00" },
    quarta:    { enabled: true,  open: "09:00", close: "18:00" },
    quinta:    { enabled: true,  open: "09:00", close: "18:00" },
    sexta:     { enabled: true,  open: "09:00", close: "18:00" },
    sabado:    { enabled: false, open: "09:00", close: "14:00" },
  },

  // Documentos
  cnpj: "",
  businessLicense: "",

  // Termos
  acceptTerms: false,
  acceptPrivacy: false,
});


  const categories = [
    "Restaurante", "Lanchonete", "Pizzaria", "Hamburgueria", "Japonês",
    "Italiano", "Brasileira", "Saudável", "Doces & Sobremesas", "Bebidas",
    "Mercado", "Farmácia", "Padaria", "Outros"
  ];

  async function handleSubmit(e) {
    e?.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await registerStore(form);
      setSuccess(true);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  const weekDays = [
  { key: "segunda", label: "Segunda-feira" },
  { key: "terca",   label: "Terça-feira" },
  { key: "quarta",  label: "Quarta-feira" },
  { key: "quinta",  label: "Quinta-feira" },
  { key: "sexta",   label: "Sexta-feira" },
  { key: "sabado",  label: "Sábado" },
  { key: "domingo", label: "Domingo" },
];


function handleLogoFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    alert("Envie um arquivo de imagem válido (PNG, JPG...).");
    return;
  }

  const preview = URL.createObjectURL(file);
  setForm(f => ({ ...f, logoFile: file, logoPreview: preview }));
}

function clearLogo() {
  if (form.logoPreview) URL.revokeObjectURL(form.logoPreview);
  setForm(f => ({ ...f, logoFile: null, logoPreview: "" }));
}

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleStoreNameChange = (e) => {
    const name = e.target.value;
    setForm(f => ({
      ...f,
      storeName: name,
      storeSlug: generateSlug(name)
    }));
  };
const toggleDay = (dayKey) => {
  setForm(f => ({
    ...f,
    schedule: {
      ...f.schedule,
      [dayKey]: {
        ...f.schedule[dayKey],
        enabled: !f.schedule[dayKey].enabled,
      }
    }
  }));
};

const updateHour = (dayKey, field, value) => {
  setForm(f => ({
    ...f,
    schedule: {
      ...f.schedule,
      [dayKey]: {
        ...f.schedule[dayKey],
        [field]: value
      }
    }
  }));
};

const copyToAll = (fromKey) => {
  const base = form.schedule[fromKey];
  setForm(f => ({
    ...f,
    schedule: Object.fromEntries(
      Object.entries(f.schedule).map(([k, v]) => ([
        k,
        v.enabled
          ? { ...v, open: base.open, close: base.close }
          : v
      ]))
    )
  }));
};



  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loja cadastrada!</h2>
            <p className="text-gray-600 mb-6">Parabéns! Sua loja foi cadastrada com sucesso e está em análise.</p>
            
            <div className="bg-blue-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center space-x-2 text-blue-700 mb-2">
                <Info className="w-5 h-5" />
                <span className="font-medium">Próximos passos:</span>
              </div>
              <div className="text-sm text-blue-600 text-left space-y-1">
                <p>• Análise dos documentos (até 24h)</p>
                <p>• Ativação da conta</p>
                <p>• Acesso ao painel de vendas</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
              <div className="bg-green-500 h-1 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
            <p className="text-sm text-gray-500">Redirecionando para o login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cadastro de Loja</h1>
          <p className="text-gray-600">Junte-se à nossa plataforma e comece a vender</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-0.5 ${
                    currentStep > step ? 'bg-orange-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-8 text-xs text-gray-500">
            <span>Responsável</span>
            <span>Loja</span>
            <span>Localização</span>
            <span>Configurações</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-white/20">
          {/* Error Message */}
          {err && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                <p className="text-sm text-red-700">{err}</p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {/* Etapa 1: Dados do Responsável */}
           {currentStep === 1 && (
  <Step1DadosResponsavel
    form={form}
    setForm={setForm}
    showPassword={showPassword}
    setShowPassword={setShowPassword}
  />
)}

            {/* Etapa 2: Dados da Loja */}
{currentStep === 2 && (
  <Step2DadosLoja
    form={form}
    setForm={setForm}
    categories={categories}
    handleStoreNameChange={handleStoreNameChange}
    handleLogoFile={handleLogoFile}
    clearLogo={clearLogo}
  />
)}
            {/* Etapa 3: Localização */}
            {currentStep === 3 && (
  <Step3Localizacao form={form} setForm={setForm} />
)}


            {/* Etapa 4: Horários & Funcionamento */}
  {currentStep === 4 && (
  <Step4HorarioFuncionamento
  form={form}
  setForm={setForm}
  weekDays={weekDays}
  toggleDay={toggleDay}
  updateHour={updateHour}
  copyToAll={copyToAll}
/>

)}
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-200">
              {currentStep > 1 ? (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Voltar
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 4 ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Próximo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.acceptTerms || !form.acceptPrivacy}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Cadastrando...</span>
                    </div>
                  ) : (
                    <>
                      <span>Cadastrar loja</span>
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Já tem loja cadastrada?{" "}
            <a href="/auth/lojista-login" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
              Fazer login
            </a>
          </p>
        </div>

        {/* Progress Info */}
        <div className="mt-6 p-4 bg-white rounded-2xl border border-orange-100 shadow-sm">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Info className="w-4 h-4 text-orange-500" />
            <span>Etapa {currentStep} de 4 - Seu progresso é salvo automaticamente</span>
          </div>
        </div>

        </div>
    </div>
  );
}