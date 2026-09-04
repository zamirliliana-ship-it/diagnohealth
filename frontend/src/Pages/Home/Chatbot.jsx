import { useEffect, useRef, useState } from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Menu,
  X,
  Trash2,
  MessageSquare,
  Plus,
} from "lucide-react";

import { supabase } from "../../config/supabase";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

const MENSAJE_INICIAL =
  "Hola, soy DIAGNOHEALTH, el asistente de bienestar emocional de DiagnoHealth. Estoy aquí para escucharte y acompañarte. ¿Cómo te sientes hoy?";

function Chatbot() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const conversacionParam =
    searchParams.get("conversacion");

  // ============================================================
  // ESTADOS
  // ============================================================

  const [messages, setMessages] = useState([
    {
      id: "inicio",
      sender: "ai",
      text: MENSAJE_INICIAL,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [session, setSession] = useState(null);

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [error, setError] = useState("");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [conversacionId, setConversacionId] =
    useState(null);

  const [conversaciones, setConversaciones] =
    useState([]);

  const [cargandoConversaciones,
    setCargandoConversaciones] =
    useState(false);

  const [cargandoConversacion,
    setCargandoConversacion] =
    useState(false);

  const textareaRef = useRef(null);

  const messagesEndRef = useRef(null);

  // ============================================================
  // OBTENER TOKEN
  // ============================================================

  const getAccessToken = async () => {
    const {
      data: { session: currentSession },
      error,
    } = await supabase.auth.getSession();

    if (error || !currentSession) {
      throw new Error(
        "Tu sesión ha expirado. Inicia sesión nuevamente."
      );
    }

    return currentSession.access_token;
  };

  // ============================================================
  // SESIÓN
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!currentSession) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        if (mounted) {
          setSession(currentSession);
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

      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {

        if (!newSession) {
          navigate("/login", {
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
  // CARGAR CONVERSACIONES
  // ============================================================

  const cargarConversaciones = async () => {
    try {
      setCargandoConversaciones(true);

      const token =
        await getAccessToken();

      const response = await fetch(
        `${API_URL}/api/chat/conversaciones`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message ||
          "No fue posible cargar las conversaciones."
        );
      }

      // ========================================================
      // EVITAR DUPLICADOS
      // ========================================================

      const conversacionesUnicas =
        Array.from(
          new Map(
            (data.conversaciones || []).map(
              (item) => [item.id, item]
            )
          ).values()
        );

      setConversaciones(
        conversacionesUnicas
      );

    } catch (err) {

      console.error(
        "Error cargando conversaciones:",
        err
      );

    } finally {

      setCargandoConversaciones(false);

    }
  };

  // ============================================================
  // CARGAR LISTA CUANDO HAY SESIÓN
  // ============================================================

  useEffect(() => {

    if (!session) {
      return;
    }

    cargarConversaciones();

  }, [session]);

  // ============================================================
  // CARGAR UNA CONVERSACIÓN
  // ============================================================

  const cargarConversacion = async (id) => {
    try {
      setCargandoConversacion(true);

      setError("");

      const token =
        await getAccessToken();

      const response = await fetch(
        `${API_URL}/api/chat/conversaciones/${id}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message ||
          "No fue posible abrir la conversación."
        );
      }

      // ========================================================
      // FORMATEAR MENSAJES
      // ========================================================

      const mensajesFormateados =
        (data.mensajes || []).map(
          (item) => ({
            id: item.id,

            // IMPORTANTE:
            // Base de datos usa "usuario" y "chatbot"

            sender:
              item.remitente === "usuario"
                ? "user"
                : "ai",

            text: item.contenido,

            time: new Date(
              item.created_at
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          })
        );

      if (
        mensajesFormateados.length === 0
      ) {

        setMessages([
          {
            id: `inicio-${Date.now()}`,
            sender: "ai",
            text: MENSAJE_INICIAL,
            time:
              new Date().toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              ),
          },
        ]);

      } else {

        setMessages(
          mensajesFormateados
        );

      }

      // ========================================================
      // GUARDAR CONVERSACIÓN ACTUAL
      // ========================================================

      setConversacionId(id);

    } catch (err) {

      console.error(
        "Error cargando conversación:",
        err
      );

      setError(
        err.message ||
        "No fue posible cargar la conversación."
      );

    } finally {

      setCargandoConversacion(false);

    }
  };

  // ============================================================
  // CARGAR DESDE URL
  // ============================================================

  useEffect(() => {

    if (
      !session ||
      !conversacionParam
    ) {
      return;
    }

    // Evitamos cargar nuevamente
    // una conversación que ya está abierta.

    if (
      conversacionParam === conversacionId
    ) {
      return;
    }

    cargarConversacion(
      conversacionParam
    );

  }, [
    session,
    conversacionParam,
    conversacionId,
  ]);

  // ============================================================
  // NUEVA CONVERSACIÓN
  // ============================================================

  const handleNewConversation = () => {

    if (loading) {
      return;
    }

    // Muy importante:
    // aquí dejamos el ID en null.
    // El backend creará la conversación
    // solamente cuando el usuario mande
    // su primer mensaje.

    setConversacionId(null);

    setMessages([
      {
        id: `inicio-${Date.now()}`,
        sender: "ai",
        text: MENSAJE_INICIAL,
        time: new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      },
    ]);

    setMessage("");

    setError("");

    // Quitar conversación de la URL

    setSearchParams({});

    setSidebarOpen(false);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  // ============================================================
  // ABRIR CONVERSACIÓN
  // ============================================================

  const handleOpenConversation = (id) => {

    if (loading) {
      return;
    }

    if (id === conversacionId) {
      setSidebarOpen(false);
      return;
    }

    setSearchParams({
      conversacion: id,
    });

    setSidebarOpen(false);
  };

  // ============================================================
  // ELIMINAR CONVERSACIÓN
  // ============================================================

  const handleDeleteConversation = async (
    event,
    id
  ) => {

    event.stopPropagation();

    const confirmar =
      window.confirm(
        "¿Estás seguro de que deseas eliminar esta conversación?"
      );

    if (!confirmar) {
      return;
    }

    try {

      const token =
        await getAccessToken();

      const response = await fetch(
        `${API_URL}/api/chat/conversaciones/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message ||
          "No fue posible eliminar la conversación."
        );
      }

      // Eliminar inmediatamente de la lista

      setConversaciones((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );

      // Si eliminamos el chat abierto,
      // iniciar una nueva conversación

      if (conversacionId === id) {
        handleNewConversation();
      }

    } catch (err) {

      console.error(
        "Error eliminando conversación:",
        err
      );

      setError(
        err.message ||
        "No fue posible eliminar la conversación."
      );
    }
  };

  // ============================================================
  // SCROLL AUTOMÁTICO
  // ============================================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [
    messages,
    loading,
    cargandoConversacion,
  ]);

  // ============================================================
  // AUTOFOCUS
  // ============================================================

  useEffect(() => {

    textareaRef.current?.focus();

  }, []);

  // ============================================================
  // TEXTAREA
  // ============================================================

  const handleTextareaChange = (event) => {

    setMessage(event.target.value);

    const textarea =
      event.target;

    textarea.style.height = "auto";

    textarea.style.height =
      `${Math.min(
        textarea.scrollHeight,
        150
      )}px`;
  };

  // ============================================================
  // ENVIAR MENSAJE
  // ============================================================

  const handleSendMessage = async () => {

    const text =
      message.trim();

    if (
      !text ||
      loading ||
      cargandoConversacion
    ) {
      return;
    }

    setError("");

    const now =
      new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      time: now,
    };

    // Guardamos el historial anterior
    // para enviarlo a DIAGNOHEALTH.

    const previousMessages =
      [...messages];

    // Mostrar inmediatamente

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height =
        "auto";
    }

    setLoading(true);

    try {

      // ========================================================
      // TOKEN
      // ========================================================

      const token =
        await getAccessToken();

      // ========================================================
      // HISTORIAL
      // ========================================================

      const history =
        previousMessages
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
      // ENVIAR AL BACKEND
      // ========================================================

      const response = await fetch(
        `${API_URL}/api/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            message: text,

            history,

            // ESTE ID ES LA CLAVE:
            // Si ya existe conversación,
            // seguimos usando la misma.

            conversacionId:
              conversacionId || null,
          }),
        }
      );

      let data;

      try {

        data =
          await response.json();

      } catch {

        throw new Error(
          "El servidor devolvió una respuesta inválida."
        );
      }

      // ========================================================
      // ERROR
      // ========================================================

      if (!response.ok || !data?.ok) {

        if (response.status === 401) {

          await supabase.auth.signOut();

          navigate("/login", {
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
      // NUEVA CONVERSACIÓN
      // ========================================================

      if (data.conversacionId) {

        // Siempre guardamos el ID devuelto
        // por el backend.

        setConversacionId(
          data.conversacionId
        );

        // Solo actualizamos URL si cambió

        if (
          conversacionParam !==
          data.conversacionId
        ) {

          setSearchParams({
            conversacion:
              data.conversacionId,
          });
        }
      }

      // ========================================================
      // RESPUESTA DIAGNOHEALTH
      // ========================================================

      const aiMessage = {
        id: `ai-${Date.now()}`,

        sender: "ai",

        text:
          data.message ||
          "No pude generar una respuesta en este momento.",

        time:
          new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

      // ========================================================
      // ACTUALIZAR LISTA LATERAL
      // ========================================================

      await cargarConversaciones();

    } catch (err) {

      console.error(
        "Error comunicando con DIAGNOHEALTH:",
        err
      );

      const errorMessage =
        err?.message ||
        "No pude conectarme con DIAGNOHEALTH.";

      setError(errorMessage);

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,

          sender: "ai",

          text:
            "Lo siento, tuve un problema para responderte. Puedes intentarlo nuevamente en unos segundos.",

          time:
            new Date().toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
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
  // ENTER
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
  // CRISIS
  // ============================================================

  const handleCrisis = () => {
    navigate("/crisis-alert");
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (checkingSession) {

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

      {/* FONDO */}

      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#0369A1] opacity-[0.06] blur-[100px]" />

      {/* OVERLAY MÓVIL */}

      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* ===================================================== */}
      {/* SIDEBAR */}
      {/* ===================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 md:relative md:z-10 md:translate-x-0 md:shadow-none ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* LOGO */}

        <div className="flex items-center justify-between border-b border-gray-200 p-5">

          <div>

            <div className="flex items-center gap-3">

                <img
                  src="imagenes/diagnohealth-logo.png"
                  alt="DiagnoHealth"
                  className="h-10 w-10 rounded-full object-cover"
                />

              
              <h1 className="text-xl font-bold text-[#0369A1]">
                DiagnoHealth
              </h1>

            </div>

            <p className="mt-1 text-sm text-gray-500">
              Bienestar emocional
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="rounded-full p-2 hover:bg-gray-100 md:hidden"
          >
            <X size={20} />
          </button>

        </div>

        {/* BOTONES */}

        <div className="border-b border-gray-100 p-4">

          <button
            type="button"
            onClick={() => {
              navigate("/inicioS");
              setSidebarOpen(false);
            }}
            className="mb-2 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            <ArrowLeft size={17} />

            Volver al panel

          </button>

          <button
            type="button"
            onClick={handleNewConversation}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0369A1] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#075985] disabled:opacity-50"
          >
            <Plus size={18} />

            Nueva conversación

          </button>

        </div>

        {/* =================================================== */}
        {/* HISTORIAL */}
        {/* =================================================== */}

        <div className="flex-1 overflow-y-auto p-3">

          <div className="mb-3 flex items-center gap-2 px-2 text-sm font-semibold text-gray-500">

            <MessageSquare size={16} />

            Tus conversaciones

          </div>

          {cargandoConversaciones && (

            <p className="px-2 py-3 text-sm text-gray-400">
              Cargando historial...
            </p>

          )}

          {!cargandoConversaciones &&
            conversaciones.length === 0 && (

              <div className="mx-1 rounded-xl border border-dashed border-gray-200 px-3 py-6 text-center">

                <MessageSquare
                  size={22}
                  className="mx-auto mb-2 text-gray-300"
                />

                <p className="text-sm text-gray-400">
                  Aún no tienes conversaciones guardadas.
                </p>

                <p className="mt-1 text-xs text-gray-300">
                  Empieza una nueva para verla aquí.
                </p>

              </div>

            )}

          <div className="space-y-1">

            {conversaciones.map(
              (item) => (

                <div
                  key={item.id}
                  onClick={() =>
                    handleOpenConversation(
                      item.id
                    )
                  }
                  className={`group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition ${
                    conversacionId === item.id
                      ? "bg-blue-50"
                      : "hover:bg-gray-100"
                  }`}
                >

                  <MessageSquare
                    size={17}
                    className="shrink-0 text-[#0369A1]"
                  />

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-medium text-gray-700">

                      {item.titulo ||
                        "Nueva conversación"}

                    </p>

                    <p className="mt-1 text-xs text-gray-400">

                      {new Date(
                        item.updated_at ||
                        item.created_at
                      ).toLocaleDateString(
                        "es-ES"
                      )}

                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={(event) =>
                      handleDeleteConversation(
                        event,
                        item.id
                      )
                    }
                    className="rounded-lg p-2 text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                    title="Eliminar conversación"
                  >
                    <Trash2 size={15} />
                  </button>

                </div>

              )
            )}

          </div>

        </div>

        {/* FOOTER */}

        <div className="border-t border-gray-200 p-4">

          <button
            type="button"
            onClick={handleCrisis}
            className="mb-2 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            🚨 Necesito ayuda
          </button>

        </div>

      </aside>

      {/* ===================================================== */}
      {/* CHAT */}
      {/* ===================================================== */}

      <main className="relative z-10 flex min-h-screen flex-1 flex-col">

        {/* HEADER */}

        <header className="border-b border-gray-200 bg-white/90 px-4 py-4 backdrop-blur">

          <div className="mx-auto flex max-w-5xl items-center justify-between">

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="rounded-full p-2 hover:bg-gray-100 md:hidden"
              >
                <Menu size={20} />
              </button>

              {/*
                Se quitó el ícono redondo que iba aquí
                (el que estaba junto al título).
                Ahora el título va solo, sin ícono duplicado
                con el del menú lateral.
              */}

              <div>

                <h2 className="font-bold text-gray-900">
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

        <section className="flex-1 overflow-y-auto px-4 py-6">

          <div className="mx-auto max-w-4xl space-y-5">

            {cargandoConversacion && (

              <div className="py-10 text-center text-sm text-gray-500">
                Cargando conversación...
              </div>

            )}

            {!cargandoConversacion &&
              messages.map(
                (item) => (

                  <div
                    key={item.id}
                    className={`flex ${
                      item.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[75%] ${
                        item.sender === "user"
                          ? "bg-[#0369A1] text-white"
                          : "border border-gray-200 bg-white text-gray-700"
                      }`}
                    >

                      <p className="whitespace-pre-wrap">
                        {item.text}
                      </p>

                      <p
                        className={`mt-2 text-right text-[10px] ${
                          item.sender === "user"
                            ? "text-blue-100"
                            : "text-gray-400"
                        }`}
                      >
                        {item.time}
                      </p>

                    </div>

                  </div>

                )
              )}

            {loading && (

              <div className="flex justify-start">

                <div className="flex items-center gap-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">

                  <span>DIAGNOHEALTH está escribiendo</span>

                  <span className="flex gap-0.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                  </span>

                </div>

              </div>

            )}

            <div ref={messagesEndRef} />

          </div>

        </section>

        {/* ERROR */}

        {error && (

          <div className="px-4 pb-3">

            <div className="mx-auto max-w-4xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

              {error}

            </div>

          </div>

        )}

        {/* INPUT */}

        <footer className="border-t border-gray-200 bg-white px-4 py-4">

          <div className="mx-auto max-w-4xl">

            <div className="flex items-end gap-3 rounded-2xl border border-gray-300 bg-gray-50 p-2 transition-colors focus-within:border-[#0369A1] focus-within:bg-white">

              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                disabled={
                  loading ||
                  cargandoConversacion
                }
                rows={1}
                maxLength={2000}
                placeholder="Escribe cómo te sientes..."
                className="max-h-[150px] min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none"
              />

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={
                  loading ||
                  cargandoConversacion ||
                  !message.trim()
                }
                className="rounded-xl bg-gradient-to-br from-[#0369A1] to-[#0C4A6E] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "..."
                  : "Enviar"}
              </button>

            </div>

            <div className="mt-2 flex justify-between text-[11px] text-gray-400">

              <span>
                Enter para enviar · Shift + Enter para nueva línea
              </span>

              <span>
                {message.length}/2000
              </span>

            </div>

            <p className="mt-2 text-center text-[11px] text-gray-400">

              DIAGNOHEALTH brinda acompañamiento emocional y no sustituye atención profesional.

            </p>

          </div>

        </footer>

      </main>

    </div>
  );
}

export default Chatbot;