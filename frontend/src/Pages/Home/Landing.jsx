import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  Share2,
  Globe,
  Bot,
  Heart,
  Activity,
  ShieldCheck,
  ClipboardList
} from 'lucide-react';

function Landing() {
  // Controla la visibilidad del menú de navegación en pantallas pequeñas (< lg)
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="App">

      {/* ================================
          ANIMACIONES
          Definidas aquí (en vez de un CSS global) para mantener el
          componente autocontenido. Si se reutilizan en otras páginas,
          conviene moverlas a un archivo CSS/Tailwind config compartido.
      ================================= */}
      <style>{`
        @keyframes dh-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes dh-float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(3deg);
          }
        }

        @keyframes dh-breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .dh-float {
          animation: dh-float 5s ease-in-out infinite;
        }

        .dh-float-slow {
          animation: dh-float-slow 7s ease-in-out infinite;
        }

        .dh-breathe-ring {
          animation: dh-breathe 3s ease-in-out infinite;
        }

        /*
          Accesibilidad: respeta la preferencia del sistema operativo de
          reducir animaciones. Ojo: esto solo cubre las animaciones
          personalizadas (dh-*). La clase de Tailwind animate-pulse
          usada mas abajo en el circulo decorativo NO esta cubierta por
          esta regla; si se quiere accesibilidad completa, hay que
          desactivarla tambien aqui o quitar animate-pulse del JSX.
        */
        @media (prefers-reduced-motion: reduce) {
          .dh-float,
          .dh-float-slow,
          .dh-breathe-ring {
            animation: none;
          }
        }
      `}</style>


      {/* ================================
          HEADER
          Barra de navegación fija (sticky) con logo, links de escritorio,
          botones de sesión/registro y botón hamburguesa para móvil.
      ================================= */}
      <header className="sticky top-0 w-full z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-gray-200">

        <nav className="flex justify-between items-center w-full px-4 md:px-8 py-4 max-w-[1400px] mx-auto min-h-[80px]">

          {/* LOGO */}
           <div className="flex items-center gap-2.5">
 
            <div className="relative flex h-10 w-10 items-center justify-center">

 
              <img
                src="/imagenes/diagnohealth-logo.png"
                alt="Logo de DIAGNOHEALTH"
                className="relative h-10 w-10 object-contain"
              />
 
            </div>
 

            <div className="text-lg sm:text-2xl font-bold text-[#0C4A6E]">
              DIAGNOHEALTH
            </div>

          </div>


          {/*
            MENÚ DESKTOP
          */}
          <div className="hidden lg:flex items-center gap-3">

            <a
              href="#funcionalidades"
              className="px-4 py-2 text-sm text-gray-600 font-semibold hover:text-[#0369A1] transition-colors"
            >
              Funcionalidades
            </a>

            <Link
              to="/test-bienestar"
              className="px-4 py-2 text-sm text-gray-600 font-semibold hover:text-[#0369A1] flex items-center gap-1.5 transition-colors"
            >
              <ClipboardList size={16} />
              Test de Bienestar
            </Link>

            <a
              href="#recursos"
              className="px-4 py-2 text-sm text-gray-600 hover:text-[#0369A1] transition-colors"
            >
              Recursos
            </a>

          </div>


          {/* BOTONES (sesión / registro / hamburguesa) */}
          <div className="flex items-center gap-2 sm:gap-3">

           <Link
           to="/login"   // ✅ antes decía "/inicioS"
            className="hidden md:block px-5 lg:px-6 py-2.5 rounded-xl border border-[#0369A1]/30 text-[#0C4A6E] text-sm font-semibold hover:bg-sky-50 transition-all"
          >
             Iniciar sesión
            </Link>

            <Link
              to="/registro"
              className="hidden sm:block px-5 lg:px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0369A1] to-[#0C4A6E] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              Registrarse
            </Link>

            {/* Botón hamburguesa: solo visible por debajo de `lg` */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="lg:hidden flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>

          </div>

        </nav>


        {/* ================================
            MENÚ MÓVIL
            Se renderiza condicionalmente solo cuando `menuOpen === true`.
            Cada link cierra el menú al hacer clic (onClick setMenuOpen(false)).
        ================================= */}
        {menuOpen && (

          <div className="lg:hidden border-t border-gray-200 bg-[#FAF7F2] px-4 pb-5">

            <div className="flex flex-col divide-y divide-gray-200">

              <a
                onClick={() => setMenuOpen(false)}
                href="#funcionalidades"
                className="py-3 text-sm font-semibold text-gray-700 hover:text-[#0369A1]"
              >
                Funcionalidades
              </a>

              <Link
                onClick={() => setMenuOpen(false)}
                to="/test-bienestar"
                className="py-3 text-sm font-semibold text-gray-700 hover:text-[#0369A1] flex items-center gap-2"
              >
                <ClipboardList size={16} />
                Test de Bienestar
              </Link>

              <a
                onClick={() => setMenuOpen(false)}
                href="#recursos"
                className="py-3 text-sm text-gray-700 hover:text-[#0369A1]"
              >
                Recursos
              </a>

              <a
                onClick={() => setMenuOpen(false)}
                href="#comunidad"
                className="py-3 text-sm text-gray-700 hover:text-[#0369A1]"
              >
                Comunidad
              </a>

              <a
                onClick={() => setMenuOpen(false)}
                href="#ayuda"
                className="py-3 text-sm text-gray-700 hover:text-[#0369A1]"
              >
                Ayuda
              </a>

            </div>


            <div className="mt-4 flex flex-col gap-2.5">

              <Link
                onClick={() => setMenuOpen(false)}
                to="/inicioS"
                className="w-full rounded-xl border border-[#0369A1]/30 py-2.5 text-center text-sm font-semibold text-[#0369A1]"
              >
                Iniciar sesión
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                to="/registro"
                className="w-full rounded-xl bg-gradient-to-r from-[#0369A1] to-[#0C4A6E] py-2.5 text-center text-sm font-semibold text-white"
              >
                Registrarse
              </Link>

            </div>

          </div>

        )}

      </header>


      {/* ================================
          HERO
          Sección principal above-the-fold: título, descripción, dos CTAs
          y una imagen ilustrativa con elementos flotantes decorativos.
      ================================= */}
      <main className="bg-[#FAF7F2] relative overflow-hidden">

        {/* Manchas decorativas de fondo (blur), puramente visuales */}

        <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="pointer-events-none absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-3xl" />


        <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden">

          <div className="max-w-[1400px] w-full mx-auto px-5 md:px-8">

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 lg:gap-4">


              {/* ================================
                  TEXTO HERO
              ================================= */}
              <div className="relative z-20 text-center md:text-left pt-12 md:pt-0">

                {/* ETIQUETA */}

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 text-[#0369A1] text-sm font-semibold">

                  <ShieldCheck size={17} />

                  Tu bienestar es nuestra prioridad

                </div>


                {/* TÍTULO */}

                <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] text-[#0C4A6E]">

                  Cuida tu

                  <span className="block bg-gradient-to-r from-[#0369A1] to-[#0C4A6E] bg-clip-text text-transparent">

                    bienestar mental

                  </span>

                </h1>


                {/* DESCRIPCIÓN */}

                <p className="mt-6 max-w-xl mx-auto md:mx-0 text-base sm:text-lg leading-relaxed text-gray-600">

                Un espacio seguro y empático donde puedes expresar lo que sientes
                comprender tus emociones y encontrar herramientas para cuidar de ti.
                 DiagnoHealth te acompaña en cada paso, ofreciéndote orientación y recursos
                 para fortalecer tu bienestar emocional y conocerte mejor.

                </p>

                {/* INFO SECUNDARIA (badges) */}

                <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-x-7 gap-y-3 text-sm text-gray-500">

                  <div className="flex items-center gap-2">

                    <Heart
                      size={17}
                      className="text-[#0369A1]"
                    />

                    Apoyo emocional

                  </div>


                  <div className="flex items-center gap-2">

                    <Bot
                      size={17}
                      className="text-[#0369A1]"
                    />

                    Chatbot disponible 24/7

                  </div>

                </div>

              </div>


              {/* ================================
                  IMAGEN HERO
              ================================= */}
              <div className="relative z-10 flex justify-center md:justify-end">

                {/* Mancha circular de fondo detrás de la imagen */}

                <div
                  className="
                    absolute
                    w-[380px]
                    h-[380px]
                    sm:w-[500px]
                    sm:h-[500px]
                    lg:w-[620px]
                    lg:h-[620px]
                    rounded-full
                    bg-sky-100/50
                    right-[-100px]
                    top-1/2
                    -translate-y-1/2
                  "
                />

                <div
                  className="
                    absolute
                    w-16
                    h-16
                    rounded-full
                    bg-[#0369A1]/10
                    top-10
                    right-12
                    animate-pulse
                  "
                />


                {/* Ícono de corazón flotante */}

                <div
                  className="
                    absolute
                    z-30
                    top-8
                    right-4
                    sm:right-14
                    w-12
                    h-12
                    rounded-full
                    bg-white
                    shadow-lg
                    flex
                    items-center
                    justify-center
                    dh-float
                  "
                >

                  <Heart
                    size={22}
                    className="text-pink-400 fill-pink-100"
                  />

                </div>


                {/* Ícono de bot flotante */}

                <div
                  className="
                    absolute
                    z-30
                    bottom-10
                    left-2
                    sm:left-10
                    w-12
                    h-12
                    rounded-full
                    bg-white
                    shadow-lg
                    flex
                    items-center
                    justify-center
                    dh-float-slow
                  "
                >

                  <Bot
                    size={22}
                    className="text-[#0369A1]"
                  />

                </div>

                <img
                  src="/imagenes/imagenes/hero-mental.png"
                  alt="Personas brindándose apoyo emocional"
                  width={650}
                  height={650}
                  className="
                    relative
                    z-10
                    w-full
                    max-w-[650px]
                    h-auto
                    object-contain
                    drop-shadow-[0_20px_35px_rgba(12,74,110,0.10)]
                    dh-float
                  "
                />

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* ================================
          HERRAMIENTAS / FUNCIONALIDADES
          Tres tarjetas con ícono, título, descripción y link.
      ================================= */}
      <section
        id="funcionalidades"
        className="bg-[#FAF7F2] py-14 sm:py-20 relative overflow-hidden"
      >

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">

          <div className="text-center mb-12 space-y-2">

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C4A6E]">
              Herramientas para tu mente
            </h2>

            <p className="text-sm sm:text-base text-gray-600">
              Tecnología humana diseñada para apoyarte en cada paso.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


            {/* TARJETA: CHATBOT */}

            <div className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col items-center text-center space-y-4 transition-all hover:shadow-xl hover:-translate-y-1.5 hover:border-sky-200">

              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center text-[#0369A1]">

                <Bot size={32} />

              </div>

              <h3 className="text-xl font-bold text-[#0C4A6E]">
                Chatbot de IA
              </h3>

              <p className="text-gray-600">
                Un compañero empático disponible 24/7 para escucharte y
                orientarte cuando necesites apoyo emocional.
              </p>


            </div>


            {/* TARJETA: TEST EMOCIONAL */}

            <div className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col items-center text-center space-y-4 transition-all hover:shadow-xl hover:-translate-y-1.5 hover:border-sky-200">

              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center text-[#0C4A6E]">

                <Heart size={32} />

              </div>

              <h3 className="text-xl font-bold text-[#0C4A6E]">
                Test Emocional
              </h3>

              <p className="text-gray-600">
                Conoce mejor cómo te sientes mediante una evaluación
                orientativa y descubre recursos que pueden ayudarte.
              </p>

              <Link
                to="/test-bienestar"
                className="pt-2 text-sm text-[#0369A1] flex items-center gap-1 hover:underline"
              >
                Realizar test
                <ArrowUpRight size={16} />
              </Link>

            </div>


            {/* TARJETA: SEGUIMIENTO DE ÁNIMO */}

            <div className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col items-center text-center space-y-4 transition-all hover:shadow-xl hover:-translate-y-1.5 hover:border-sky-200">

              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center text-[#0369A1]">

                <Activity size={32} />

              </div>

              <h3 className="text-xl font-bold text-[#0C4A6E]">
                Seguimiento de Ánimo
              </h3>

              <p className="text-gray-600">
                Registra tus emociones y observa tus cambios para mejorar
                tu autoconocimiento.
              </p>

              {/* Mismo caso que "Saber más" arriba: href="#" sin destino real */}
              <a
                href="#"
                className="pt-2 text-sm text-[#0369A1] flex items-center gap-1 hover:underline"
              >
                
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* ================================
          ESTADÍSTICAS
          Banda con tres métricas destacadas (usuarios, valoración, soporte).
          NOTA: los valores (+50k, 4.9/5, 24/7) están fijos ("hardcodeados").
          Si en el futuro se vuelven dinámicos (ej. desde una API/base de
          datos), conviene extraerlos a variables o props.
      ================================= */}
      <section className="bg-gradient-to-br from-[#0369A1] to-[#0C4A6E] text-white py-14">

        <div className="max-w-[1400px] mx-auto px-4 md:px-8">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">

            <div>
              <div className="text-4xl font-bold text-sky-200">
                +50k
              </div>

              <p className="mt-1 text-sm uppercase tracking-widest text-sky-100/80">
                usuarios activos
              </p>
            </div>


            <div>
              <div className="text-4xl font-bold text-sky-200">
                4.9/5
              </div>

              <p className="mt-1 text-sm uppercase tracking-widest text-sky-100/80">
                valoración media
              </p>
            </div>


            <div>
              <div className="text-4xl font-bold text-sky-200">
                24/7
              </div>

              <p className="mt-1 text-sm uppercase tracking-widest text-sky-100/80">
                soporte disponible
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* ================================
          CTA FINAL
      ================================= */}
      <section
        id="ayuda"
        className="bg-[#FAF7F2] py-14 sm:py-20 overflow-hidden relative"
      >

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">

          <div className="bg-white/80 backdrop-blur-md border border-gray-200 p-7 sm:p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-7">

            <div className="space-y-2 text-center md:text-left">

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0C4A6E]">
                ¿Listo para transformar tu bienestar?
              </h2>

              <p className="text-sm sm:text-base text-gray-600 max-w-lg">
                Comienza a conocer mejor tus emociones y encuentra
                herramientas que pueden acompañarte en tu día a día.
              </p>

            </div>


            <Link
              to="/registro"
              className="
                whitespace-nowrap
                px-8
                py-4
                rounded-full
                bg-gradient-to-r
                from-[#0369A1]
                to-[#0C4A6E]
                text-white
                font-bold
                shadow-lg
                hover:shadow-xl
                hover:-translate-y-0.5
                transition-all
                flex
                items-center
                gap-2
              "
            >

              Empieza Gratis

              <ArrowRight size={20} />

            </Link>

          </div>

        </div>

      </section>


      {/* ================================
          FOOTER
      ================================= */}
      <footer className="bg-[#FAF7F2] border-t border-gray-200">

        <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-8 py-8 max-w-[1400px] mx-auto">

          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">

            <span className="text-xl font-bold text-[#0C4A6E]">
              DIAGNOHEALTH
            </span>

            <p className="text-xs text-gray-500">
              © 2026 DIAGNOHEALTH. Todos los derechos reservados.
            </p>

          </div>


          <div className="flex flex-wrap justify-center gap-8">

            <a
              href="#"
              className="text-xs text-gray-500 hover:text-[#0369A1]"
            >
              Privacidad
            </a>

            <a
              href="#"
              className="text-xs text-gray-500 hover:text-[#0369A1]"
            >
              Términos
            </a>

            <a
              href="#"
              className="text-xs text-gray-500 hover:text-[#0369A1]"
            >
              Contacto
            </a>

            <a
              href="#"
              className="text-xs text-gray-500 hover:text-[#0369A1]"
            >
              Blog
            </a>

          </div>


          <div className="flex items-center gap-3 mt-5 md:mt-0">

            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-sky-100 transition-colors cursor-pointer">

              <Share2 size={17} />

            </div>


            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-sky-100 transition-colors cursor-pointer">

              <Globe size={17} />

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Landing;