import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Send,
  Menu,
  X,
  LogOut,
  User,
  AlertTriangle,
  MessageSquare,
  Plus,
  Bot,
} from "lucide-react";

import { supabase } from "../../config/supabase";

function Chatbot() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  /* =========================================================
     OBTENER USUARIO
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error obteniendo usuario:", error);
        return;
      }

      if (mounted) {
        setUser(user);
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     MENSAJE INICIAL
  ========================================================= */

  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hola, soy el asistente de DiagnoHealth. Estoy aquí para escucharte y acompañarte. ¿Cómo te sientes hoy?",
      },
    ]);
  }, []);

  /* =========================================================
     SCROLL
  ========================================================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* =========================================================
     ENVIAR MENSAJE
  ========================================================= */

  const handleSend = async (event) => {
    event?.preventDefault();

    const text = message.trim();

    if (!text || loading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setMessage("");
    setLoading(true);

    try {
      /*
       * Aquí posteriormente conectaremos el chatbot
       * con el backend de DiagnoHealth.
       *
       * Por ahora dejamos una respuesta local para que
       * la pantalla funcione sin romperse.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "Gracias por compartirlo conmigo. Puedes contarme un poco más sobre cómo te has estado sintiendo.",
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("Error enviando mensaje:", error);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 2,
          role: "assistant",
          content:
            "Lo siento, ocurrió un problema al procesar tu mensaje. Inténtalo nuevamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     CERRAR SESIÓN
  ========================================================= */

  const handleLogout = () => {
    navigate("/cerrar-sesion");
  };

  /* =========================================================
     NUEVA CONVERSACIÓN
  ========================================================= */

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content:
          "Nueva conversación iniciada. ¿Cómo puedo acompañarte hoy?",
      },
    ]);

    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1C1A]">

      {/* =====================================================
          BOTÓN MENÚ MÓVIL
      ====================================================== */}

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

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

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
            to="/chatbot"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-4 rounded-lg bg-white/10 px-4 py-3 text-sm text-white"
          >
            <MessageSquare size={20} />
            Chat con IA
          </Link>

          <button
            type="button"
            onClick={handleNewChat}
            className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm text-white/80 hover:bg-white/10"
          >
            <Plus size={20} />
            Nueva conversación
          </button>

          <Link
            to="/inicioS"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm text-white/80 hover:bg-white/10"
          >
            <User size={20} />
            Perfil
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm text-white/80 hover:bg-white/10"
          >
            <LogOut size={20} />
            Cerrar sesión
          </button>

        </nav>

        <div className="px-4 pb-6">

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">

            <p className="text-sm font-medium">
              Bienvenido
            </p>

            <p className="mt-1 truncate text-xs text-white/60">
              {user?.email || "Usuario"}
            </p>

          </div>

        </div>

      </aside>

      {/* OVERLAY MÓVIL */}

      {menuOpen && (
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Cerrar menú"
        />
      )}

      {/* =====================================================
          CONTENIDO
      ====================================================== */}

      <main className="ml-0 flex min-h-screen flex-col md:ml-64">

        {/* HEADER */}

        <header className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">

          <div className="pl-12 md:pl-0">

            <div className="flex items-center justify-between gap-4">

              <div>

                <h1 className="text-2xl font-bold text-[#00334F]">
                  Chat con IA
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Un espacio para hablar y cuidar tu bienestar.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/crisis-alert")
                }
                className="flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
              >
                <AlertTriangle size={16} />
                <span className="hidden sm:inline">
                  Ayuda
                </span>
              </button>

            </div>

          </div>

        </header>

        {/* CHAT */}

        <section className="flex flex-1 flex-col">

          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:px-6">

            {/* MENSAJES */}

            <div className="flex-1 space-y-5 overflow-y-auto pb-6">

              {messages.map((item) => (
                <div
                  key={item.id}
                  className={`flex ${
                    item.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`flex max-w-[90%] gap-3 sm:max-w-[75%] ${
                      item.role === "user"
                        ? "flex-row-reverse"
                        : ""
                    }`}
                  >

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        item.role === "user"
                          ? "bg-[#0369A1] text-white"
                          : "bg-[#0C4A6E] text-white"
                      }`}
                    >
                      {item.role === "user" ? (
                        <User size={18} />
                      ) : (
                        <Bot size={18} />
                      )}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                        item.role === "user"
                          ? "rounded-tr-md bg-[#0369A1] text-white"
                          : "rounded-tl-md border border-gray-200 bg-white text-gray-700"
                      }`}
                    >
                      {item.content}
                    </div>

                  </div>

                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0C4A6E] text-white">
                    <Bot size={18} />
                  </div>

                  <div className="rounded-2xl rounded-tl-md border border-gray-200 bg-white px-4 py-3 shadow-sm">

                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                    </div>

                  </div>

                </div>
              )}

              <div ref={messagesEndRef} />

            </div>

            {/* INPUT */}

            <form
              onSubmit={handleSend}
              className="sticky bottom-0"
            >

              <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-lg">

                <div className="flex items-end gap-2">

                  <textarea
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();
                        handleSend(event);
                      }
                    }}
                    rows={1}
                    placeholder="Escribe cómo te sientes..."
                    className="max-h-32 min-h-[44px] flex-1 resize-none border-0 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-gray-400"
                    disabled={loading}
                  />

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !message.trim()
                    }
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0369A1] text-white transition hover:bg-[#0C4A6E] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Enviar mensaje"
                  >
                    <Send size={18} />
                  </button>

                </div>

              </div>

              <p className="mt-2 text-center text-[11px] text-gray-400">
                DiagnoHealth es una herramienta de acompañamiento y no reemplaza la atención profesional.
              </p>

            </form>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Chatbot;