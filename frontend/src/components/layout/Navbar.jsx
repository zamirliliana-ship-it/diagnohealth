import { Search, User, Menu, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    // ACCESIBILIDAD: Se cambia a <nav> y se agrega aria-label
    <nav aria-label="Navegación principal" className="fixed top-0 left-0 z-50 w-full bg-orange-600 shadow-md">

      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">

        <div className="flex h-16 items-center justify-between gap-6">

          {/* ======================= IZQUIERDA ======================= */}
          <div className="flex shrink-0 items-center gap-3">

            <button
              type="button"
              className="cursor-pointer rounded-md p-1 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-white sm:hidden"
              aria-label="Abrir menú principal"
            >
              <Menu size={24} aria-hidden="true" />
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Ir a la página de inicio"
            >
              <img
                src="/imagenes/logo.png"
                alt="Logotipo de DiagnoHealth"
                className="h-9 object-contain sm:h-10"
              />
            </Link>

          </div>

          {/* ======================= CENTRO (BÚSQUEDA) ======================= */}
          {/* ACCESIBILIDAD: focus-within hace que el anillo azul aparezca cuando escribes */}
          <div className="hidden h-10 max-w-2xl flex-1 overflow-hidden rounded-full bg-white shadow-sm transition-all focus-within:ring-4 focus-within:ring-orange-300 sm:flex">

            <input
              type="text"
              placeholder="MIS EMOCIONES..."
              aria-label="Buscar emociones o recursos"
              className="flex-1 px-5 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />

            <button
              type="button"
              className="flex items-center justify-center bg-black px-5 text-white transition hover:bg-gray-800 focus:bg-gray-800 focus:outline-none"
              aria-label="Ejecutar búsqueda"
            >
              <Search size={18} aria-hidden="true" />
            </button>

          </div>

          {/* ======================= DERECHA (ACCIONES) ======================= */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4 text-white">

            <button
              type="button"
              className="cursor-pointer rounded-md p-1 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white sm:hidden"
              aria-label="Abrir búsqueda"
            >
              <Search size={22} aria-hidden="true" />
            </button>

            {/* NUEVO ENLACE: Test de Bienestar */}
            <Link
              to="/test-bienestar"
              className="flex cursor-pointer items-center gap-2 rounded-full p-2 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Realizar Test de Bienestar"
              title="Test de Bienestar"
            >
              <ClipboardList size={22} aria-hidden="true" />
              {/* Opcional: Mostrar la palabra "Test" solo en pantallas grandes */}
              <span className="hidden text-sm font-semibold md:inline">Test</span>
            </Link>

            <Link
              to="/cerrar-sesion"
              className="cursor-pointer rounded-full p-2 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Ir al perfil o cerrar sesión"
              title="Cerrar sesión"
            >
              <User size={22} aria-hidden="true" />
            </Link>

          </div>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;