import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Home,
  TrendingUp,
  ClipboardList,
  Bot,
  LogOut,
  Menu,
  X,
  Smile,
  Dumbbell,
  History,
} from "lucide-react";

import { supabase } from "../../config/supabase";

const navItems = [
  { label: "Panel Principal", to: "/inicioS", icon: Home },
  { label: "Mi Progreso", to: "/mi-progreso", icon: TrendingUp },
  { label: "Test de Bienestar", to: "/test-bienestar", icon: ClipboardList },
  { label: "Asistente IA", to: "/chatbot", icon: Bot },
];

function CerrarSesion() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadEmail = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted && session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };

    loadEmail();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCancel = () => {
    navigate("/chatbot");
  };

  const handleLogout = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // ¡Ajuste aquí! Lo enviamos directo al login tras cerrar sesión
      navigate("/login", {
        replace: true,
      });

    } catch (error) {
      console.error("Error cerrando sesión:", error);
      setErrorMessage(error.message || "No fue posible cerrar la sesión.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FAF7F2] text-[#1B1C1A]">

      {/* BOTÓN DE MENÚ MÓVIL */}
      <button
        type="button"
        onClick={() => setMenuOpen((value) => !value)}
        className="fixed left-4 top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition hover:text-[#0369A1] md:hidden"
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* OVERLAY (móvil) */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 max-w-[85%] flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-out md:translate-x-0 md:shadow-none ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-gray-200 p-5">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#00334F]">
            DIAGNOHEALTH
          </h1>
        </div>

        <nav className="flex-1 space-y-1.5 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-[#0369A1]"
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {userEmail && (
          <div className="border-t border-gray-200 px-5 py-4">
            <p className="truncate text-xs text-gray-500 sm:text-sm">
              {userEmail}
            </p>
          </div>
        )}
      </aside>

      {/* CONTENIDO */}
      <main className="min-h-screen md:pl-72">
        <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
          <div className="pl-12 md:pl-0">
            <h1 className="text-xl font-bold text-[#00334F] sm:text-2xl">Cerrar sesión</h1>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">Administra tu sesión de DiagnoHealth.</p>
          </div>
        </header>

        <section className="px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 sm:h-16 sm:w-16">
                <LogOut size={26} className="sm:hidden" />
                <LogOut size={30} className="hidden sm:block" />
              </div>

              <h2 className="text-center text-xl font-bold text-[#00334F] sm:text-2xl">¿Quieres cerrar sesión?</h2>
              <p className="mx-auto mt-3 max-w-md text-center text-sm text-gray-500 sm:text-base">Tu sesión actual se cerrará de forma segura.</p>

              {errorMessage && (
                <div role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut size={18} />
                  {loading ? "Cerrando sesión..." : "Cerrar sesión"}
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <Smile size={24} className="mb-3 text-[#0369A1]" />
                <h3 className="font-semibold text-[#00334F]">Tu ánimo</h3>
                <p className="mt-1 text-sm text-gray-500">Continúa cuidando tu bienestar.</p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <Dumbbell size={24} className="mb-3 text-[#0369A1]" />
                <h3 className="font-semibold text-[#00334F]">Ejercicios</h3>
                <p className="mt-1 text-sm text-gray-500">Mantén tus hábitos saludables.</p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <History size={24} className="mb-3 text-[#0369A1]" />
                <h3 className="font-semibold text-[#00334F]">Historial</h3>
                <p className="mt-1 text-sm text-gray-500">Tus actividades quedan asociadas a tu cuenta.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CerrarSesion;