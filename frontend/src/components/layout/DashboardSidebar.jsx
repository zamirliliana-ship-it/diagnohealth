import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, ClipboardList, Bot, LogOut } from 'lucide-react';

export default function DashboardSidebar({ userLabel }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-gray-200 bg-white md:flex">
      
      {/* LOGO */}
      <div className="flex h-20 items-center px-6 border-b border-gray-100">
        <span className="font-extrabold text-xl text-[#004D73] tracking-wide">
          DIAGNOHEALTH
        </span>
      </div>

      {/* ENLACES DE NAVEGACIÓN */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link
          to="/inicioS"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
            isActive('/inicioS')
              ? 'bg-[#E0F2FE] text-[#0369A1]'
              : 'text-gray-600 hover:bg-gray-50 hover:text-[#0369A1]'
          }`}
        >
          <Home size={20} />
          <span>Panel Principal</span>
        </Link>

        <Link
          to="/mi-progreso"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
            isActive('/mi-progreso')
              ? 'bg-[#E0F2FE] text-[#0369A1]'
              : 'text-gray-600 hover:bg-gray-50 hover:text-[#0369A1]'
          }`}
        >
          <TrendingUp size={20} />
          <span>Mi Progreso</span>
        </Link>

        <Link
          to="/test-bienestar"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
            isActive('/test-bienestar')
              ? 'bg-[#E0F2FE] text-[#0369A1]'
              : 'text-gray-600 hover:bg-gray-50 hover:text-[#0369A1]'
          }`}
        >
          <ClipboardList size={20} />
          <span>Test de Bienestar</span>
        </Link>

        <Link
          to="/chatbot"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
            isActive('/chatbot')
              ? 'bg-[#E0F2FE] text-[#0369A1]'
              : 'text-gray-600 hover:bg-gray-50 hover:text-[#0369A1]'
          }`}
        >
          <Bot size={20} />
          <span>Asistente IA</span>
        </Link>
      </nav>

      {/* PERFIL / CERRAR SESIÓN */}
      <div className="border-t border-gray-100 p-4">
        {userLabel && (
          <p className="mb-3 truncate px-2 text-xs font-medium text-gray-500">
            {userLabel}
          </p>
        )}
        <Link
          to="/cerrar-sesion"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </Link>
      </div>

    </aside>
  );
}