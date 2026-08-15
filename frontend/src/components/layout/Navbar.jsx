import { Search, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-orange-600 shadow-md">

      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">

        <div className="flex h-16 items-center justify-between gap-6">

          <div className="flex shrink-0 items-center gap-3">

            <button
              type="button"
              className="cursor-pointer rounded-md p-1 text-white hover:bg-blue-700 sm:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={24} />
            </button>

            <Link
              to="/"
              className="flex items-center gap-2"
            >
              <img
                src="/imagenes/logo.png"
                alt="DiagnoHealth"
                className="h-9 object-contain sm:h-10"
              />
            </Link>

          </div>

          <div className="hidden h-10 max-w-2xl flex-1 overflow-hidden rounded-full bg-white shadow-sm sm:flex">

            <input
              type="text"
              placeholder="MIS EMOCIONES..."
              className="flex-1 px-5 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />

            <button
              type="button"
              className="flex items-center justify-center bg-black px-5 text-white hover:bg-gray-800"
              aria-label="Buscar"
            >
              <Search size={18} />
            </button>

          </div>

          <div className="flex shrink-0 items-center gap-4 text-white">

            <button
              type="button"
              className="cursor-pointer p-1 hover:opacity-80 sm:hidden"
              aria-label="Buscar"
            >
              <Search size={22} />
            </button>

            <Link
              to="/cerrar-sesion"
              className="cursor-pointer rounded-full p-1 hover:bg-white/10"
              aria-label="Cerrar sesión"
            >
              <User size={22} />
            </Link>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;