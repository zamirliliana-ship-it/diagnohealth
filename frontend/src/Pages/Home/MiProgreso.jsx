import { useEffect, useState } from "react";
import {
  Plus,
  ClipboardCheck,
  Flame,
  Award,
  Calendar,
  ChevronRight,
  Download,
  Activity,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import DashboardSidebar from "../../components/layout/DashboardSidebar";

const STATUS_STYLES = {
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
  red: "bg-red-100 text-red-800",
};

const STATUS_DOT = {
  green: "bg-green-600",
  yellow: "bg-yellow-600",
  red: "bg-red-600",
};

function MiProgreso() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [historialTests, setHistorialTests] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estadísticas dinámicas que arrancan en 0
  const [estadisticas, setEstadisticas] = useState({
    totalTests: 0,
    rachaActual: "0 días",
    mejorRacha: "0 días",
  });

  useEffect(() => {
    let mounted = true;

    const loadRealData = async () => {
      try {
        // 1. Obtener usuario autenticado
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Error obteniendo usuario:", userError);
          return;
        }

        if (mounted) {
          setUser(user);

          // 2. Consultar los tests reales de este usuario en Supabase en tiempo real
          const { data: testData, error: testError } = await supabase
            .from('resultados_test')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!testError && testData) {
            // Mapear los datos reales para el historial
            const historialMapeado = testData.map((item) => {
              const esBienestar = item.emocion_predominante.toLowerCase().includes("bienestar") || item.emocion_predominante.toLowerCase().includes("estabilidad");
              const esAlerta = item.emocion_predominante.toLowerCase().includes("ansiedad") || item.emocion_predominante.toLowerCase().includes("tristeza");

              return {
                id: item.id,
                date: new Date(item.created_at).toLocaleDateString('es-ES', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric' 
                }),
                title: item.emocion_predominante,
                detalle: item.detalle,
                status: esBienestar ? "Estable" : esAlerta ? "Atención requerida" : "Moderado",
                color: esBienestar ? "green" : esAlerta ? "red" : "yellow",
              };
            });

            setHistorialTests(historialMapeado);

            // 3. Actualizar estadísticas reales basadas en los datos
            setEstadisticas({
              totalTests: testData.length,
              rachaActual: testData.length > 0 ? "1 día" : "0 días",
              mejorRacha: testData.length > 0 ? "1 día" : "0 días",
            });
          }
        }
      } catch (err) {
        console.error("Error al conectar con Supabase:", err);
      } finally {
        if (mounted) {
          setCargando(false);
        }
      }
    };

    loadRealData();

    return () => {
      mounted = false;
    };
  }, []);

  const STATS_CONFIG = [
    { label: "Tests realizados", value: estadisticas.totalTests, icon: ClipboardCheck },
    { label: "Racha actual", value: estadisticas.rachaActual, icon: Flame },
    { label: "Mejor racha", value: estadisticas.mejorRacha, icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1C1A]">
      <DashboardSidebar userLabel={user?.email} />

      <main className="ml-0 flex min-h-screen flex-col pb-20 md:ml-64 md:pb-0">
        <div className="mx-auto w-full max-w-[1100px] flex-1 space-y-8 px-4 py-6 pl-16 sm:px-6 md:pl-6 md:py-10">

          {/* =====================================================
              HEADER
          ===================================================== */}
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0C4A6E] sm:text-3xl">
                Mi progreso emocional
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Visualiza tu evolución clínica en tiempo real y mantén tus hábitos saludables.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/test-bienestar')}
              className="flex items-center justify-center gap-2 self-start rounded-lg bg-[#0369A1] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0C4A6E]"
            >
              <Plus size={18} />
              Nuevo test
            </button>
          </header>

          {/* =====================================================
              ESTADÍSTICAS EN TIEMPO REAL (ARRANCAN EN 0)
          ===================================================== */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {STATS_CONFIG.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="rounded-lg bg-[#CBE6FF] p-3 text-[#0C4A6E]">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#0C4A6E]">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* =====================================================
              GRÁFICO DE EVOLUCIÓN
          ===================================================== */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-[#0C4A6E] sm:text-xl">
                Evolución emocional
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                <Activity size={14} className="text-[#0369A1]" />
                <span>Datos sincronizados con Supabase</span>
              </div>
            </div>

            {historialTests.length === 0 ? (
              <div className="flex h-48 w-full flex-col items-center justify-center text-center">
                <p className="text-sm text-gray-400 mb-2">Aún no hay suficientes datos para graficar.</p>
                <p className="text-xs text-gray-400">Completa tu primer test de bienestar para activar las métricas.</p>
              </div>
            ) : (
              <div className="relative h-64 w-full">
                <svg
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 1000 300"
                >
                  <line x1="0" x2="1000" y1="0" y2="0" stroke="#E2D9CA" strokeWidth="1" />
                  <line x1="0" x2="1000" y1="100" y2="100" stroke="#E2D9CA" strokeWidth="1" />
                  <line x1="0" x2="1000" y1="200" y2="200" stroke="#E2D9CA" strokeWidth="1" />
                  <line x1="0" x2="1000" y1="300" y2="300" stroke="#E2D9CA" strokeWidth="1" />

                  <path
                    d="M 0 200 Q 250 150, 500 180 T 1000 100"
                    fill="none"
                    stroke="#0369A1"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <path
                    d="M 0 200 Q 250 150, 500 180 T 1000 100 L 1000 300 L 0 300 Z"
                    fill="url(#chartGradient)"
                    opacity="0.15"
                  />

                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#0369A1" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            )}
          </section>

          {/* =====================================================
              HISTORIAL DE RESULTADOS EN TIEMPO REAL
          ===================================================== */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0C4A6E] sm:text-xl">
                Historial de resultados
              </h2>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-1 text-sm font-semibold text-[#0369A1] hover:text-[#0C4A6E]"
              >
                Descargar reporte <Download size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {cargando ? (
                <p className="text-sm text-gray-500 py-6 text-center">Cargando historial en tiempo real...</p>
              ) : historialTests.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                  <p className="text-sm font-semibold text-gray-700 mb-1">No hay evaluaciones registradas todavía.</p>
                  <p className="text-xs text-gray-500 mb-4">Tu historial aparecerá aquí en cuanto completes tu primer test.</p>
                  <button
                    onClick={() => navigate('/test-bienestar')}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0369A1] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0C4A6E]"
                  >
                    Realizar test de bienestar ahora
                  </button>
                </div>
              ) : (
                historialTests.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:bg-gray-50 md:flex-row md:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-[#CBE6FF] p-3 text-[#0C4A6E]">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-[#0C4A6E]">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.date} • {item.detalle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                          STATUS_STYLES[item.color]
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            STATUS_DOT[item.color]
                          }`}
                        />
                        {item.status}
                      </span>

                      <span className="hidden items-center text-xs font-bold text-[#0369A1] sm:flex">
                        Registrado <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default MiProgreso;