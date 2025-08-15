import React, { useState } from "react";
import {
  Store, Globe, Tag, Building2, Phone, Instagram, Facebook,
  FileText, ImageIcon, Trash2, X
} from "lucide-react";
import { TAG_SUGESTOES} from '../lib/categorias';

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dpmq1xwcg/image/upload";
const UPLOAD_PRESET = "Upload_Localizando";


const Step2DadosLoja = ({ form, setForm, categories, generateSlug }) => {
  const [inputTag, setInputTag] = useState("");

  const normalizarTag = (tag) => {
    return tag
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  const adicionarTag = (tag) => {
    const tagNormalizada = normalizarTag(tag);
    if (!tagNormalizada) return;
    if (form.tags?.includes(tagNormalizada)) return;
    if ((form.tags?.length || 0) >= 10) return;

    setForm(f => ({
      ...f,
      tags: [...(f.tags || []), tagNormalizada]
    }));
    setInputTag("");
  };

  const removerTag = (tag) => {
    setForm(f => ({
      ...f,
      tags: f.tags.filter(t => t !== tag)
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      adicionarTag(inputTag);
    }
  };

  const sugestoesFiltradas = TAG_SUGESTOES.filter(
  s => s.label.toLowerCase().includes(inputTag.toLowerCase()) && !form.tags?.includes(s.value)
);

  const handleStoreNameChange = (e) => {
    const nome = e.target.value;
    setForm(f => ({
      ...f,
      storeName: nome,
      storeSlug: generateSlug(nome),
    }));
  };

  const handleLogoFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(f => ({ ...f, logoPreview: reader.result }));
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setForm(f => ({
          ...f,
          logoUrl: data.secure_url,
        }));
      } else {
        alert("Erro ao enviar imagem. Verifique as configurações do Cloudinary.");
      }
    } catch (err) {
      console.error("Erro ao enviar imagem:", err);
      alert("Erro ao enviar imagem. Verifique sua conexão.");
    }
  };

  const clearLogo = () => {
    setForm(f => ({ ...f, logoPreview: "", logoUrl: "" }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Store className="w-6 h-6 mr-3 text-orange-500" />
        Dados da Loja
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Nome da loja */}
        <div>
          <label className="text-sm font-medium text-gray-700">Nome da loja *</label>
          <div className="relative">
            <Store className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nome da sua loja"
              value={form.storeName}
              onChange={handleStoreNameChange}
              required
              className="w-full pl-12 pr-4 py-4 border rounded-2xl bg-gray-50/50"
            />
          </div>
        </div>

        {/* Slug */}
        <div>
          <label className="text-sm font-medium text-gray-700">URL da loja</label>
          <div className="relative">
            <Globe className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="minha-loja"
              value={form.storeSlug}
              onChange={(e) => setForm(f => ({ ...f, storeSlug: e.target.value }))}
              className="w-full pl-12 pr-4 py-4 border rounded-2xl bg-gray-50/50"
            />
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label className="text-sm font-medium text-gray-700">Categoria *</label>
          <div className="relative">
            <Tag className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <select
  value={form.category}
  onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
  required
  className="w-full pl-12 pr-4 py-4 border rounded-2xl bg-gray-50/50"
>
  <option value="">Selecione</option>
  {categories.map((cat) => (
    <option key={cat.value} value={cat.value}>
      {cat.label}
    </option>
  ))}
</select>
          </div>
        </div>

        {/* WhatsApp */}
        <div>
          <label className="text-sm font-medium text-gray-700">WhatsApp *</label>
          <div className="relative">
            <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              placeholder="(99) 99999-9999"
              value={form.whatsapp}
              onChange={(e) => setForm(f => ({ ...f, whatsapp: e.target.value }))}
              required
              className="w-full pl-12 pr-4 py-4 border rounded-2xl bg-gray-50/50"
            />
          </div>
        </div>

        {/* Campo de Tags */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
            <Tag className="w-4 h-4 mr-2" /> Tags da loja
          </label>

          <div className="flex flex-wrap gap-2 mb-2">
            {form.tags?.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
              >
                {tag}
                <button type="button" onClick={() => removerTag(tag)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <input
            type="text"
            placeholder="Digite e pressione Enter..."
            value={inputTag}
            onChange={(e) => setInputTag(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 border rounded-lg"
          />

          {inputTag && sugestoesFiltradas.length > 0 && (
            <div className="border mt-1 rounded-lg bg-white shadow-sm max-h-40 overflow-auto">
            {sugestoesFiltradas.map((s) => (
  <div
    key={s.value}  // Aqui usamos s.value ou s.label para garantir que estamos passando uma string para o JSX
    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
    onClick={() => adicionarTag(s.label)}  // Passando s.label para a função adicionarTag
  >
    {s.label}  {/* Agora estamos renderizando a propriedade label */}
  </div>
))}

            </div>
          )}

          <p className="text-xs text-gray-500 mt-1">
            Máximo de 10 tags. Elas ajudam o cliente a encontrar sua loja.
          </p>
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Descrição</label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <textarea
              placeholder="Conte sobre sua loja..."
              value={form.desc}
              onChange={(e) => setForm(f => ({ ...f, desc: e.target.value }))}
              rows={4}
              className="w-full pl-12 pr-4 py-4 border rounded-2xl bg-gray-50/50 resize-none"
            />
          </div>
        </div>

        {/* Logo */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <ImageIcon className="w-5 h-5 text-gray-400 mr-2" />
            Logo da loja (obrigatório)
          </label>

          {form.logoUrl ? (
            <div className="relative w-full">
              <img
                src={form.logoUrl}
                alt="Logo preview"
                className="w-full max-h-48 object-contain bg-white border rounded-2xl p-6"
              />
              <button
                type="button"
                onClick={clearLogo}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
              >
                <Trash2 className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-gray-50">
              <ImageIcon className="w-7 h-7 text-gray-400 mb-2" />
              <span className="text-gray-500 text-sm">Clique para enviar</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoFile}
                required
              />
            </label>
          )}

          <p className="text-xs text-gray-500">PNG/JPG até 5MB</p>
        </div>
      </div>
    </div>
  );
};

export default Step2DadosLoja;
