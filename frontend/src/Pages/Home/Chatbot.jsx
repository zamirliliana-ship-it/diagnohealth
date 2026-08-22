import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, User } from "lucide-react";
import { supabase } from "../../config/supabase";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

function Chatbot() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hola, soy DIAGNOHEALTH IA. Estoy aquí para escucharte y acompañarte. ¿Cómo te sientes hoy?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ============================================================
  // OBTENER SESIÓN
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error(
            "Error obteniendo sesión:",
            error
          );

          if (mounted) {
            setError(
              "No fue posible verificar tu sesión."
            );
          }

          return;
        }

        if (!session) {
          navigate("/inicioS", {
            replace: true,
          });

          return;
        }

        if (mounted) {
          setSession(session);
        }
      } catch (err) {
        console.error(
          "Error verificando sesión:",
          err
        );

        if (mounted) {
          setError(
            "No fue posible verificar tu sesión."
          );
        }
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!newSession) {
          navigate("/inicioS", {
            replace: true,
          });

          return;
        }

        if (mounted) {
          setSession(newSession);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // ============================================================
  // SCROLL AUTOMÁTICO
  // ============================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // ============================================================
  // AUTOFOCUS
  // ============================================================

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // ============================================================
  // AJUSTAR ALTURA DEL TEXTAREA
  // ============================================================

  const handleTextareaChange = (event) => {
    setMessage(event.target.value);

    const textarea = event.target;

    textarea.style.height = "auto";

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      150
    )}px`;
  };

  // ============================================================
  // ENVIAR MENSAJE
  // ============================================================

  const handleSendMessage = async () => {
    const text = message.trim();

    if (!text || loading) {
      return;
    }

    setError("");

    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text,
      time: now,
    };

    // Guardamos los mensajes anteriores antes de agregar
    // el mensaje actual.
    const previousMessages = [...messages];

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setLoading(true);

    try {
      let currentSession = session;

      // ========================================================
      // SI NO TENEMOS SESIÓN, LA OBTENEMOS NUEVAMENTE
      // ========================================================

      if (!currentSession) {
        const {
          data,
          error: sessionError,
        } = await supabase.auth.getSession();

        if (
          sessionError ||
          !data?.session
        ) {
          throw new Error(
            "Tu sesión ha expirado. Inicia sesión nuevamente."
          );
        }

        currentSession = data.session;

        setSession(currentSession);
      }

      // ========================================================
      // REFRESCAR TOKEN SI ES NECESARIO
      // ========================================================

      const {
        data: refreshedData,
        error: refreshError,
      } = await supabase.auth.refreshSession();

      if (
        !refreshError &&
        refreshedData?.session
      ) {
        currentSession =
          refreshedData.session;

        setSession(currentSession);
      }

      if (!currentSession?.access_token) {
        throw new Error(
          "No se encontró un token de autenticación válido."
        );
      }

      // ========================================================
      // HISTORIAL QUE SE ENVÍA AL BACKEND
      // ========================================================

      const history = previousMessages
        .filter(
          (item) =>
            item.sender === "user" ||
            item.sender === "ai"
        )
        .slice(-12)
        .map((item) => ({
          sender: item.sender,
          text: item.text,
        }));

      // ========================================================
      // LLAMADA AL BACKEND
      // ========================================================

      const response = await fetch(
        `${API_URL}/api/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentSession.access_token}`,
          },

          body: JSON.stringify({
            message: text,
            history,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "El servidor devolvió una respuesta inválida."
        );
      }

      if (!response.ok || !data?.ok) {
        if (response.status === 401) {
          await supabase.auth.signOut();

          navigate("/inicioS", {
            replace: true,
          });

          throw new Error(
            "Tu sesión ha expirado. Inicia sesión nuevamente."
          );
        }

        throw new Error(
          data?.message ||
            "No fue posible obtener una respuesta de DIAGNOHEALTH."
        );
      }

      // ========================================================
      // RESPUESTA DE YAIRA
      // ========================================================

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text:
          data.message ||
          "No pude generar una respuesta en este momento.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);
    } catch (err) {
      console.error(
        "Error comunicando con DIAGNOHEALTH:",
        err
      );

      const errorMessage =
        err?.message ||
        "No pude conectarme con DIAGNOHEALTH en este momento.";

      setError(errorMessage);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "ai",
          text:
            "Lo siento, tuve un problema para responderte. " +
            "Puedes intentarlo nuevamente en unos segundos.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  };

  // ============================================================
  // ENTER / SHIFT + ENTER
  // ============================================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSendMessage();
    }
  };

  // ============================================================
  // NUEVA CONVERSACIÓN
  // ============================================================

  const handleNewConversation = () => {
    if (loading) {
      return;
    }

    setMessages([
      {
        id: Date.now(),
        sender: "ai",
        text: "Nueva conversación iniciada. Estoy aquí para escucharte. ¿Qué quieres contarme?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setMessage("");
    setError("");

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  // ============================================================
  // CERRAR SESIÓN
  // ============================================================

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();

      navigate("/inicioS", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Error cerrando sesión:",
        err
      );
    }
  };

  // ============================================================
  // CRISIS
  // ============================================================

  const handleCrisis = () => {
    navigate("/crisis-alert");
  };

  // ============================================================
  // LOADING DE SESIÓN
  // ============================================================

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#0369A1]/20 border-t-[#0369A1]" />

          <p className="text-sm text-gray-500">
            Verificando sesión...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // INTERFAZ
  // ============================================================

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#FAF7F2] text-gray-800">

      {/* ======================================================
          ANIMACIONES Y TEXTURA DE FONDO
          (mismos colores de marca, solo cambia la opacidad)
      ======================================================= */}

      <style>{`
        @keyframes dh-fade-in-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dh-breathe {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.35); opacity: 0; }
        }
        .dh-msg-in {
          animation: dh-fade-in-up 0.35s ease-out both;
        }
        .dh-breathe-ring {
          animation: dh-breathe 2.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .dh-msg-in { animation: none; }
          .dh-breathe-ring { animation: none; }
        }
      `}</style>

      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#0369A1] opacity-[0.06] blur-[100px]" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#0C4A6E] opacity-[0.05] blur-[120px]" />

      {/* ======================================================
          SIDEBAR
      ======================================================= */}

      <aside className="relative z-10 hidden w-72 flex-col border-r border-gray-200 bg-white/90 backdrop-blur-sm md:flex">

        <div className="border-b border-gray-200 p-5">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#0369A1] text-white">
              <Activity size={18} />
            </div>

            <h1 className="text-xl font-bold text-[#0369A1]">
              DiagnoHealth
            </h1>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Bienestar emocional
          </p>
        </div>

        <div className="flex-1 p-4">

          <button
            type="button"
            onClick={handleNewConversation}
            disabled={loading}
            className="mb-4 w-full rounded-xl bg-[#0369A1] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#075985] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Nueva conversación
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/crisis-alert")
            }
            className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            🚨 Necesito ayuda
          </button>

        </div>

        <div className="border-t border-gray-200 p-4">

          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl px-4 py-3 text-left text-sm text-gray-600 transition hover:bg-gray-100"
          >
            Cerrar sesión
          </button>

        </div>

      </aside>

      {/* ======================================================
          CHAT
      ======================================================= */}

      <main className="relative z-10 flex min-h-screen flex-1 flex-col">

        {/* HEADER */}

        <header className="border-b border-gray-200 bg-white/90 px-4 py-4 backdrop-blur-sm md:px-8">

          <div className="mx-auto flex max-w-5xl items-center justify-between">

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/inicioS")}
                aria-label="Volver al panel"
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-[#0369A1]"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="relative flex h-10 w-10 items-center justify-center">
                <span className="dh-breathe-ring absolute inset-0 rounded-full bg-[#0369A1]" />
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0369A1] to-[#0C4A6E] text-white shadow-sm">
                  <Activity size={18} />
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  DIAGNOHEALTH IA
                </h2>

                <p className="text-sm text-gray-500">
                  Tu asistente de bienestar emocional
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCrisis}
              className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              🚨 Crisis
            </button>

          </div>

        </header>

        {/* MENSAJES */}

        <section className="flex-1 overflow-y-auto px-4 py-6 md:px-8">

          <div className="mx-auto max-w-4xl space-y-5">

            {messages.map((item) => (
              <div
                key={item.id}
                className={`dh-msg-in flex items-end gap-2.5 ${
                  item.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {item.sender === "ai" && (
                  <span className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0369A1] to-[#0C4A6E] text-white shadow-sm">
                    <Activity size={14} />
                  </span>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                    item.sender === "user"
                      ? "rounded-br-md bg-gradient-to-br from-[#0369A1] to-[#0C4A6E] text-white"
                      : "rounded-bl-md border border-gray-200 bg-white text-gray-800"
                  }`}
                >

                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {item.text}
                  </p>

                  <p
                    className={`mt-2 text-[11px] ${
                      item.sender === "user"
                        ? "text-white/70"
                        : "text-gray-400"
                    }`}
                  >
                    {item.time}
                  </p>

                </div>

                {item.sender === "user" && (
                  <span className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                    <User size={14} />
                  </span>
                )}

              </div>
            ))}

            {/* PENSANDO */}

            {loading && (
              <div className="dh-msg-in flex items-end gap-2.5 justify-start">

                <span className="relative mb-1 flex h-8 w-8 shrink-0 items-center justify-center">
                  <span className="dh-breathe-ring absolute inset-0 rounded-full bg-[#0369A1]" />
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#0369A1] to-[#0C4A6E] text-white">
                    <Activity size={14} />
                  </span>
                </span>

                <div className="rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3 shadow-sm">

                  <div className="flex items-center gap-2">

                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#0369A1]/60" />

                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-[#0369A1]/60"
                      style={{
                        animationDelay: "0.15s",
                      }}
                    />

                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-[#0369A1]/60"
                      style={{
                        animationDelay: "0.3s",
                      }}
                    />

                    <span className="ml-1 text-xs text-gray-400">
                      DIAGNOHEALTH está pensando...
                    </span>

                  </div>

                </div>

              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

        </section>

        {/* ERROR */}

        {error && (
          <div className="px-4 md:px-8">

            <div className="mx-auto mb-3 max-w-4xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>

          </div>
        )}

        {/* INPUT */}

        <footer className="border-t border-gray-200 bg-white/90 px-4 py-4 backdrop-blur-sm md:px-8">

          <div className="mx-auto max-w-4xl">

            <div className="flex items-end gap-3 rounded-2xl border border-gray-300 bg-gray-50 p-2 transition focus-within:border-[#0369A1] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0369A1]/10">

              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows={1}
                maxLength={2000}
                placeholder="Escribe cómo te sientes..."
                className="max-h-[150px] min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
              />

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={
                  loading ||
                  !message.trim()
                }
                className="rounded-xl bg-gradient-to-br from-[#0369A1] to-[#0C4A6E] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {loading
                  ? "..."
                  : "Enviar"}
              </button>

            </div>

            <div className="mt-2 flex items-center justify-between">

              <p className="text-[11px] text-gray-400">
                Enter para enviar · Shift + Enter para nueva línea
              </p>

              <p className="text-[11px] text-gray-400">
                {message.length}/2000
              </p>

            </div>

            <p className="mt-2 text-center text-[11px] text-gray-400">
              DIAGNOHEALTH IA brinda acompañamiento emocional y no sustituye atención profesional.
            </p>

          </div>

        </footer>

      </main>

    </div>
  );
}

export default Chatbot;