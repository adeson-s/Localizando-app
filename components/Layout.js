// pages/_app.js usará este Layout globalmente, ou você pode envolver página a página.
import Link from "next/link";
import 'leaflet/dist/leaflet.css';
import { useRouter } from "next/router";
import {
  Search,
  Home as HomeIcon,
  Play,
  User,
  MapPin
} from "lucide-react";

export default function Layout({ children }) {
  const router = useRouter();

  // Ajuste os hrefs conforme suas rotas reais
  const menuItems = [
    { href: "/", label: "Buscar", Icon: Search },
    { href: "/mapa", label: "Mapa", Icon: MapPin },
    { href: "/eventos", label: "Eventos", Icon: Play },
    { href: "/perfil", label: "Perfil", Icon: User }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      {/* Bottom Navigation (estilo do seu snippet) */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200">
        <div className="flex justify-around py-3">
          {menuItems.map(({ href, label, Icon }) => {
            const active = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center p-2 ${
                  active ? "text-blue-500" : "text-gray-400"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
