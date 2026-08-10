import { useState } from "react";
import {
  ArrowLeft,
  Bot,
  HeartPulse,
  Send,
  Mic,
  Paperclip,
  Sparkles,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hola 👋 Soy el asistente de DiagnoHealth. Estoy aquí para orientarte y ayudarte con tus dudas de salud.",
    },
    {
      id: 2,
      sender: "bot",
      text: "Cuéntame qué necesitas o selecciona una de las opciones para comenzar.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const suggestions = [
    {
      icon: <HeartPulse size={18} />,
      text: "Tengo algunos síntomas",
    },
    {
      icon: <Sparkles size={18} />,
      text: "Quiero información de salud",
    },
    {
      icon: <ShieldCheck size={18} />,
      text: "¿Cuándo debo consultar?",
    },
  ];

  const generateResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("síntoma") ||
      lowerMessage.includes("sintoma")
    ) {
      return "Claro. Puedes contarme qué síntomas estás presentando, desde cuándo los tienes y qué tan intensos son. Te daré orientación general, pero recuerda que el chatbot no reemplaza una valoración médica.";
    }

    if (
      lowerMessage.includes("salud") ||
      lowerMessage.includes("información") ||
      lowerMessage.includes("informacion")
    ) {
      return "Puedo ayudarte con información general sobre temas de salud y bienestar. Cuéntame qué tema quieres conocer.";
    }

    if (
      lowerMessage.includes("consultar") ||
      lowerMessage.includes("médico") ||
      lowerMessage.includes("medico")
    ) {
      return "Si los síntomas son intensos, empeoran rápidamente o representan una situación que consideras urgente, busca atención médica profesional. Puedo ayudarte a organizar la información que quieras comunicarle al profesional de salud.";
    }

    return "Gracias por contarme. Para poder orientarte mejor, dame un poco más de información sobre lo que necesitas.";
  };

  const handleSend = (message = input) => {
    const cleanMessage = message.trim();

    if (!cleanMessage || isTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: cleanMessage,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: generateResponse(cleanMessage),
      };

      setMessages((previous) => [...previous, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestion = (text) => {
    handleSend(text);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSend();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Volver"
            >
              <ArrowLeft size={21} />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                <Bot size={22} />
              </div>

              <div>
                <h1 className="text-base font-bold text-slate-900 sm:text-lg">
                  Asistente DiagnoHealth
                </h1>

                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-500">
                    Disponible para ayudarte
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 sm:flex">
            <Sparkles size={14} />
            Asistente virtual
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col lg:flex-row">
        {/* PANEL LATERAL */}
        <aside className="hidden w-80 shrink-0 border-r border-slate-200 bg-white p-6 lg:block">
          <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-sm">
              <HeartPulse size={25} />
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              Tu salud, más cerca
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Puedes utilizar el asistente para obtener orientación general y
              preparar tus preguntas antes de consultar con un profesional.
            </p>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Puedes preguntar sobre
            </p>

            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.text}
                  type="button"
                  onClick={() => handleSuggestion(suggestion.text)}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm text-slate-600 transition hover:bg-teal-50 hover:text-teal-700"
                >
                  <span className="text-teal-600">{suggestion.icon}</span>
                  <span>{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-amber-100 bg-amber-50 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-amber-600" size={19} />

              <p className="text-xs leading-5 text-amber-800">
                La información proporcionada es orientativa y no sustituye el
                diagnóstico o tratamiento de un profesional de la salud.
              </p>
            </div>
          </div>
        </aside>

        {/* CHAT */}
        <section className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col">
          {/* MENSAJES */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10">
            <div className="mx-auto w-full max-w-3xl">
              {/* PRESENTACIÓN */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-100 text-teal-700">
                  <Bot size={32} />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  ¿En qué puedo ayudarte?
                </h2>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                  Habla conmigo sobre tus dudas y recibe orientación general
                  de salud.
                </p>
              </div>

              {/* MENSAJES */}
              <div className="space-y-5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.sender === "bot" && (
                      <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 sm:flex">
                        <Bot size={18} />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[75%] ${
                        message.sender === "user"
                          ? "rounded-br-md bg-teal-600 text-white"
                          : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      {message.text}
                    </div>

                    {message.sender === "user" && (
                      <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 sm:flex">
                        <UserRound size={18} />
                      </div>
                    )}
                  </div>
                ))}

                {/* ESCRIBIENDO */}
                {isTyping && (
                  <div className="flex items-end gap-2">
                    <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 sm:flex">
                      <Bot size={18} />
                    </div>

                    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-4 shadow-sm">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* INPUT */}
          <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-3 sm:px-6 lg:px-10">
            <div className="mx-auto w-full max-w-3xl">
              {/* SUGERENCIAS MÓVIL */}
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.text}
                    type="button"
                    onClick={() => handleSuggestion(suggestion.text)}
                    className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                  >
                    {suggestion.icon}
                    {suggestion.text}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm transition focus-within:border-teal-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100">
                  <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white hover:text-teal-600"
                    aria-label="Adjuntar archivo"
                  >
                    <Paperclip size={19} />
                  </button>

                  <input
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Escribe tu mensaje..."
                    disabled={isTyping}
                    className="min-w-0 flex-1 bg-transparent px-1 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white hover:text-teal-600 sm:flex"
                    aria-label="Usar micrófono"
                  >
                    <Mic size={19} />
                  </button>

                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Enviar mensaje"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>

              <p className="mt-2 text-center text-[11px] leading-4 text-slate-400">
                DiagnoHealth brinda orientación general. Ante una emergencia,
                busca atención médica profesional.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Chatbot;