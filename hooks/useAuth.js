"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../lib/firebase";   

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);   // {uid, name, email, avatar}
  const [loading, setLoading]     = useState(true);
  const [isGuest,     setGuest]   = useState(false);  // p/ “convidado”

  // 🔄 ouve login/logout em tempo‑real
  useEffect(() => {
    const off = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setGuest(false);
        setLoading(false);
        return;
      }

      // Se não tiver displayName você pega de um “profile” no Firestore, etc.
      setUser({
        uid:    fbUser.uid,
        name:   fbUser.displayName ?? "Sem nome",
        email:  fbUser.email,
        avatar: fbUser.photoURL,          // pode vir null
      });
      setLoading(false);
    });

    return () => off();
  }, []);

  /* ---------- Actions ---------- */
  const loginEmail = (email, pass) =>
    signInWithEmailAndPassword(auth, email, pass);

  const loginGoogle = () =>
    signInWithPopup(auth, new GoogleAuthProvider());

  const loginGuest = () => {
    setGuest(true);
    setUser({
      name:   "Convidado",
      email:  "",
      avatar: null,
    });
  };

  const logout = () => signOut(auth);

  const value = {
    user,
    loading,
    isGuest,
    isLojista: !!user?.storeId,    // ex.: marcou isso na coleção “stores”
    isAuthenticated: !!user && !isGuest,
    loginEmail,
    loginGoogle,
    loginGuest,
    logout,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
