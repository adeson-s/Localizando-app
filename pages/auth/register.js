"use client";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import {
  registerWithEmail,
  signInWithGoogle,
  translateFirebaseError, 
} from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { label: "Fraca", color: "bg-red-500", width: "25%" };
    if (score === 3) return { label: "Média", color: "bg-yellow-500", width: "50%" };
    if (score === 4) return { label: "Boa", color: "bg-blue-500", width: "75%" };
    return { label: "Forte", color: "bg-green-500", width: "100%" };
  }

  async function handleRegister(e) {
    e?.preventDefault();
    setErr("");
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setErr("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    if (form.password.length < 8) {
      setErr("A senha deve ter no mínimo 8 caracteres.");
      setLoading(false);
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_.-]{3,}$/;
    if (!usernameRegex.test(form.username)) {
      setErr("Nome de usuário inválido.");
      setLoading(false);
      return;
    }

   
    try {
      await registerWithEmail(form);
      setSuccess(true);
      router.push("/");
    } catch (e) {
      const msg = translateFirebaseError(e.code || e.message);
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setErr("");
    setLoading(true);
    try {
      await signInWithGoogle();
      setSuccess(true);
    } catch (e) {
      const msg = translateFirebaseError(e.code || e.message);
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  const handleUsernameChange = (e) => {
  const newUsername = e.target.value;
  setForm((f) => ({ ...f, username: newUsername }));
};

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Conta criada!</h2>
            <p className="text-gray-600 mb-4">Verifique seu email para confirmar a conta.</p>
            <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
              <div className="bg-green-500 h-1 rounded-full animate-pulse" style={{ width: "100%" }} />
            </div>
            <p className="text-sm text-gray-500">Redirecionando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Criar conta</h1>
          <p className="text-gray-600">Junte-se à nossa comunidade</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-white/20">
          {err && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <p className="text-sm text-red-700">{err}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nome completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nome de usuário</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="usuario123"
                  value={form.username}
                  onChange={handleUsernameChange}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl"
                  required
                />
              </div>
              </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Força da senha */}
              {form.password && (() => {
                const strength = getPasswordStrength(form.password);
                return (
                  <div className="mt-2">
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div className={`h-2 rounded-full ${strength.color}`} style={{ width: strength.width }}></div>
                    </div>
                    <div className="text-xs mt-1 text-gray-600">Força da senha: <span className="font-medium">{strength.label}</span></div>
                  </div>
                );
              })()}
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirmar senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl"
                  required
                />
              </div>
            </div>

            {/* Termos */}
            <div className="flex items-start space-x-3">
              <input type="checkbox" required className="mt-1 h-4 w-4 text-emerald-600" />
              <label className="text-sm text-gray-600">
                Aceito os{" "}
                <a href="#" className="text-emerald-600 font-medium">Termos de Uso</a>{" "}
                e{" "}
                <a href="#" className="text-emerald-600 font-medium">Política de Privacidade</a>
              </label>
            </div>

            {/* Botão de cadastro */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl py-4 font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <div className="my-8 text-center text-sm text-gray-400">ou cadastre-se com</div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full bg-white border border-gray-200 text-gray-700 rounded-2xl py-4 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Google</span>
          </button>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Já tem conta?{" "}
              <a href="/auth/login" className="text-emerald-600 font-semibold">Entrar</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
