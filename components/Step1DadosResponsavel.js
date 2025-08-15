"use client";

import React, { useState } from "react";
import { User, FileText, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase"; 

export default function Step1DadosResponsavel({
  form,
  setForm,
  showPassword,
  setShowPassword,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleCreateAccount(e) {
    e.preventDefault();
    setErr("");

    if (form.password.length < 8) {
      setErr("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      // Cria conta no Firebase Auth
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Guarda o UID no form para usar no Firestore depois
      setForm((f) => ({
        ...f,
        uid: cred.user.uid,
      }));

      console.log("Usuário criado com sucesso:", cred.user.uid);

     if (onSuccess) {
        onSuccess(); // 👈 avança para o próximo passo
      }
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <User className="w-6 h-6 mr-3 text-orange-500" />
        Dados do Responsável
      </h2>

      <form onSubmit={handleCreateAccount}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Nome completo */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Nome completo *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Seu nome completo"
                value={form.ownerName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ownerName: e.target.value }))
                }
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl"
                required
              />
            </div>
          </div>

          {/* CPF */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">CPF *</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={(e) => setForm((f) => ({ ...f, cpf: e.target.value }))}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email *</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
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
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700">Senha *</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500">Mínimo 8 caracteres</p>
          </div>
        </div>

        {/* Mensagem de erro */}
        {err && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {err}
          </div>
        )}

        {/* Botão */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-4 font-semibold transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Criando conta..." : "Criar conta e continuar"}
          </button>
        </div>
      </form>
    </div>
  );
}
