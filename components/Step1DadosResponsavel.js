"use client";

import React from "react";
import {
  User,
  FileText,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Step1DadosResponsavel({
  form,
  setForm,
  showPassword,
  setShowPassword,
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <User className="w-6 h-6 mr-3 text-orange-500" />
        Dados do Responsável
      </h2>

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
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
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
              onChange={(e) =>
                setForm((f) => ({ ...f, cpf: e.target.value }))
              }
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
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
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
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
              className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
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
    </div>
  );
}
