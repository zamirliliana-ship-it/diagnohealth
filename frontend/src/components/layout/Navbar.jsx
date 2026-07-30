import { Search, User, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-orange-600 shadow-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 relative">
          {/*IZQUIERDA*/}
          <div className="flex items-center gap-3">
            <button className="sm:hidden text-white cursor-pointer hover:bg-orange-700 p-1 
            rounded-md transition">
              <Menu size={28} />
            </button>


           <Link to="/">
              <img src="/imagenes/logo.png" alt="logo" className="h-8 sm:h-10 
              object-contain"/>
           </Link>
          </div>
          {/*BUSCADOR*/}
          <div className="hidden sm:flex flex-1 max-6 mx-6 bg-white
          rounded-full overflow-hidden h-11 shadow-sm">
            <input type="text" placeholder="MIS EMOCIONES..."
            className="flex-1 px-5 text-sm outline-none text-gray-700" />
            <button className="px-5 bg-black text-white transition-color cursor-pointer">
            <Search size={20}/>
            </button>
          </div>
        </div>
      </div>


    </header>
  )
}

export default Navbar