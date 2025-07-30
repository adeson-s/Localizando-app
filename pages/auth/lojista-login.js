"use client";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Store, ArrowRight, ShoppingBag } from "lucide-react";

// Simulando a função de auth (você pode substituir pela sua)
const signInWithEmail = async (email, password, isStore = false) => {
  // Simular delay da API
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (email === "error@test.com") throw new Error("Credenciais inválidas");
  return { user: { email, isStore } };
};

export default function LojistaLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleEmailLogin(e) {
    e?.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signInWithEmail(form.email, form.password, true);
      setSuccess(true);
      // router.push("/app/dashboard-lojista");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Acesso autorizado!</h2>
            <p className="text-gray-600 mb-4">Bem-vindo ao painel da sua loja</p>
            <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
              <div className="bg-orange-500 h-1 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
            <p className="text-sm text-gray-500">Redirecionando para o dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Área Lojista</h1>
          <p className="text-gray-600">Acesse o painel da sua loja</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-white/20">
          {/* Error Message */}
          {err && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{err}</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Card */}
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800">Painel de Vendas</p>
                <p className="text-xs text-orange-600">Gerencie produtos, pedidos e relatórios</p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email da loja</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="loja@email.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleEmailLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl py-4 font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                <>
                  <span>Entrar no painel</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Features List */}
          <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">O que você pode fazer:</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                <span>Gerenciar produtos e estoque</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                <span>Acompanhar pedidos em tempo real</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                <span>Ver relatórios de vendas</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                <span>Configurar promoções</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Não tem cadastro?{" "}
            <a href="/auth/lojista-cadastro" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
              Cadastre sua loja
            </a>
          </p>
        </div>

             
      </div>
    </div>
  );
}