import React, { useState } from 'react';
import {
  Store, Camera, MapPin, Clock, Phone, Mail, Globe, Instagram, 
  Facebook, Save, ArrowLeft, Plus, X, Star, Upload, Check,
  AlertCircle, Eye, EyeOff, Palette, Type, Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';

export default function StoreProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  

  // Estado dos dados da loja
  const [storeData, setStoreData] = useState({
    name: 'Café & Sabores',
    category: 'restaurante',
    description: 'Um aconchegante café com os melhores sabores da cidade. Servimos café especiais, doces caseiros e lanches saudáveis.',
    phone: '(11) 99999-9999',
    email: 'contato@cafeesabores.com',
    address: 'Rua das Flores, 123 - Centro',
    cep: '01234-567',
    city: 'São Paulo',
    state: 'SP',
    website: 'www.cafeesabores.com',
    instagram: '@cafeesabores',
    facebook: 'cafeesabores',
    openingHours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '20:00', closed: false },
      saturday: { open: '09:00', close: '20:00', closed: false },
      sunday: { open: '09:00', close: '17:00', closed: false }
    },
    images: [
      { id: 1, url: null, alt: 'Fachada da loja' },
      { id: 2, url: null, alt: 'Interior' },
      { id: 3, url: null, alt: 'Produtos' }
    ],
    tags: ['Café', 'Doces', 'Wi-Fi', 'Pet Friendly'],
    primaryColor: '#8B5CF6',
    logoUrl: null
  });

  const categories = [
    { value: 'restaurante', label: 'Restaurante' },
    { value: 'cafe', label: 'Café' },
    { value: 'loja', label: 'Loja' },
    { value: 'servicos', label: 'Serviços' },
    { value: 'beleza', label: 'Beleza' },
    { value: 'saude', label: 'Saúde' },
    { value: 'outros', label: 'Outros' }
  ];

  const days = [
    { key: 'monday', label: 'Segunda' },
    { key: 'tuesday', label: 'Terça' },
    { key: 'wednesday', label: 'Quarta' },
    { key: 'thursday', label: 'Quinta' },
    { key: 'friday', label: 'Sexta' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  const suggestedTags = ['Wi-Fi', 'Estacionamento', 'Pet Friendly', 'Delivery', 'Ar Condicionado', 'Música Ao Vivo', 'Vegetariano', 'Sem Glúten'];

  const handleInputChange = (field, value) => {
    setStoreData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHoursChange = (day, field, value) => {
    setStoreData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleAddTag = (tag) => {
    if (!storeData.tags.includes(tag)) {
      setStoreData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setStoreData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = () => {
    setSavedSuccessfully(true);
    setIsEditing(false);
    setTimeout(() => setSavedSuccessfully(false), 3000);
  };

  const tabs = [
    { id: 'basic', label: 'Básico', icon: Store },
    { id: 'contact', label: 'Contato', icon: Phone },
    { id: 'hours', label: 'Horários', icon: Clock },
    { id: 'visual', label: 'Visual', icon: Palette }
  ];

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link 
          href="/perfil"
          className="mr-4 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200 inline-flex"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
            <div>
              <h1 className="text-xl font-bold">Minha Loja</h1>
              <p className="text-purple-100 text-sm">Edite as informações do seu negócio</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
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
                  className="px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-all duration-200 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
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
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
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
                    storeData.name.charAt(0)
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800">{storeData.name}</h3>
                  <p className="text-slate-600 capitalize mb-2">{categories.find(c => c.value === storeData.category)?.label}</p>
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      4.8
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {storeData.city}
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-slate-700">{storeData.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {storeData.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Informações Básicas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nome da Loja *
                  </label>
                  <input
                    type="text"
                    value={storeData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="Ex: Café & Sabores"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={storeData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Descrição da Loja *
                </label>
                <textarea
                  value={storeData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                  placeholder="Conte sobre sua loja, o que vocês fazem de especial..."
                />
                <p className="text-xs text-slate-500 mt-1">
                  {storeData.description.length}/500 caracteres
                </p>
              </div>

              {/* Tags */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tags (características da sua loja)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {storeData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center"
                    >
                      {tag}
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
                    <p className="text-sm text-slate-600 mb-2">Sugestões:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.filter(tag => !storeData.tags.includes(tag)).map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => handleAddTag(tag)}
                          className="px-3 py-1 border border-slate-300 text-slate-600 rounded-full text-sm hover:bg-slate-50 transition-colors"
                        >
                          <Plus className="w-3 h-3 inline mr-1" />
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Informações de Contato
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Telefone/WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={storeData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={storeData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="contato@suaempresa.com"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Endereço Completo *
                </label>
                <input
                  type="text"
                  value={storeData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                  placeholder="Rua das Flores, 123 - Centro"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">CEP</label>
                  <input
                    type="text"
                    value={storeData.cep}
                    onChange={(e) => handleInputChange('cep', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="00000-000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Cidade</label>
                  <input
                    type="text"
                    value={storeData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="São Paulo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Estado</label>
                  <input
                    type="text"
                    value={storeData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="SP"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Redes Sociais
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={storeData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
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
                      value={storeData.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
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
                      value={storeData.facebook}
                      onChange={(e) => handleInputChange('facebook', e.target.value)}
                      disabled={!isEditing}
                      className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-25 text-sm"
                      placeholder="suaempresa"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hours Tab */}
        {activeTab === 'hours' && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              Horário de Funcionamento
            </h2>
            
            <div className="space-y-3">
              {days.map((day) => (
                <div key={day.key} className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <div className="w-20 text-sm font-medium text-slate-700">
                    {day.label}
                  </div>
                  
                  <div className="flex items-center space-x-3 flex-1">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={storeData.openingHours[day.key].closed}
                        onChange={(e) => handleHoursChange(day.key, 'closed', e.target.checked)}
                        disabled={!isEditing}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-slate-600">Fechado</span>
                    </label>
                    
                    {!storeData.openingHours[day.key].closed && (
                      <>
                        <input
                          type="time"
                          value={storeData.openingHours[day.key].open}
                          onChange={(e) => handleHoursChange(day.key, 'open', e.target.value)}
                          disabled={!isEditing}
                          className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-100 text-sm"
                        />
                        <span className="text-slate-500">às</span>
                        <input
                          type="time"
                          value={storeData.openingHours[day.key].close}
                          onChange={(e) => handleHoursChange(day.key, 'close', e.target.value)}
                          disabled={!isEditing}
                          className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-100 text-sm"
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
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
        )}

        {/* Visual Tab */}
        {activeTab === 'visual' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Identidade Visual
              </h2>
              
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
                      storeData.name.charAt(0)
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
                    value={storeData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    disabled={!isEditing}
                    className="w-12 h-12 rounded-lg border border-slate-300 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div>
                    <p className="text-sm text-slate-700">Cor que representa sua marca</p>
                    <p className="text-xs text-slate-500">{storeData.primaryColor}</p>
                  </div>
                </div>
              </div>

              {/* Photos */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Fotos da Loja
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {storeData.images.map((image) => (
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
            </div>
          </div>
        )}
      </div>     
     
    </div>
  )
}