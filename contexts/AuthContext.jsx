"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  signInWithEmail,
  signInWithGoogle,
  signInAsGuest,
  registerWithEmail,
  registerStore,
} from "../lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("idle"); // idle | loading | ready
  const [user, setUser] = useState(null); // { uid, name, email, role: 'guest'|'usuario'|'lojista' }
  const [error, setError] = useState("");

  // Carrega do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem("auth_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch {}
    }
    setStatus("ready");
  }, []);

  // Persiste mudanças
  useEffect(() => {
    if (status === "ready") {
      if (user) localStorage.setItem("auth_user", JSON.stringify(user));
      else localStorage.removeItem("auth_user");
    }
  }, [user, status]);

  const loginUser = async (email, password) => {
    setStatus("loading");
    setError("");
    try {
      const u = await signInWithEmail(email, password, false);
      setUser(u);
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setStatus("ready");
    }
  };

  const loginLojista = async (email, password) => {
    setStatus("loading");
    setError("");
    try {
      const u = await signInWithEmail(email, password, true);
      setUser(u);
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setStatus("ready");
    }
  };

  const loginGoogle = async () => {
    setStatus("loading");
    setError("");
    try {
      const u = await signInWithGoogle();
      setUser(u);
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setStatus("ready");
    }
  };

  const loginGuest = async () => {
    setStatus("loading");
    setError("");
    try {
      const u = await signInAsGuest();
      setUser(u);
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setStatus("ready");
    }
  };

  const registerUser = async ({ name, email, password }) => {
    setStatus("loading");
    setError("");
    try {
      const u = await registerWithEmail({ name, email, password });
      setUser(u);
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setStatus("ready");
    }
  };

  const registerLojista = async (payload) => {
    setStatus("loading");
    setError("");
    try {
      const loja = await registerStore(payload);
      // você pode querer setar o usuário como lojista já logado:
      setUser({
        uid: "lojista_" + loja.id,
        role: "lojista",
        email: payload.email,
        name: payload.ownerName,
        store: loja,
      });
      return loja;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setStatus("ready");
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      status,
      error,
      user,
      isAuthenticated: !!user && user.role !== "guest",
      isGuest: user?.role === "guest",
      isUser: user?.role === "user" || user?.role === "usuario",
      isLojista: user?.role === "lojista",
      // actions
      loginUser,
      loginLojista,
      loginGuest,
      loginGoogle,
      registerUser,
      registerLojista,
      logout,
      setUser,
    }),
    [status, error, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext deve ser usado dentro de AuthProvider");
  return ctx;
}
