import React from "react";
import { Store, Globe, Tag, Building2, Phone, Instagram, Facebook, FileText, ImageIcon, Trash2 } from "lucide-react";

const Step2DadosLoja = ({ form, setForm, categories, handleStoreNameChange, handleLogoFile, clearLogo }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Store className="w-6 h-6 mr-3 text-orange-500" />
        Dados da Loja
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Nome da loja */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nome da loja *</label>
          <div className="relative">
            <Store className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nome da sua loja"
              value={form.storeName}
              onChange={handleStoreNameChange}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
              required
            />
          </div>
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">URL da loja</label>
          <div className="relative">
            <Globe className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="minha-loja"
              value={form.storeSlug}
              onChange={(e) => setForm(f => ({ ...f, storeSlug: e.target.value }))}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
            />
          </div>
          <p className="text-xs text-gray-500">
            app.com/loja/{form.storeSlug || 'sua-loja'}
          </p>
        </div>

        {/* Categoria */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Categoria *</label>
          <div className="relative">
            <Tag className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <select
              value={form.category}
              onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CNPJ */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">CNPJ</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="00.000.000/0000-00"
              value={form.cnpj}
              onChange={(e) => setForm(f => ({ ...f, cnpj: e.target.value }))}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
            />
          </div>
        </div>

        {/* WhatsApp */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">WhatsApp *</label>
          <div className="relative">
            <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              placeholder="(99) 99999-9999"
              value={form.whatsapp}
              onChange={(e) => setForm(f => ({ ...f, whatsapp: e.target.value }))}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
              required
            />
          </div>
        </div>

        {/* Instagram */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Instagram</label>
          <div className="relative">
            <Instagram className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="@seuinstagram"
              value={form.instagram}
              onChange={(e) => setForm(f => ({ ...f, instagram: e.target.value }))}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
            />
          </div>
        </div>

        {/* Facebook */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Facebook</label>
          <div className="relative">
            <Facebook className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="facebook.com/sualoja"
              value={form.facebook}
              onChange={(e) => setForm(f => ({ ...f, facebook: e.target.value }))}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
            />
          </div>
        </div>

        {/* Descrição */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-700">Descrição da loja</label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <textarea
              placeholder="Conte sobre sua loja, especialidades, diferenciais..."
              value={form.desc}
              onChange={(e) => setForm(f => ({ ...f, desc: e.target.value }))}
              rows={4}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 resize-none"
            />
          </div>
        </div>

        {/* Logo (upload obrigatório) */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <ImageIcon className="w-5 h-5 text-gray-400 mr-2" />
            Logo da loja (obrigatório)
          </label>

          {form.logoPreview ? (
            <div className="relative w-full">
              <img
                src={form.logoPreview}
                alt="Logo preview"
                className="w-full max-h-48 object-contain bg-white border border-gray-200 rounded-2xl p-6"
              />
              <button
                type="button"
                onClick={clearLogo}
                className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 shadow"
                title="Remover"
              >
                <Trash2 className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-36 bg-white border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
              <ImageIcon className="w-7 h-7 text-gray-400 mb-2" />
              <span className="text-gray-500 text-sm">Clique para enviar a logo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoFile}
                required
              />
            </label>
          )}

          <p className="text-xs text-gray-500">
            PNG/JPG, até ~5MB.
          </p>
        </div>

        {/* Site (opcional) */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Site da loja</label>
          <div className="relative">
            <Globe className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="url"
              placeholder="https://www.minhaloja.com"
              value={form.website}
              onChange={(e) => setForm(f => ({ ...f, website: e.target.value }))}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2DadosLoja;
