// components/Protected.js
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export function withAuth(Component, { allowGuest = false, roles = [] } = {}) {
  return function ProtectedPage(props) {
    const { user, status, isGuest } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (status !== "ready") return;

      // Não autenticado e guest não é permitido
      if (!user && !allowGuest) {
        router.replace("/auth/login");
        return;
      }

      // Usuario guest mas a rota não permite guest
      if (user?.role === "guest" && !allowGuest) {
        router.replace("/auth/login");
        return;
      }

      // Se roles foram passadas, restringe
      if (roles.length > 0 && user && !roles.includes(user.role)) {
        router.replace("/auth/login");
        return;
      }
    }, [user, status, router, allowGuest, roles]);

    if (status !== "ready") return null; // loading global

    // Opcional: mostrar loading ou skeleton
    if (!user && !allowGuest) return null;

    return <Component {...props} />;
  };
}
