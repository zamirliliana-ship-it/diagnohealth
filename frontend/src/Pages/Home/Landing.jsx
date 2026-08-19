import { Link } from 'react-router-dom';
import { Menu, ArrowRight, ArrowUpRight, Share2, Globe, Bot, Heart, Activity, ShieldCheck, ClipboardList } from 'lucide-react';

function Landing() {
  return (
    <div className="App">
      <header className="sticky top-0 w-full z-50 bg-[#FAF7F2] border-b border-gray-200">
        <nav className="flex justify-between items-center w-full px-4 md:px-8 py-4 max-w-[1400px] mx-auto h-20">
          <div className="text-2xl font-bold text-[#0C4A6E]">
            DIAGNOHEALTH
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
          <div className="flex items-center gap-3">
            <Link to="/inicioS" className="hidden md:block px-6 py-2.5 rounded-lg border border-gray-300 text-[#0369A1] text-sm font-medium active:scale-95 duration-150 transition-all hover:bg-gray-50">
              Iniciar sesión
            </Link>
            <Link to="/registro" className="px-6 py-2.5 rounded-lg bg-[#0369A1] text-white text-sm font-medium active:scale-95 duration-150 transition-all shadow-sm hover:shadow-md">
              Registrarse
            </Link>
            <button className="md:hidden flex items-center justify-center p-2">
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      <main className="bg-[#FAF7F2] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-24 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-sky-100 rounded-full text-[#0369A1] text-sm">
              <ShieldCheck size={16} />
              Tu bienestar es nuestra prioridad
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0C4A6E] leading-tight">
              Encuentra tu <br className="hidden md:block" /> <span className="text-[#0369A1]">equilibrio mental</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-[540px]">
              Tu espacio seguro para el bienestar emocional y el crecimiento personal. Descubre herramientas diseñadas por expertos para cultivar la calma en tu día a día.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <button className="px-8 py-4 rounded-lg bg-[#0369A1] text-white text-sm font-medium flex items-center gap-2 active:scale-95 transition-all">
                Comenzar ahora
                <ArrowRight size={18} />
              </button>
              <button className="px-8 py-4 rounded-lg border-2 border-gray-300 text-gray-800 text-sm font-medium active:scale-95 transition-all hover:bg-white/50">
                Ver demo
              </button>
            </div>
          </div>
          <div className="flex-1 relative w-full flex justify-center">
            <div className="relative w-full max-w-[500px]">
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-sky-300/10 rounded-full blur-2xl"></div>
              <img
                alt="Meditación y calma"
                className="relative z-10 w-full h-auto object-cover rounded-xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWq5youNqBMS2uAGdTZAYNjSwgK-mfkDX90bfsXnQYEbXNtwYTl7vdVg7tk6Vz2v2QHagywsydQwFhInygPfn4x2HkZabog_o0tHzcLQuzHRoSCiEl5pcCtn-1X7cBuM4XF4B3lFjn-FNR8s_YJGNKJ1YeQ7wLV8Qp1xmcmo0In_sy7Ij015VtTcfUQdPMmhPXo89qDLJvPyaQtAKLEgypyp8sYR2wQp3Zx8MtXA7cwPwVK05vqM3QXt06TeHLzI7U6IDWc7NJUsU"
              />
            </div>
          </div>
        </div>
      </main>

      <section className="bg-[#FAF7F2] py-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-bold text-[#0C4A6E]">Herramientas para tu mente</h2>
            <p className="text-gray-600">Tecnología humana diseñada para apoyarte en cada paso.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center space-y-4 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center text-[#0369A1]">
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

            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center space-y-4 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center text-[#0C4A6E]">
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

            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center space-y-4 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center text-[#0369A1]">
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

      <section className="bg-[#0C4A6E] text-white py-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
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

      <section className="bg-[#FAF7F2] py-16 overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
          <div className="bg-white/70 backdrop-blur-md border border-gray-200 p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-bold text-[#0C4A6E]">¿Listo para transformar tu bienestar?</h2>
              <p className="text-gray-600 max-w-lg">Únete a miles de personas que ya están cuidando su salud mental con DIAGNOHEALTH. Comienza tu prueba gratuita hoy mismo.</p>
            </div>
            <button className="whitespace-nowrap px-10 py-5 rounded-full bg-[#0369A1] text-white text-lg font-bold shadow-lg active:scale-95 transition-all">
              Empieza Gratis
            </button>
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