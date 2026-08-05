import { Search, User, Menu, Heart, ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-orange-600 shadow-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          
          {/* IZQUIERDA: Menú Móvil y Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="sm:hidden text-white cursor-pointer hover:bg-blue-700 p-1 rounded-md transition">
              <Menu size={24} />
            </button>

            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/imagenes/logo.png" 
                alt="logo" 
                className="h-9 sm:h-10 object-contain"
              />
            </Link>
          </div>

          {/* CENTRO: Barra de Búsqueda Ancha */}
          <div className="hidden sm:flex flex-1 max-w-2xl bg-white rounded-full overflow-hidden h-10 shadow-sm">
            <input 
              type="text" 
              placeholder="MIS EMOCIONES..."
              className="flex-1 px-5 text-sm outline-none text-gray-700 placeholder-gray-400" 
            />
            <button className="px-5 bg-black text-white hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center">
              <Search size={18}/>
            </button>
          </div>

          {/* DERECHA: Iconos en el orden de la imagen (Corazón, Usuario, Carrito) */}
          <div className="flex items-center gap-4 text-white shrink-0">
            {/* Buscador solo para pantallas pequeñas */}
            <button className="sm:hidden cursor-pointer hover:opacity-80 transition p-1">
              <Search size={22} />
            </button>

            {/* Usuario */}
            <button className="cursor-pointer hover:opacity-80 transition p-1">
              <User size={22} />
            </button>
          </div>

        </div>
      </div>
    </header>
  )
}

export default Navbar