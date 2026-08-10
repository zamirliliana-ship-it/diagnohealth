import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  MessageSquare,
  User,
  AlertTriangle,
  Send,
  Smile,
  History,
} from "lucide-react";

function Chatbot() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hola, ¿cómo te sientes hoy?",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "user",
      text: "Me he sentido un poco ansioso",
      time: "10:31 AM",
    },
    {
      id: 3,
      sender: "ai",
      text: "Lamento escuchar que te sientes así. Es valiente reconocerlo. ¿Hay algo específico que haya desencadenado esa ansiedad o simplemente ha ido creciendo durante el día? Estoy aquí para escucharte sin juicios.",
      time: "10:32 AM",
    },
  ]);

  const textareaRef = useRef(null);

  // Ajustar automáticamente la altura del campo de texto
  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";

    const height = Math.min(textarea.scrollHeight, 150);

    textarea.style.height = `${height}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > 150 ? "auto" : "hidden";
  }, [message]);

  // Enviar mensaje
  const handleSendMessage = () => {
    const text = message.trim();

    if (!text) return;

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Respuesta temporal
    setTimeout(() => {
      const response = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Gracias por compartir lo que estás sintiendo. Estoy aquí para escucharte y acompañarte.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  // Enter para enviar
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Ir a Crisis Alert
  const handleEmergency = () => {
    navigate("/crisisAlert");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1C1A]">

      {/* =====================================================
          BOTÓN MENÚ MÓVIL
      ====================================================== */}
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed left-4 top-4 z-[60] rounded-lg bg-[#0C4A6E] p-2 text-white shadow-md md:hidden"
        aria-label="Abrir menú"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
          bg-[#0C4A6E] text-white shadow-xl
          transition-transform duration-300
          md:translate-x-0
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* LOGO */}
        <div className="flex h-20 items-center border-b border-white/10 px-5">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3"
          >

            {/* Icono */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-bold text-[#0C4A6E]">
              D
            </div>

            {/* Nombre */}
            <span className="text-lg font-bold tracking-tight">
              DIAGNOHEALTH
            </span>

          </Link>

        </div>

        {/* ===================================================
            OPCIONES DEL MENÚ
        ==================================================== */}
        <nav className="flex-1 space-y-2 px-3 py-7">

          {/* DASHBOARD */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          {/* CHAT CON IA */}
          <Link
            to="/chatbot"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-4 rounded-lg bg-[#0369A1] px-4 py-3 text-sm font-semibold text-white shadow-sm"
          >
            <MessageSquare size={20} />
            <span>Chat con IA</span>
          </Link>

          {/* MIS CAMINOS */}
          <button
            type="button"
            className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <History size={20} />
            <span>Mis Caminos</span>
          </button>

          {/* PERFIL */}
          <Link
            to="/inicioS"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <User size={20} />
            <span>Perfil</span>
          </Link>

        </nav>

        {/* ===================================================
            NIVEL DE BIENESTAR
        ==================================================== */}
        <div className="px-4 pb-6">

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">

            <p className="mb-3 text-sm font-medium text-white">
              Nivel de Bienestar
            </p>

            {/* Barra */}
            <div className="h-2 overflow-hidden rounded-full bg-white/10">

              <div
                className="h-full rounded-full bg-[#7BC2FF]"
                style={{ width: "65%" }}
              />

            </div>

          </div>

        </div>

      </aside>

      {/* =====================================================
          FONDO OSCURO EN MÓVIL
      ====================================================== */}
      {menuOpen && (
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Cerrar menú"
        />
      )}

      {/* =====================================================
          CONTENIDO PRINCIPAL
      ====================================================== */}
      <main className="ml-0 flex min-h-screen flex-col md:ml-64">

        {/* ===================================================
            ENCABEZADO
        ==================================================== */}
        <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">

          <div className="mx-auto flex max-w-7xl items-center justify-between">

            <div className="pl-12 md:pl-0">

              <h1 className="text-xl font-bold text-[#0C4A6E] sm:text-2xl">
                Chat
              </h1>

              <p className="text-sm text-gray-500">
                Un espacio seguro para hablar y ser escuchado
              </p>

            </div>

            {/* AYUDA URGENTE */}
            <button
              type="button"
              onClick={handleEmergency}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-95 sm:px-4"
            >
              <AlertTriangle size={18} />

              <span className="hidden sm:inline">
                Ayuda urgente
              </span>

            </button>

          </div>

        </header>

        {/* ===================================================
            ÁREA DE MENSAJES
        ==================================================== */}
        <section className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">

          <div className="mx-auto flex max-w-6xl flex-col gap-6">

            {messages.map((msg) => (

              <div
                key={msg.id}
                className={`flex ${msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
                  }`}
              >

                <div
                  className={`flex max-w-[85%] flex-col sm:max-w-[70%] ${msg.sender === "user"
                    ? "items-end"
                    : "items-start"
                    }`}
                >

                  {/* INFORMACIÓN DE YAIRA */}
                  {msg.sender === "ai" && (

                    <div className="mb-1 flex items-center gap-2">

                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7BC2FF] text-sm font-bold text-[#004F7B]">
                        Y
                      </div>

                      <span className="text-xs font-medium text-gray-500">
                        YAIRA IA
                      </span>

                    </div>

                  )}

                  {/* BURBUJA */}
                  <div
                    className={`rounded-xl px-4 py-3 ${msg.sender === "user"
                      ? "rounded-tr-none bg-[#0369A1] text-white"
                      : "rounded-tl-none border border-[#C1C7CF]/30 bg-[#E0F2FE] text-[#004F7B]"
                      }`}
                  >

                    <p className="text-sm leading-6 sm:text-base">
                      {msg.text}
                    </p>

                  </div>

                  {/* HORA */}
                  <span className="mt-1 text-xs text-gray-400">
                    {msg.time}
                  </span>

                </div>

              </div>

            ))}

            {/* INDICADOR DE ESCRITURA */}
            <div className="flex items-center">

              <div className="rounded-lg bg-[#E0F2FE] px-4 py-2">

                <div className="flex gap-1">

                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#0369A1]" />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-[#0369A1]"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-[#0369A1]"
                    style={{ animationDelay: "0.3s" }}
                  />

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            CAMPO PARA ESCRIBIR
        ==================================================== */}
        <footer className="border-t border-gray-200 bg-[#FAF7F2] px-4 py-4 sm:px-6">

          <div className="mx-auto max-w-6xl">

            <div className="flex items-end gap-2 rounded-xl border border-gray-300 bg-white p-2 shadow-sm transition focus-within:border-[#0369A1] focus-within:ring-2 focus-within:ring-[#0369A1]/10">

              {/* EMOJI */}
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-[#0369A1]"
                aria-label="Emoji"
              >
                <Smile size={20} />
              </button>

              {/* TEXTAREA */}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Escribe tu mensaje..."
                className="max-h-[150px] min-h-[44px] flex-1 resize-none border-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-gray-400 focus:ring-0 sm:text-base"
              />

              {/* ENVIAR */}
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0369A1] text-white transition hover:bg-[#0C4A6E] active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Enviar mensaje"
              >
                <Send size={19} />
              </button>

            </div>

            {/* AVISO */}
            <p className="mt-2 text-center text-xs text-gray-400">
              YAIRA IA puede cometer errores. Considera verificar información importante.
            </p>

          </div>

        </footer>

      </main>

    </div>
  );
}

export default Chatbot;