import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  MessageSquare,
  History,
  User,
  LogOut,
  Menu,
  X,
  Smile,
  Dumbbell,
} from "lucide-react";

import { supabase } from "../../config/supabase";

function CerrarSesion() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleCancel = () => {
    navigate("/chatbot");
  };

  const handleLogout = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      navigate("/inicioS", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Error cerrando sesión:",
        error
      );

      setErrorMessage(
        error.message ||
          "No fue posible cerrar la sesión."
      );

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1C1A]">

      {/* MENÚ MÓVIL */}

      <button
        type="button"
        onClick={() =>
          setMenuOpen((value) => !value)
        }
        className="fixed left-4 top-4 z-[60] rounded-lg bg-[#0C4A6E] p-2 text-white shadow-md md:hidden"
        aria-label="Abrir menú"
      >
        {menuOpen ? (
          <X size={24} />
        ) : (
          <Menu size={24} />
        )}
      </button>

      {/* SIDEBAR */}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64
          flex-col bg-[#0C4A6E] text-white shadow-xl
          transition-transform duration-300
          md:translate-x-0
          ${
            menuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        <div className="flex h-20 items-center border-b border-white/10 px-5">

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-bold text-[#0C4A6E]">
              D
            </div>

            <span className="text-lg font-bold">
              DIAGNOHEALTH
            </span>

          </Link>

        </div>

        <nav className="flex-1 space-y-2 px-3 py-7">

          <Link
            to="/"
            className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm text-white/80 hover:bg-white/10"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            to="/chatbot"
            className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm text-white/80 hover:bg-white/10"
          >
            <MessageSquare size={20} />
            Chat con IA
          </Link>

          <button
            type="button"
            className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm text-white/80 hover:bg-white/10"
          >
            <History size={20} />
            Mis Caminos
          </button>

          <Link
            to="/inicioS"
            className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm text-white/80 hover:bg-white/10"
          >
            <User size={20} />
            Perfil
          </Link>

        </nav>

        <div className="px-4 pb-6">

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">

            <p className="mb-3 text-sm font-medium">
              Nivel de Bienestar
            </p>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">

              <div
                className="h-full rounded-full bg-[#7BC2FF]"
                style={{
                  width: "65%",
                }}
              />

            </div>

          </div>

        </div>

      </aside>

      {/* OVERLAY */}

      {menuOpen && (
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Cerrar menú"
        />
      )}

      {/* CONTENIDO */}

      <main className="ml-0 min-h-screen md:ml-64">

        <header className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">

          <div className="pl-12 md:pl-0">

            <h1 className="text-2xl font-bold text-[#00334F]">
              Cerrar sesión
            </h1>

            <p className="mt-1 text-gray-500">
              Administra tu sesión de DiagnoHealth.
            </p>

          </div>

        </header>

        <section className="px-4 py-10 sm:px-6">

          <div className="mx-auto max-w-2xl">

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">

                <LogOut size={30} />

              </div>

              <h2 className="text-center text-2xl font-bold text-[#00334F]">
                ¿Quieres cerrar sesión?
              </h2>

              <p className="mx-auto mt-3 max-w-md text-center text-gray-500">
                Tu sesión actual se cerrará de forma segura.
              </p>

              {errorMessage && (
                <div
                  role="alert"
                  className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {errorMessage}
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <LogOut size={18} />

                  {loading
                    ? "Cerrando sesión..."
                    : "Cerrar sesión"}

                </button>

              </div>

            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                <Smile
                  size={24}
                  className="mb-3 text-[#0369A1]"
                />

                <h3 className="font-semibold text-[#00334F]">
                  Tu ánimo
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Continúa cuidando tu bienestar.
                </p>

              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                <Dumbbell
                  size={24}
                  className="mb-3 text-[#0369A1]"
                />

                <h3 className="font-semibold text-[#00334F]">
                  Ejercicios
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Mantén tus hábitos saludables.
                </p>

              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                <History
                  size={24}
                  className="mb-3 text-[#0369A1]"
                />

                <h3 className="font-semibold text-[#00334F]">
                  Historial
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Tus actividades quedan asociadas a tu cuenta.
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default CerrarSesion;