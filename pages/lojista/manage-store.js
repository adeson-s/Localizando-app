"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import {
  Store, Camera, MapPin, Clock, Phone, Mail, Globe, Instagram, 
  Facebook, Save, ArrowLeft, Plus, X, Star, Upload, Check,
  AlertCircle, Eye, EyeOff, Palette, Type, Image as ImageIcon
} from 'lucide-react';
import { gcategories, TAG_SUGESTOES } from '../../lib/categorias';

export default function ManageStore() {
  const [storeData, setStoreData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [activeTab, setActiveTab] = useState("dados");
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [tagInput, setTagInput] = useState('');


  // 🔹 Inicializar dados padrão
  const initializeDefaultData = (existingData = {}) => {
    return {
      // Dados básicos
      storeName: existingData.storeName || "",
      category: existingData.category || "outros",
      desc: existingData.desc || "",
      address: existingData.address || "",
      city: existingData.city || "",
      state: existingData.state || "",
      whatsapp: existingData.whatsapp || "",
      
      // Links externos
      website: existingData.website || "",
      instagram: existingData.instagram || "",
      facebook: existingData.facebook || "",
      youtube: existingData.youtube || "",
      tiktok: existingData.tiktok || "",
      
      // Horários de funcionamento
      horarios: existingData.horarios || {
        segunda: { aberto: true, abertura: "08:00", fechamento: "18:00" },
        terca: { aberto: true, abertura: "08:00", fechamento: "18:00" },
        quarta: { aberto: true, abertura: "08:00", fechamento: "18:00" },
        quinta: { aberto: true, abertura: "08:00", fechamento: "18:00" },
        sexta: { aberto: true, abertura: "08:00", fechamento: "18:00" },
        sabado: { aberto: true, abertura: "08:00", fechamento: "14:00" },
        domingo: { aberto: false, abertura: "08:00", fechamento: "18:00" }
      },
      
      // Configurações adicionais
      delivery: existingData.delivery || false,
      retirada: existingData.retirada || true,
      pagamentoCartao: existingData.pagamentoCartao || false,
      pagamentoPix: existingData.pagamentoPix || true,
      pagamentoDinheiro: existingData.pagamentoDinheiro || true,
      
      // Visual
      primaryColor: existingData.primaryColor || '#8B5CF6',
      logoUrl: existingData.logoUrl || null,
      images: existingData.images || [
        { id: 1, url: null, alt: 'Fachada da loja' },
        { id: 2, url: null, alt: 'Interior' },
        { id: 3, url: null, alt: 'Produtos' }
      ],
      tags: existingData.tags || [],
      
      ...existingData
    };
  };
 
  const categories  = gcategories.map(category => ({
    value: category.id,
    label: category.name,
  
}));

  const suggestedTags = TAG_SUGESTOES.map(tag => ({
    value: tag.value,
    label: tag.label,
}));

  // 🔹 Buscar dados da loja
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const { storeId } = userData;
            
            if (storeId) {
              const storeRef = doc(db, "lojas", storeId);
              const storeSnap = await getDoc(storeRef);
              
              if (storeSnap.exists()) {
                const storeInfo = { id: storeSnap.id, ...storeSnap.data() };
                const initializedData = initializeDefaultData(storeInfo);
                setStoreData(initializedData);
                setOriginalData(initializedData);
              } else {
                setMessage("Loja não encontrada no banco de dados.");
                setMessageType("error");
              }
            } else {
              setMessage("Usuário não possui uma loja associada.");
              setMessageType("info");
            }
          } else {
            setMessage("Dados do usuário não encontrados.");
            setMessageType("error");
          }
        } catch (error) {
          console.error("Erro ao carregar loja:", error);
          setMessage("Erro ao carregar dados da loja. Tente novamente.");
          setMessageType("error");
        }
      } else {
        setMessage("Você precisa estar logado para gerenciar sua loja.");
        setMessageType("error");
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Verificar se há alterações
  const hasChanges = () => {
    if (!storeData || !originalData) return false;
    return JSON.stringify(storeData) !== JSON.stringify(originalData);
  };

  // 🔹 Salvar alterações
  const handleSave = async () => {
    if (!storeData?.id) {
      setMessage("Dados da loja não encontrados.");
      setMessageType("error");
      return;
    }

    if (!hasChanges()) {
      setMessage("Nenhuma alteração detectada.");
      setMessageType("info");
      return;
    }

    setSaving(true);
    setMessage("");
    
    try {
      const storeRef = doc(db, "lojas", storeData.id);
      const updateData = { ...storeData };
      delete updateData.id;
      
      await updateDoc(storeRef, updateData);
      setOriginalData({ ...storeData });
      setMessage("Alterações salvas com sucesso!");
      setMessageType("success");
      setSavedSuccessfully(true);
      setIsEditing(false);
      setTimeout(() => setSavedSuccessfully(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar loja:", error);
      setMessage("Erro ao salvar alterações. Tente novamente.");
      setMessageType("error");
    }
    
    setSaving(false);
  };

  // 🔹 Atualizar campo
  const updateField = (field, value) => {
    setStoreData(prev => ({ ...prev, [field]: value }));
  };

  // 🔹 Atualizar horário
  const updateHorario = (dia, campo, valor) => {
    setStoreData(prev => ({
      ...prev,
      horarios: {
        ...prev.horarios,
        [dia]: {
          ...prev.horarios[dia],
          [campo]: valor
        }
      }
    }));
  };

  // 🔹 Funções para tags
 const handleAddTag = (tag) => {
  if (!(storeData.tags || []).some(t => t.value === tag.value)) {
    setStoreData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tag]
    }));
  }
};


 const handleRemoveTag = (tagToRemove) => {
  setStoreData(prev => ({
    ...prev,
    tags: (prev.tags || []).filter(tag => tag.value !== tagToRemove.value)
  }));
};




  // 🔹 Definir abas
  const tabs = [
    {
      id: "dados",
      name: "Básico",
      icon: <Store className="w-5 h-5" />
    },
    {
      id: "contato", 
      name: "Contato",
      icon: <Phone className="w-5 h-5" />
    },
    {
      id: "horarios",
      name: "Horários",
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: "visual",
      name: "Visual",
      icon: <Palette className="w-5 h-5" />
    }
  ];

  // 🔹 Componente de mensagem
  const MessageAlert = ({ message, type }) => {
    if (!message) return null;
    
    const styles = {
      success: "bg-emerald-50 border-emerald-200 text-emerald-800",
      error: "bg-red-50 border-red-200 text-red-800",
      info: "bg-blue-50 border-blue-200 text-blue-800"
    };

    return (
      <div className={`border-l-4 p-4 mb-4 rounded-r-md ${styles[type] || styles.info}`}>
        <p className="font-medium">{message}</p>
      </div>
    );
  };

  // 🔹 Render da aba Dados Básicos
  const renderDadosTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Nome da Loja *
          </label>
          <input
            type="text"
            value={storeData.storeName || ""}
            onChange={(e) => updateField("storeName", e.target.value)}
            disabled={!isEditing}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 transition-all"
            placeholder="Ex: Café & Sabores"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Categoria *
          </label>
          <select
            value={storeData.category || "outros"}
            onChange={(e) => updateField("category", e.target.value)}
            disabled={!isEditing}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Descrição da Loja *
        </label>
        <textarea
          value={storeData.desc || ""}
          onChange={(e) => updateField("desc", e.target.value)}
          disabled={!isEditing}
          rows={4}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 transition-all resize-none"
          placeholder="Conte sobre sua loja, o que vocês fazem de especial..."
        />
        <p className="text-xs text-slate-500 mt-1">
          {(storeData.desc || "").length}/500 caracteres
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Tags (características da sua loja)
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {(storeData.tags || []).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center"
            >
              {tag.label}
              {isEditing && (
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 hover:text-purple-900"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        
       {isEditing && (
  <div>
    <p className="text-sm text-slate-600 mb-2">Adicionar tag:</p>

    {/* Input para digitar a tag */}
    <input
      type="text"
      value={tagInput}
      onChange={(e) => setTagInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          const match = suggestedTags.find(tag =>
            tag.label.toLowerCase() === tagInput.toLowerCase()
          );
          if (match) {
            handleAddTag(match);
          } else {
            handleAddTag({ value: tagInput.toLowerCase(), label: tagInput });
          }
          setTagInput('');
        }
      }}
      className="w-full px-3 py-2 mb-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
      placeholder="Digite uma tag..."
    />

    {/* Sugestões filtradas dinamicamente */}
    <div className="flex flex-wrap gap-2">
      {suggestedTags
        .filter(tag =>
          tag.label.toLowerCase().includes(tagInput.toLowerCase()) &&
          !(storeData.tags || []).some(t => t.value === tag.value)
        )
        .map((tag, index) => (
          <button
            key={index}
            onClick={() => {
              handleAddTag(tag);
              setTagInput('');
            }}
            className="px-3 py-1 border border-slate-300 text-slate-600 rounded-full text-sm hover:bg-slate-50 transition-colors"
          >
            <Plus className="w-3 h-3 inline mr-1" />
            {tag.label}
          </button>
        ))}
    </div>
  </div>
)}

      </div>
    </div>
  );

  // 🔹 Render da aba Contato
  const renderContatoTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            WhatsApp *
          </label>
          <input
            type="tel"
            value={storeData.whatsapp || ""}
            onChange={(e) => updateField("whatsapp", e.target.value)}
            disabled={!isEditing}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 transition-all"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Cidade *
          </label>
          <input
            type="text"
            value={storeData.city || ""}
            onChange={(e) => updateField("city", e.target.value)}
            disabled={!isEditing}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 transition-all"
            placeholder="Nome da cidade"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Endereço Completo *
        </label>
        <input
          type="text"
          value={storeData.address || ""}
          onChange={(e) => updateField("address", e.target.value)}
          disabled={!isEditing}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 transition-all"
          placeholder="Rua das Flores, 123 - Centro"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Estado
        </label>
        <input
          type="text"
          value={storeData.state || ""}
          onChange={(e) => updateField("state", e.target.value)}
          disabled={!isEditing}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 transition-all"
          placeholder="Ex: SP, RJ, MG"
        />
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
          <Globe className="w-4 h-4 mr-2" />
          Redes Sociais
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Website</label>
            <input
              type="url"
              value={storeData.website || ""}
              onChange={(e) => updateField("website", e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-25 text-sm"
              placeholder="www.suaempresa.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              <Instagram className="w-3 h-3 inline mr-1" />
              Instagram
            </label>
            <input
              type="text"
              value={storeData.instagram || ""}
              onChange={(e) => updateField("instagram", e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-25 text-sm"
              placeholder="@suaempresa"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              <Facebook className="w-3 h-3 inline mr-1" />
              Facebook
            </label>
            <input
              type="text"
              value={storeData.facebook || ""}
              onChange={(e) => updateField("facebook", e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-25 text-sm"
              placeholder="suaempresa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              YouTube
            </label>
            <input
              type="text"
              value={storeData.youtube || ""}
              onChange={(e) => updateField("youtube", e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-25 text-sm"
              placeholder="https://youtube.com/seucanal"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // 🔹 Render da aba Horários
  const renderHorariosTab = () => {
    const diasSemana = [
      { key: "segunda", label: "Segunda-feira" },
      { key: "terca", label: "Terça-feira" },
      { key: "quarta", label: "Quarta-feira" },
      { key: "quinta", label: "Quinta-feira" },
      { key: "sexta", label: "Sexta-feira" },
      { key: "sabado", label: "Sábado" },
      { key: "domingo", label: "Domingo" }
    ];

    return (
      <div className="space-y-4">
        {diasSemana.map(({ key, label }) => (
          <div key={key} className="flex items-center p-3 bg-slate-50 rounded-lg">
            <div className="w-28 text-sm font-medium text-slate-700">
              {label}
            </div>
            
            <div className="flex items-center space-x-3 flex-1">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={!storeData.horarios?.[key]?.aberto}
                  onChange={(e) => updateHorario(key, "aberto", !e.target.checked)}
                  disabled={!isEditing}
                  className="mr-2 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-slate-600">Fechado</span>
              </label>
              
              {storeData.horarios?.[key]?.aberto && (
                <>
                  <input
                    type="time"
                    value={storeData.horarios?.[key]?.abertura || "08:00"}
                    onChange={(e) => updateHorario(key, "abertura", e.target.value)}
                    disabled={!isEditing}
                    className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-100 text-sm"
                  />
                  <span className="text-slate-500">às</span>
                  <input
                    type="time"
                    value={storeData.horarios?.[key]?.fechamento || "18:00"}
                    onChange={(e) => updateHorario(key, "fechamento", e.target.value)}
                    disabled={!isEditing}
                    className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-100 text-sm"
                  />
                </>
              )}
            </div>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Dica importante</p>
              <p className="text-sm text-yellow-700">
                Mantenha seus horários sempre atualizados para que os clientes saibam quando encontrar você aberto.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 🔹 Render da aba Visual
  const renderVisualTab = () => (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Logo da Loja
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            {storeData.logoUrl ? (
              <img src={storeData.logoUrl} alt="Logo" className="w-20 h-20 rounded-xl object-cover" />
            ) : (
              (storeData.storeName || "L").charAt(0)
            )}
          </div>
          {isEditing && (
            <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Enviar Logo
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Recomendado: imagem quadrada, mínimo 200x200px
        </p>
      </div>

      {/* Color Theme */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Cor Principal
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={storeData.primaryColor || '#8B5CF6'}
            onChange={(e) => updateField('primaryColor', e.target.value)}
            disabled={!isEditing}
            className="w-12 h-12 rounded-lg border border-slate-300 cursor-pointer disabled:cursor-not-allowed"
          />
          <div>
            <p className="text-sm text-slate-700">Cor que representa sua marca</p>
            <p className="text-xs text-slate-500">{storeData.primaryColor || '#8B5CF6'}</p>
          </div>
        </div>
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Fotos da Loja
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(storeData.images || []).map((image) => (
            <div key={image.id} className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              {image.url ? (
                <div className="relative">
                  <img src={image.url} alt={image.alt} className="w-full h-32 object-cover rounded-lg" />
                  {isEditing && (
                    <button className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-slate-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm font-medium">{image.alt}</p>
                  {isEditing && (
                    <button className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs hover:bg-purple-200 transition-colors">
                      Adicionar Foto
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Adicione fotos da fachada, interior e produtos para atrair mais clientes
        </p>
      </div>

      {/* Configurações de Serviços */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Serviços Oferecidos</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={storeData.delivery || false}
              onChange={(e) => updateField("delivery", e.target.checked)}
              disabled={!isEditing}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">🚚 Delivery</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={storeData.retirada !== false}
              onChange={(e) => updateField("retirada", e.target.checked)}
              disabled={!isEditing}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">🏪 Retirada no Local</span>
          </label>
        </div>

        <h3 className="text-lg font-medium text-slate-900 mb-4 mt-6">Formas de Pagamento</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={storeData.pagamentoPix !== false}
              onChange={(e) => updateField("pagamentoPix", e.target.checked)}
              disabled={!isEditing}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">💳 PIX</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={storeData.pagamentoCartao || false}
              onChange={(e) => updateField("pagamentoCartao", e.target.checked)}
              disabled={!isEditing}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">💳 Cartão de Crédito/Débito</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={storeData.pagamentoDinheiro !== false}
              onChange={(e) => updateField("pagamentoDinheiro", e.target.checked)}
              disabled={!isEditing}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">💵 Dinheiro</span>
          </label>
        </div>
      </div>
    </div>
  );

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando dados da loja...</p>
        </div>
      </div>
    );
  }

  // 🔹 No store found
  if (!storeData) {
    return (
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <div className="text-gray-400 mb-4">
            <Store className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loja não encontrada</h2>
          <p className="text-gray-600 mb-4">Você ainda não possui uma loja cadastrada.</p>
          <MessageAlert message={message} type={messageType} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button className="mr-4 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200 inline-flex">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Minha Loja</h1>
              <p className="text-purple-100 text-sm">
                {storeData.storeName || "Configure sua loja"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasChanges() && (
              <span className="flex items-center text-sm text-orange-200">
                <div className="w-2 h-2 bg-orange-300 rounded-full mr-2 animate-pulse"></div>
                Não salvo
              </span>
            )}
            
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            >
              {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !hasChanges()}
                  className="px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-semibold"
              >
                Editar
              </button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {savedSuccessfully && (
          <div className="mt-4 p-3 bg-emerald-500 bg-opacity-20 border border-emerald-300 rounded-lg flex items-center">
            <Check className="w-5 h-5 mr-2 text-emerald-200" />
            <span className="text-emerald-100">Informações salvas com sucesso!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-[112px] z-30">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <MessageAlert message={message} type={messageType} />

        {/* Preview Mode */}
        {showPreview && (
          <div className="mb-6 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white">
              <h3 className="font-bold mb-2">Prévia da sua loja</h3>
              <p className="text-sm text-purple-100">Assim seus clientes verão sua loja</p>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {storeData.logoUrl ? (
                    <img src={storeData.logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    (storeData.storeName || "L").charAt(0)
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800">{storeData.storeName || "Nome da Loja"}</h3>
                  <p className="text-slate-600 capitalize mb-2">{categories.find(c => c.value === storeData.category)?.label || "Categoria"}</p>
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      4.8
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {storeData.city || "Cidade"}
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-slate-700">{storeData.desc || "Descrição da loja..."}</p>
              {(storeData.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {storeData.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {tag.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
            {tabs.find(tab => tab.id === activeTab)?.name}
          </h2>
          
          {activeTab === "dados" && renderDadosTab()}
          {activeTab === "contato" && renderContatoTab()}
          {activeTab === "horarios" && renderHorariosTab()}
          {activeTab === "visual" && renderVisualTab()}
        </div>

        {/* Status cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  storeData.storeName ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {storeData.storeName ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Dados Básicos</p>
                <p className="text-sm text-gray-500">
                  {storeData.storeName ? 'Completo' : 'Incompleto'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  (storeData.instagram || storeData.facebook || storeData.website) ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {(storeData.instagram || storeData.facebook || storeData.website) ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Redes Sociais</p>
                <p className="text-sm text-gray-500">
                  {(storeData.instagram || storeData.facebook || storeData.website) ? 'Configurado' : 'Não configurado'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  Object.values(storeData.horarios || {}).some(h => h.aberto) ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {Object.values(storeData.horarios || {}).some(h => h.aberto) ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Horários</p>
                <p className="text-sm text-gray-500">
                  {Object.values(storeData.horarios || {}).some(h => h.aberto) ? 'Configurado' : 'Não configurado'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  (storeData.logoUrl || storeData.primaryColor !== '#8B5CF6') ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {(storeData.logoUrl || storeData.primaryColor !== '#8B5CF6') ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Visual</p>
                <p className="text-sm text-gray-500">
                  {(storeData.logoUrl || storeData.primaryColor !== '#8B5CF6') ? 'Personalizado' : 'Padrão'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips card */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-blue-900 mb-1">Dicas para otimizar sua loja</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Complete todos os dados para aparecer melhor nos resultados</p>
                <p>• Adicione suas redes sociais para aumentar o engajamento</p>
                <p>• Configure os horários de funcionamento corretamente</p>
                <p>• Personalize o visual com logo e cores da sua marca</p>
              </div>
            </div>
          </div>
        </div>
      </div>     
    </div>
  );
}