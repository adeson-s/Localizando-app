"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../../lib/firebase";
import { 
  ArrowLeft, 
  Camera, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Lock,
  Save,
  X,
  Edit3,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";

export default function Perfil() {
  const router = useRouter();
  const auth = getAuth();
  const fileInputRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    fullName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Brasil"
    },
    birthDate: "",
    profilePhoto: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});

  // Observa login do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setUserData(prev => ({ ...prev, email: user.email || "" }));
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  // Busca dados do usuário
  useEffect(() => {
    if (!userId) return;
    
    async function fetchUser() {
      setLoading(true);
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(prev => ({
            ...prev,
            ...data,
            address: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "Brasil",
              ...data.address
            }
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, [userId]);

  // Validação de campos
  const validateFields = () => {
    const newErrors = {};
    
    if (!userData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    
    if (!userData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email inválido";
    }
    
    if (userData.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(userData.phone)) {
      newErrors.phone = "Formato: (11) 99999-9999";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Upload da foto de perfil
  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file || !userId) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("A foto deve ter no máximo 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas imagens");
      return;
    }

    setUploadingPhoto(true);
    
    try {
      if (userData.profilePhoto) {
        try {
          const oldPhotoRef = ref(storage, `profile-photos/${userId}`);
          await deleteObject(oldPhotoRef);
        } catch (error) {
          console.log("Foto anterior não encontrada ou já removida");
        }
      }

      const photoRef = ref(storage, `profile-photos/${userId}`);
      const snapshot = await uploadBytes(photoRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { profilePhoto: downloadURL });
      
      setUserData(prev => ({ ...prev, profilePhoto: downloadURL }));
      
      alert("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      alert("Erro ao fazer upload da foto");
    } finally {
      setUploadingPhoto(false);
    }
  }

  // Salva os dados do perfil
  async function handleSave() {
    if (!userId || !validateFields()) return;

    setSaving(true);
    
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      const dataToSave = {
        name: userData.name,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        birthDate: userData.birthDate,
        profilePhoto: userData.profilePhoto,
        updatedAt: new Date().toISOString()
      };

      if (userSnap.exists()) {
        await updateDoc(userRef, dataToSave);
      } else {
        await setDoc(userRef, {
          ...dataToSave,
          createdAt: new Date().toISOString()
        });
      }
      
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar alterações");
    } finally {
      setSaving(false);
    }
  }

  // Altera senha
  async function handlePasswordChange() {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      await updatePassword(auth.currentUser, passwordData.newPassword);
      alert("Senha alterada com sucesso!");
      setShowPasswordChange(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswords({ new: false, confirm: false });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      alert("Erro ao alterar senha. Tente fazer login novamente.");
    }
  }

  // Formatar telefone
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Meu Perfil</h1>
            <div className="w-9"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Foto de Perfil */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg bg-gray-100">
                {userData.profilePhoto ? (
                  <img
                    src={userData.profilePhoto}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 border-2 border-white"
              >
                {uploadingPhoto ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            
            <h2 className="text-xl font-bold text-gray-800">
              {userData.name || "Usuário"}
            </h2>
            <p className="text-gray-600 text-sm">{userData.email}</p>
          </div>
        </div>

        {/* Informações Básicas */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Informações Básicas
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome de usuário *
              </label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Como você quer ser chamado"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                value={userData.fullName}
                onChange={(e) => setUserData(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Seu nome completo"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email *
              </label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Telefone
              </label>
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setUserData(prev => ({ ...prev, phone: formatted }));
                }}
                className={`w-full border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="(11) 99999-9999"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Data de nascimento
              </label>
              <input
                type="date"
                value={userData.birthDate}
                onChange={(e) => setUserData(prev => ({ ...prev, birthDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Endereço
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rua/Endereço
              </label>
              <input
                type="text"
                value={userData.address.street}
                onChange={(e) => setUserData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, street: e.target.value }
                }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Rua das Flores, 123"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={userData.address.city}
                  onChange={(e) => setUserData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, city: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="São Paulo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado
                </label>
                <input
                  type="text"
                  value={userData.address.state}
                  onChange={(e) => setUserData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, state: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SP"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  value={userData.address.zipCode}
                  onChange={(e) => setUserData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, zipCode: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="01234-567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  País
                </label>
                <input
                  type="text"
                  value={userData.address.country}
                  onChange={(e) => setUserData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, country: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
       
        {/* Segurança */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-blue-600" />
            Segurança
          </h3>
          
          <button
            type="button"
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="flex items-center justify-between w-full px-4 py-3 text-left text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
          >
            <span className="flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              Alterar senha
            </span>
            <div className={`transform transition-transform ${showPasswordChange ? 'rotate-45' : ''}`}>
              <X className="w-4 h-4" />
            </div>
          </button>
          
          {showPasswordChange && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nova senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nova senha (mín. 6 caracteres)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar nova senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirme a nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handlePasswordChange}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    Alterar senha
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                      setShowPasswords({ new: false, confirm: false });
                    }}
                    className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botão de Salvar */}
        <div className="pt-2 pb-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploadingPhoto}
            className="w-full bg-blue-600 text-white py-4 px-4 rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold shadow-lg"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}