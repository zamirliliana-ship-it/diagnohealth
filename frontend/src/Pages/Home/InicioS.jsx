import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

function IncioS() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate('/perfil');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 md:p-8 overflow-x-hidden">
      {/* Fondo atmosférico sutil */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full blur-[120px] bg-sky-300/30"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] rounded-full blur-[120px] bg-[#0C4A6E]/10"></div>
      </div>

      {/* Contenedor del login */}
      <main className="relative z-10 w-full max-w-[440px]">
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-[0px_4px_20px_rgba(12,74,110,0.04)]">
          {/* Marca */}
          <div className="flex flex-col items-center mb-8">
            <span className="text-2xl font-bold text-[#0369A1] mb-1">
              DIAGNOHEALTH
            </span>
            <h1 className="text-xl font-bold text-gray-800 text-center">
              Bienvenido de vuelta
            </h1>
            <p className="text-gray-500 text-sm mt-1 text-center opacity-70">
              Tu espacio seguro de bienestar mental.
            </p>
          </div>

          {/* Formulario */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 block" htmlFor="email">
                Correo electrónico
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0369A1] transition-colors" />
                <input
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-200 focus:border-[#0369A1] outline-none transition-all placeholder:text-gray-300"
                  id="email"
                  name="email"
                  placeholder="ejemplo@diagnohealth.com"
                  required
                  type="email"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600 block" htmlFor="password">
                Contraseña
              </label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0369A1] transition-colors" />
                <input
                  className="w-full pl-11 pr-11 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-200 focus:border-[#0369A1] outline-none transition-all placeholder:text-gray-300"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0369A1] transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  className="peer h-5 w-5 rounded border-gray-300 text-[#0369A1] focus:ring-sky-200 transition-all cursor-pointer"
                  type="checkbox"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  Recordarme
                </span>
              </label>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- TODO: enlazar cuando exista la pantalla de recuperar contraseña */}
              <a className="text-sm text-[#0369A1] hover:text-[#0C4A6E] transition-colors" href="#">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              className="w-full bg-[#0369A1] hover:bg-[#0C4A6E] text-white text-sm font-medium py-2.5 rounded-lg shadow-sm active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Cargando...</span>
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase tracking-wider">
                O continuar con
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-600" type="button">
                Google
              </button>
              <button className="flex items-center justify-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-600" type="button">
                Otras apps
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link className="text-[#0369A1] font-bold hover:underline transition-all" to="/registro">Regístrate</Link>
            </p>
          </div>
        </div>

        <footer className="mt-8 flex flex-wrap justify-center gap-4 text-gray-400 text-xs">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- TODO: enlazar cuando exista la pantalla de Ayuda */}
          <a className="hover:text-[#0369A1] transition-colors" href="#">Ayuda</a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- TODO: enlazar cuando exista la pantalla de Privacidad */}
          <a className="hover:text-[#0369A1] transition-colors" href="#">Privacidad</a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- TODO: enlazar cuando exista la pantalla de Términos */}
          <a className="hover:text-[#0369A1] transition-colors" href="#">Términos</a>
          <span className="hidden md:inline">|</span>
          <span>© 2024 DIAGNOHEALTH. Todos los derechos reservados.</span>
        </footer>
      </main>
    </div>
  );
}

export default IncioS;