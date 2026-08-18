import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Bot,
  ArrowRight,
  TrendingUp,
  ClipboardList,
  BookOpen,
  History,
  Lightbulb,
} from "lucide-react";

import { supabase } from "../../config/supabase";
import DashboardSidebar from "../../components/layout/DashboardSidebar";

const WEEKLY_MOOD = [
  { day: "Lun", value: 2.0 },
  { day: "Mar", value: 3.0 },
  { day: "Mié", value: 2.5 },
  { day: "Jue", value: 3.5 },
  { day: "Vie", value: 4.0 },
  { day: "Sáb", value: 3.8 },
  { day: "Dom", value: 4.5 },
];

const MOODS = [
  { emoji: "😊", label: "Muy bien", value: "muy_bien" },
  { emoji: "🙂", label: "Bien", value: "bien" },
  { emoji: "😐", label: "Regular", value: "regular" },
  { emoji: "😟", label: "Mal", value: "mal" },
  { emoji: "😡", label: "Muy mal", value: "muy_mal" },
];

function PanelUsuario() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);

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

  const firstName =
    user?.user_metadata?.nombre ||
    user?.email?.split("@")[0] ||
    "de nuevo";

  const maxMoodValue = Math.max(...WEEKLY_MOOD.map((item) => item.value));

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1C1A]">
      <DashboardSidebar userLabel={user?.email} />

      <main className="ml-0 flex min-h-screen flex-col pb-20 md:ml-64 md:pb-0">
        <div className="mx-auto w-full max-w-[1100px] flex-1 space-y-6 px-4 py-6 pl-16 sm:px-6 md:pl-6 md:py-10">

          {/* =====================================================
              HEADER
          ===================================================== */}
          <header className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-[#0C4A6E] sm:text-3xl">
              ¡Hola, {firstName}! 👋
            </h2>
            <p className="text-sm text-gray-500">
              Nos alegra verte de nuevo. ¿Cómo estás hoy?
            </p>
          </header>

          {/* =====================================================
              SELECTOR DE ÁNIMO
          ===================================================== */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="mb-6 text-lg font-semibold text-[#0C4A6E]">
              ¿Cómo te sientes hoy?
            </h3>

            <div className="flex flex-wrap items-center justify-around gap-4">
              {MOODS.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition hover:-translate-y-0.5 ${
                    selectedMood === mood.value
                      ? "bg-[#E0F2FE]"
                      : ""
                  }`}
                >
                  <span className="mb-1 text-4xl sm:text-5xl">
                    {mood.emoji}
                  </span>
                  <span
                    className={`text-xs font-medium sm:text-sm ${
                      selectedMood === mood.value
                        ? "text-[#0369A1]"
                        : "text-gray-500"
                    }`}
                  >
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* =====================================================
              CHAT + PROGRESO
          ===================================================== */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* HABLAR CON DIAGNOHEALTH */}
            <section className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:flex-row">
              <div className="flex w-full items-center justify-center bg-blue-50 p-6 md:w-1/3">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-md">
                    <Bot size={40} className="text-[#0369A1]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-white bg-green-500" />
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-center gap-4 p-6">
                <div>
                  <h3 className="text-xl font-bold text-[#0C4A6E]">
                    Hablar con DiagnoHealth
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    Nuestro asistente está aquí para escucharte y apoyarte en cualquier momento que lo necesites.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/chatbot")}
                  className="flex items-center justify-center gap-2 self-start rounded-lg bg-[#0369A1] px-6 py-3 font-semibold text-white transition hover:bg-[#0C4A6E]"
                >
                  Iniciar conversación
                  <ArrowRight size={18} />
                </button>
              </div>
            </section>

            {/* PROGRESO EMOCIONAL */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <TrendingUp size={20} className="text-[#0369A1]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0C4A6E]">
                    Progreso emocional
                  </h3>
                </div>
              </div>

              <div className="mb-3 flex h-40 items-end justify-between gap-2 border-b border-gray-100 px-1">
                {WEEKLY_MOOD.map((item) => (
                  <div
                    key={item.day}
                    className="group relative w-full rounded-t-sm bg-blue-100"
                    style={{
                      height: `${(item.value / maxMoodValue) * 100}%`,
                      backgroundColor:
                        item.value === maxMoodValue ? "#0369A1" : undefined,
                    }}
                  >
                    <div className="absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-[#0C4A6E] px-1 text-[10px] text-white group-hover:block">
                      {item.value.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between px-1 text-[10px] uppercase text-gray-400">
                {WEEKLY_MOOD.map((item) => (
                  <span key={item.day}>{item.day}</span>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  to="/mi-progreso"
                  className="block w-full rounded-lg border border-gray-200 py-2 text-center text-sm font-semibold text-[#0369A1] transition hover:bg-gray-50"
                >
                  Ver progreso completo
                </Link>
              </div>
            </section>
          </div>

          {/* =====================================================
              TRES TARJETAS
          ===================================================== */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                  <ClipboardList size={20} className="text-green-600" />
                </div>
                <h4 className="mb-1 font-bold text-[#0C4A6E]">
                  Test de Bienestar
                </h4>
                <p className="mb-4 text-xs text-gray-600">
                  Realiza tu evaluación y conoce tu estado emocional actual.
                </p>
              </div>
              <Link
                to="/test-bienestar"
                className="flex items-center gap-1 text-sm font-semibold text-green-600 transition hover:gap-2"
              >
                Realizar test <ArrowRight size={14} />
              </Link>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                  <BookOpen size={20} className="text-purple-600" />
                </div>
                <h4 className="mb-1 font-bold text-[#0C4A6E]">Recursos</h4>
                <p className="mb-4 text-xs text-gray-600">
                  Explora artículos y técnicas que te ayudarán.
                </p>
              </div>
              <Link
                to="/recursos"
                className="flex items-center gap-1 text-sm font-semibold text-purple-600 transition hover:gap-2"
              >
                Explorar recursos <ArrowRight size={14} />
              </Link>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                  <History size={20} className="text-orange-500" />
                </div>
                <h4 className="mb-1 font-bold text-[#0C4A6E]">Historial</h4>
                <p className="mb-4 text-xs text-gray-600">
                  Revisa tus conversaciones y tu progreso.
                </p>
              </div>
              <Link
                to="/mi-progreso"
                className="flex items-center gap-1 text-sm font-semibold text-orange-500 transition hover:gap-2"
              >
                Ver historial <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* =====================================================
              BANNER DE FRASE
          ===================================================== */}
          <section className="relative overflow-hidden rounded-2xl bg-[#0C4A6E] p-8 text-white">
            <div className="relative z-10 flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Lightbulb size={28} />
              </div>
              <p className="text-lg font-medium italic opacity-90 sm:text-xl">
                "Que nada ni nadie apague la luz que llevas dentro."
              </p>
            </div>
          </section>

          {/* =====================================================
              FOOTER
          ===================================================== */}
          <footer className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 text-center md:flex-row md:text-left">
            <p className="text-xs text-gray-400">
              © 2026 DIAGNOHEALTH. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-gray-400 hover:text-[#0369A1]">
                Privacidad
              </a>
              <a href="#" className="text-xs text-gray-400 hover:text-[#0369A1]">
                Términos
              </a>
              <a href="#" className="text-xs text-gray-400 hover:text-[#0369A1]">
                Ayuda
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default PanelUsuario;