"use client";
import React, { useState } from "react";
import Step1DadosResponsavel from "../../components/Step1DadosResponsavel";
import Step2DadosLoja from "../../components/Step2DadosLoja";
import Step3Localizacao from "../../components/Step3Localizacao";
import Step4HorarioFuncionamento from "../../components/Step4HorarioFuncionamento";
import { ArrowRight, Store, CheckCircle, AlertCircle, Info } from "lucide-react";
import { salvarLoja } from "../../lib/salvarloja";
import { gcategories } from '../../lib/categorias';

export default function LojistaCadastroPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
    ownerName: "", email: "", password: "", phone: "", cpf: "",
    storeName: "", storeSlug: "", desc: "", category: "", website: "",
    whatsapp: "", instagram: "", facebook: "", logoFile: null,
    logoPreview: "", address: "", neighborhood: "", city: "",
    state: "", zipCode: "", lat: "", lng: "",
    schedule: {
      domingo: { enabled: false, open: "09:00", close: "18:00" },
      segunda: { enabled: true, open: "09:00", close: "18:00" },
      terca: { enabled: true, open: "09:00", close: "18:00" },
      quarta: { enabled: true, open: "09:00", close: "18:00" },
      quinta: { enabled: true, open: "09:00", close: "18:00" },
      sexta: { enabled: true, open: "09:00", close: "18:00" },
      sabado: { enabled: false, open: "09:00", close: "14:00" },
    },
    cnpj: "", businessLicense: "",
    acceptTerms: false, acceptPrivacy: false
  });

  const categories  = gcategories.map(category => ({
      value: category.id,
      label: category.name,
    
  })); 

  const weekDays = [
    { key: "segunda", label: "Segunda-feira" },
    { key: "terca", label: "Terça-feira" },
    { key: "quarta", label: "Quarta-feira" },
    { key: "quinta", label: "Quinta-feira" },
    { key: "sexta", label: "Sexta-feira" },
    { key: "sabado", label: "Sábado" },
    { key: "domingo", label: "Domingo" }
  ];

  function validateForm(values) {
    const errors = [];
    if (!values.ownerName.trim()) errors.push("Nome do responsável é obrigatório.");
    if (!values.email.trim()) errors.push("E‑mail é obrigatório.");
    if (!values.password.trim()) errors.push("Senha é obrigatória.");
    if (!values.storeName.trim()) errors.push("Nome da loja é obrigatório.");
    if (!values.category.trim()) errors.push("Categoria é obrigatória.");
    if (!values.whatsapp.trim()) errors.push("WhatsApp é obrigatório.");
    if (!values.address.trim()) errors.push("Endereço é obrigatório.");
    if (!values.city.trim()) errors.push("Cidade é obrigatória.");
    if (!values.state.trim()) errors.push("Estado é obrigatório.");
    if (!values.zipCode.trim()) errors.push("CEP é obrigatório.");
    if (!values.acceptTerms) errors.push("Você deve aceitar os Termos de Uso.");
    if (!values.acceptPrivacy) errors.push("Você deve aceitar a Política de Privacidade.");
    return errors;
  }
  

  async function handleSubmit(e) {
  e?.preventDefault();
  setErr("");

  const validationErrors = validateForm(form);
  if (validationErrors.length > 0) {
    setErr(validationErrors.join(" "));
    return;
  }

  setLoading(true);
  try {
    await salvarLoja(form);
    setSuccess(true);
  } catch (error) {
    console.error(error);
    setErr(error.message || "Erro ao cadastrar loja");
  } finally {
    setLoading(false);
  }
}

 function handleLogoFile(e) {
  const file = e.target.files?.[0];
  if (!file || !file.type.startsWith("image/")) {
    alert("Envie um arquivo de imagem válido (PNG, JPG...)");
    return;
  }
  const preview = URL.createObjectURL(file);
  setForm(f => ({ ...f, logoFile: file, logoPreview: preview }));
}

  function clearLogo() {
    if (form.logoPreview) URL.revokeObjectURL(form.logoPreview);
    setForm(f => ({ ...f, logoFile: null, logoPreview: "" }));
  }

  function generateSlug(name) {
    return name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function handleStoreNameChange(e) {
    const name = e.target.value;
    setForm(f => ({ ...f, storeName: name, storeSlug: generateSlug(name) }));
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto"/>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loja cadastrada!</h2>
            <p className="text-gray-600 mb-6">Parabéns! Sua loja está em análise.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <Store className="w-16 h-16 text-white bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl mx-auto mb-4 flex items-center justify-center"/>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cadastro de Loja</h1>
          <p className="text-gray-600">Junte-se à nossa plataforma.</p>
        </div>

        {/* Barra de progresso */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1,2,3,4].map(step => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>{step}</div>
                {step < 4 && <div className={`w-12 h-0.5 ${currentStep > step ? 'bg-orange-500' : 'bg-gray-200'}`}/>}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-8 text-xs text-gray-500">
            <span>Responsável</span>
            <span>Loja</span>
            <span>Localização</span>
            <span>Horarios</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-white/20">
          {err && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg text-sm text-red-700">
              <AlertCircle className="inline w-5 h-5 mr-2"/>
              {err}
            </div>
          )}

          <div className="space-y-8">
           {currentStep === 1 && (
  <Step1DadosResponsavel
    form={form}
    setForm={setForm}
    showPassword={showPassword}
    setShowPassword={setShowPassword}
    onSuccess={() => setCurrentStep(2)} // 👈 avança para o próximo passo
  />
)}

            {currentStep === 2 && <Step2DadosLoja form={form} setForm={setForm} categories={categories} handleStoreNameChange={handleStoreNameChange} handleLogoFile={handleLogoFile} clearLogo={clearLogo} generateSlug={generateSlug} />}

            {currentStep === 3 && <Step3Localizacao form={form} setForm={setForm} />}

            {currentStep === 4 && <Step4HorarioFuncionamento form={form} setForm={setForm} weekDays={weekDays} />}

           <div className="flex justify-between pt-8 border-t border-gray-200">
  {currentStep > 1 ? (
    <button
      onClick={() => setCurrentStep(s => s - 1)}
      className="px-6 py-3 border-2 rounded-2xl"
    >
      Voltar
    </button>
  ) : (
    <div />
  )}

  {currentStep === 1 ? null : currentStep < 4 ? (
    <button
      onClick={() => setCurrentStep(s => s + 1)}
      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl flex items-center gap-2"
    >
      <span>Próximo</span>
      <ArrowRight />
    </button>
  ) : (
    <button
      onClick={handleSubmit}
      disabled={loading}
      className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl flex items-center gap-2"
    >
      {loading ? "Cadastrando..." : "Cadastrar loja"}
      <CheckCircle className="inline w-5 h-5 ml-2" />
    </button>
  )}
</div>

          </div>
        </div>
      </div>
    </div>
  );
}
