import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, ArrowUpRight, Share2, Globe, Bot, Heart, Activity, ShieldCheck, ClipboardList } from 'lucide-react';

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="App">

      <style>{`
        @keyframes dh-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes dh-float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes dh-breathe {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 0; }
        }
        .dh-float { animation: dh-float 5s ease-in-out infinite; }
        .dh-float-slow { animation: dh-float-slow 7s ease-in-out infinite; }
        .dh-breathe-ring { animation: dh-breathe 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .dh-float, .dh-float-slow, .dh-breathe-ring, .animate-pulse { animation: none; }
        }
      `}</style>

      <header className="sticky top-0 w-full z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-gray-200">
        <nav className="flex justify-between items-center w-full px-4 md:px-8 py-4 max-w-[1400px] mx-auto h-20">
          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center sm:h-9 sm:w-9">
              <span className="dh-breathe-ring absolute inset-0 rounded-full bg-[#0369A1]" />
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#0369A1] to-[#0C4A6E] text-white sm:h-9 sm:w-9">
                <Activity size={16} />
              </span>
            </div>
            <div className="truncate text-lg font-bold text-[#0C4A6E] sm:text-2xl">
              DIAGNOHEALTH
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a className="px-4 py-2 text-sm text-gray-600 font-bold transition-colors hover:text-[#0369A1]" href="#">Funcionalidades</a>

            {/* NUEVO: ENLACE AL TEST DE BIENESTAR (Corregido sin subrayado permanente) */}
            <Link to="/test-bienestar" className="px-4 py-2 text-sm text-gray-600 font-bold hover:text-[#0369A1] flex items-center gap-1.5 transition-colors">
              <ClipboardList size={16} aria-hidden="true" />
              Test de Bienestar
            </Link>

            <a className="px-4 py-2 text-sm text-gray-600 hover:text-[#0369A1] transition-colors" href="#">Recursos</a>
            <a className="px-4 py-2 text-sm text-gray-600 hover:text-[#0369A1] transition-colors" href="#">Comunidad</a>
            <a className="px-4 py-2 text-sm text-gray-600 hover:text-[#0369A1] transition-colors" href="#">Ayuda</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/inicioS" className="hidden md:block px-6 py-2.5 rounded-lg border border-gray-300 text-[#0369A1] text-sm font-medium active:scale-95 duration-150 transition-all hover:bg-gray-50">
              Iniciar sesión
            </Link>
            <Link to="/registro" className="hidden sm:block px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg bg-gradient-to-br from-[#0369A1] to-[#0C4A6E] text-white text-sm font-medium active:scale-95 duration-150 transition-all shadow-sm hover:shadow-md">
              Registrarse
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              className="md:hidden flex items-center justify-center p-2 rounded-lg text-gray-600 transition hover:bg-gray-100"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* MENÚ MÓVIL */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-[#FAF7F2] px-4 pb-4">
            <div className="flex flex-col divide-y divide-gray-200">
              <a onClick={() => setMenuOpen(false)} className="py-3 text-sm font-bold text-gray-700 hover:text-[#0369A1]" href="#">Funcionalidades</a>

              <Link onClick={() => setMenuOpen(false)} to="/test-bienestar" className="py-3 text-sm font-bold text-gray-700 hover:text-[#0369A1] flex items-center gap-1.5">
                <ClipboardList size={16} aria-hidden="true" />
                Test de Bienestar
              </Link>

              <a onClick={() => setMenuOpen(false)} className="py-3 text-sm text-gray-700 hover:text-[#0369A1]" href="#">Recursos</a>
              <a onClick={() => setMenuOpen(false)} className="py-3 text-sm text-gray-700 hover:text-[#0369A1]" href="#">Comunidad</a>
              <a onClick={() => setMenuOpen(false)} className="py-3 text-sm text-gray-700 hover:text-[#0369A1]" href="#">Ayuda</a>
            </div>

            <div className="mt-3 flex flex-col gap-2.5">
              <Link
                onClick={() => setMenuOpen(false)}
                to="/inicioS"
                className="w-full rounded-lg border border-gray-300 py-2.5 text-center text-sm font-medium text-[#0369A1] transition hover:bg-gray-50"
              >
                Iniciar sesión
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                to="/registro"
                className="w-full rounded-lg bg-gradient-to-br from-[#0369A1] to-[#0C4A6E] py-2.5 text-center text-sm font-medium text-white shadow-sm"
              >
                Registrarse
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="bg-[#FAF7F2] relative overflow-hidden">

        {/* Textura de fondo, mismos tonos de marca */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#0369A1] opacity-[0.07] blur-[110px]" />
        <div className="pointer-events-none absolute top-1/4 -right-40 h-[30rem] w-[30rem] rounded-full bg-[#0C4A6E] opacity-[0.06] blur-[130px]" />

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 sm:py-10 md:py-24 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 relative z-10">
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-sky-100 rounded-full text-[#0369A1] text-sm">
              <ShieldCheck size={16} />
              Tu bienestar es nuestra prioridad
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0C4A6E] leading-tight">
              Encuentra tu <br className="hidden md:block" /> <span className="bg-gradient-to-r from-[#0369A1] to-[#0C4A6E] bg-clip-text text-transparent">equilibrio mental</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-[540px]">
              Tu espacio seguro para el bienestar emocional y el crecimiento personal. Descubre herramientas diseñadas por expertos para cultivar la calma en tu día a día.
            </p>
          </div>
          <div className="flex-1 relative w-full flex justify-center">
            <div className="relative w-full max-w-[500px]">
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-sky-300/10 rounded-full blur-2xl"></div>

              {/* Íconos flotantes decorativos, coherentes con el tema de calma */}
              <div className="dh-float absolute -top-4 right-6 z-20 hidden h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg sm:flex">
                <Heart size={24} className="text-[#0369A1]" />
              </div>
              <div className="dh-float-slow absolute bottom-8 -left-6 z-20 hidden h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg sm:flex">
                <Bot size={24} className="text-[#0C4A6E]" />
              </div>

              <img
                alt="Meditación y calma"
                className="relative z-10 w-full h-auto object-cover rounded-xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWq5youNqBMS2uAGdTZAYNjSwgK-mfkDX90bfsXnQYEbXNtwYTl7vdVg7tk6Vz2v2QHagywsydQwFhInygPfn4x2HkZabog_o0tHzcLQuzHRoSCiEl5pcCtn-1X7cBuM4XF4B3lFjn-FNR8s_YJGNKJ1YeQ7wLV8Qp1xmcmo0In_sy7Ij015VtTcfUQdPMmhPXo89qDLJvPyaQtAKLEgypyp8sYR2wQp3Zx8MtXA7cwPwVK05vqM3QXt06TeHLzI7U6IDWc7NJUsU"
              />
            </div>
          </div>
        </div>
      </main>

      <section className="bg-[#FAF7F2] py-10 sm:py-16 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-10 sm:mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C4A6E]">Herramientas para tu mente</h2>
            <p className="text-sm sm:text-base text-gray-600">Tecnología humana diseñada para apoyarte en cada paso.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center space-y-4 transition-all hover:shadow-xl hover:-translate-y-1.5 hover:border-sky-200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center text-[#0369A1]">
                <Bot size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#0C4A6E]">Chatbot de IA</h3>
              <p className="text-gray-600">
                Un compañero empático disponible 24/7 para escucharte y guiarte con técnicas de terapia breve.
              </p>
              <a className="pt-2 text-sm text-[#0369A1] flex items-center gap-1 hover:underline" href="#">
                Saber más <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center space-y-4 transition-all hover:shadow-xl hover:-translate-y-1.5 hover:border-sky-200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center text-[#0C4A6E]">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#0C4A6E]">Test Emocional</h3>
              <p className="text-gray-600">
                Evaluaciones clínicas rápidas para entender mejor tu estado actual y recibir recomendaciones personalizadas.
              </p>
              <a className="pt-2 text-sm text-[#0369A1] flex items-center gap-1 hover:underline" href="#">
                Saber más <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center space-y-4 transition-all hover:shadow-xl hover:-translate-y-1.5 hover:border-sky-200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center text-[#0369A1]">
                <Activity size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#0C4A6E]">Seguimiento de Ánimo</h3>
              <p className="text-gray-600">
                Registra tus emociones diarias y visualiza patrones para mejorar tu autoconocimiento a largo plazo.
              </p>
              <a className="pt-2 text-sm text-[#0369A1] flex items-center gap-1 hover:underline" href="#">
                Saber más <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#0369A1] to-[#0C4A6E] text-white py-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 text-center">
            <div className="space-y-1">
              <div className="text-4xl font-bold text-sky-200">+50k</div>
              <p className="text-sm uppercase tracking-widest text-sky-100/80">usuarios activos</p>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold text-sky-200">4.9/5</div>
              <p className="text-sm uppercase tracking-widest text-sky-100/80">valoración media</p>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold text-sky-200">24/7</div>
              <p className="text-sm uppercase tracking-widest text-sky-100/80">soporte disponible</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FAF7F2] py-10 sm:py-16 overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
          <div className="bg-white/70 backdrop-blur-md border border-gray-200 p-6 sm:p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0C4A6E]">¿Listo para transformar tu bienestar?</h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-lg">Únete a miles de personas que ya están cuidando su salud mental con DIAGNOHEALTH. Comienza tu prueba gratuita hoy mismo.</p>
            </div>
            <Link
              to="/registro"
              className="w-full md:w-auto justify-center whitespace-nowrap px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-gradient-to-br from-[#0369A1] to-[#0C4A6E] text-white text-base sm:text-lg font-bold shadow-lg active:scale-95 transition-all hover:shadow-xl flex items-center gap-2"
            >
              Empieza Gratis
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-sky-200/10 rounded-full blur-3xl"></div>
      </section>

      <footer className="bg-[#FAF7F2] border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-8 py-8 max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
            <span className="text-xl font-bold text-[#0C4A6E]">DIAGNOHEALTH</span>
            <p className="text-xs text-gray-500">
              © 2024 DIAGNOHEALTH. Todos los derechos reservados.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="text-xs text-gray-500 hover:text-[#0369A1] transition-colors" href="#">Privacidad</a>
            <a className="text-xs text-gray-500 hover:text-[#0369A1] transition-colors" href="#">Términos</a>
            <a className="text-xs text-gray-500 hover:text-[#0369A1] transition-colors" href="#">Contacto</a>
            <a className="text-xs text-gray-500 hover:text-[#0369A1] transition-colors" href="#">Blog</a>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-sky-100 transition-colors cursor-pointer">
              <Share2 size={18} />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-sky-100 transition-colors cursor-pointer">
              <Globe size={18} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;